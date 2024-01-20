<?php
namespace App\Repositories;

use stdClass;
use Exception;
use App\Models\Area;

class CurrencyRepository 
{
    public function Get()
    {
        return Area::get();
    }

    public function GetById($id)
    {
        return Area::where('id', $id)->first();
    }

    public function Insert(Area $area)
    {
        $res = new stdClass();

        try {
            $duplicateArea = Area::where('name', $area->name)->first();

            if($duplicateArea) {
                $res->code = 409;
                $res->message = $duplicateArea->name . " already exists";
                return $res;
            }

            $area->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Area $area)
    {
        $res = new stdClass();

        try {
            $duplicateArea = Area::where('name', $area->name)->where('id', '!=', $area->id)->first();

            if($duplicateArea) {
                $res->code = 409;
                $res->message = $duplicateArea->name . " already exists";
                return $res;
            }

            $area->save();

            $res->code = 200;
            $res->message = "Saved successfully";
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
            $area = $this->GetById($id);
            $area->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
