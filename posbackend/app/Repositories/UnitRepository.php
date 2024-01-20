<?php
namespace App\Repositories;

use App\Models\Product;
use stdClass;
use Exception;
use App\Models\Unit;

class UnitRepository 
{
    public function Get()
    {
        return Unit::get();
    }

    public function GetById($id)
    {
        return Unit::where('id', $id)->first();
    }

    public function Insert(Unit $unit)
    {
        $res = new stdClass();

        try {
            $duplicateUnit = Unit::where('name', $unit->name)->first();

            if($duplicateUnit) {
                $res->code = 409;
                $res->message = $duplicateUnit->name . " already exists";
                return $res;
            }

            $unit->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Unit $unit)
    {
        $res = new stdClass();

        try {
            $duplicateUnit = Unit::where('name', $unit->name)->where('id', '!=', $unit->id)->first();

            if($duplicateUnit) {
                $res->code = 409;
                $res->message = $duplicateUnit->name . " already exists";
                return $res;
            }

            $unit->save();

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
            $count = Product::where('unit_id', $id)->count();
            if($count > 0) {
                $res->code = 451;
                $res->message = "Unable to delete. Product entry already used";
                return $res;
            }

            $unit = $this->GetById($id);
            $unit->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }
}
