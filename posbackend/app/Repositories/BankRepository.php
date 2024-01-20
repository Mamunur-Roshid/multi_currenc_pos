<?php
namespace App\Repositories;

use App\Models\BankAccount;
use App\Models\BankTransaction;
use App\Models\CustomerPayment;
use App\Models\SalaryPayment;
use App\Models\SupplierPayment;
use stdClass;
use Exception;
use Illuminate\Support\Facades\DB;

class BankRepository 
{
    public function GetBankAccount()
    {
        $accounts = BankAccount::where('branch_id', app('branchId'))->get();
        return $accounts;
    }

    public function GetBankAccountById($id)
    {
        return BankAccount::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function InsertBankAccount(BankAccount $account)
    {
        $res = new stdClass();

        try {
            $branchId = app('branchId');
            
            $validation = $this->ValidateBankAccount($account);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateName = BankAccount::where('account_name', $account->account_name)->where('account_number', $account->account_number)->where('branch_id', $branchId)->first();
            if($duplicateName) {
                $res->code = 409;
                $res->message = $duplicateName->account_name . " already exists";
                return $res;
            } 


            $account->branch_id = $branchId;
            $account->added_by = app('userId');
            $account->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function UpdateBankAccount(BankAccount $account)
    {
        $res = new stdClass();

        try {
            $branchId = app('branchId');

            $validation = $this->ValidateBankAccount($account);
            if(strlen($validation) != 0) {
                $res->code = 406;
                $res->message = $validation;
                return $res;
            }

            $duplicateName = BankAccount::where('account_name', $account->account_name)->where('account_number', $account->account_number)->where('branch_id', $branchId)->where('id', '!=', $account->id)->first();
            if($duplicateName) {
                $res->code = 409;
                $res->message = $duplicateName->account_name . " already exists";
                return $res;
            } 


            $account->branch_id = $branchId;
            $account->updated_by = app('branchId');
            $account->save();

            $res->code = 200;
            $res->message = "Updated successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function DeleteBankAccount($id)
    {
        $res = new stdClass();
        try {
            $account = $this->GetBankAccountById($id);
            $account->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $ex) {
            $res->code = $ex->getCode();
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function ValidateBankAccount(BankAccount $account)
    {
        if($account->account_name == '') return 'Account Name is required';
        
        if($account->account_number  == '') return 'Account number is required';
       
        if($account->bank_name  == '') return 'Bank name is required';
        
        if($account->branch_name  == '') return 'Branch name is required';
        
        return '';
    }

    public function GenerateTransactionCode()
    {
        $transaction = BankTransaction::withTrashed()->orderBy('id', 'desc');
        $transactionId = ($transaction->count() == 0 ? 0 : $transaction->first()->id) + 1;
        $zeros = 5 - strlen($transactionId);
        $newTnxCode = "BTNX";
        for($i = 1; $i <= $zeros; $i++) $newTnxCode .= '0';
        $newTnxCode .= $transactionId;
        return $newTnxCode;
    }

    public function GetTransaction($arg = [])
    {
        $transactons = BankTransaction::with(['bank', 'added_by'])->where('branch_id', app('branchId'));

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
        return BankTransaction::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function ValidateTransaction(BankTransaction $transaction)
    {
        if($transaction->account_id  == '') return 'Bank account is required';
        return '';
    }

    public function InsertBankTransaction(BankTransaction $transaction)
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

            $duplicateCode = BankTransaction::where('code', $transaction->code)->first();
            if($duplicateCode) {
                $transaction->code = $this->GenerateTransactionCode();
            }

            $transaction->branch_id = $branchId;
            $transaction->added_by = app('userId');
            $transaction->save();

            $res->code = 200;
            $res->message = "Saved successfully";
        } catch(Exception $ex) {
            $res->code = 500;
            $res->message = $ex->getMessage();
        }

        return $res;
    }

    public function UpdateBankTransaction(BankTransaction $transaction)
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

    public function DeleteBankTransaction($id)
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

    public function GetCurrentBalance($arg = [])
    {
        $branchId = app('branchId');

        $account = BankAccount::where('branch_id', $branchId);
        $deposit = BankTransaction::where('type', 'Deposit')->where('branch_id', $branchId);
        $withdraw = BankTransaction::where('type', 'Withdraw')->where('branch_id', $branchId);
        $custReceived = CustomerPayment::where('type', 'Bank')->where('branch_id', $branchId);
        $suppPayment = SupplierPayment::where('type', 'Bank')->where('branch_id', $branchId);
        $salaryPayment = SalaryPayment::where('type', 'Bank')->where('branch_id', $branchId);

        if(isset($arg['accountId'])) {
            $account = $account->where('id', $arg['accountId']);
            $deposit = $deposit->where('account_id', $arg['accountId']);
            $withdraw = $withdraw->where('account_id', $arg['accountId']);
            $custReceived = $custReceived->where('account_id', $arg['accountId']);
            $suppPayment = $suppPayment->where('account_id', $arg['accountId']);
            $salaryPayment = $salaryPayment->where('account_id', $arg['accountId']);
        }

        $account = $account->sum('initial_balance');
        $totalDeposit = $deposit->sum('amount');
        $totalWithdraw = $withdraw->sum('amount');
        $custReceived = $custReceived->sum('amount');
        $suppPayment = $suppPayment->sum('amount');
        $salaryPayment = $salaryPayment->sum('amount');

        return $balance = ($account + $totalDeposit + $custReceived) - ($totalWithdraw + $suppPayment + $salaryPayment);
    }

    public function CalculateBankBalance()
    {
        $branchId = app('branchId');
        // Initial
        $initial = BankAccount::where('status', 1)->where('branch_id', $branchId)->sum('initial_balance');

        // Receive
        $deposit = BankTransaction::where('type', 'Deposit')->where('branch_id', $branchId)->sum('amount');
        $customerReceive = CustomerPayment::where('type', 'Bank')->where('branch_id', $branchId)->sum('amount');
        
        // Paid
        $withdraw = BankTransaction::where('type', 'Withdraw')->where('branch_id', $branchId)->sum('amount');
        $supplierPaid = SupplierPayment::where('type', 'Bank')->where('branch_id', $branchId)->sum('amount');
        $salaryPaid = SalaryPayment::where('type', 'Bank')->where('branch_id', $branchId)->sum('amount');

        $balance = ($initial + $deposit + $customerReceive) - ($withdraw + $supplierPaid + $salaryPaid);

        return $balance;
    }

    public function GetBankBalance()
    {
        $branchId = app('branchId');
        $bank = BankAccount::where('branch_id', $branchId)->where('status', 1);

        $bank = $bank->addSelect([
            'deposit' => BankTransaction::where('type', 'Deposit')->selectRaw('ifnull(sum(amount), 0)')
            ->whereColumn('account_id', 'bank_accounts.id'),

            'withdraw' => BankTransaction::where('type', 'Withdraw')->selectRaw('ifnull(sum(amount), 0)')
            ->whereColumn('account_id', 'bank_accounts.id'),

            'customerReceive' => CustomerPayment::where('type', 'Bank')->selectRaw('ifnull(sum(amount), 0)')
            ->whereColumn('account_id', 'bank_accounts.id'),

            'supplierPayment' => SupplierPayment::where('type', 'Bank')->selectRaw('ifnull(sum(amount), 0)')
            ->whereColumn('account_id', 'bank_accounts.id'),

            'salaryPayment' => SalaryPayment::where('type', 'Bank')->selectRaw('ifnull(sum(amount), 0)')
            ->whereColumn('account_id', 'bank_accounts.id')
        ]);

        $bank =  $bank->get()->map(function($bank) {
            $bank->balance = ($bank->initial_balance + $bank->deposit + $bank->customerReceive) - ($bank->withdraw + $bank->supplierPayment + $bank->salaryPayment);
            return $bank;
        });

        return $bank;
    }

    public function GetBankLedger($arg = [])
    {
        $res = new stdClass;
        $branchId = app('branchId');

        $deposit =  DB::table('bank_transactions as bt')
                    ->selectRaw("
                        bt.created_at,
                        bt.date,
                        concat('Bank Deposit - ', ba.bank_name, ' - ', ba.branch_name, ' - ', ba.account_name, ' - ', ba.account_number) as description,
                        bt.amount as cash_in,
                        0.00 as cash_out,
                        0.00 as balance
                    ")
                    ->join('bank_accounts as ba', 'ba.id', '=', 'bt.account_id')
                    ->where('bt.type', 'Deposit')
                    ->whereNull('bt.deleted_at')
                    ->where('account_id', $arg['accountId'])
                    ->where('bt.branch_id', $branchId);
        
        $withdraw = DB::table('bank_transactions as bt')
                    ->selectRaw("
                        bt.created_at,
                        bt.date,
                        concat('Bank withdraw - ', ba.bank_name, ' - ', ba.branch_name, ' - ', ba.account_name, ' - ', ba.account_number) as description,
                        0.00 as cash_in,
                        bt.amount as cash_out,
                        0.00 as balance
                    ")
                    ->join('bank_accounts as ba', 'ba.id', '=', 'bt.account_id')
                    ->where('bt.type', 'Withdraw')
                    ->whereNull('bt.deleted_at')
                    ->where('account_id', $arg['accountId'])
                    ->where('bt.branch_id', $branchId);
        
        $customerPayment =  DB::table('customer_payments')
                            ->selectRaw("
                                created_at,
                                date,
                                concat('Customer Payment Received -', invoice) as description,
                                amount as cash_in,
                                0.00 as cash_out,
                                0.00 as balance
                            ")
                            ->where('type', 'Bank')
                            ->whereNull('deleted_at')
                            ->where('account_id', $arg['accountId'])
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
                            ->where('type', 'Bank')
                            ->whereNull('deleted_at')
                            ->where('account_id', $arg['accountId'])
                            ->where('branch_id', $branchId);

        $salaryPayment =  DB::table('salary_payments')
                    ->selectRaw("
                        created_at,
                        date,
                        concat('Salary Payment') as description,
                        0.00 as cash_in,
                        amount as cash_out,
                        0.00 as balance
                    ")
                    ->where('type', 'Bank')
                    ->whereNull('deleted_at')
                    ->where('account_id', $arg['accountId'])
                    ->where('branch_id', $branchId);
                   
        $ledgers =  DB::table('bank_accounts')
                    ->selectRaw("
                        created_at,
                        date(created_at) as date,
                        concat('Initial Balance') as description,
                        initial_balance as cash_in,
                        0.00 as cash_out,
                        0.00 as balance
                    ")
                    ->where('id', $arg['accountId'])
                    ->where('branch_id', $branchId)
                    ->whereNull('deleted_at')
                    ->union($deposit)
                    ->union($withdraw)
                    ->union($customerPayment)
                    ->union($supplierPayment)
                    ->union($salaryPayment)
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
}