<?php
namespace App\Repositories;

use App\Models\BankTransaction;
use App\Models\CashTransaction;
use App\Models\CustomerPayment;
use App\Models\Damage;
use App\Models\Expense;
use App\Models\Purchase;
use App\Models\SalaryPayment;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\SupplierPayment;
use Carbon\Carbon;
use stdClass;
use Exception;
use Illuminate\Support\Facades\DB;

class AccountRepository
{
    public function GetExpense()
    {
        $expense = Expense::where('branch_id', app('branchId'))->get();
        return $expense;
    }

    public function GetByExpenseId($id)
    {
        return Expense::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function Insert(Expense $expense)
    {
        $res = new stdClass();
        $branchId = app('branchId');
        
        try {
            $duplicateExpense = Expense::where('name', $expense->name)->where('branch_id', $branchId)->first();

            if($duplicateExpense) {
                $res->code = 409;
                $res->message = $duplicateExpense->name . " already exists";
                return $res;
            }

            $expense->added_by = app('userId');
            $expense->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function UpdateExpense(Expense $expense)
    {
        $res = new stdClass();
        $branchId = app('branchId');

        try {
            $duplicateExpense = Expense::where('name', $expense->name)->where('id', '!=', $expense->id)->where('branch_id', $branchId)->first();

            if($duplicateExpense) {
                $res->code = 409;
                $res->message = $duplicateExpense->name . " already exists";
                return $res;
            }

            $expense->updated_by = app('userId');
            $expense->save();

            $res->code = 200;
            $res->message = "Updated successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function DeleteExpense($id)
    {
        $res = new stdClass();

        try {
            $expense = $this->GetByExpenseId($id);
            $expense->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function GetTransaction($arg = [])
    {
        $transactons = CashTransaction::with(['expense', 'added_by'])->where('branch_id', app('branchId'));

        if(isset($arg['dateFrom']) && isset($arg['dateTo'])) {
            $transactons = $transactons->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['id']) && $arg['id'] != '') {
            $transactons = $transactons->where('id', $arg['id']);
        }

        if(isset($arg['accountId']) && $arg['accountId'] != '') {
            $transactons = $transactons->where('account_id', $arg['accountId']);
        }

        if(isset($arg['type'])) {
            $transactons = $transactons->where('type', $arg['type']);
        }

        return $transactons->latest()->get();
    }

    public function GetByTransactionId($id)
    {
        return CashTransaction::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function GenerateTransactionCode()
    {
        $transaction = CashTransaction::withTrashed()->orderBy('id', 'desc');
        $transactionId = ($transaction->count() == 0 ? 0 : $transaction->first()->id) + 1;
        $zeros = 5 - strlen($transactionId);
        $newTnxCode = "TNX";
        for($i = 1; $i <= $zeros; $i++) $newTnxCode .= '0';
        $newTnxCode .= $transactionId;
        return $newTnxCode;
    }

    public function ValidateTransaction(CashTransaction $cashTransaction)
    {
        if($cashTransaction->account_id  == '') return 'Expense account is required';
        return '';
    }

    public function InsertCashTransaction(CashTransaction $transaction)
    {
        $res = new stdClass;
        try {
            $branchId = app('branchId');
            
            $validation = $this->ValidateTransaction($transaction);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateCode = CashTransaction::where('code', $transaction->code)->first();
            if($duplicateCode) {
                $transaction->code = $this->GenerateTransactionCode();
            }

            $transaction->branch_id = $branchId;
            $transaction->added_by = app('userId');
            $transaction->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function UpdateCashTransaction(CashTransaction $transaction)
    {
        $res = new stdClass;
        try {
            $branchId = app('branchId');
            
            $validation = $this->ValidateTransaction($transaction);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $transaction->branch_id = $branchId;
            $transaction->updated_by = app('userId');
            $transaction->save();

            $res->code = 200;
            $res->message = "Update successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function DeleteTransaction($id)
    {
        $res = new stdClass();
        try {
            $transaction = $this->GetByTransactionId($id);
            $transaction->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function GetCashBalance()
    {
        $branchId = app('branchId');
        // Received
        $salePaid = Sale::where('status', 'a')->where('branch_id', $branchId)->sum('paid');
        $customerReceive = CustomerPayment::where('type', 'Cash')->where('branch_id', $branchId)->sum('amount');
        $cashReceive = CashTransaction::where('type', 'Cash Receive')->where('branch_id', $branchId)->sum('received_amount');
        $bankWithdraw = BankTransaction::where('type', 'Withdraw')->where('branch_id', $branchId)->sum('amount');

        // Paid
        $purchasePaid = Purchase::where('status', 'a')->where('branch_id', $branchId)->sum('paid');
        $supplierPayment = SupplierPayment::where('type', 'Cash')->where('branch_id', $branchId)->sum('amount');
        $cashPaid = CashTransaction::where('type', 'Cash Payment')->where('branch_id', $branchId)->sum('paid_amount');
        $bankDeposit = BankTransaction::where('type', 'Deposit')->where('branch_id', $branchId)->sum('amount');
        $salaryPayment = SalaryPayment::where('type', 'Cash')->where('branch_id', $branchId)->sum('amount');

        $balance = ($salePaid + $customerReceive +  $cashReceive + $bankWithdraw) - ($purchasePaid +  $supplierPayment +  $cashPaid + $bankDeposit + $salaryPayment);

        return $balance;
    }

    public function GetCashLedger($arg = [])
    {
        $res = new stdClass;
        $branchId = app('branchId');
        // cash receive
        $sale = DB::table('sales')
                ->selectRaw("
                    created_at,
                    date,
                    concat('Sales - ', invoice) as description,
                    paid as cash_in,
                    0.00 as cash_out,
                    0.00 as balance
                ")
                ->where('status', 'a')
                ->whereNull('deleted_at')
                ->where('branch_id', $branchId);
        
        $customerPayment = DB::table('customer_payments')
                    ->selectRaw("
                        created_at,
                        date,
                        concat('Customer Payment Received -', invoice) as description,
                        amount as cash_in,
                        0.00 as cash_out,
                        0.00 as balance
                    ")
                    ->where('type', 'Cash')
                    ->whereNull('deleted_at')
                    ->where('branch_id', $branchId);
        
        $cashReceive =  DB::table('cash_transactions')
                        ->selectRaw("
                            created_at,
                            date,
                            concat('Cash Receive - ', code) as description,
                            received_amount as cash_in,
                            0.00 as cash_out,
                            0.00 as balance
                        ")
                        ->where('type', 'Cash Receive')
                        ->whereNull('deleted_at')
                        ->where('branch_id', $branchId);
        
        $bankWithdraw = DB::table('bank_transactions as bt')
                        ->selectRaw("
                            bt.created_at,
                            bt.date,
                            concat('Bank withdraw - ', ba.bank_name, ' - ', ba.branch_name, ' - ', ba.account_name, ' - ', ba.account_number) as description,
                            bt.amount as cash_in,
                            0.00 as cash_out,
                            0.00 as balance
                        ")
                        ->join('bank_accounts as ba', 'ba.id', '=', 'bt.account_id')
                        ->where('bt.type', 'Withdraw')
                        ->whereNull('bt.deleted_at')
                        ->where('bt.branch_id', $branchId);

        // cash paid
        $purchase = DB::table('purchases')
                    ->selectRaw("
                        created_at,
                        date,
                        concat('Purchase - ', invoice) as description,
                        0.00 as cash_in,
                        paid as cash_out,
                        0.00 as balance
                    ")
                    ->where('status', 'a')
                    ->whereNull('deleted_at')
                    ->where('branch_id', $branchId);
        
        $supplierPayment =  DB::table('supplier_payments')
                            ->selectRaw("
                                created_at,
                                date,
                                concat('Supplier Paymnet - ', invoice) as description,
                                0.00 as cash_in,
                                amount as cash_out,
                                0.00 as balance
                            ")
                            ->where('type', 'Cash')
                            ->whereNull('deleted_at')
                            ->where('branch_id', $branchId);

        $cashPayment =  DB::table('cash_transactions')
                        ->selectRaw("
                            created_at,
                            date,
                            concat('Cash Payment -', code) as description,
                            0.00 as cash_in,
                            paid_amount as cash_out,
                            0.00 as balance
                        ")
                        ->where('type', 'Cash Payment')
                        ->whereNull('deleted_at')
                        ->where('branch_id', $branchId);

        $bankDeposit = DB::table('bank_transactions as bt')
                        ->selectRaw("
                            bt.created_at,
                            bt.date,
                            concat('Bank Deposit - ', ba.bank_name, ' - ', ba.branch_name, ' - ', ba.account_name, ' - ', ba.account_number) as description,
                            0.00 as cash_in,
                            bt.amount as cash_out,
                            0.00 as balance
                        ")
                        ->join('bank_accounts as ba', 'ba.id', '=', 'bt.account_id')
                        ->where('bt.type', 'Deposit')
                        ->whereNull('bt.deleted_at')
                        ->where('bt.branch_id', $branchId);

        $ledgers =  DB::table('salary_payments')
                    ->selectRaw("
                        created_at,
                        date,
                        concat('Salary Payment') as description,
                        0.00 as cash_in,
                        amount as cash_out,
                        0.00 as balance
                    ")
                    ->where('type', 'Cash')
                    ->where('branch_id', $branchId)
                    ->whereNull('deleted_at')
                    ->union($sale)
                    ->union($customerPayment)
                    ->union($cashReceive)
                    ->union($bankWithdraw)
                    ->union($purchase)
                    ->union($supplierPayment)
                    ->union($cashPayment)
                    ->union($bankDeposit)
                    ->orderBy('created_at')
                    ->get()->toArray();

        $previouDue = 0;
        $openingBalance = 0;

        $ledgers = array_map(function($key, $ledger) use($ledgers, $previouDue) {
            $lastBalance = $key == 0 ? $previouDue : $ledgers[$key - 1]->balance;
            $ledger->balance = ($lastBalance + $ledger->cash_in - $ledger->cash_out);
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

    public function Ghrap()
    {
        $res = new stdClass;
        $branchId = app('branchId');

        //monthly
        $monthlyRecord = [];
        $year = date('Y');
        $month = date('m');
        $dayNumber = cal_days_in_month(CAL_GREGORIAN, $month, $year);
        for($i = 1; $i <= $dayNumber; $i++){
            $date = $year . '-' . $month . '-'. sprintf("%02d", $i);
            $amount = Sale::where('date', $date)->sum('total');

            $sales = [sprintf("%02d", $i), $amount];
            array_push($monthlyRecord, $sales);
        }

        //yearly
        $yearlyRecord = [];
        for($i = 1; $i <= 12; $i++) {
            $yearMonth = $year . sprintf("%02d", $i);
           
            $amount = DB::select("
                select 
                    ifnull(sum(total), 0)
                from sales
                where extract(year_month from date) = $yearMonth
            ");
            $monthName = date("M", mktime(0, 0, 0, $i, 10));

            $total = array_values((array)$amount[0]);
            $sale = [$monthName, $total[0]];
            array_push($yearlyRecord, $sale);
        }

        $res->monthly = $monthlyRecord;
        $res->yearly = $yearlyRecord;

        // top sold customer
        $customers = DB::table('sales as s')
                    ->selectRaw("
                        c.name,
                        ifnull(sum(s.total), 0) as amount
                    ")
                    ->join('customers as c', 'c.id', '=', 's.customer_id')
                    ->whereNull('s.deleted_at')
                    ->where('s.branch_id', $branchId)
                    ->groupBy('c.name')
                    ->take(5)->get();
        
        $res->topCustomers = $customers;

        // top sold product
        $products = DB::table('sale_details as sd')
                    ->selectRaw("
                        p.name,
                        ifnull(sum(sd.quantity), 0) as quantity
                    ")
                    ->join('products as p', 'p.id', '=', 'sd.product_id')
                    ->whereNull('sd.deleted_at')
                    ->where('sd.branch_id', $branchId)
                    ->groupBy('p.name')
                    ->take(5)->get();

        $res->topProducts = $products;
        return $res;
    }

    // profit
    public function ProfitLoss()
    {
        $res = new stdClass;

        $res->daily = $this->DailyProfit();
        $res->weekly = $this->WeeklyProfit();
        $res->monthly = $this->MonthProfit();
        $res->yearly = $this->YearlyProfit();

        return $res;
    }

    public function DailyProfit()
    {
        $branchId = app('branchId');
        $day = date('Y-m-d');

        $sales = DB::table('sale_details as sd')
                ->selectRaw("
                    (sd.purchase_rate * sd.quantity) as purchase_amount,
                    (select sd.total - purchase_amount) as profit_loss
                ")
                ->join('sales as s', 's.id', '=', 'sd.sale_id')
                ->whereNull('sd.deleted_at')
                ->where('sd.branch_id', $branchId)
                ->where('s.date', $day)
                ->get()
                ->toArray();
        
        $saleProfit = array_reduce($sales, function($p, $c) {
            return $p + $c->profit_loss;
        });

       
        $discount = Sale::where('status', 'a')
                   ->where('date', $day)
                   ->where('branch_id', $branchId)
                   ->sum('discount');

        $transport = Sale::where('status', 'a')
                   ->where('date', $day)
                   ->where('branch_id', $branchId)
                   ->sum('transport');

        $vat = Sale::where('status', 'a')
                   ->where('date', $day)
                   ->where('branch_id', $branchId)
                   ->sum('vat');

        $income = CashTransaction::where('type', 'Cash Receive')
                        ->where('branch_id', $branchId)
                        ->where('date', $day)
                        ->sum('received_amount');

        $expense = CashTransaction::where('type', 'Cash Payment')
                        ->where('branch_id', $branchId)
                        ->where('date', $day)
                        ->sum('paid_amount');

        $salaryPayment = SalaryPayment::where('branch_id', $branchId)
                         ->where('date', $day)
                         ->sum('amount');

        $damage = DB::table('damage_details as dd')
                 ->join('damages as d', 'd.id', '=', 'dd.damage_id')
                 ->where('d.date', $day)
                 ->where('dd.branch_id', $branchId)
                 ->where('dd.status', 'a')
                 ->sum('dd.total');

        $returns = DB::table('sale_returndetails as srd')
                    ->selectRaw("
                        ifnull(sum(srd.return_amount) - sum(sd.purchase_rate * srd.quantity ), 0) as total
                    ")
                   ->join('sale_returns as sr', 'sr.id', '=', 'srd.sale_return_id')
                   ->join('sales as s', 's.invoice', '=', 'sr.invoice')
                   ->join('sale_details as sd', 'sd.sale_id', '=', 's.id')
                   ->where('sr.date', $day)
                   ->where('srd.branch_id', $branchId)
                   ->where('sr.status', 'a')
                   ->get();

        $returnProfit = $returns[0]->total;

        // $profite = ($saleProfit + $transport + $income + $vat) - ($discount + $expense + $salaryPayment + $damage + $returnProfit);
        $profite = ($saleProfit + $transport + $vat) - ($discount + $salaryPayment + $damage + $returnProfit);

        return $profite;
    }

    public function WeeklyProfit()
    {
        $branchId = app('branchId');

        $sales = DB::table('sale_details as sd')
                ->selectRaw("
                    (sd.purchase_rate * sd.quantity) as purchase_amount,
                    (select sd.total - purchase_amount) as profit_loss
                ")
                ->join('sales as s', 's.id', '=', 'sd.sale_id')
                ->whereNull('sd.deleted_at')
                ->where('sd.branch_id', $branchId)
                ->whereBetween('s.date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                ->get()
                ->toArray();
        
        $saleProfit = array_reduce($sales, function($p, $c) {
            return $p + $c->profit_loss;
        });

       
        $discount = Sale::where('status', 'a')
                    ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                   ->where('branch_id', $branchId)
                   ->sum('discount');

        $transport = Sale::where('status', 'a')
                    ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                   ->where('branch_id', $branchId)
                   ->sum('transport');

        $vat = Sale::where('status', 'a')
                    ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                   ->where('branch_id', $branchId)
                   ->sum('vat');

        $income = CashTransaction::where('type', 'Cash Receive')
                        ->where('branch_id', $branchId)
                        ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                        ->sum('received_amount');

        $expense = CashTransaction::where('type', 'Cash Payment')
                    ->where('branch_id', $branchId)
                    ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                    ->sum('paid_amount');

        $salaryPayment = SalaryPayment::where('branch_id', $branchId)
                        ->whereBetween('date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                         ->sum('amount');

        $damage = DB::table('damage_details as dd')
                 ->join('damages as d', 'd.id', '=', 'dd.damage_id')
                 ->whereBetween('d.date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                 ->where('dd.branch_id', $branchId)
                 ->where('dd.status', 'a')
                 ->sum('dd.total');

        $returns = DB::table('sale_returndetails as srd')
                    ->selectRaw("
                        ifnull(sum(srd.return_amount) - sum(sd.purchase_rate * srd.quantity ), 0) as total
                    ")
                   ->join('sale_returns as sr', 'sr.id', '=', 'srd.sale_return_id')
                   ->join('sales as s', 's.invoice', '=', 'sr.invoice')
                   ->join('sale_details as sd', 'sd.sale_id', '=', 's.id')
                   ->whereBetween('sr.date', [Carbon::now()->startOfWeek(), Carbon::now()->endOfWeek()])
                   ->where('srd.branch_id', $branchId)
                   ->where('sr.status', 'a')
                   ->get();

        $returnProfit = $returns[0]->total;

        // $profite = ($saleProfit + $transport + $income + $vat) - ($discount + $expense + $salaryPayment + $damage + $returnProfit);
        $profite = ($saleProfit + $transport + $vat) - ($discount + $salaryPayment + $damage + $returnProfit);

        return $profite;
    }

    public function MonthProfit()
    {
        $branchId = app('branchId');

        $sales = DB::table('sale_details as sd')
                ->selectRaw("
                    (sd.purchase_rate * sd.quantity) as purchase_amount,
                    (select sd.total - purchase_amount) as profit_loss
                ")
                ->join('sales as s', 's.id', '=', 'sd.sale_id')
                ->whereNull('sd.deleted_at')
                ->where('sd.branch_id', $branchId)
                ->whereMonth('s.date', Carbon::now()->month)
                ->get()
                ->toArray();
        
        $saleProfit = array_reduce($sales, function($p, $c) {
            return $p + $c->profit_loss;
        });

        $discount = Sale::where('status', 'a')
                   ->whereMonth('date', Carbon::now()->month)
                   ->where('branch_id', $branchId)
                   ->sum('discount');

        $transport = Sale::where('status', 'a')
                    ->whereMonth('date', Carbon::now()->month)
                    ->where('branch_id', $branchId)
                    ->sum('transport');

        $vat = Sale::where('status', 'a')
                   ->whereMonth('date', Carbon::now()->month)
                   ->where('branch_id', $branchId)
                   ->sum('vat');

        $income = CashTransaction::where('type', 'Cash Receive')
                        ->where('branch_id', $branchId)
                        ->whereMonth('date', Carbon::now()->month)
                        ->sum('received_amount');

        $expense = CashTransaction::where('type', 'Cash Payment')
                        ->where('branch_id', $branchId)
                        ->whereMonth('date', Carbon::now()->month)
                        ->sum('paid_amount');

        $salaryPayment = SalaryPayment::where('branch_id', $branchId)
                        ->whereMonth('date', Carbon::now()->month)
                         ->sum('amount');

        $damage = DB::table('damage_details as dd')
                 ->join('damages as d', 'd.id', '=', 'dd.damage_id')
                 ->whereMonth('d.date', Carbon::now()->month)
                 ->where('dd.branch_id', $branchId)
                 ->where('dd.status', 'a')
                 ->sum('dd.total');

        $returns = DB::table('sale_returndetails as srd')
                    ->selectRaw("
                        ifnull(sum(srd.return_amount) - sum(sd.purchase_rate * srd.quantity ), 0) as total
                    ")
                   ->join('sale_returns as sr', 'sr.id', '=', 'srd.sale_return_id')
                   ->join('sales as s', 's.invoice', '=', 'sr.invoice')
                   ->join('sale_details as sd', 'sd.sale_id', '=', 's.id')
                   ->whereMonth('sr.date', Carbon::now()->month)
                   ->where('srd.branch_id', $branchId)
                   ->where('sr.status', 'a')
                   ->get();

        $returnProfit = $returns[0]->total;

        // $profite = ($saleProfit + $transport + $income + $vat) - ($discount + $expense + $salaryPayment + $damage + $returnProfit);
        $profite = ($saleProfit + $transport + $vat) - ($discount + $salaryPayment + $damage + $returnProfit);

        return $profite;
    }

    public function YearlyProfit()
    {
        $branchId = app('branchId');

        $sales = DB::table('sale_details as sd')
                ->selectRaw("
                    (sd.purchase_rate * sd.quantity) as purchase_amount,
                    (select sd.total - purchase_amount) as profit_loss
                ")
                ->join('sales as s', 's.id', '=', 'sd.sale_id')
                ->whereNull('sd.deleted_at')
                ->where('sd.branch_id', $branchId)
                ->whereYear('s.date', Carbon::now()->year)
                ->get()
                ->toArray();
        
        $saleProfit = array_reduce($sales, function($p, $c) {
            return $p + $c->profit_loss;
        });

       
        $discount = Sale::where('status', 'a')
                   ->whereYear('date', Carbon::now()->year)
                   ->where('branch_id', $branchId)
                   ->sum('discount');

        $transport = Sale::where('status', 'a')
                   ->whereYear('date', Carbon::now()->year)
                   ->where('branch_id', $branchId)
                   ->sum('transport');

        $vat = Sale::where('status', 'a')
                   ->whereYear('date', Carbon::now()->year)
                   ->where('branch_id', $branchId)
                   ->sum('vat');

        $income =   CashTransaction::where('type', 'Cash Receive')
                    ->where('branch_id', $branchId)
                    ->whereYear('date', Carbon::now()->year)
                    ->sum('received_amount');

        $expense = CashTransaction::where('type', 'Cash Payment')
                    ->where('branch_id', $branchId)
                    ->whereYear('date', Carbon::now()->year)
                    ->sum('paid_amount');

        $salaryPayment = SalaryPayment::where('branch_id', $branchId)
                         ->whereYear('date', Carbon::now()->year)
                         ->sum('amount');

        $damage = DB::table('damage_details as dd')
                 ->join('damages as d', 'd.id', '=', 'dd.damage_id')
                 ->whereYear('d.date', Carbon::now()->year)
                 ->where('dd.branch_id', $branchId)
                 ->where('dd.status', 'a')
                 ->sum('dd.total');

        $returns = DB::table('sale_returndetails as srd')
                    ->selectRaw("
                        ifnull(sum(srd.return_amount) - sum(sd.purchase_rate * srd.quantity ), 0) as total
                    ")
                   ->join('sale_returns as sr', 'sr.id', '=', 'srd.sale_return_id')
                   ->join('sales as s', 's.invoice', '=', 'sr.invoice')
                   ->join('sale_details as sd', 'sd.sale_id', '=', 's.id')
                   ->whereYear('sr.date', Carbon::now()->year)
                   ->where('srd.branch_id', $branchId)
                   ->where('sr.status', 'a')
                   ->get();

        $returnProfit = $returns[0]->total;

        // $profite = ($saleProfit + $transport + $income + $vat) - ($discount + $expense + $salaryPayment + $damage + $returnProfit);
        $profite = ($saleProfit + $transport + $vat) - ($discount + $salaryPayment + $damage + $returnProfit);

        return $profite;
    }

}