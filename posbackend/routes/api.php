<?php

use App\Http\Controllers\AccountController;
use App\Models\Purchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AreaController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BankController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UnitController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ChequeController;
use App\Http\Controllers\CompanyProfileController;
use App\Http\Controllers\CustomerCategoryController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DamageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\DiscountCodeController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\MonthController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SupplierController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::post('/login', [UserController::class, 'Login']);

Route::middleware(['jwt', 'throttle:1000, 1'])->group(function () {
    Route::get('/verification-token', function () {
        return response()->json(true);
    });
    
    // check authorization
    Route::get('/get-login-user', [UserController::class, 'CheckAuth']);
    Route::get('/get-login-user', 'App\Http\Controllers\UserController@CheckAuth');

    // area
    Route::get('/get-areas', [AreaController::class, 'GetAreas']);
    Route::post('/add-area', [AreaController::class, 'AddArea']);
    Route::post('/update-area', [AreaController::class, 'UpdateArea']);
    Route::delete('/delete-area/{id}', [AreaController::class, 'DeleteArea']);

    // unit
    Route::get('/get-units', [UnitController::class, 'GetUnits']);
    Route::post('/add-unit', [UnitController::class, 'AddUnit']);
    Route::post('/update-unit', [UnitController::class, 'UpdateUnit']);
    Route::delete('/delete-unit/{id}', [UnitController::class, 'DeleteUnit']);
    Route::post('/branch-access', [UserController::class, 'BranchAccess']);

    // brand
    Route::get('/get-brands', [BrandController::class, 'GetBrands']);
    Route::post('/add-brand', [BrandController::class, 'AddBrand']);
    Route::post('/update-brand', [BrandController::class, 'UpdateBrand']);
    Route::delete('/delete-brand/{id}', [BrandController::class, 'DeleteBrand']);

    // category
    Route::get('/get-categories', [CategoryController::class, 'GetCategories']);
    Route::post('/add-category', [CategoryController::class, 'AddCategory']);
    Route::post('/update-category', [CategoryController::class, 'UpdateCategory']);
    Route::delete('/delete-category/{id}', [CategoryController::class, 'DeleteCategory']);

    // customer category
    Route::get('/get-customer-categories', [CustomerCategoryController::class, 'GetCustomerCategories']);
    Route::post('/add-customer-category', [CustomerCategoryController::class, 'AddCustomerCategory']);
    Route::post('/update-customer-category', [CustomerCategoryController::class, 'UpdateCustomerCategory']);
    Route::delete('/delete-customer-category/{id}', [CustomerCategoryController::class, 'DeleteCustomerCategory']);

    // product 
    Route::get('/generate-product-code', [ProductController::class, 'GenerateProductCode']);
    Route::post('/get-products', [ProductController::class, 'GetProducts']);
    Route::post('/add-product', [ProductController::class, 'AddProduct']);
    Route::post('/bulk-imoprt-product', [ProductController::class, 'bulkImportProduct']);
    Route::post('/bulk-imoprt-purchase', [ProductController::class, 'bulkImportPurchase']);
    Route::post('/update-product', [ProductController::class, 'UpdateProduct']);
    Route::delete('/delete-product/{id}', [ProductController::class, 'DeleteProduct']);

    //stock
    Route::post('/get-current-stock', [ProductController::class, 'GetCurrentStock']);
    Route::post('/get-total-stock', [ProductController::class, 'GetTotalStock']);
    Route::post('/get-product-ledger', [ProductController::class, 'GetProductLeder']);
    Route::post('/low-stock-products', [ProductController::class, 'lowStockProducts']);

    // user
    Route::post('/get-users', [UserController::class, 'GetUsers']);
    Route::post('/add-user', [UserController::class, 'AddUser']);
    Route::post('/update-user', [UserController::class, 'UpdateUser']);
    Route::delete('/delete-user/{id}', [UserController::class, 'DeleteUser']);
    Route::post('/user-profile-update', [UserController::class, 'UserProfileUpdate']);
    Route::post('/update-user-permission', [UserController::class, 'UserPermissionUpdate']);

    // customer
    Route::get('/generate-customer-code', [CustomerController::class, 'GenerateCustomerCode']);
    Route::post('/get-customers', [CustomerController::class, 'GetCustomers']);
    Route::post('/add-customer', [CustomerController::class, 'AddCustomer']);
    Route::post('/update-customer', [CustomerController::class, 'UpdateCustomer']);
    Route::delete('/delete-customer/{id}', [CustomerController::class, 'DeleteCustomer']);
    Route::post('/get-customer-ledger', [CustomerController::class, 'GetCustomerLedger']);

    // customer payment 
    Route::post('/get-customer-due', [CustomerController::class, 'GetCustomerDue']);
    Route::post('/get-customer-payment', [CustomerController::class, 'GetCustomerPayment']);
    Route::post('/customer-payment', [CustomerController::class, 'AddCustomerPayment']);
    Route::post('/update-customer-payment', [CustomerController::class, 'UpdateCustomerPayment']);
    Route::delete('/delete-customer-payment/{id}', [CustomerController::class, 'DeleteCustomerPayment']);

    // customer type
    Route::get('/get-customer-types', [CustomerController::class, 'GetCustomerType']);
    Route::post('/add-customer-type', [CustomerController::class, 'AddCustomerType']);
    Route::post('/update-customer-type', [CustomerController::class, 'UpdateCustomerType']);
    Route::delete('/delete-customer-type/{id}', [CustomerController::class, 'DeleteCustomerType']);

    // supplier
    Route::get('/generate-supplier-code', [SupplierController::class, 'GenerateSupplierCode']);
    Route::get('/get-suppliers', [SupplierController::class, 'GetSuppliers']);
    Route::post('/add-supplier', [SupplierController::class, 'AddSupplier']);
    Route::post('/update-supplier', [SupplierController::class, 'UpdateSupplier']);
    Route::delete('/delete-supplier/{id}', [SupplierController::class, 'DeleteSupplier']);
    Route::post('/get-supplier-ledger', [SupplierController::class, 'GetSupplierLedger']);

    // supplier payment 
    Route::post('/get-supplier-due', [SupplierController::class, 'SupplierDue']);
    Route::post('/get-supplier-payment', [SupplierController::class, 'GetSupplierPayment']);
    Route::post('/supplier-payment', [SupplierController::class, 'AddSupplierPayment']);
    Route::post('/update-supplier-payment', [SupplierController::class, 'UpdateSupplierPayment']);
    Route::delete('/delete-supplier-payment/{id}', [SupplierController::class, 'DeleteSupplierPayment']);

    // purchase
    Route::get('/generate-purchase-code', [PurchaseController::class, 'GeneratePurchaseInvoice']);
    Route::get('/get-purchase-invoices', [PurchaseController::class, 'GetPurchaseInvoice']);
    Route::post('/get-purchases', [PurchaseController::class, 'GetPurchase']);
    Route::post('/add-purchase', [PurchaseController::class, 'AddPurchase']);
    Route::post('/update-purchase', [PurchaseController::class, 'UpdatePurchase']);
    Route::delete('/delete-purchase/{id}', [PurchaseController::class, 'DeletePurchase']);

    // purchae return get-purchase-for-return
    Route::post('/get-purchase-for-return', [PurchaseController::class, 'GetPurchaseForReturn']);
    Route::post('/get-purchase-returns', [PurchaseController::class, 'GetPurchaseReturns']);
    Route::post('/add-purchase-return', [PurchaseController::class, 'AddPurchaseReturn']);

    // sale
    Route::get('/generate-sale-code', [SaleController::class, 'GenerateSaleInvoice']);
    Route::get('/get-sale-invoices', [SaleController::class, 'GetSaleInvoice']);
    Route::post('/get-sales', [SaleController::class, 'GetSales']);
    Route::post('/add-sale', [SaleController::class, 'AddSale']);
    Route::post('/update-sale', [SaleController::class, 'UpdateSale']);
    Route::delete('/delete-sale/{id}', [SaleController::class, 'DeleteSale']);

    // sale return 
    Route::post('/get-sale-for-return', [SaleController::class, 'GetSaleForReturn']);
    Route::post('/get-sale-returns', [SaleController::class, 'GetSaleReturn']);
    Route::post('/add-sale-return', [SaleController::class, 'AddSaleReturn']);

    // company prifle 
    Route::get('/get-company-profile', [CompanyProfileController::class, 'GetCompanyProfile']);
    Route::post('/update-company-profile', [CompanyProfileController::class, 'UpdateCompanyProfile']);

    // damage
    Route::get('/generate-damage-code', [DamageController::class, 'GenerateDamageCode']);
    Route::post('/get-damages', [DamageController::class, 'GetDamages']);
    Route::post('/add-damage', [DamageController::class, 'AddDamage']);
    Route::post('/update-damage', [DamageController::class, 'UpdateDamage']);
    Route::delete('/delete-damage/{id}', [DamageController::class, 'DeleteDamage']);

    // department
    Route::get('/get-departments', [DepartmentController::class, 'GetDepartments']);
    Route::post('/add-department', [DepartmentController::class, 'AddDepartment']);
    Route::post('/update-department', [DepartmentController::class, 'UpdateDepartment']);
    Route::delete('/delete-department/{id}', [DepartmentController::class, 'DeleteDepartment']);

    // designation
    Route::get('/get-designations', [DesignationController::class, 'GetDesignations']);
    Route::post('/add-designation', [DesignationController::class, 'AddDesignation']);
    Route::post('/update-designation', [DesignationController::class, 'UpdateDesignation']);
    Route::delete('/delete-designation/{id}', [DesignationController::class, 'DeleteDesignation']);

    // employee
    Route::get('/generate-employee-code', [EmployeeController::class, 'GenerateEmployeeCode']);
    Route::post('/get-employees', [EmployeeController::class, 'GetEmployees']);
    Route::post('/add-employee', [EmployeeController::class, 'AddEmployee']);
    Route::post('/update-employee', [EmployeeController::class, 'UpdateEmployee']);
    Route::delete('/delete-employee/{id}', [EmployeeController::class, 'DeleteEmployee']);

    // salary 
    Route::post('/get-salary-sheets', [EmployeeController::class, 'GetSalarySheet']);
    Route::post('/salary-generate', [EmployeeController::class, 'AddSalaryGenerate']);
    Route::post('/get-salary-payments', [EmployeeController::class, 'GetSalaryPayment']);
    Route::post('/get-salary-due', [EmployeeController::class, 'GetSalaryDue']);
    Route::post('/add-salary-payment', [EmployeeController::class, 'AddSalaryPayment']);
    Route::post('/update-salary-payment', [EmployeeController::class, 'UpdateSalaryPayment']);
    Route::delete('/delete-salary-payment/{id}', [EmployeeController::class, 'DeleteSalaryPayment']);

    // expense
    Route::get('/get-expenses', [AccountController::class, 'GetExpenses']);
    Route::post('/add-expense', [AccountController::class, 'AddExpense']);
    Route::post('/update-expense', [AccountController::class, 'UpdateExpense']);
    Route::delete('/delete-expense/{id}', [AccountController::class, 'DeleteExpense']);

    // discount code
    Route::get('/get-discount-code', [DiscountCodeController::class, 'GetDiscountCode']);
    Route::post('/add-discount-code', [DiscountCodeController::class, 'AddDiscountCode']);
    Route::post('/update-discount-code', [DiscountCodeController::class, 'UpdateExpense']);
    Route::delete('/delete-discount-code/{id}', [DiscountCodeController::class, 'DeleteExpense']);

    // cash transaction
    Route::get('/generate-transaction-code', [AccountController::class, 'GenerateTransactionCode']);
    Route::get('/get-cash-balance', [AccountController::class, 'GetCashBalance']);
    Route::post('/get-cash-transactions', [AccountController::class, 'GetCashTransactions']);
    Route::post('/add-cash-transaction', [AccountController::class, 'AddCashTransaction']);
    Route::post('/update-cash-transaction', [AccountController::class, 'UpdateCashTransaction']);
    Route::delete('/delete-cash-transaction/{id}', [AccountController::class, 'DeleteCashTransaction']);
    Route::post('/get-cash-ledger', [AccountController::class, 'CashLedger']);

    // bank account
    Route::get('/get-bank-accounts', [BankController::class, 'GetBankAccounts']);
    Route::post('/add-bank-account', [BankController::class, 'AddBankAccount']);
    Route::post('/update-bank-account', [BankController::class, 'UpdateBankAccount']);
    Route::delete('/delete-bank-account/{id}', [BankController::class, 'DeleteBankAccount']);

    // bank transaction 
    Route::get('/generate-bank-transaction', [BankController::class, 'GenerateBankTransactionCode']);
    Route::get('/get-bank-balance', [BankController::class, 'GetBankBalance']);
    Route::get('/get-account-balance', [BankController::class, 'GetAccountBalance']);
    Route::post('/get-bank-transactions', [BankController::class, 'GetBankTransaction']);
    Route::post('/add-bank-transaction', [BankController::class, 'AddBankTrnasaction']);
    Route::post('/update-bank-transaction', [BankController::class, 'UpdateBankTrnasaction']);
    Route::delete('/delete-bank-transaction/{id}', [BankController::class, 'DeleteBankTrnasaction']);
    Route::post('/get-current-bank-balance', [BankController::class, 'GetCurrentBalance']);
    Route::post('/get-bank-ledger', [BankController::class, 'GetBankLedger']);

    // cheque
    Route::post('/get-cheques', [ChequeController::class, 'GetCheques']);
    Route::post('/add-cheque', [ChequeController::class, 'AddCheque']);
    Route::post('/update-cheque', [ChequeController::class, 'UpdateCheque']);
    Route::delete('/delete-cheque/{id}', [ChequeController::class, 'DeleteCheque']);
    Route::post('/change-status', [ChequeController::class, 'ChangeChequeStatus']);

    // month
    Route::get('/get-months', [MonthController::class, 'GetMonths']);
    Route::post('/add-month', [MonthController::class, 'AddMonth']);
    Route::post('/update-month', [MonthController::class, 'UpdateMonth']);
    Route::delete('/delete-month/{id}', [MonthController::class, 'DeleteMonth']);

    // ghrap
    Route::get('/get-ghrap-data', [AccountController::class, 'GhrapData']);
    Route::get('/get-profits', [AccountController::class, 'GetProfit']);
    Route::post('get-dashboard-data', [DashboardController::class, 'GetDashboardData']);

    // branch
    Route::get('/get-branches', [BranchController::class, 'GetBranches']);
    Route::post('/add-branch', [BranchController::class, 'AddBranch']);
    Route::post('/update-branch', [BranchController::class, 'UpdateBranch']);
    Route::delete('/delete-branch/{id}', [BranchController::class, 'DeleteBranch']);

    // Attendance
    Route::post('/get-attendances', [AttendanceController::class, 'GetAttendance']);
    Route::post('/add-attendance', [AttendanceController::class, 'AddAttendance']);
    // Route::post('/update-branch', [BranchController::class, 'UpdateBranch']);
    // Route::delete('/delete-branch/{id}', [BranchController::class, 'DeleteBranch']);


    // profitloss 
    Route::get('/profit-loss', [ReportController::class, 'profitloss']);

});
