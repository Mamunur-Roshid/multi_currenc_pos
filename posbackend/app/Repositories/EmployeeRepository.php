<?php
namespace App\Repositories;

use App\Models\Attendance;
use App\Models\Sale;
use stdClass;
use Exception;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Designation;
use App\Models\EmployeeEducation;
use App\Models\PreviousEmployment;
use App\Models\SalaryPayment;
use App\Models\SalarySheet;
use App\Utils;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class EmployeeRepository
{
    public function Get($arg = [])
    {
        $employees = Employee::with(['department', 'designation', 'area'])->where('branch_id', app('branchId'));
        if(isset($arg['id'])) {
            $employees = $employees->where('id', $arg['id']);
        }

        if(isset($arg['departmentId'])) {
            $employees = $employees->where('department_id', $arg['departmentId']);
        }

        if(isset($arg['designationId'])) {
            $employees = $employees->where('designation_id', $arg['designationId']);
        }

        if(isset($arg['date'])) {

            // Extract month and year from date
            $month = date('m', strtotime($arg['date']));
            $year = date('Y', strtotime($arg['date']));

            $employees = $employees->get();

            // Loop through employees
            foreach ($employees as $employee) {

                $totalDuration = Attendance::where('employee_id', $employee['id'])
                    ->whereMonth('created_at', $month)
                    ->whereYear('created_at', $year)
                    ->sum('duration');

                $salaryCalculated = ($totalDuration / 60) * ($employee['salary'] / 30);

                $saleSubTotal = Sale::where('employee_id', $employee['id'])
                    ->whereMonth('date', $month)
                    ->whereYear('date', $year)
                    ->sum('sub_total');

                $commission = $saleSubTotal * ($employee['commission_rate'] / 100);

                $employee->commission = $commission;
                $employee->salary = $salaryCalculated;
                $employee->total = $commission + $salaryCalculated;

                return $employees;
            }
        }
            
       return  $employees->get();
    }

    public function GetById($id) 
    {
        return Employee::where('id', $id)->where('branch_id', app('branchId'))->first();
    }

    public function GenerateEmployeeCode()
    {
        $emp = Employee::orderBy('id', 'desc');
        $empId = ($emp->count() == 0 ? 0 : $emp->first()->id) + 1;
        $zeros = 5 - strlen($empId);
        $newEmpCode = "E";
        for($i = 1; $i <= $zeros; $i++) $newEmpCode .= '0';
        $newEmpCode .= $empId;
        return $newEmpCode;
    }

    public function Insert(Employee $employee)
    {
        $res = new stdClass;

        try {
            $employee->birth_date = $employee->birth_date ? date('Y-m-d', strtotime($employee->birth_date)) : null;
            $employee->branch_id = app('branchId');
            $employee->added_by = app('userId');
            $employee->save();
            
            $res->message = "Employee insert successfully";
            $res->code= 200;
        } catch (Exception $e) {
            $res->message = $e->getMessage();
            $res->code = 500;
        }

        return $res;
    }

    public function Update(Employee $employee)
    {
        $res = new stdClass;

        try {
            $employee->birth_date = $employee->birth_date ? date('Y-m-d', strtotime($employee->birth_date)) : null;
            $employee->branch_id = app('branchId');
            $employee->updated_by = app('userId');
            $employee->save();
            
            $res->message = "Employee updated successfully";
            $res->code= 200;
        } catch (Exception $e) {
            $res->message = $e->getMessage();
            $res->code = 500;
        }

        return $res;
    }

    public function Delete($id)
    {
        $res = new stdClass();
        try {
            $employee = $this->GetById($id);
            $employee->delete();

            $res->code = 200;
            $res->message = "Deleted successfully";
        } catch(Exception $e) {
            $res->code = $e->getCode();
            $res->message = $e->getMessage();
        }

        return $res;
    }

    public function SalaryGenerate(SalarySheet $salary, $cart)
    {
        $res = new stdClass;

        try {
            $duplicateSalary = SalarySheet::where('month_id', $salary->month_id)->where('branch_id', app('branchId'))->first();
            if($duplicateSalary) {
                $res->code = 409;
                $res->message = "This month salary already exists";
                return $res;
            }

            foreach($cart as $employee) {
                $sheet = new SalarySheet();
                
                $sale_sub_total = Sale::where('employee_id', $employee['id'])
                    ->whereMonth('date', $salary->month_id)
                    ->whereYear('date', $salary->year)
                    ->sum('sub_total');

                $commission = $sale_sub_total * ($employee['commission_rate'] / 100);
//                
//                $total_duration = Attendance::where('employee_id', $employee['id'])
//                    ->whereMonth('created_at', $salary->month_id)
//                    ->whereYear('created_at', $salary->year)
//                    ->sum('duration');
//
//                $salary_calculated = ($total_duration / 60 ) * ($employee['salary'] / 30); 
                
                $sheet->date = $salary->date;
                $sheet->month_id = $salary->month_id;
                $sheet->employee_id = $employee['id'];
                $sheet->salary = $employee['salary'];
                $sheet->deduction = $employee['deduction'];
                $sheet->commission = $commission;
                $sheet->advance = $employee['advance'];
                $sheet->others = $employee['others'];
                $sheet->total = $employee['total'];
                $sheet->branch_id = app('branchId');
                $sheet->added_by = app('userId');
                $sheet->save();
            }

            $res->code = 200;
            $res->message = "Salary generate successfully";
        } catch(Exception $e) {
            $res->code = 500;
            $res->message = $e->getMessage();
        }
            
        return $res;
    }

    public function GetPayments($arg = [])
    {
        $branchId = app('branchId');
        $payments = SalaryPayment::with(['employee', 'month', 'bank_account'])->where('branch_id', $branchId);

        if(isset($arg['dateFrom']) && isset($arg['dateTo'])) {
            $payments = $payments->whereBetween('date', [$arg['dateFrom'], $arg['dateTo']]);
        }

        if(isset($arg['monthId'])) {
            $payments = $payments->where('month_id', $arg['monthId']);
        }

        if(isset($arg['employeeId'])) {
            $payments = $payments->where('employee_id', $arg['employeeId']);
        }

        return $payments->latest()->get();
    }

    public function GetByPaymentId($id)
    {
        return SalaryPayment::where('id', $id)->first();
    }

    public function InsertPayment(SalaryPayment $payment)
    {
        $res = new stdClass();
        try {
            $payment->branch_id = app('branchId');
            $payment->added_by = app('userId');

            $payment->save();

            $res->message = 'Salary payment insert successfully';
            $res->code = 200;
        } catch (\Exception $e) {
            $res->code = $e->getCode();
            $res->message = 'fail '.$e->getMessage();
        }

        return $res;
    }

    public function UpdatePayment(SalaryPayment $payment)
    {
        $res = new stdClass();
        try {
            $payment->branch_id = app('branchId');
            $payment->updated_by  = app('userId');

            $payment->save();

            $res->message = 'Salary payment update successfully';
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

    public function GetSalaryDue($arg = [])
    {
        $branchId = app('branchId');
        $salary = Employee::where('branch_id', $branchId);

        if(isset($arg['employeeId'])) {
            $salary = $salary->where('id', $arg['employeeId']);
        }

        $salary = $salary->addSelect([
            'payable_salary' => SalarySheet::selectRaw('ifnull(sum(total), 0)')
            ->where('month_id', $arg['monthId'])
            ->whereColumn('employee_id', 'employees.id'),

            'payment' => SalaryPayment::selectRaw('ifnull(sum(amount), 0)')
            ->where('month_id', $arg['monthId'])
            ->whereColumn('employee_id', 'employees.id'),
        ]);

        $salary = $salary->latest()->get()
            ->map(function($salary) {
                $salary->due = ($salary->payable_salary - $salary->payment);
                return $salary;
            }, );

        return $salary;
    }

    public function GetSalarySheet($arg = [])
    {
        $branchId = app('branchId');
        $sheet = SalarySheet::with(['employee', 'employee.department', 'employee.designation', 'month'])->where('branch_id', $branchId);

        if(isset($arg['monthId'])) {
            $sheet = $sheet->where('month_id', $arg['monthId']);
        }

        if(isset($arg['employeeId'])) {
            $sheet = $sheet->where('employee_id', $arg['employeeId']);
        }

        $sheet = $sheet->get();
        return $sheet;
    }
}

