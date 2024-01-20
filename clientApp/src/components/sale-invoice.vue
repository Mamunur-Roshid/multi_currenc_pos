<template>
    <div style="padding: 0 10px;width: 100%;min-height:80vh;" class="white theme_rounded shadow1">
    
        <div class="pa-6" style="width: 100%;">
            <div class="custom-row">
                <div class="col-xs-12" style="display: flex;justify-content: space-between;">
                    <v-btn color="purple" dark class="mb-4 ml-5" v-on:click.prevent="print">
                        PRINT
                    </v-btn>
                    <div class="d-flex" style="gap: 10px;align-items: center;">
                        <v-text-field
                            style="width: 250px;margin-bottom: -10px;"
                            outlined
                            dense
                            v-model.trim.number="customDiscount"
                            label="Show custom discount"
                        ></v-text-field>
                        <v-btn  :color="!isSrd ? 'primary' : 'white'" :dark="!isSrd" class="mb-4" v-on:click.prevent="isSrd=false">
                            USD
                        </v-btn>
                        <v-btn :color="isSrd ? 'primary' : 'white'" :dark="isSrd" class="mb-4 ml-1" v-on:click.prevent="isSrd=true">
                            SRD
                        </v-btn>
                    </div>
                </div>
            </div>
            
            <div id="invoiceContent">
                <div class="custom-row">
                    <div class="invoice-title">
                    Sale Invoice
                    </div>
                </div>
                <div class="custom-row">
                    <div class="col-xs-7">
                        <strong class="b-text">Customer ID:</strong> <span class="normal-text">{{ sale.customer ? sale.customer.code : '' }}</span><br>
                        <strong class="b-text">Customer  Name:</strong> <span class="normal-text">{{ sale.customer ? sale.customer.name : '' }}</span><br>
                        <strong class="b-text">Customer  Address:</strong> <span class="normal-text">{{ sale.customer ? sale.customer.address : '' }}</span><br>
                        <strong class="b-text">Customer  Mobile:</strong> <span class="normal-text">{{ sale.customer ? sale.customer.phone : '' }}</span><br>
                        <strong class="b-text">P.O No.:</strong> <span class="normal-text">{{ sale.po_no }}</span>
                    </div>
                    <div class="col-xs-5 text-right">
                        <strong class="b-text">Sales Person:</strong> <span class="normal-text">{{ sale.employee ? sale.employee.name : '' }}</span><br>
                        <strong class="b-text">Invoice No:</strong> <span class="normal-text">{{ sale.invoice }}</span><br>
                        <strong class="b-text">Sale Date:</strong> <span class="normal-text">{{ sale.created_at | formatDateTime('DD-MM-YYYY h:mm a') }}</span><br>
                        <strong class="b-text">P.O Date:</strong> <span class="normal-text">{{ sale.po_date }}</span>
                    </div>
                    <div class="cls"></div>
                </div>
                <div class="custom-row">
                    <div class="line">&nbsp;</div>
                </div>
                <div class="custom-row">
                    <div class="col-xs-12">
                        <table class="invoice-details" border="1px solid #ccc;">
                            <thead>
                                <tr>
                                    <td class="text-center font-bold">Sl.</td>
                                    <td class="text-center font-bold" colspan="2">Product Details</td>
                                    <td class="text-center font-bold">Qty</td>
                                    <td class="text-center font-bold">Sale Rate</td>
                                    <td class="text-right font-bold">Total</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(detail, ind) in sale.sale_details" :key="ind">
                                    <td class="text-center">{{ ind + 1 }}</td>
                                    <td colspan="2" class="text-center">{{ detail.product != null ? detail.product.name :'' }}</td>
                                    <td class="text-center">
                                        {{ detail.quantity }}
                                        <template v-if="detail.product.unit">
                                            {{ detail.product.unit.name }}
                                        </template>
                                    </td>
                                    <td class="text-center" width="20%">
                                        {{ srd(detail.sale_rate) }}
                                    </td>
                                    <td class="text-right" width="20%">{{ srd(detail.total) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="custom-row">
                    <div class="col-xs-7">
                        <div class="paid-text" style="margin-top: 20px;">
                            <strong class="b-text" style="font-weight:bold;"> In Words: </strong> <span class="normal-text">{{ convertNumberToWords(srd(sale.total)) }}</span>
                        </div>
                        <p style="margin-top: 50px"><strong>Note : </strong> {{ sale.note }}</p>
                    </div>
                    <div class="col-xs-5">
                        <table width="100%">
                            <tr>
                                <td width="40%" class="b-text">Sub Total :</td>
                                <td class="text-right">{{ srd(sale.sub_total) }}</td>
                            </tr>
                            <tr>
                                <td width="40%" class="b-text">VAT :</td>
                                <td class="text-right">{{ srd(sale.vat) }}</td>
                            </tr>
                            <tr>
                                <td width="45%" class="b-text">Discount :</td>
                                <td class="text-right">{{ srd(customDiscount > 0 ? customDiscount : sale.discount) }}</td>
                            </tr>
                            <tr>
                                <td width="45%" class="b-text">Delivery Charge :</td>
                                <td class="text-right">{{ srd(sale.transport) }}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border-bottom: 1px solid rgb(204, 204, 204);"></td>
                            </tr>
                            <tr>
                                <td width="45%" class="b-text">Total Amount:</td>
                                <td class="text-right">{{ srd(customDiscount>0 ? +sale.total - +customDiscount : sale.total) }}</td>
                            </tr>
                            <tr>
                                <td width="45%" class="b-text">Paid Amount:</td>
                                <td class="text-right">{{ srd(sale.paid) }}</td>
                            </tr>
                            <tr>
                                <td colspan="2" style="border-bottom: 1px solid rgb(204, 204, 204);"></td>
                            </tr>
                            <tr>
                                <td width="45%" class="b-text">Due Amount:</td>
                                <td class="text-right">{{ srd(sale.due) }}</td>
                            </tr>
                        </table> 
                    </div>
                </div>
                <div class="custom-row">
                    
                </div>
                
            </div>
        </div>

    </div>
</template>

<script>
import moment from 'moment';
export default {
    props: ['saleId'],

    data(){
        return {
            sale:{},
            isSrd: false,
            customDiscount: 0,
            style: null,
        }
    },
    watch: {
        // customDiscount(discount) {
        //     if (discount>0) {
        //         this.sale.discount = discount
        //     }
        //     // console.log(this.sale);
        // },
    },
    filters: {
        formatDateTime(dt, format) {
            return dt == '' || dt == null ? '' : moment(dt).format(format);
        }
    },
    created(){
        this.setStyle();
        this.getSales();
        this.getCompanyProfile();
    },
    methods:{
        getCompanyProfile() {
            this.$store.dispatch('companyProfile/getCompanyProfile')
        },

        srd(amount=0) {
            if (this.isSrd) {
                let rate = +this.sale.currency_rate || 1;
                return Number((+amount || 0) * rate).toFixed(2);
            }
            return Number(amount).toFixed(2)
        },

        async getSales(){
            await this.$store.dispatch('sale/getSales', {id: this.saleId});
            this.sale = await this.$store.getters['sale/sales'][0];
        },
        setStyle(){
            this.style = document.createElement('style');
            this.style.innerHTML = `
                * {
                    font-family: Arial,sans-serif;
                }
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                html, body {
                    height: 100%;
                }
                body > div
                {
                    height: 100%;
                }
                .custom-row {
                    width: 100%;
                    display: block;
                }
                .foot {
                    position: absolute;
                    bottom: 25px;
                    width: 100%;
                }
                .font-bold {
                    font-weight: 600;
                }
                .print-btn a{
                    background: #CFD8DC;
                    display: inline-block;
                    padding: 3px 13px;
                    border-radius: 5px;
                    color: #000 !important;
                }
                .print-btn a:hover {
                    background: #B0BEC5;
                }
                .invoice-title {
                    text-align: center;
                    font-weight: bold;
                    font-size: 15px;
                    margin-bottom: 15px;
                    padding: 5px;
                    border-top: 1px dotted #454545;
                    border-bottom: 1px dotted #454545;
                }
                .col-xs-12 {
                    width: 100%;
                }
                .col-xs-10 {
                    width: 80%;
                    float: left;
                }
                .col-xs-9 {
                    width: 70%;
                    float: left;
                }
                .col-xs-7 {
                    width: 60%;
                    float: left;
                }
                .col-xs-6 {
                    width: 50%;
                    float: left;
                }
                .col-xs-5 {
                    width: 40%;
                    float: left;
                }
                .col-xs-4 {
                    width: 35%;
                    float: left;
                }
                .col-xs-3 {
                    width: 30%;
                    float: left;
                }
                .col-xs-2 {
                    width: 20%;
                    float: left;
                }
                .b-text {
                    font-weight: 500;
                    font-size: 15px;
                }
                .normal-text {
                    font-size: 14px;
                    margin: 0px;
                }
                .invoice-details {
                    width: 100%;
                    border-collapse: collapse;
                    border:1px solid #ccc;
                }
                .invoice-details thead {
                    font-weight: 500;
                    text-align:center;
                }
                .invoice-details tbody td{
                    padding: 0px 5px;
                }
                .text-center {
                    text-align: center;
                }
                .text-right {
                    text-align: right;
                }
                .line {
                    border-bottom: 1px solid #ccc;
                    margin-top: 15px;
                    margin-bottom: 15px;
                }
                .paid-text {
                    padding:00px 0px;
                }
                .mt-60 {
                    margin-top: 60px;
                }
                @media (max-width: 500px) {
                    .mt-60 {
                        margin-top: 10px;
                    }
                }
                .mr-20 {
                    margin-right: 0px;
                }
                .ml-20 {
                    margin-left: 0px;
                }
                .ft-fiext {
                    position: fixed;
                    bottom: 0;
                }
                .cls {
                    clear: both;
                }
                .logo_wattermaerk {
                    display: block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    opacity: 0.5;
                    width: 200px;
                    display: none !important;
                }
                @media (max-width: 500px) {
                    .logo_wattermaerk {
                        display: none;
                    }
                }
            `;
            document.head.appendChild(this.style);
        },
        convertNumberToWords(amountToWord) {
            var words = new Array();
            words[0] = '';
            words[1] = 'One';
            words[2] = 'Two';
            words[3] = 'Three';
            words[4] = 'Four';
            words[5] = 'Five';
            words[6] = 'Six';
            words[7] = 'Seven';
            words[8] = 'Eight';
            words[9] = 'Nine';
            words[10] = 'Ten';
            words[11] = 'Eleven';
            words[12] = 'Twelve';
            words[13] = 'Thirteen';
            words[14] = 'Fourteen';
            words[15] = 'Fifteen';
            words[16] = 'Sixteen';
            words[17] = 'Seventeen';
            words[18] = 'Eighteen';
            words[19] = 'Nineteen';
            words[20] = 'Twenty';
            words[30] = 'Thirty';
            words[40] = 'Forty';
            words[50] = 'Fifty';
            words[60] = 'Sixty';
            words[70] = 'Seventy';
            words[80] = 'Eighty';
            words[90] = 'Ninety';
            let amount = amountToWord == null ? '0.00' : amountToWord.toString();
            var atemp = amount.split(".");
            var number = atemp[0].split(",").join("");
            var n_length = number.length;
            var words_string = "";
            if (n_length <= 9) {
                var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                var received_n_array = new Array();
                for (var i = 0; i < n_length; i++) {
                    received_n_array[i] = number.substr(i, 1);
                }
                for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
                    n_array[i] = received_n_array[j];
                }
                for (var i = 0, j = 1; i < 9; i++, j++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        if (n_array[i] == 1) {
                            n_array[j] = 10 + parseInt(n_array[j]);
                            n_array[i] = 0;
                        }
                    }
                }
                let value = "";
                for (var i = 0; i < 9; i++) {
                    if (i == 0 || i == 2 || i == 4 || i == 7) {
                        value = n_array[i] * 10;
                    } else {
                        value = n_array[i];
                    }
                    if (value != 0) {
                        words_string += words[value] + " ";
                    }
                    if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Crores ";
                    }
                    if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Lakhs ";
                    }
                    if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                        words_string += "Thousand ";
                    }
                    if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                        words_string += "Hundred and ";
                    } else if (i == 6 && value != 0) {
                        words_string += "Hundred ";
                    }
                }
                words_string = words_string.split("  ").join(" ");
            }

            if (String(words_string).length > 0) {
                return words_string + ' Only';
            } else {
                return 'Zero' + ' Only';
            }
        },
        async print(){
            let invoiceContent = document.querySelector('#invoiceContent').innerHTML;
            let printWindow = window.open('', 'PRINT', `width=${screen.width}, height=${screen.height}, left=0, top=0`);
            let image = await this.$store.getters['companyProfile/company'].image;
            let ImagePath = `${this.$store.state.hostName}/${image}`;
            let companyName = this.$store.getters['companyProfile/company'].company_name;
            let address = this.$store.getters['companyProfile/company'].address;
            let contactUs = this.$store.getters['companyProfile/company'].contact_us;
            let email = this.$store.getters['companyProfile/company'].email;
            printWindow.document.write(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="X-UA-Compatible" content="ie=edge">
                    <title>Investigation Payment Slip</title>
                    <style>
                    </style>
                </head>
                <body>
                    <div>
                        <div class="container">
                            <table style="width:100%;">
                                <thead>
                                    <tr>
                                        <td>
                                            <div class="custom-row">
                                                <div class="col-xs-2">
                                                    <img src="`+ImagePath+`" alt="Logo" style="height:90px; width:90%;object-fit: contain;" />
                                                </div>
                                                <div class="col-xs-10">
                                                    <strong style="font-size:18px;">${companyName}</strong><br>
                                                    <p style="white-space:pre-line;margin:0px">Address : ${address}</p>
                                                    <p style="margin:0px">Mobile : ${contactUs}</p>
                                                    <p style="margin:0px">E-mail : ${email}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="custom-row">
                                                <div class="col-xs-12">
                                                    ${invoiceContent}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody> 
                            </table>
                            <img src="`+ImagePath+`" alt="Logo" class="logo_wattermaerk" />
                            
                            
                            <div class="foot">
                                <div class="custom-row">
                                    <div class="col-xs-6">
                                        <p class="mt-60">
                                            <span style="text-decoration:overline;font-weight:500;font-size:14px">Received By</span>
                                        </p>
                                    </div>
                                    <div class="col-xs-6">
                                        <div class="mt-60">
                                            <p class="text-right">
                                                <span style="text-decoration:overline;font-weight:500;font-size:14px">Authorized Signature</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="position:absolute;bottom:0px;left:50%;transform: translateX(-50%);">
                                <div class="custom-row" style="font-size:12px;">
                                    <div class="col-xs-12">
                                        <p class="normal-text" style="font-size: 12px;"> Print Date: ${moment().format('DD-MM-YYYY h:mm a')}, Cashier: ${this.sale.added_by.name}  </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>    
                    
                </body>
                </html>
            `);
            
            let invoiceStyle = printWindow.document.createElement('style');
            invoiceStyle.innerHTML = this.style.innerHTML;
            printWindow.document.head.appendChild(invoiceStyle);
            printWindow.moveTo(0, 0);
            
            printWindow.focus();
            await new Promise(resolve => setTimeout(resolve, 1000));
            printWindow.print();
            printWindow.close();
        }
    }
}
</script>

<style scoped>
    .container {
        width: 90%;
        margin: 0px auto;
    }
    .custom-row {
        width: 100%;
        display: block;
    }

    .print-btn a{
        background: #CFD8DC;
        display: inline-block;
        padding: 3px 13px;
        border-radius: 5px;
        color: #000 !important;
    }
    .print-btn a:hover {
        background: #B0BEC5;
    }
    .invoice-title {
        text-align: center;
        font-weight: bold;
        font-size: 15px;
        margin-bottom: 15px;
        padding: 5px;
        border-top: 1px dotted #454545;
        border-bottom: 1px dotted #454545;
    }
    .col-xs-12 {
        width: 100%;
    }
    .col-xs-10 {
        width: 80%;
        float: left;
    }
    .col-xs-9 {
        width: 70%;
        float: left;
    }
    .col-xs-7 {
        width: 60%;
        float: left;
    }
    .col-xs-6 {
        width: 50%;
        float: left;
    }
    .col-xs-5 {
        width: 40%;
        float: left;
    }
    .col-xs-4 {
        width: 35%;
        float: left;
    }
    .col-xs-3 {
        width: 30%;
        float: left;
    }
    .col-xs-2 {
        width: 20%;
        float: left;
    }
    .b-text {
        font-weight: 500;
        font-size: 15px;
    }
    .normal-text {
        font-size: 14px;
        margin: 0px;
    }
    .invoice-details {
        width: 100%;
        border-collapse: collapse;
        border:1px solid #ccc;
    }
    .invoice-details thead {
        font-weight: 500;
        text-align:center;
    }
    .invoice-details tbody td{
        padding: 0px 5px;
    }
    .text-center {
        text-align: center;
    }
    .text-right {
        text-align: right;
    }
    .font-bold {
        font-weight: 700;
    }
    .line {
        border-bottom: 1px solid #ccc;
        margin-top: 15px;
        margin-bottom: 15px;
    }
    .paid-text {
        padding:30px 0px;
    }
    .mt-60 {
        margin-top: 60px;
    }
    .mr-20 {
        margin-right: 20px;
    }
    .ml-20 {
        margin-left: 20px;
    }
    .ft-fiext {
        position: fixed;
        bottom: 0;
    }
    .cls {
        clear: both;
    }
</style>