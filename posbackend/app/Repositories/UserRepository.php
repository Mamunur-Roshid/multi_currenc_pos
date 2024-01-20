<?php
namespace App\Repositories;

use App\Models\Branch;
use App\Models\User;
use Exception;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Hash;
use stdClass;

class UserRepository
{
    private $utilityRepo;
    
    public function __construct(UtilityRepository $utilityRepo)
    {
        $this->utilityRepo = $utilityRepo;
    }

    public function Login($username, $password)
    {
        $res = new stdClass();

        try {
            $userQuery = User::with(['branch'])->where('username', $username);

            if($userQuery->count() == 0) {
                $res->code = 403;
                $res->message = "Account not found";
                return $res;
            }

            $user = $userQuery->first();

            if(!Hash::check($password, $user->password)) {
                $res->code = 403;
                $res->message = "Password did not match";
                return $res;
            }

            if($user->status == 'd') {
                $res->code = 403;
                $res->message = "Account inactive";
                return $res;
            }

            $iat = time(); // time of token issued at
            $nbf = $iat + 10; //not before in seconds
            $exp = $iat + 21600; // expire time of token in seconds 86400
            $key = '<?[js@nill!CMT1!]?>';
            $token = array(
                "iat" => $iat,
                "nbf" => $nbf,
                "exp" => $exp,
                "userId" => $user->id,
                "userType" => $user->user_type,
                "branchId" => $user->branch_id,
            );
           
            $res->jwt = JWT::encode($token, $key, 'HS256');

            $res->authorizedUser = [
                'userId' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'phone' => $user->phone,
                'email' => $user->email,
                'userType' => $user->user_type,
                'branchId' => $user->branch_id,
                'branchName' => $user->branch->name,
                'permissions' => $user->permissions,
            ];

            $res->code = 200;
            $res->message = 'Login success';
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Get($arg = [])
    {
        $users = User::with(['branch']);

        if(isset($arg['id'])) {
            $users = $users->where('id', $arg['id']);
        }

        $users = $users->latest()->get()
            ->map(function($user) {
            $user->password = '';
            return $user;
        });

        return $users;
    }

    public function GetById($id)
    {
        return User::where('id', $id)->first();
    }

    public function Insert(User $user)
    {
        $res = new stdClass();
        try {
            $validation = $this->ValidateUser($user);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateValidationProps = ['username', 'phone', 'email'];

            foreach($duplicateValidationProps as $prop) {
                $duplicateCount = User::where($prop, $user->$prop)->count();
                if($duplicateCount > 0) {
                    $res->code = 409;
                    $res->message = ucfirst($prop) . " already used";
                    return $res;
                }
            }

            $user->password = Hash::make($user->password);
            $user->added_by = app('userId');
            $user->branch_id = app('branchId');
            $user->save();

            $res->code = 200;
            $res->message = 'User created successfully';
        } catch (Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(User $user)
    {
        $res = new stdClass();

        try {
            $validation = $this->ValidateUser($user);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateValidationProps = ['username', 'phone', 'email'];

            foreach($duplicateValidationProps as $prop) {
                $duplicateCount = User::where($prop, $user->$prop)->where('id', '!=', $user->id)->count();
                if($duplicateCount > 0) {
                    $res->code = 409;
                    $res->message = ucfirst($prop) . " already used";
                    return $res;
                }
            }

            if($user->password != '') {
                $user->password = Hash::make($user->password);
            } else {
                unset($user->password);
            }

            $user->updated_by = app('userId');
            // $user->branch_id = app('branchId');
            $user->save();

            $res->code = 200;
            $res->message = 'Updated successfully';
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Delete($id)
    {
        $res = new stdClass();

        try {
            $user = $this->GetById($id);
            $user->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function ValidateUser(User $user)
    {
        if($user->name == '') return 'Name is required';

        if(!$this->utilityRepo->ValidateMobile($user->phone)) return 'Invalid mobile number';
        
        if(!$this->utilityRepo->ValidateEmail($user->email)) return 'Invalid email';
        
        if($user->username == '') return 'Username is required';

        if($user->password == '') return 'Password is required';
        return '';
    }

    public function UpdateProfile(User $user)
    {
        $res = new stdClass();

        try {
            
            if (isset($user->password) && $user->password != '' && isset($user->$user->currentPassword) && $user->$user->currentPassword != '') {
                if (!Hash::check($user->currentPassword, $user->password)) {
                    $res->code = 422;
                    $res->message = "Current password did not match";
                    return $res;
                }
                unset($user->currentPassword);
                $user->password = Hash::make($user->password);
            }
           
            $user->save();

            $res->code = 200;
            $res->message = "User info updated successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function UserPermissions(User $user)
    {
        $res = new stdClass();

        try {
            $user->save();

            $res->code = 200;
            $res->message = "User permission update successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function BranchAccess($branchId)
    {
        $res = new stdClass;
        try {
            $user = User::where('id', app('userId'))->first();
            $branch = Branch::where('id', $branchId)->first();
            $iat = time(); // time of token issued at
            $nbf = $iat + 10; //not before in seconds
            $exp = $iat + 21600; // expire time of token in seconds 86400
            $key = '<?[js@nill!CMT1!]?>';
            $token = array(
                "iat" => $iat,
                "nbf" => $nbf,
                "exp" => $exp,
                "userId" => $user->id,
                "userType" => $user->user_type,
                "branchId" => $branchId,
            );
    
            $res->jwt = JWT::encode($token, $key, 'HS256');

            $res->authorizedUser = [
                'userId' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'phone' => $user->phone,
                'email' => $user->email,
                'userType' => $user->user_type,
                'branchId' => $branchId,
                "branchName" => $branch->name
            ];

            $res->code = 200;
            $res->message = "Access successfully";
        } catch (\Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
    
}