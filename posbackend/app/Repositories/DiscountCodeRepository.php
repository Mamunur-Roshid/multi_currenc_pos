<?php
namespace App\Repositories;

use stdClass;
use Exception;
use App\Models\DiscountCode;

class DiscountCodeRepository 
{
    public function Get()
    {
        return DiscountCode::with(['employee'])->get();
    }

    public function GetById($id)
    {
        return DiscountCode::where('id', $id)->first();
    }

    public function Insert(DiscountCode $discountCode)
    {
        $res = new stdClass();

        try {
            $duplicateCode = DiscountCode::where('code', $discountCode->code)->first();

            if($duplicateCode) {
                $res->code = 409;
                $res->message = $duplicateCode->code . " already exists";
                return $res;
            }

            $discountCode->approve_by = app('userId');
            $discountCode->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(DiscountCode $discountCode)
    {
        $res = new stdClass();

        try {
            $duplicateCode = DiscountCode::where('code', $discountCode->code)->where('id', '!=', $discountCode->id)->first();

            if($duplicateCode) {
                $res->code = 409;
                $res->message = $duplicateCode->code . " already exists";
                return $res;
            }

            $discountCode->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Delete($id)
    {
        $res = new stdClass();

        try {
            $discountCode = $this->GetById($id);
            
            if ($discountCode->used > 0) {
                $res->code = 500;
                $res->message = "Cannot delete. Already used";
            } else {
                $discountCode->delete();
    
                $res->code = 200;
                $res->message = "Deleted successfully";
            }

        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
