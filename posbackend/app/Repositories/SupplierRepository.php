<?php
namespace App\Repositories;

use App\Models\Purchase;
use stdClass;
use Exception;
use App\Models\Supplier;
use App\Models\SupplierPayment;
use Illuminate\Support\Facades\DB;

class SupplierRepository 
{
    public function Get()
    {
        return Supplier::with(['area'])->where('branch_id', app('branchId'))->get();
    }

    public function GetById($id)
    {
        return Supplier::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function GetSupplierDue($arg = [])
    {
        $supplier = Supplier::where('branch_id', app('branchId'));

        $supplier = $supplier->addSelect([
            'purchase_due' => Purchase::selectRaw('sum(due)')
            ->whereColumn('supplier_id', 'suppliers.id'),

            'supplier_payment' => SupplierPayment::selectRaw('sum(amount)')
            ->whereColumn('supplier_id', 'suppliers.id')
        ]);

        if(isset($arg['supplierId'])) {
            $supplier = $supplier->where('id', $arg['supplierId']);
        }

        $supplier = $supplier->latest()->get()
            ->map(function($supplier){
                $supplier->due = $supplier->purchase_due - $supplier->supplier_payment;
                return $supplier;
            });
        return $supplier;
    }

    public function Insert(Supplier $supplier)
    {
        $res = new stdClass();

        try {
            $branchId = app('branchId');
            
            $validation = $this->ValidateSupplier($supplier);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateMobile = Supplier::where('phone', $supplier->phone)->where('branch_id', $branchId)->first();
            if($duplicateMobile) {
                $res->code = 409;
                $res->message = $duplicateMobile->phone . " already exists";
                return $res;
            } 

            $duplicateSupplier = Supplier::where('code', $supplier->code)->first();
            if($duplicateSupplier) {
                $supplier->code = $this->GenerateSupplierCode();
            }

            $supplier->branch_id = $branchId;
            $supplier->added_by = app('userId');
            $supplier->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Update(Supplier $supplier)
    {
        $res = new stdClass();

        try {
            $branchId = app('branchId');
            
            $validation = $this->ValidateSupplier($supplier);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateMobile = Supplier::where('phone', $supplier->phone)->where('id', '!=', $supplier->id)->where('branch_id', $branchId)->first();
            if($duplicateMobile) {
                $res->code = 409;
                $res->message = $duplicateMobile->phone . " already exists";
                return $res;
            } 

            $duplicateSupplier = Supplier::where('code', $supplier->code)->where('id', '!=', $supplier->id)->first();
            if($duplicateSupplier) {
                $supplier->code = $this->GenerateSupplierCode();
            }

            $supplier->branch_id = $branchId;
            $supplier->updated_by = app('userId');
            $supplier->save();

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
            $supplier = $this->GetById($id);
            $supplier->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function GenerateSupplierCode()
    {
        $supplier = Supplier::orderBy('id', 'desc');
        $supplierId = ($supplier->count() == 0 ? 0 : $supplier->first()->id) + 1;
        $zeros = 5 - strlen($supplierId);
        $newTnxCode = "S";
        for($i = 1; $i <= $zeros; $i++) $newTnxCode .= '0';
        $newTnxCode .= $supplierId;
        return $newTnxCode;
    }
    
    public function GenerateSupplierPaymentCode()
    {
        $payment = SupplierPayment::where('branch_id', app('branchId'))->orderBy('id', 'desc');
        $paymentId = ($payment->count() == 0 ? 0 : $payment->first()->id) + 1;
        $zeros = 5 - strlen($paymentId);
        $newTnxCode = "TNXSP";
        for($i = 1; $i <= $zeros; $i++) $newTnxCode .= '0';
        $newTnxCode .= $paymentId;
        return $newTnxCode;
    }

    public function ValidateSupplier(Supplier $supplier)
    {
        if($supplier->name == '') return 'Name is required';
        
        if($supplier->area_id  == '') return 'Area is required';
        
        return '';
    }

    public function GetPayments($arg = [])
    {
        $payments = SupplierPayment::with(['supplier', 'bank_account'])->where('branch_id', app('branchId'));

        if(isset($arg['dateFrom']) && isset($arg['dateTo'])) {
            $payments = $payments->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['supplierId'])) {
            $payments = $payments->where('supplier_id', $arg['supplierId']);
        }
        
        $payments = $payments->latest()->get();
        return $payments;
    }

    public function GetByPaymentId($id)
    {
        return SupplierPayment::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function InsertPayment(SupplierPayment $payment)
    {
        $res = new stdClass();
        try {
            $payment->invoice = $this->GenerateSupplierPaymentCode();
            $payment->branch_id = app('branchId');
            $payment->added_by = app('userId');

            $payment->save();

            $res->message = 'Supplier payment insert successfully';
            $res->code = 200;
        } catch (\Exception $e) {
            $res->code = $e->getCode();
            $res->message = 'fail '.$e->getMessage();
        }

        return $res;
    }

    public function UpdatePayment(SupplierPayment $payment)
    {
        $res = new stdClass();
        try {
            $payment->branch_id = app('branchId');
            $payment->updated_by  = app('userId');

            $payment->save();

            $res->message = 'Supplier payment update successfully';
            $res->code = 200;
        } catch (\Exception $e) {
            $res->code = $e->getCode();
            $res->message = 'fail '.$e->getMessage();
        }

        return $res;
    }

    public function DeletePayment($id)
    {
        $res = new stdClass();
        try {
            $payment = $this->GetByPaymentId($id);
            $payment->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function Ledger($arg = [])
    {
        $res = new stdClass;
        $branchId = app('branchId');

        $payments = DB::table('supplier_payments')
                    ->selectRaw("
                        'b' as sequence,
                        created_at,
                        date,
                        concat('Paymnet -', invoice) as description,
                        0.00 as bill,
                        amount as paid,
                        0.00 as due,
                        0.00 as returned,
                        0.00 as balance
                    ")
                    ->where('supplier_id', $arg['supplierId'])
                    ->whereNull('deleted_at')
                    ->where('branch_id', $branchId);
                    
        $returns = DB::table('purchase_returns as pr')
                    ->selectRaw("
                        'c' as sequence,
                        pr.created_at,
                        pr.date,
                        concat('Purchase return -', pr.invoice) as description,
                        0.00 as bill,
                        0.00 as paid,
                        0.00 as due,
                        pr.total as returned,
                        0.00 as balance
                    ")
                    ->join('purchases as p','p.invoice', '=', 'pr.invoice')
                    ->where('p.supplier_id', $arg['supplierId'])
                    ->whereNull('pr.deleted_at')
                    ->where('pr.branch_id', $branchId);
                   
        $ledgers = DB::table('purchases')
                    ->selectRaw("
                        'a' as sequence,
                        created_at,
                        date,
                        concat('Purchase -', invoice) as description,
                        total as bill,
                        paid,
                        due,
                        0.00 as returned,
                        0.00 as balance
                    ")
                    ->where('supplier_id', $arg['supplierId'])
                    ->where('branch_id', $branchId)
                    ->whereNull('deleted_at')
                    ->union($payments)
                    ->union($returns)
                    ->orderBy('created_at')
                    ->get()->toArray();
        
        $previouDue = 0;
        $openingBalance = 0;

        $ledgers = array_map(function($key, $ledger) use($ledgers, $previouDue) {
            $lastBalance = $key == 0 ? $previouDue : $ledgers[$key - 1]->balance;
            $ledger->balance = ($lastBalance + $ledger->bill) - ($ledger->paid + $ledger->returned);
            return $ledger;
        }, array_keys($ledgers), $ledgers);

        if(isset($arg['dateFrom']) && isset($arg['dateTo'])) {
            $previousBalance = array_filter($ledgers, function($ledger) use ($arg){
                return $ledger->date < $arg['dateFrom'];
            });
            $previousBalance = (object) $previousBalance;

            $openingBalance = (count((array)$previousBalance) > 0) ? (empty($previousBalance) ? 0 : end($previousBalance)->balance) : 0;
           
            $ledgers = array_filter($ledgers, function($ledger) use ($arg){
                return $ledger->date >= $arg['dateFrom'] && $ledger->date <= $arg['dateTo'];
            });
    
            $ledgers = array_values($ledgers);
        }
            
        $res->ledgers = $ledgers;
        $res->openingBalance = $openingBalance;
        return $res;
    }
}
