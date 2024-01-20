<?php
namespace App\Repositories;

use stdClass;
use Exception;
use App\Models\Attendance;

class AttendanceRepository 
{
    public function Get()
    {
        return Attendance::with(['employee'])->get();
    }

    public function GetById($id)
    {
        return Attendance::where('id', $id)->first();
    }

    public function Insert(Attendance $attendance)
    {
        $res = new stdClass();

        try {

            $attendance->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Attendance $attendance)
    {
        $res = new stdClass();

        try {
            $attendance->save();

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
