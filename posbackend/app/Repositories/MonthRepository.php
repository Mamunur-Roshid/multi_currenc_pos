<?php 
namespace App\Repositories;

use App\Models\Month;
use stdClass;
use Exception;

class MonthRepository
{
    public function Get()
    {
        return Month::latest()->get();
    }

    public function GetById($id)
    {
        return Month::where('id', $id)->first();
    }

    public function Insert(Month $month)
    {
        $res = new stdClass();

        try {
            $duplicateMonth = Month::where('name', $month->name)->first();

            if($duplicateMonth) {
                $res->code = 409;
                $res->message = $duplicateMonth->name . " already exists";
                return $res;
            }

            $month->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Month $month)
    {
        $res = new stdClass();

        try {
            $duplicateMonth = Month::where('name', $month->name)->where('id', '!=', $month->id)->first();

            if($duplicateMonth) {
                $res->code = 409;
                $res->message = $duplicateMonth->name . " already exists";
                return $res;
            }

            $month->save();

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
            $month = $this->GetById($id);
            $month->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}