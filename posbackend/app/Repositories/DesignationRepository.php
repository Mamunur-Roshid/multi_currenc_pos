<?php
namespace App\Repositories;

use stdClass;
use Exception;
use App\Models\Designation;

class DesignationRepository 
{
    public function Get()
    {
        return Designation::latest()->get();
    }

    public function GetById($id)
    {
        return Designation::where('id', $id)->first();
    }

    public function Insert(Designation $designation)
    {
        $res = new stdClass();

        try {
            $duplicateDesignation = Designation::where('name', $designation->name)->first();

            if($duplicateDesignation) {
                $res->code = 409;
                $res->message = $duplicateDesignation->name . " already exists";
                return $res;
            }

            $designation->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Designation $designation)
    {
        $res = new stdClass();

        try {
            $duplicateDesignation = Designation::where('name', $designation->name)->where('id', '!=', $designation->id)->first();

            if($duplicateDesignation) {
                $res->code = 409;
                $res->message = $duplicateDesignation->name . " already exists";
                return $res;
            }

            $designation->save();

            $res->code = 200;
            $res->message = "Updated successfully";
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
            $designation = $this->GetById($id);
            $designation->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
