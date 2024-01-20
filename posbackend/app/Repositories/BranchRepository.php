<?php 
namespace App\Repositories;

use stdClass;
use App\Models\Branch;
use App\Models\User;

class BranchRepository
{
    public function Get()
    {
        $branch = Branch::get();
        return $branch;
    }

    public function GetById($id)
    {
        return Branch::where('id', $id)->first();
    }

    public function Insert(Branch $branch)
    {
        $res = new stdClass;

        try {
            $duplicateName = Branch::where('name', $branch->name)->first();
            if($duplicateName) {
                $res->code = 409;
                $res->message = $duplicateName->name . " already exists";
                return $res;
            }

            $branch->added_by = app('userId');
            $branch->save();

            $res->message = "Branch insert successfully";
            $res->code = 201;
        } catch (\Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Branch $branch)
    {
        $res = new stdClass;

        try {
            $duplicateName = Branch::where('name', $branch->name)->where('id', '!=', $branch->id)->first();

            if($duplicateName) {
                $res->code = 409;
                $res->message = $duplicateName->name . " already exists";
                return $res;
            }

            $branch->updated_by = app('userId');
            $branch->save();

            $res->message = "Branch updated successfully";
            $res->code = 200;
        } catch (\Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Delete($id)
    {
        $res = new stdClass;

        try {
            // check user
            $user = User::where('branch_id', $id)->count();
            if($user > 0) {
                $res->code = 451;
                $res->message = "Unavailable delete! Please user delete first";
                return $res;
            }

            // check class
            $classes = StudentClass::where('branch_id', $id)->count();
            if($classes > 0) {
                $res->code = 451;
                $res->message = "Unavailable delete! Please class delete first";
                return $res;
            }

            $branch = $this->GetById($id);
            $branch->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch (\Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
