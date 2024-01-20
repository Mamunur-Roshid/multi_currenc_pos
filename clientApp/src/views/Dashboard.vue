<template>
  <v-container fluid class="pt-2 dashboard_main_wrap">
    <div no-gutters class="widget_gap">
      <div>
        <v-card class="mx-auto shadow1 crd">
          <v-card-title class="nl_widget_parent">
            <div class="nl_widget_title">
              Profile
              <v-icon class="icn"> mdi-account-group </v-icon>
            </div>
            <div class="nl_widget_item">
                <span>Total Customer</span>
                <span>{{ $store.getters["customer/customers"].length }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Total Suppliers</span>
                <span>{{ $store.getters["supplier/suppliers"].length }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Total Employees</span>
                <span>{{ $store.getters["employee/employees"].length }}</span>
            </div>
          </v-card-title>
        </v-card>
      </div>
      <div>
        <v-card class="mx-auto shadow1 crd crd2">
          <v-card-title class="nl_widget_parent">
            <div class="nl_widget_title">
              Sales
              <v-icon class="icn"> mdi-cart </v-icon>
            </div>
            <div class="nl_widget_item">
                <span>Total Sales</span>
                <span>{{ todaySales }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Cash Sales</span>
                <span>{{ cashSales }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Due Sales</span>
                <span>{{ dueSales }}</span>
            </div>
          </v-card-title>
        </v-card>
      </div>
      <div>
        <v-card class="mx-auto shadow1 crd crd3">
          <v-card-title class="nl_widget_parent">
            <div class="nl_widget_title">
                Today Cash Trnx
              <v-icon class="icn"> mdi-account-cash </v-icon>
            </div>
            <div class="nl_widget_item">
                <span>Cash Received</span>
                <span>{{ totalCashReceived }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Cash Payment</span>
                <span>{{ totalCashPayment }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Total Balance</span>
                <span>{{ totalBalance }}</span>
            </div>
          </v-card-title>
        </v-card>
      </div>
      <div>
        <v-card class="mx-auto shadow1 crd crd4">
          <v-card-title class="nl_widget_parent">
            <div class="nl_widget_title">
                Overall Balance
              <v-icon class="icn"> mdi-account-cash </v-icon>
            </div>
            <div class="nl_widget_item">
                <span>Supplier Dues</span>
                <span>{{ supplierDue }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Customer Dues</span>
                <span>{{ customerDue }}</span>
            </div>
            <div class="nl_widget_item">
                <span>Liability</span>
                <span>{{ totalLiability }}</span>
            </div>
          </v-card-title>
        </v-card>
      </div>
      <v-col cols="12" class="d-none">
        <v-card class="shadow1">
          <v-card-text class="py-1">
            <v-row>
              <v-col cols="3">
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-icon large color="green darken-2">
                      mdi-account-group
                    </v-icon>
                  </v-col>
                  <v-col cols="6">
                    <p class="text-uppercase text-right pt-3">Profile</p>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody class="profile">
                          <tr>
                            <td>Total Customers</td>
                            <td class="text-right">
                              {{ $store.getters["customer/customers"].length }}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Suppliers</td>
                            <td class="text-right">
                              {{ $store.getters["supplier/suppliers"].length }}
                            </td>
                          </tr>
                          <tr>
                            <td>Total Employees</td>
                            <td class="text-right">
                              {{ $store.getters["employee/employees"].length }}
                            </td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="3">
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-icon large color="green darken-2"> mdi-cart </v-icon>
                  </v-col>
                  <v-col cols="6">
                    <p class="text-uppercase text-right pt-3">Today's Sale</p>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody class="profile">
                          <tr>
                            <td>Total Sales</td>
                            <td class="text-right">{{ todaySales }}</td>
                          </tr>
                          <tr>
                            <td>Cash Sales</td>
                            <td class="text-right">{{ cashSales }}</td>
                          </tr>
                          <tr>
                            <td>Due Sales</td>
                            <td class="text-right">{{ dueSales }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="3">
                <v-row no-gutters>
                  <v-col cols="5">
                    <v-icon large color="green darken-2">
                      mdi-account-cash
                    </v-icon>
                  </v-col>
                  <v-col cols="7">
                    <p class="text-uppercase text-right pt-3">
                      Today Cash Trnx.
                    </p>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody class="profile">
                          <tr>
                            <td>Cash Received</td>
                            <td class="text-right">{{ totalCashReceived }}</td>
                          </tr>
                          <tr>
                            <td>Cash Payment</td>
                            <td class="text-right">{{ totalCashPayment }}</td>
                          </tr>
                          <tr>
                            <td>Total Balance</td>
                            <td class="text-right">{{ totalBalance }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-col>

              <v-col cols="3">
                <v-row no-gutters>
                  <v-col cols="5">
                    <v-icon large color="green darken-2">
                      mdi-currency-bdt
                    </v-icon>
                  </v-col>
                  <v-col cols="7">
                    <p class="text-uppercase text-right pt-3">
                      Overall Balance
                    </p>
                  </v-col>
                </v-row>
                <v-row no-gutters>
                  <v-col cols="12">
                    <v-simple-table>
                      <template v-slot:default>
                        <tbody class="profile">
                          <tr>
                            <td>Supplier Dues</td>
                            <td class="text-right">{{ supplierDue }}</td>
                          </tr>
                          <tr>
                            <td>Customer Dues</td>
                            <td class="text-right">{{ customerDue }}</td>
                          </tr>
                          <tr>
                            <td>Liability</td>
                            <td class="text-right">{{ totalLiability }}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </div>
    <v-row class="widget_parent" v-if="userData.userType == 'super_admin'">
      <v-col cols="12" md="3" sm="6">
        <v-card class="widget widget-1">
          <div class="widget-icon">
            <!-- <v-icon>mdi-currency-bdt</v-icon> -->
            <svg
              class="widget_icon_svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M21 7a.78.78 0 0 0 0-.21a.64.64 0 0 0-.05-.17a1.1 1.1 0 0 0-.09-.14a.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71l-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34l4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7Z"
              ></path>
            </svg>
            <!-- <svg style="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.3 7.61l-4.57 6a1 1 0 0 1-.79.39a1 1 0 0 1-.79-.38l-2.44-3.11a1 1 0 0 1 1.58-1.23l1.63 2.08l3.78-5a1 1 0 1 1 1.6 1.22Z"></path></svg> -->
          </div>
          <div class="widget_info">
            <div class="widget-text">Daily Profit</div>
            <div class="widget-value">{{ dailyProfit.toFixed(2) }}</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <v-card class="widget widget-3">
          <div class="widget-icon">
            <!-- <v-icon>mdi-currency-bdt</v-icon> -->
            <svg
              class="widget_icon_svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M21 7a.78.78 0 0 0 0-.21a.64.64 0 0 0-.05-.17a1.1 1.1 0 0 0-.09-.14a.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71l-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34l4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7Z"
              ></path>
            </svg>
          </div>
          <div class="widget_info">
            <div class="widget-text">Weekly Profit</div>
            <div class="widget-value">{{ weeklyProfit.toFixed(2) }}</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <v-card class="widget widget-2">
          <div class="widget-icon">
            <!-- <v-icon>mdi-currency-bdt</v-icon> -->
            <svg
              class="widget_icon_svg"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M21 7a.78.78 0 0 0 0-.21a.64.64 0 0 0-.05-.17a1.1 1.1 0 0 0-.09-.14a.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71l-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34l4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7Z"
              ></path>
            </svg>
          </div>
          <div class="widget_info">
            <div class="widget-text">Monthly Profit</div>
            <div class="widget-value">{{ monthlyProfit.toFixed(2) }}</div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="6">
        <v-card class="widget widget-4">
          <div class="widget-icon">
            <!-- <v-icon>mdi-currency-bdt</v-icon> -->
            <svg class="widget_icon_svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M21 7a.78.78 0 0 0 0-.21a.64.64 0 0 0-.05-.17a1.1 1.1 0 0 0-.09-.14a.75.75 0 0 0-.14-.17l-.12-.07a.69.69 0 0 0-.19-.1h-.2A.7.7 0 0 0 20 6h-5a1 1 0 0 0 0 2h2.83l-4 4.71l-4.32-2.57a1 1 0 0 0-1.28.22l-5 6a1 1 0 0 0 .13 1.41A1 1 0 0 0 4 18a1 1 0 0 0 .77-.36l4.45-5.34l4.27 2.56a1 1 0 0 0 1.27-.21L19 9.7V12a1 1 0 0 0 2 0V7Z"></path></svg>
          </div>
          <div class="widget_info">
            <div class="widget-text">Yearly Profit</div>
            <div class="widget-value">{{ yearlyProfit.toFixed(2) }}</div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col md="8" cols="12">
        <v-row>
          <v-col cols="12" class="pt-0">
            <v-card class="shadow1 theme_rounded">
              <v-toolbar color="primarwhite" :elevation="0">
                <v-toolbar-title class="subtitle-3">Sales Progress</v-toolbar-title>
              </v-toolbar>
    
              <v-card-text class="py-3">
                <v-row>
                  <v-col cols="12" v-if="salesGraph == 'monthly'">
                    <h3 class="text-center">This Month's Sale</h3>
                    <!-- <GChart
                      type="LineChart"
                      :data="monthData"
                      :options="salesChartOptions"
                    ></GChart> -->
                    <ApexCharts
                    height="200"
                    :options="apexchartOptions"
                    :series="series"
                    v-if="enable"
                    ></ApexCharts>
                    <div v-else class="d-flex align-center" style="justify-content: center;min-height: 100px;">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </div>
                  </v-col>
                  <v-col cols="12" v-if="salesGraph == 'yearly'">
                    <h3 class="text-center">This Year's Sale</h3>
                    <!-- <GChart
                      type="LineChart"
                      :data="yearData"
                      :options="yearlySalesChartOptions"
                    ></GChart> -->
                    <ApexCharts
                    height="200"
                    :options="apexchartOptionsYearly"
                    :series="seriesYearly"
                    v-if="enable"
                    ></ApexCharts>
                    <div v-else class="d-flex align-center" style="justify-content: center;min-height: 100px;">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                      ></v-progress-circular>
                    </div>
                  </v-col>
                  <v-col cols="12" class="text-center pt-0">
                    <v-btn
                      @click="salesGraph = 'monthly'"
                      depressed
                      color="primary"
                      dark
                      class="mr-2"
                      >Monthly</v-btn
                    >
                    <v-btn
                      @click="salesGraph = 'yearly'"
                      depressed
                      color="teal"
                      dark
                      >Yearly</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col cols="12" md="6">
            <v-card class="shadow1 theme_rounded">
              <v-toolbar color="white" :elevation="0">
                <v-toolbar-title class="subtitle-3"
                  >Top Sold Customers</v-toolbar-title
                >
              </v-toolbar>

              <v-card-text class="py-3">
                <!-- <GChart
                  type="PieChart"
                  :data="topCustomers"
                  :options="topCustomersOptions"
                ></GChart>  -->
                <ApexCharts
                  v-if="enable"
                  width="380"
                  :series="apextopCustomers"
                  :options="apextopCustomersOptions"
                ></ApexCharts>
                <div v-else class="d-flex align-center" style="justify-content: center;min-height: 100px;">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col md="6" cols="12">
            <v-card class="shadow1 theme_rounded">
              <v-toolbar color="white" :elevation="0">
                <v-toolbar-title class="subtitle-3"
                  >Top Sold Products</v-toolbar-title
                >
              </v-toolbar>

              <v-card-text class="py-3">
                <!-- <GChart
                  type="PieChart"
                  :data="topProducts"
                  :options="topProductsOptions"
                ></GChart> -->
                <ApexCharts
                  v-if="enable"
                  width="380"
                  :series="apextopProducts"
                  :options="apextopProductsOptions"
                ></ApexCharts>
                <div v-else class="d-flex align-center" style="justify-content: center;min-height: 100px;">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="4" class="d-flex flex-column pb-7">
        <v-card class="shadow1 theme_rounded" v-if="userData.userType == 'super_admin'">
          <v-toolbar color="white" :elevation="0">
            <v-toolbar-title class="subtitle-3">Balance</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-simple-table v-if="enable">
              <template v-slot:default>
                <thead></thead>
                <tbody class="account-head">
                  <tr>
                    <td class="text-left">Account</td>
                    <td class="text-right">Balance</td>
                  </tr>
                  <tr>
                    <td>Cash</td>
                    <td class="text-right">{{ parseFloat(Number(cashBalance).toFixed(3)) }}</td>
                  </tr>
                  <tr
                    v-for="(bank, ind) in $store.getters[
                      'bankTransaction/banks'
                    ]"
                    :key="ind"
                  >
                    <td>{{ bank.account_name }}</td>
                    <td class="text-right">{{ bank.balance }}</td>
                  </tr>
                  <tr>
                    <td>Total</td>
                    <td class="text-right">{{ totalBankBalance }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else class="d-flex align-center" style="justify-content: center;min-height: 100px;">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
        <v-card class="shadow1 mt-5 flex-grow-1 theme_rounded" style="position:relative;">
          <v-toolbar color="white" :elevation="0" height="40">
            <v-toolbar-title class="subtitle-1 d-flex justify-between align-center" style="width:100%">
              <div class="flex-grow-1">
                Low stock report
              </div>
              <router-link to="/low-stock-report">View All</router-link>
            </v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-simple-table v-if="enable">
              <template v-slot:default>
                <thead></thead>
                <tbody class="account-head">
                  <tr>
                    <td>Name</td>
                    <td>Code</td>
                    <td>Stock</td>
                  </tr>
                  <tr
                    v-for="(low_stock, ind) in $store.getters[
                      'product/low_stock_products'
                    ]"
                    :key="ind"
                  >
                    <template v-if="ind < 5">
                      <td>{{ low_stock.product.name }}</td>
                      <td>{{ low_stock.product.code }}</td>
                      <td>{{ low_stock.current_quantity }}</td>
                    </template>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-else class="d-flex align-center" style="justify-content: center;min-height: 100px;">
              <v-progress-circular
                indeterminate
                color="primary"
              ></v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
    </v-row>
    <v-row v-if="userData.userType == 'super_admin'">
      <v-col md="6" cols="12">
        <v-card class="shadow1 theme_rounded">
          <v-toolbar color="white" :elevation="0">
            <v-toolbar-title class="subtitle-3"
              >Cash Received Today</v-toolbar-title
            >
          </v-toolbar>

          <v-card-text class="py-3">
            <!-- sales paid -->
            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="5">Sales Received</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Invoice</th>
                        <th>Customer</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(sale, i) in $store.getters['sale/sales'].filter(
                          (s) => s.paid != 0
                        )"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ sale.date }}</td> -->
                        <td>{{ sale.invoice }}</td>
                        <td>{{ sale.customer.name }}</td>
                        <td class="text-right">{{ sale.paid }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ cashSales }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <!-- customer payment -->
            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Customer Payment</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Tnx. Id</th>
                        <th>Customer</th>
                        <th>Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(payment, i) in $store.getters[
                          'customer/payments'
                        ]"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ payment.date }}</td> -->
                        <td>{{ payment.invoice }}</td>
                        <td>{{ payment.customer.name }}</td>
                        <td class="text-right">{{ payment.amount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ customerPayment }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Cash Received</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Tnx. Id</th>
                        <th>Account</th>
                        <th>Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(trans, i) in $store.getters[
                          'cashTransaction/transactions'
                        ].filter((i) => i.type == 'Cash Receive')"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ trans.date }}</td> -->
                        <td>{{ trans.code }}</td>
                        <td>{{ trans.expense.name }}</td>
                        <td class="text-right">{{ trans.received_amount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ cashReceived }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Bank Withdraw</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Tnx. Id</th>
                        <th>Acc. Name</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(trans, i) in $store.getters[
                          'bankTransaction/transactions'
                        ].filter((i) => i.type == 'Withdraw')"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ trans.date }}</td> -->
                        <td>{{ trans.code }}</td>
                        <td>
                          {{ trans.bank.account_name }} -
                          {{ trans.bank.account_number }} -
                          {{ trans.bank.bank_name }}
                        </td>
                        <td class="text-right">{{ trans.amount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ withdraw }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col md="6" cols="12">
        <v-card class="shadow1 theme_rounded">
          <v-toolbar color="white" :elevation="0">
            <v-toolbar-title class="subtitle-3"
              >Cash Payment Today</v-toolbar-title
            >
          </v-toolbar>

          <v-card-text class="py-3">
            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Purchase Payment</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Invoice</th>
                        <th>Supplier</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(purchase, i) in $store.getters[
                          'purchase/purchases'
                        ].filter((i) => i.paid != 0)"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ purchase.date }}</td> -->
                        <td>{{ purchase.invoice }}</td>
                        <td>{{ purchase.supplier.name }}</td>
                        <td class="text-right">{{ purchase.paid }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ purchasePayment }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Supplier Payment</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Tnx. Id</th>
                        <th>Supplier</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(payment, i) in $store.getters[
                          'supplier/payments'
                        ]"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ payment.date }}</td> -->
                        <td>{{ payment.invoice }}</td>
                        <td>{{ payment.supplier.name }}</td>
                        <td class="text-right">{{ payment.amount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ supplierPayment }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Cash Payment</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Tnx. Id</th>
                        <th>Expense</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(trans, i) in $store.getters[
                          'cashTransaction/transactions'
                        ].filter((i) => i.type == 'Cash Payment')"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ trans.date }}</td> -->
                        <td>{{ trans.code }}</td>
                        <td>{{ trans.expense.name }}</td>
                        <td class="text-right">{{ trans.paid_amount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ cashPayment }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Bank Deposit</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Invoice</th>
                        <th>Supplier</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(trans, i) in $store.getters[
                          'bankTransaction/transactions'
                        ].filter((i) => i.type == 'Deposit')"
                        :key="i"
                      >
                        <td>{{ i + 1 }}</td>
                        <!-- <td>{{ trans.date }}</td> -->
                        <td>{{ trans.code }}</td>
                        <td>
                          {{ trans.bank.account_name }} -
                          {{ trans.bank.account_number }} -
                          {{ trans.bank.bank_name }}
                        </td>
                        <td class="text-right">{{ trans.amount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ deposit }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>

            <v-row no-gutters class="mb-2">
              <v-col cols="12">
                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th colspan="4">Salary Payment</th>
                      </tr>
                      <tr>
                        <th>SL</th>
                        <!-- <th>Date</th> -->
                        <th>Employee</th>
                        <th>Month</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(salary, i) in $store.getters[
                          'salaryPayment/payments'
                        ]"
                        :key="i"
                      >
                        <td>{{ i + i }}</td>
                        <!-- <td>{{ salary.date }}</td> -->
                        <td>{{ salary.employee.name }}</td>
                        <td>{{ salary.month.name }}</td>
                        <td class="text-right">{{ salary.amount }}</td>
                      </tr>
                      <tr>
                        <td colspan="3" class="text-right font-weight-bold">
                          Total
                        </td>
                        <td class="text-right">
                          <strong>{{ salaryPayment }}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { GChart } from "vue-google-charts";
import VueApexCharts from 'vue-apexcharts'
export default {
  name: "Dashboard",

  components: {
    GChart,
    ApexCharts: VueApexCharts,
  },

  data: () => ({
    filter: {
      dateFrom: new Date().toISOString().substr(0, 10),
      dateTo: new Date().toISOString().substr(0, 10),
    },
    userData: {},
    salesGraph: "monthly",
    monthData: [
      ["Date", "Sales"],
      [0, 0],
    ],
    series: [{
        name: 'This Week\'s Sale',
        data: [],
    }],
    enable: false,
    apexchartOptions: {
      chart: {
        height: 200,
        type: 'area'
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'text',
        categories: []
      },
    },
    seriesYearly: [{
        name: 'This Year\'s Sale',
        data: [],
    }],
    apexchartOptionsYearly: {
      chart: {
        height: 200,
        type: 'area'
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        type: 'text',
        categories: []
      },
    },
    salesChartOptions: {
      curveType: "function",
      chart: {
        title: "Sales",
        subtitle: "This Week's sales data",
      },
    },
    yearData: [
      ["Month", "Sales"],
      ["jan", 100],
    ],
    yearlySalesChartOptions: {
      curveType: "function",
      chart: {
        title: "Sales",
        subtitle: "This year's sales data",
      },
    },
    topProducts: [["Product", "Quantity"]],
    topProductsOptions: {
      chart: {
        title: "Top Sold Products",
        subtitle: "Top sold products",
      },
      pieHole: 0.4,
    },
    
    topCustomers: [["Customer", "Amount"]],
    topCustomersOptions: {
      chart: {
        title: "Top Sold Products",
        subtitle: "Top sold products",
      },
      pieHole: 0.4,
    },

    apextopCustomers: [],
    apextopCustomersOptions: {
      chart: {
        width: 380,
        type: 'donut',
      },
      plotOptions: {
        pie: {
          donut: {
            size: '20%',
          }
        }
      },
      fill: {
        type: 'gradient',
        // type: 'solid',
      },
      dataLabels: {
        enabled: true
      },
      labels: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: false
          }
        }
      }],
      legend: {
        // position: 'right',
        // offsetY: 0,
        // height: 20,
        width: 130,
        formatter: function(val, opts) {
          return val + " - " + opts.w.globals.series[opts.seriesIndex]
        }
      }
    },
    apextopProducts: [],
    apextopProductsOptions: {
      chart: {
        width: 380,
        type: 'donut',
      },
      fill: {
        type: 'gradient',
        // type: 'solid',
      },
      dataLabels: {
        enabled: true
      },
      plotOptions: {
        pie: {
          donut: {
            size: '20%',
          }
        }
      },
      labels: [],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            show: false
          }
        }
      }],
      legend: {
        // position: 'right',
        // offsetY: 0,
        // height: 20,
        width: 130,
      }
    },
  }),

  computed: {
    todaySales() {
      return this.$store.getters["sale/sales"]
        .reduce((p, c) => {
          return +p + +c.total;
        }, 0)
        .toFixed(2);
    },

    cashSales() {
      return this.$store.getters["sale/sales"]
        .reduce((p, c) => {
          return +p + +c.paid;
        }, 0)
        .toFixed(2);
    },

    dueSales() {
      return this.$store.getters["sale/sales"]
        .reduce((p, c) => {
          return +p + +c.due;
        }, 0)
        .toFixed(2);
    },

    customerPayment() {
      return this.$store.getters["customer/payments"]
        .reduce((p, c) => {
          return +p + +c.amount;
        }, 0)
        .toFixed(2);
    },

    supplierPayment() {
      return this.$store.getters["supplier/payments"]
        .reduce((p, c) => {
          return +p + +c.amount;
        }, 0)
        .toFixed(2);
    },

    cashReceived() {
      return this.$store.getters["cashTransaction/transactions"]
        .filter((i) => i.type == "Cash Receive")
        .reduce((p, c) => {
          return +p + +c.received_amount;
        }, 0)
        .toFixed(2);
    },

    cashPayment() {
      return this.$store.getters["cashTransaction/transactions"]
        .filter((i) => i.type == "Cash Payment")
        .reduce((p, c) => {
          return +p + +c.paid_amount;
        }, 0)
        .toFixed(2);
    },

    withdraw() {
      return this.$store.getters["bankTransaction/transactions"]
        .filter((i) => i.type == "Withdraw")
        .reduce((p, c) => {
          return +p + +c.amount;
        }, 0)
        .toFixed(2);
    },

    deposit() {
      return this.$store.getters["bankTransaction/transactions"]
        .filter((i) => i.type == "Deposit")
        .reduce((p, c) => {
          return +p + +c.amount;
        }, 0)
        .toFixed(2);
    },

    salaryPayment() {
      return this.$store.getters["salaryPayment/payments"]
        .reduce((p, c) => {
          return +p + +c.amount;
        }, 0)
        .toFixed(2);
    },

    purchasePayment() {
      return this.$store.getters["purchase/purchases"]
        .reduce((p, c) => {
          return +p + +c.paid;
        }, 0)
        .toFixed(2);
    },

    totalCashReceived() {
      return (
        +this.cashSales +
        +this.cashReceived +
        +this.withdraw +
        +this.customerPayment
      ).toFixed(2);
    },

    totalCashPayment() {
      return (
        +this.purchasePayment +
        +this.cashPayment +
        +this.supplierPayment +
        +this.deposit +
        +this.salaryPayment
      ).toFixed(2);
    },

    totalBalance() {
      return (+this.totalCashReceived - +this.totalCashPayment).toFixed(2);
    },

    customerDue() {
      return this.$store.getters["customer/customerDue"]
        .reduce((p, c) => {
          return +p + +c.due;
        }, 0)
        .toFixed(2);
    },

    supplierDue() {
      return this.$store.getters["supplier/supplierDue"]
        .reduce((p, c) => {
          return +p + +c.due;
        }, 0)
        .toFixed(2);
    },

    totalLiability() {
      return (+this.customerDue - +this.supplierDue).toFixed(2);
    },

    cashBalance() {
      return this.$store.getters["cashTransaction/totalCashBalance"] ?? 0;
    },

    bankBalance() {
      return this.$store.getters["bankTransaction/banks"]
        .reduce((p, c) => {
          return +p + +c.balance;
        }, 0)
        .toFixed(2);
    },

    totalBankBalance() {
      return (+this.cashBalance + +this.bankBalance).toFixed(2);
    },

    dailyProfit() {
      return this.$store.getters["cashTransaction/profit"].daily ?? 0;
    },
    weeklyProfit() {
      return this.$store.getters["cashTransaction/profit"].weekly ?? 0;
    },
    monthlyProfit() {
      return this.$store.getters["cashTransaction/profit"].monthly ?? 0;
    },
    yearlyProfit() {
      return this.$store.getters["cashTransaction/profit"].yearly ?? 0;
    },
  },

  async created() {

    let userData = JSON.parse(localStorage.getItem("userData"));
    this.userData = userData;
    await this.$store.dispatch("dashboard/getRecord", this.filter);
    let data = this.$store.getters["dashboard/records"]
    let state = this.$store.state;
    state.customer.customers = data.customers;
    state.supplier.suppliers = data.suppliers;
    state.employee.employees = data.employees;
    state.sale.sales = data.sales;
    state.customer.payments = data.customer_payments;
    state.supplier.payments = data.supplier_payments;
    state.cashTransaction.transactions = data.cash_transactions;
    state.bankTransaction.transactions = data.bank_transactions;
    state.salaryPayment.payments = data.salary_payments;
    state.purchase.purchases = data.purchases;
    state.customer.customerDue = data.customer_due;
    state.supplier.supplierDue = data.supplier_due;
    state.cashTransaction.cashBalance = data.balance;
    state.bankTransaction.banks = data.bank_account_balance;
    state.product.low_stock_products = data.low_stock_products;
    state.cashTransaction.profit = data.profit;
    // await this.$store.dispatch("customer/getCustomers");
    // await this.$store.dispatch("supplier/getSuppliers");
    // await this.$store.dispatch("employee/getEmployees");
    // await this.getSales();
    // await this.getCustomerPayments();
    // await this.getSupplierPayments();
    // await this.getCashTransaction();
    // await this.getBankTransaction();
    // await this.getSalaryPayment();
    // await this.getPurchases();
    // await this.$store.dispatch("customer/getCustomerDue");
    // await this.$store.dispatch("supplier/getSupplierDue");
    // await this.$store.dispatch("cashTransaction/getCashBalance");
    // await this.$store.dispatch("bankTransaction/getAccountBalance");
    // await this.$store.dispatch("cashTransaction/getGhrap");
    // await this.$store.dispatch("product/getLowStockReport");

    

    // let ghraps = await this.$store.getters["cashTransaction/ghraps"];
    // console.log(ghraps);
    let ghraps = data.graph_data;

    ghraps.monthly.forEach((d, index) => {
      this.monthData.push(d);
      // console.log(this.monthData);
      // this.apexData.series[].push(d[0]);
      // if (index <= 7) {
      // }
      this.apexchartOptions.xaxis.categories.push(d[0]);
      this.series[0].data.push(d[1]);
    });
    

    ghraps.yearly.forEach((i) => {
      this.yearData.push(i);
      this.seriesYearly[0].data.push(i[1]);
      this.apexchartOptionsYearly.xaxis.categories.push(i[0]);
    });

    ghraps.topCustomers.forEach((c) => {
      this.topCustomers.push([c.name, parseFloat(c.amount)]);
      this.apextopCustomers.push(parseFloat(c.amount));
      this.apextopCustomersOptions.labels.push(c.name);
    });

    ghraps.topProducts.forEach((p) => {
      this.topProducts.push([p.name, parseFloat(p.quantity)]);
      this.apextopProducts.push(parseFloat(p.quantity));
      this.apextopProductsOptions.labels.push(p.name);
    });
    this.enable = true;
    // await this.$store.dispatch("cashTransaction/getProfit");
  },

  methods: {
    async getSales() {
      await this.$store.dispatch("sale/getSales", this.filter);
    },

    async getCustomerPayments() {
      await this.$store.dispatch("customer/getCustomerPayments", this.filter);
    },

    async getSupplierPayments() {
      await this.$store.dispatch("supplier/getSupplierPayments", this.filter);
    },

    async getCashTransaction() {
      await this.$store.dispatch(
        "cashTransaction/getTransactions",
        this.filter
      );
    },

    async getBankTransaction() {
      await this.$store.dispatch(
        "bankTransaction/getTransactions",
        this.filter
      );
    },

    async getSalaryPayment() {
      await this.$store.dispatch("salaryPayment/getPayments", this.filter);
    },

    async getPurchases() {
      await this.$store.dispatch("purchase/getPurchases", this.filter);
    },
  },
};
</script>

<style lang="scss" scoped>
.module-card-text {
  padding: 12px 5px 3px;
  text-align: center;

  .v-icon {
    color: #263238 !important;
  }
}
.module-card-title {
  text-align: center;
  padding-bottom: 12px;
  font-weight: bold;
}
.theme--light.v-data-table {
  thead {
    tr {
      th {
        border: 1px solid rgba(204, 204, 204, 0.253);
        text-align: center !important;
        font-size: 14px;
        padding: 0px 1px;
        // height: 24px;
        letter-spacing: 0.7px;
        background: white;
        color: #000 !important;
      }
    }
    tr:last-child {
      th {
        font-size: 12px;
        // background: rgba(66, 84, 94, 0.096);
      }
    }
  }
}
.v-data-table--dense > .v-data-table__wrapper > table > tbody > tr > td {
  height: 20px !important;
  padding: 1px 5px !important;
  font-size: 12px !important;
  border: 1px solid #ccc !important;
  text-align: center;
}
.profile td {
  padding: 0 !important;
  height: 35px !important;
}
.account-head td {
  padding: 0 !important;
  // height: 34px !important;
}
.widget_parent {
  // box-shadow: var(--shadow1);
  // border-radius: 10px;
  // margin: 20px 0;
  overflow: hidden;
  // padding: 10px;
  // background: #fff !important;
}



.widget_gap {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding-top: 20px;
  @media (max-width: 1450px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    gap: 10px;
    grid-template-columns: repeat(1, 1fr);
  }
  .crd {
    // background: rgb(94,53,177);
    background: #250661;
    color: #fff;
    border-radius: 15px;
    box-shadow: 0px 3px 8px -2px rgba(0, 0, 0, 0.15) !important;
    position: relative;
    overflow: hidden;
    z-index: 1;
    .icn {
      color: #fff;
    }
    &:before {
      content: "";
      position: absolute;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      top: -125px;
      right: -15px;
      opacity: .5;
      background: #480eba;
      z-index: -1;
    }
    &:after {
      content: "";
      position: absolute;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      top: -85px;
      right: -95px;
      background: #3b0b9c;
      z-index: -1;
    }
  }
  .crd2 {
    // background: #5e3ec9;
    // background: #1565c0;
    background: #88109a;
    &:before {
      background: #6a0779;
    }
    &:after {
      background: #6a0779;
    }
  }
  .crd3 {
    background: #ba0838;
    &:before {
      background: #d81d4f;
    }
    &:after {
      background: #e9164e;
    }
  }
  .crd4 {
    background: #751c90;
    &:before {
      background: #ae41cf;
    }
    &:after {
      background: #9205bd;
    }
  }
  @media (max-width: 768px) {
   & .crd {
    border-radius: 10px !important;
    background: #fff !important;
    color: #000;
    & .icn {
      color: #000 !important;
    }
    &::before,
    &::after {
      display: none !important;
    }
   }
    
  }
}
.nl_widget_parent {
  position: relative;
  @media (max-width: 768px) {
    padding: 10px;
  }
}

.nl_widget_title {
  // text-h5 d-flex mb-3
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;
  width: 100%;
  padding-bottom: 3px;
  margin-bottom: 7px;
  border-bottom: 1px solid rgba(0,0,0,0.15);
}
.nl_widget_item {
  font-size:16px;
  display: flex;
  justify-content: space-between;
  width:100%;
  @media (max-width: 768px) {
    & {
      // flex-direction: column;
      font-size: 14px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 8px;
      // & span:first-child {
      //   text-align: left;
      // }
      & span:last-child {
        // border: 1px solid rgba(66, 84, 94, 0.096);
        background: rgba(0, 0, 0, 0.05);
        padding: 2px 10px;
        border-radius: 40px;
      }
    }
  }
}

.widget {
  // margin: 5px;
  box-shadow: var(--shadow1);
  padding: 10px;
  background: #ffffff !important;
  padding: 15px;
  box-shadow: none !important;
  border: 3px solid var(--theme_dark);
  display: flex;
  justify-content: space-between;
  gap: 10px;
  border-radius: 10px;
  align-items: center !important;
  & .widget_info {
    // flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    text-align: left;
    // align-items: flex-start;
  }

  .widget-icon {
    width: 60px;
    height: 60px;
    border-radius: 50% !important;
    // margin: auto;
    // padding-top: 8px;
    // margin-top: 8px;
    // background: #00ab551a;
    background: var(--theme_light);
    display: flex;
    justify-content: center;
    align-items: center;
    .v-icon {
      color: var(--theme_dark);
    }
    .widget_icon_svg {
      width: 35px;
      height: 35px;
      // color:var(--theme_dark);
    }
  }

  .widget-text {
    font-size: 14px;
    text-align: right;
    font-weight: bold;
    color: var(--theme_dark);
    // color: rgb(94, 94, 94);
    letter-spacing: 0.5px;
  }

  .widget-value {
    font-weight: bold;
    font-size: 18px;
    color: var(--theme_dark);
  }
  @media (max-width: 768px) {
    .widget-value {
      font-size: 18px;
    }
  }
}

.widget-1 {
  // border-top: 5px solid #1C8DFF !important;
  // border-color: rgba(28, 142, 255, 0.3);
  // border-color: transparent;
  .widget-icon {
    // background: #1C8DFF
    // outline: 3px solid rgba(28, 142, 255, 0.3);
    color: var(--theme_dark);
  }
}
.widget-2 {
  // border-top: 5px solid #666633 !important;
  // border-color: rgba(32, 208, 217, 0.3);
  // border-color: transparent;
  .widget-icon {
    // background: #666633
    color: var(--theme_dark);
    // outline: 3px solid rgba(32, 208, 217, 0.3);
  }
}
.widget-3 {
  // border-top: 5px solid #008241 !important;
  // border-color: rgba(0, 130, 65, 0.3);
  // border-color: transparent;
  .widget-icon {
    // background: #008241
    // outline: 3px solid rgba(0, 130, 65, 0.3);
    color: var(--theme_dark);
  }
}
.widget-4 {
  // border-top: 5px solid #FF8000 !important;
  // border-color: transparent;
  .widget-icon {
    // background: #FF8000
    // outline: 3px solid rgba(255, 128, 0, 0.3);
    color: var(--theme_dark);
  }
}
.widget-5 {
  // border-top: 5px solid #AE0000 !important;
  // border-color: #0b7b435b;
  // border-color: transparent;
  .widget-icon {
    background: var(--theme_dark);
  }
}
.widget-6 {
  // border-top: 5px solid #663300 !important;
  // border-color: transparent;
  .widget-icon {
    background: var(--theme_dark);
  }
}



</style>