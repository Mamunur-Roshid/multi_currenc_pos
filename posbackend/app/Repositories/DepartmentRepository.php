<?php
namespace App\Repositories;

use stdClass;
use Exception;
use App\Models\Department;

class DepartmentRepository 
{
    public function Get()
    {
        return Department::latest()->get();
    }

    public function GetById($id)
    {
        return Department::where('id', $id)->first();
    }

    public function Insert(Department $department)
    {
        $res = new stdClass();

        try {
            $duplicateDepartment = Department::where('name', $department->name)->first();

            if($duplicateDepartment) {
                $res->code = 409;
                $res->message = $duplicateDepartment->name . " already exists";
                return $res;
            }

            $department->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Department $department)
    {
        $res = new stdClass();

        try {
            $duplicateDepartment = Department::where('name', $department->name)->where('id', '!=', $department->id)->first();

            if($duplicateDepartment) {
                $res->code = 409;
                $res->message = $duplicateDepartment->name . " already exists";
                return $res;
            }

            $department->save();

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
            $department = $this->GetById($id);
            $department->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
