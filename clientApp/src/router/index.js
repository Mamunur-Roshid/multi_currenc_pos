import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import store from './../store'

Vue.use(VueRouter)


const routes = [
	{
		path: '/login',
		name: 'Login',
		meta: { color: '', layout: 'simpleLayout' },
		component: Login,
	},
	{
		beforeEnter: asyncGuard,
		path: '/',
		name: 'Dashboard',
		meta: { color: 'yellow' },
		// component: () => import('../views/Dashboard.vue')
		component: () => import('../views/Dashboard.vue')
	},
	{
		beforeEnter: guard,
		path: '/areas',
		name: 'Areas',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "areas" */ '../views/Administration/Areas.vue')
	},
	{
		beforeEnter: guard,
		path: '/units',
		name: 'Units',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "units" */ '../views/Administration/Units.vue')
	},
	{
		beforeEnter: guard,
		path: '/brands',
		name: 'Brands',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "brands" */ '../views/Administration/Brands.vue')
	},
	{
		beforeEnter: guard,
		path: '/categories',
		name: 'Categories',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "categories" */ '../views/Administration/Categories.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer-categories',
		name: 'CustomerCategories',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "categories" */ '../views/Administration/CustomerCategories.vue')
	},
	{
		beforeEnter: guard,
		path: '/user',
		name: 'User',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "user" */ '../views/Administration/User.vue')
	},
	{
		beforeEnter: guard,
		path: '/discount-code',
		name: 'DiscountCode',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "user" */ '../views/Administration/DiscountCode.vue')
	},
	{
		beforeEnter: guard,
		path: '/profile-setting',
		name: 'ProfileSetting',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "profile-setting" */ '../views/Administration/ProfileSetting.vue')
	},
	{
		beforeEnter: guard,
		path: '/product',
		name: 'Product',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/Product.vue')
	},
	{
		beforeEnter: guard,
		path: '/product-list',
		name: 'ProductList',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/ProductList.vue')
	},
	{
		beforeEnter: guard,
		path: '/product-view/:id?',
		name: 'ProductView',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/ProductView.vue')
	},
	{
		beforeEnter: guard,
		path: '/low-stock-report',
		name: 'LowStockReport',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/LowStockReport.vue')
	},
	{
		beforeEnter: guard,
		path: '/products',
		name: 'Products',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/Products.vue')
	},
	{
		beforeEnter: guard,
		path: '/purchase-bulk-import',
		name: 'PurchaseBulkImport',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/PurchaseBulkImport.vue')
	},
	{
		beforeEnter: guard,
		path: '/product-buld-import',
		name: 'ProductBulkImport',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/ProductBulkImport.vue')
	},
	{
		beforeEnter: guard,
		path: '/stock-inquiry',
		name: 'StockInquiry',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product" */ '../views/Administration/StockInquiry.vue')
	},
	{
		beforeEnter: guard,
		path: '/product-ledger',
		name: 'ProductLedger',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product-ledger" */ '../views/Administration/ProductLedger.vue')
	},
	{
		beforeEnter: guard,
		path: '/barcode-generate/:id?',
		name: 'ProductBarcode',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "product-ledger" */ '../views/Administration/ProductBarcode.vue')
	},
	{
		beforeEnter: guard,
		path: '/retail/:id?',
		name: 'retail',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sale" */ '../views/Sale/RetailSale.vue')
	},
	{
		beforeEnter: guard,
		path: '/wholesale/:id?',
		name: 'wholesale',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sale" */ '../views/Sale/WholesaleSale.vue')
	},
	{
		beforeEnter: guard,
		path: '/pos',
		name: 'Pos',
		meta: { color: '', layout: 'PosLayout' },
		component: () => import(/* webpackChunkName: "sale" */ '../views/Sale/Pos.vue')
	},
	{
		beforeEnter: guard,
		path: '/stock-price-list',
		name: 'Stock & Price List',
		meta: { color: '', layout: 'PosLayout' },
		component: () => import(/* webpackChunkName: "sale" */ '../views/Sale/StockAndPriceList.vue')
	},
	{
		
		beforeEnter: guard,
		path: '/sale-return/:id?',
		name: 'SaleReturn',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sale-return" */ '../views/Sale/SaleReturn.vue')
	},
	{
		beforeEnter: guard,
		path: '/sales',
		name: 'SaleRecord',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sales" */ '../views/Sale/SaleRecord.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer-product-report',
		name: 'CustomerProductReport',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sales" */ '../views/Sale/CustomerProductReport.vue')
	},
	{
		beforeEnter: guard,
		path: '/sale-returns',
		name: 'SaleReturns',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sales" */ '../views/Sale/SaleReturns.vue')
	},
	{
		beforeEnter: guard,
		path: '/sale-invoice/:id',
		name: 'SaleInvoices',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sale-invoice" */ '../views/Sale/SaleInvoices.vue')
	},
	{
		beforeEnter: guard,
		path: '/sale-return-invoice/:id',
		name: 'SaleReturnInvoice',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "sale-return-invoice" */ '../views/Sale/SaleReturnInvoice.vue')
	},
	{
		beforeEnter: guard,
		path: '/saleinvoice',
		name: 'SaleInvoice',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "saleinvoice" */ '../views/Sale/Invoice.vue')
	},
	{
		beforeEnter: guard,
		path: '/stock',
		name: 'Stock',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "stock" */ '../views/Sale/Stock.vue')
	},
	{
		beforeEnter: guard,
		path: '/purchase/:id?',
		name: 'Purchase',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "purchase" */ '../views/Purchase/Purchase.vue')
	},
	{
		beforeEnter: guard,
		path: '/purchase-return/:id?',
		name: 'PurchaseReturn',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "purchase-return" */ '../views/Purchase/PurchaseReturn.vue')
	},
	{
		beforeEnter: guard,
		path: '/purchases',
		name: 'PurchaseRecord',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "purchases" */ '../views/Purchase/PurchaseRecord.vue')
	},
	{
		beforeEnter: guard,
		path: '/purinvoice',
		name: 'PurInvoice',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "purinvoice" */ '../views/Purchase/Invoice.vue')
	},
	{
		beforeEnter: guard,
		path: '/purchase-invoice/:id',
		name: 'PurchaseInvoice',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "purchase-invoice" */ '../views/Purchase/PurchaseInvoice.vue')
	},
	{
		beforeEnter: guard,
		path: '/purchase-returns',
		name: 'PurchaseReturns',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "purchase-returns" */ '../views/Purchase/PurchaseReturns.vue')
	},
	{
		beforeEnter: guard,
		path: '/purchase-return-invoice/:id',
		name: 'PurchaseReturnInvoice',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "purchase-return-invoice" */ '../views/Purchase/PurchaseReturnInvoice.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer',
		name: 'Customer',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customer" */ '../views/Customer/Customer.vue')
	},
	{
		beforeEnter: guard,
		path: '/customers',
		name: 'Customers',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customers" */ '../views/Customer/Customers.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer-payment',
		name: 'CustomerPayment',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customer-payment" */ '../views/Customer/CustomerPayment.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer-due',
		name: 'CustomerDue',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customer-due" */ '../views/Customer/CustomerDue.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer-ledger',
		name: 'CustomerLedger',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customer-ledger" */ '../views/Customer/CustomerLedger.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer-payments',
		name: 'CustomerPayments',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customer-payments" */ '../views/Customer/CustomerPayments.vue')
	},
	{
		beforeEnter: guard,
		path: '/customer-type',
		name: 'CustomerType',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customer-payments" */ '../views/Customer/CustomerType.vue')
	},
	{
		beforeEnter: guard,
		path: '/custome-point',
		name: 'CustomerPoint',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "customer-point" */ '../views/Customer/CustomerPoint.vue')
	},
	{
		beforeEnter: guard,
		path: '/supplier',
		name: 'Supplier',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "supplier" */ '../views/Supplier/Supplier.vue')
	},
	{
		beforeEnter: guard,
		path: '/suppliers',
		name: 'Suppliers',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "suppliers" */ '../views/Supplier/Suppliers.vue')
	},
	{
		beforeEnter: guard,
		path: '/supplier-payment',
		name: 'SupplierPayment',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "supplier-payment" */ '../views/Supplier/SupplierPayment.vue')
	},
	{
		beforeEnter: guard,
		path: '/supplier-payments',
		name: 'SupplierPayments',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "supplier-payment" */ '../views/Supplier/SupplierPayments.vue')
	},
	{
		beforeEnter: guard,
		path: '/supplier-due',
		name: 'SupplierDue',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "supplier-due" */ '../views/Supplier/SupplierDue.vue')
	},
	{
		beforeEnter: guard,
		path: '/supplier-ledger',
		name: 'SupplierLedger',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "supplier-ledger" */ '../views/Supplier/SupplierLedger.vue')
	},
	{
		path: '/company-profile',
		name: 'CompanyProfile',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "supplier-due" */ '../views/Administration/CompanyProfile.vue')
	},
	{
		beforeEnter: guard,
		path: '/damage/:id?',
		name: 'Damage',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "damage" */ '../views/Administration/Damage.vue')
	},
	{
		beforeEnter: guard,
		path: '/damages',
		name: 'Damages',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "damages" */ '../views/Administration/Damages.vue')
	},
	{
		beforeEnter: guard,
		path: '/damage-invoice/:id',
		name: 'DamageInvoice',
		meta: { color: '' },
		component: () => import(/* webpackChunkName: "damage-invoice" */ '../views/Administration/DamageInvoice.vue')
	},
	{
		beforeEnter: guard,
		path: '/departments',
		name: 'Departments',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "departments" */ '../views/Employee/Department.vue')
	},
	{
		beforeEnter: guard,
		path: '/attendance',
		name: 'Attendance',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "departments" */ '../views/Employee/Attendance.vue')
	},
	{
		beforeEnter: guard,
		path: '/designations',
		name: 'Designations',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "designations" */ '../views/Employee/Designation.vue')
	},
	{
		beforeEnter: guard,
		path: '/months',
		name: 'Months',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "months" */ '../views/Employee/Months.vue')
	},
	{
		beforeEnter: guard,
		path: '/employee/:id?',
		name: 'Employee',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "employee" */ '../views/Employee/Employee.vue')
	},
	{
		beforeEnter: guard,
		path: '/employees',
		name: 'Employees',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "employees" */ '../views/Employee/Employees.vue')
	},
	{
		beforeEnter: guard,
		path: '/salary-generate',
		name: 'SalaryGenerate',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "salary-generate" */ '../views/Employee/SalaryGenerate.vue')
	},
	{
		beforeEnter: guard,
		path: '/salary-payment',
		name: 'SalaryPayment',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "salary-payment" */ '../views/Employee/SalaryPayment.vue')
	},
	{
		beforeEnter: guard,
		path: '/salary-payments',
		name: 'SalaryPayments',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "salary-payments" */ '../views/Employee/SalaryPayments.vue')
	},
	{
		beforeEnter: guard,
		path: '/salary-sheet',
		name: 'SalarySheet',
		meta: { color: 'lime darken-2' },
		component: () => import(/* webpackChunkName: "salary-sheet" */ '../views/Employee/SalarySheet.vue')
	},
	{
		beforeEnter: guard,
		path: '/expenses',
		name: 'ExpenseAccount',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "expenses" */ '../views/Account/ExpenseAccount.vue')
	},
	{
		beforeEnter: guard,
		path: '/cash-transaction',
		name: 'CashTransaction',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "cash-transaction" */ '../views/Account/CashTransaction.vue')
	},
	{
		beforeEnter: guard,
		path: '/cash-transactions',
		name: 'CashTransactions',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "cash-transactions" */ '../views/Account/CashTransactions.vue')
	},
	{
		beforeEnter: guard,
		path: '/bank-account',
		name: 'BankAccount',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "bank-account" */ '../views/Account/BankAccount.vue')
	},
	{
		beforeEnter: guard,
		path: '/profit-loss',
		name: 'ProfitLoss',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "bank-account" */ '../views/Account/ProfitLoss.vue')
	},
	{
		beforeEnter: guard,
		path: '/bank-transaction',
		name: 'BankTransaction',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "bank-transaction" */ '../views/Account/BankTransaction.vue')
	},
	{
		beforeEnter: guard,
		path: '/bank-transactions',
		name: 'BankTransactions',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "bank-transactions" */ '../views/Account/BankTransactions.vue')
	},
	{
		beforeEnter: guard,
		path: '/cash-view',
		name: 'CashView',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "cash-view" */ '../views/Account/CashView.vue')
	},
	{
		beforeEnter: guard,
		path: '/cash-ledger',
		name: 'CashLedger',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "cash-ledger" */ '../views/Account/CashLedger.vue')
	},
	{
		beforeEnter: guard,
		path: '/bank-ledger',
		name: 'BankLedger',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "bank-ledger" */ '../views/Account/BankLedger.vue')
	},
	{
		beforeEnter: guard,
		path: '/cheque',
		name: 'Cheque',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "cheque" */ '../views/Account/Cheque/Cheque.vue')
	},
	{
		beforeEnter: guard,
		path: '/cheques',
		name: 'Cheques',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "cheques" */ '../views/Account/Cheque/Cheques.vue')
	},
	{
		beforeEnter: guard,
		path: '/cheque-reminder',
		name: 'ChequeReminder',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "cheque-reminder" */ '../views/Account/Cheque/ChequeReminder.vue')
	},
	{
		beforeEnter: guard,
		path: '/pending-cheque',
		name: 'PendingCheque',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "pending-cheque" */ '../views/Account/Cheque/PendingCheque.vue')
	},
	{
		beforeEnter: guard,
		path: '/dishonoured-cheque',
		name: 'DishonouredCheque',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "dishonoured-cheque" */ '../views/Account/Cheque/DishonouredCheque.vue')
	},
	{
		beforeEnter: guard,
		path: '/paid-cheque',
		name: 'PaidCheque',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "paid-cheque" */ '../views/Account/Cheque/PaidCheque.vue')
	},
	{
		beforeEnter: guard,
		path: '/branches',
		name: 'Branches',
		meta: { color: 'pink' },
		component: () => import(/* webpackChunkName: "paid-cheque" */ '../views/Administration/Branch.vue')
	},
]

const router = new VueRouter({
	mode: 'history',
	base: '/',
	routes
})


function checkPermission(to, from) {
	let user = JSON.parse(localStorage.getItem("userData"));
	let _permissions = user ? user.permissions : [];

	let userData = JSON.parse(localStorage.getItem("userData"));
	let userType = userData.userType;
	if (userType == "super_admin") return;
	if (to.name == "user-profile-setting") return;
	// console.log();

	if (to.name) {
	  let permissions = _permissions;
	  if (permissions.length) {
		let hasPermission = permissions.indexOf(to.name);
		if (hasPermission == -1 && to.path != "/") {
			router.replace("/");
		}
	  }
	// 	if (hasPermission == -1 && to.path != "/")
	// 	  router.push("/");
	//   }
	}
}

async function asyncGuard(to, from, next) {
	let token = localStorage.getItem('jwtToken');
	
	await axios.get(`${router.app.$store.state.host}/verification-token`, {
		headers: {
			Authorization: token ? token : null
		}
	})
	.then(res => {
		// next({ name: 'Login' })
		if(!res.data) {
			localStorage.removeItem('jwtToken')
			token = null;
			router.push('/login').catch(()=>{});
		}
	})
	.catch(e => {
		if(e.response.statusText == 'Unauthorized'){
			localStorage.removeItem('jwtToken')
			token = null;
		}
	})

	if(token == null || token == undefined || token == '') {
        next({ name: 'Login' })
    } 
    else {
		let user = JSON.parse(localStorage.getItem("userData"));
		let _permissions = user ? user.permissions : [];
		checkPermission(to, from)
		next()
	}
}

async function guard(to, from, next){
	let token = localStorage.getItem('jwtToken');
	
	axios.get(`${router.app.$store.state.host}/verification-token`, {
		headers: {
			Authorization: token ? token : null
		}
	})
	.then(res => {
		// next({ name: 'Login' })
		if(!res.data) {
			localStorage.removeItem('jwtToken')
			token = null;
			router.push('/login').catch(()=>{});
		}
	})
	.catch(e => {
		if(e.response.statusText == 'Unauthorized'){
			localStorage.removeItem('jwtToken')
			token = null;
		}
	})

    if(token == null || token == undefined || token == '') {
        next({ name: 'Login' })
    } 
    else {
		let user = JSON.parse(localStorage.getItem("userData"));
		let _permissions = user ? user.permissions : [];
		checkPermission(to, from)
		next()
	}
}

export default router
