<template>
    <div class="container">
        <div class="custom-row">
            <div class="col-xs-12">
                <span class="print-btn"><v-btn v-on:click.prevent="print" color="primary" dark class="mb-4"><i class="fa fa-print"></i> Print</v-btn></span>
            </div>
        </div>
        
        <div id="invoiceContent">
            <div class="custom-row">
                <div class="invoice-title">
                   Purchase Invoice
                </div>
            </div>
            <div class="custom-row">
                <div class="col-xs-7">
                    <strong class="b-text">Supplier Id:</strong> <span class="normal-text">{{ purchases.supplier ? purchases.supplier.code : '' }}</span><br>
                    <strong class="b-text">Supplier  Name:</strong> <span class="normal-text">{{ purchases.supplier ? purchases.supplier.name : '' }}</span><br>
                    <strong class="b-text">Supplier  Address:</strong> <span class="normal-text">{{ purchases.supplier ? purchases.supplier.address : '' }}</span><br>
                    <strong class="b-text">Supplier  Mobile:</strong> <span class="normal-text">{{ purchases.supplier ? purchases.supplier.phone : '' }}</span><br>
                    <strong class="b-text">P.O No.:</strong> <span class="normal-text">{{ purchases.po_no }}</span>
                </div>
                <div class="col-xs-5 text-right">
                    <strong class="b-text">Purchase by:</strong> <span class="normal-text">{{ purchases.added_by ? purchases.added_by.name : '' }}</span><br>
                    <strong class="b-text">Invoice No:</strong> <span class="normal-text">{{ purchases.invoice }}</span><br>
                    <strong class="b-text">Purchase Date:</strong> <span class="normal-text">{{ purchases.created_at | formatDateTime('DD-MM-YYYY h:mm a') }}</span><br>
                    <strong class="b-text">P.O Date:</strong> <span class="normal-text">{{ purchases.po_date }}</span>
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
                                <td class="font-bold">Sl.</td>
                                <td class="font-bold" colspan="2">Product Details</td>
                                <td class="font-bold">Quantity</td>
                                <td class="font-bold">Pur. Rate (USD)</td>
                                <td class="font-bold">Pur. Rate (SRD)</td>
                                <td class="font-bold">Total (USD)</td>
                                <td class="font-bold">Total (SRD)</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detail, ind) in purchases.purchase_details" :key="ind">
                                <td class="text-center">{{ ind + 1 }}</td>
                                <td colspan="2" class="text-center">{{ detail.product != null ? detail.product.name :'' }}</td>
                                <td class="text-center">
                                    {{ detail.quantity }}
                                    <template v-if="detail.product.unit">
                                        {{ detail.product.unit.name }}
                                    </template>
                                </td>
                                <td class="text-center" width="20%">{{ detail.purchase_rate_usd }}</td>
                                <td class="text-center" width="20%">{{ detail.purchase_rate_srd }}</td>
                                <td class="text-center" width="15%">{{ detail.total_usd }}</td>
                                <td class="text-center" width="15%">{{ detail.total_srd }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="custom-row">
                <div class="col-xs-7">
                    <div class="paid-text">
                        <strong class="b-text"> Paid in Words: </strong> <span class="normal-text">{{ convertNumberToWords(purchases.paid) }}</span>
                    </div>
                </div>
                <div class="col-xs-5">
                    <table width="100%">
                        <tr>
                            <td width="40%" class="b-text">Sub Total :</td>
                            <td class="text-right">{{ purchases.sub_total }}</td>
                        </tr>
                        <tr>
                            <td width="40%" class="b-text">Vat :</td>
                            <td class="text-right">{{ purchases.vat }}</td>
                        </tr>
                        <tr>
                            <td width="45%" class="b-text">Discount :</td>
                            <td class="text-right">{{ purchases.discount }}</td>
                        </tr>
                        <tr>
                            <td width="45%" class="b-text">Transport Cost :</td>
                            <td class="text-right">{{ purchases.transport }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-bottom: 1px solid rgb(204, 204, 204);"></td>
                        </tr>
                        <tr>
                            <td width="45%" class="b-text">Total Amount :</td>
                            <td class="text-right">{{ purchases.total }}</td>
                        </tr>
                        <tr>
                            <td width="45%" class="b-text">Paid Amount:</td>
                            <td class="text-right">{{ purchases.paid }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="border-bottom: 1px solid rgb(204, 204, 204);"></td>
                        </tr>
                        <tr>
                            <td width="45%" class="b-text">Due Amount:</td>
                            <td class="text-right">{{ purchases.due }}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <div class="custom-row">
                <div class="col-xs-12">
                    <p style="margin-top: 189px"><strong>Note : </strong> {{ purchases.note }}</p>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    props: ['purchaseId'],

    data(){
        return {
            purchases:{},
            style: null,
        }
    },
    filters: {
        formatDateTime(dt, format) {
            return dt == '' || dt == null ? '' : moment(dt).format(format);
        }
    },
    created(){
        this.setStyle();
        this.getPurchases();
        this.getCompanyProfile();
    },
    methods:{
        getCompanyProfile() {
            this.$store.dispatch('companyProfile/getCompanyProfile')
        },

        async getPurchases(){
            await this.$store.dispatch('purchase/getPurchases', {id: this.purchaseId});
            this.purchases = await this.$store.getters['purchase/purchases'][0];
        },
        setStyle(){
            this.style = document.createElement('style');
            this.style.innerHTML = `
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: arial;
                }
                html, body {
                    height: 100%;
                }
                body > div
                {
                    height: 100%;
                }
                .container {
                    height: 100%;
                }
                .custom-row {
                    width: 100%;
                    display: block;
                    content: '';
                    clear: both;
                }
                .font-bold {
                    font-weight: 600;
                }
                .foot {
                    position: absolute;
                    bottom: 25px;
                    width: 100%;
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
                return words_string + ' TK Only';
            } else {
                return 'Zero' + ' TK Only';
            }
        },
        async print(){
            let image = await this.$store.getters['companyProfile/company'].image;
            let invoiceContent = document.querySelector('#invoiceContent').innerHTML;
            let printWindow = window.open('', 'PRINT', `width=${screen.width}, height=${screen.height}, left=0, top=0`);
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
                                <tfoot>
                                    <tr>
                                        <td>
                                            
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
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
        width: 80%;
        margin: 0px auto;
        position: relative;
        height: 100%;
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
        font-weight: 600;
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