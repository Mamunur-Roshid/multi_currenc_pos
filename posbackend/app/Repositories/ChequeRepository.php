<?php 
namespace App\Repositories;

use App\Models\Cheque;
use stdClass;
use Exception;

class ChequeRepository 
{
    public function Get($arg = [])
    {
        $branchId = 1;

        $cheque = Cheque::with(['customer'])->where('branch_id', $branchId);

        if(isset($arg['id'])) {
            $cheque = $cheque->where('id', $arg['id']);
        }

        if(isset($arg['customerId'])) {
            $cheque = $cheque->where('customer_id', $arg['customerId']);
        }

        if(isset($arg['dateFrom']) && isset($arg['dateTo'])) {
            $cheque = $cheque->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['reminder'])) {
            $cheque = $cheque->whereDate('reminder_date', '>=', date('Y-m-d'));
        }

        $cheque = $cheque->latest()->get();
        return $cheque;
    }

    public function GetById($id)
    {
        return Cheque::where('id', $id)->first();
    }

    public function Insert(Cheque $cheque)
    {
        $res = new stdClass();

        try {
            $branchId = 1;
            
            $validation = $this->ValidateCheque($cheque);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $cheque->branch_id = $branchId;
            $cheque->added_by = 1;
            $cheque->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Cheque $cheque)
    {
        $res = new stdClass();

        try {
            $branchId = 1;
            
            $validation = $this->ValidateCheque($cheque);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $cheque->branch_id = $branchId;
            $cheque->updated_by = 1;
            $cheque->save();

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
            $cheque = $this->GetById($id);
            $cheque->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function ChangeStatus($id)
    {
        $res = new stdClass();

        try {
            $branchId = 1;

            $cheque = $this->GetById($id);

            $cheque->cheque_status = 'Paid';
            $cheque->branch_id = $branchId;
            $cheque->updated_by = 1;
            $cheque->save();

            $res->code = 200;
            $res->message = "Change status successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function ValidateCheque(Cheque $cheque)
    {
        if($cheque->customer_id  == '') return 'Customer is required';
        if($cheque->bank_name == '') return 'Bank name is required';
        if($cheque->branch_name == '') return 'Branch name is required';
        if($cheque->cheque_number == '') return 'Cheque number is required';
        if($cheque->cheque_amount == '') return 'Cheque amount is required';
        if($cheque->cheque_status == '') return 'Cheque status is required';
        if($cheque->cheque_date == '') return 'Cheque date is required';
        if($cheque->submit_date == '') return 'Cheque submit date is required';
        
        return '';
    }
}