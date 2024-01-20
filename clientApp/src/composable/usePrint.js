import useConfig from './useConfig'
const { hostName, host } = useConfig()
export const styles = `
    body {
        font-family: Arial,sans-serif;
    }

    .bordered-table {
        border-collapse: collapse;
        width: 100%;
    }
    .text-right {
        text-align: right !important;
    }
    .text-center {
        text-align: center !important;
    }
    .bordered-table th,
    .bordered-table td {
        border: 1px solid black;
        padding: 8px;
        text-align: left;
    }

    .bordered-table thead th {
        background-color: #f2f2f2;
    }

    .bordered-table tbody tr:nth-child(even) {
        background-color: #f9f9f9;
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
    @media print {
        .hide {
            display: none
        }
        .v-data-table > .v-data-table__wrapper > table {
            width: 100%;
            border-spacing: 0;
        }
        .theme--light.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
            font-size: 13px;
            padding: 0px 1px;
            color: #000;
            border: 1px solid #ccc;
            text-align: center;
            height: 24px !important;
        }
        .v-data-table--dense > .v-data-table__wrapper > table > tbody > tr > td {
            height: 20px !important;
            padding: 0px 5px !important;
            font-size: 12px !important;
            border: 1px solid #ccc !important;
        }
    }
    .cls {
        clear: both;
    }
`;


export const invoiceStyle = `
*,::before,::after{
    box-sizing:border-box;
    border-width:0;
    border-style:solid;
    border-color:#e5e7eb;
    }
    ::before,::after{
    --tw-content:'';
    }
    html{
    line-height:1.5;
    -webkit-text-size-adjust:100%;
    -moz-tab-size:4;
    tab-size:4;
    font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
    font-feature-settings:normal;
    font-variation-settings:normal;
    }
    body{
    margin:0;
    line-height:inherit;
    }
    hr{
    height:0;
    color:inherit;
    border-top-width:1px;
    }
    abbr:where([title]){
    -webkit-text-decoration:underline dotted;
    text-decoration:underline dotted;
    }
    h1,h2,h3,h4,h5,h6{
    font-size:inherit;
    font-weight:inherit;
    }
    a{
    color:inherit;
    text-decoration:inherit;
    }
    b,strong{
    font-weight:bolder;
    }
    code,kbd,samp,pre{
    font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
    font-size:1em;
    }
    small{
    font-size:80%;
    }
    sub,sup{
    font-size:75%;
    line-height:0;
    position:relative;
    vertical-align:baseline;
    }
    sub{
    bottom:-0.25em;
    }
    sup{
    top:-0.5em;
    }
    table {
        width: 100%;
        border-collapse: collapse;
      }
      thead {
        display: table-header-group;
      }
      tfoot {
        display: table-footer-group;
      }
      @media print {
        thead {
          display: table-header-group !important;
        }
      }

    button,input,optgroup,select,textarea{
    font-family:inherit;
    font-size:100%;
    font-weight:inherit;
    line-height:inherit;
    color:inherit;
    margin:0;
    padding:0;
    }
    button,select{
    text-transform:none;
    }
    button,[type='button'],[type='reset'],[type='submit']{
    -webkit-appearance:button;
    background-color:transparent;
    background-image:none;
    }
    :-moz-focusring{
    outline:auto;
    }
    :-moz-ui-invalid{
    box-shadow:none;
    }
    progress{
    vertical-align:baseline;
    }
    ::-webkit-inner-spin-button,::-webkit-outer-spin-button{
    height:auto;
    }
    [type='search']{
    -webkit-appearance:textfield;
    outline-offset:-2px;
    }
    ::-webkit-search-decoration{
    -webkit-appearance:none;
    }
    ::-webkit-file-upload-button{
    -webkit-appearance:button;
    font:inherit;
    }
    summary{
    display:list-item;
    }
    blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{
    margin:0;
    }
    fieldset{
    margin:0;
    padding:0;
    }
    legend{
    padding:0;
    }
    ol,ul,menu{
    list-style:none;
    margin:0;
    padding:0;
    }
    textarea{
    resize:vertical;
    }
    input::placeholder,textarea::placeholder{
    opacity:1;
    color:#9ca3af;
    }
    button,[role="button"]{
    cursor:pointer;
    }
    :disabled{
    cursor:default;
    }
    img,svg,video,canvas,audio,iframe,embed,object{
    display:block;
    vertical-align:middle;
    }
    img,video{
    max-width:100%;
    height:auto;
    }
    [hidden]{
    display:none;
    }
    *,::before,::after{
    --tw-border-spacing-x:0;
    --tw-border-spacing-y:0;
    --tw-translate-x:0;
    --tw-translate-y:0;
    --tw-rotate:0;
    --tw-skew-x:0;
    --tw-skew-y:0;
    --tw-scale-x:1;
    --tw-scale-y:1;
    --tw-scroll-snap-strictness:proximity;
    --tw-ring-offset-width:0px;
    --tw-ring-offset-color:#fff;
    --tw-ring-color:rgb(59 130 246 / 0.5);
    --tw-ring-offset-shadow:0 0 #0000;
    --tw-ring-shadow:0 0 #0000;
    --tw-shadow:0 0 #0000;
    --tw-shadow-colored:0 0 #0000;
    }
    ::backdrop{
    --tw-border-spacing-x:0;
    --tw-border-spacing-y:0;
    --tw-translate-x:0;
    --tw-translate-y:0;
    --tw-rotate:0;
    --tw-skew-x:0;
    --tw-skew-y:0;
    --tw-scale-x:1;
    --tw-scale-y:1;
    --tw-scroll-snap-strictness:proximity;
    --tw-ring-offset-width:0px;
    --tw-ring-offset-color:#fff;
    --tw-ring-color:rgb(59 130 246 / 0.5);
    --tw-ring-offset-shadow:0 0 #0000;
    --tw-ring-shadow:0 0 #0000;
    --tw-shadow:0 0 #0000;
    --tw-shadow-colored:0 0 #0000;
    }
    .relative{
    position:relative;
    }
    .mx-auto{
    margin-left:auto;
    margin-right:auto;
    }
    .mb-2{
    margin-bottom:0.5rem;
    }
    .mb-5{
    margin-bottom:1.25rem;
    }
    .mt-1{
    margin-top:0.25rem;
    }
    .mt-2{
    margin-top:0.5rem;
    }
    .mt-3{
    margin-top:0.75rem;
    }
    .block{
    display:block;
    }
    .inline-block{
    display:inline-block;
    }
    .flex{
    display:flex;
    }
    .table{
    display:table;
    }
    .h-2{
    height:0.5rem;
    }
    .w-\[120px\]{
    width:120px;
    }
    .w-\[75\%\]{
    width:75%;
    }
    .w-\[80px\]{
    width:80px;
    }
    .w-full{
    width:100%;
    }
    .max-w-\[700px\]{
    max-width:700px;
    }
    .items-center{
    align-items:center;
    }
    .justify-center{
    justify-content:center;
    }
    .justify-between{
    justify-content:space-between;
    }
    .gap-5{
    gap:1.25rem;
    }
    .whitespace-nowrap{
    white-space:nowrap;
    }
    .rounded-md{
    border-radius:0.375rem;
    }
    .border{
    border-width:1px;
    }
    .border-2{
    border-width:2px;
    }
    .border-\[\#24298d\]{
    --tw-border-opacity:1;
    border-color:rgb(36 41 141 / var(--tw-border-opacity));
    }
    .border-gray-400{
    --tw-border-opacity:1;
    border-color:rgb(156 163 175 / var(--tw-border-opacity));
    }
    .bg-\[\#24298d\]{
    --tw-bg-opacity:1;
    background-color:rgb(36 41 141 / var(--tw-bg-opacity));
    }
    .bg-\[\#24298d\]\/20{
    background-color:rgb(36 41 141 / 0.2);
    }
    .px-1{
    padding-left:0.25rem;
    padding-right:0.25rem;
    }
    .py-4{
    padding-top:1rem;
    padding-bottom:1rem;
    }
    .py-px{
    padding-top:1px;
    padding-bottom:1px;
    }
    .text-center{
    text-align:center;
    }
    .text-right{
    text-align:right;
    }
    .font-serif{
    font-family:ui-serif,Georgia,Cambria,"Times New Roman",Times,serif;
    }
    .text-2xl{
    font-size:1.5rem;
    line-height:2rem;
    }
    .text-4xl{
    font-size:2.25rem;
    line-height:2.5rem;
    }
    .text-\[15px\]{
    font-size:15px;
    }
    .font-bold{
    font-weight:700;
    }
    .uppercase{
    text-transform:uppercase;
    }
    .text-\[\#24298d\]{
    --tw-text-opacity:1;
    color:rgb(36 41 141 / var(--tw-text-opacity));
    }
    .text-\[\#d32d49\]{
    --tw-text-opacity:1;
    color:rgb(211 45 73 / var(--tw-text-opacity));
    }
    .text-black{
    --tw-text-opacity:1;
    color:rgb(0 0 0 / var(--tw-text-opacity));
    }
    .text-blue-500{
    --tw-text-opacity:1;
    color:rgb(59 130 246 / var(--tw-text-opacity));
    }
    .text-white{
    --tw-text-opacity:1;
    color:rgb(255 255 255 / var(--tw-text-opacity));
    }
    .text-yellow-300{
    --tw-text-opacity:1;
    color:rgb(253 224 71 / var(--tw-text-opacity));
    }

    .black-heading-color {
        color: #24298d;
    }
    .red-heading-color {
       color: #d32d49;
    }
    .blue-heading-color {
       color: #24298d;
    }
    .blue-heading-bg {
       background: rgba(36, 41, 141, 0.2);
    }
    .blue-bg {
       background: #24298d;
    }
    
    .bordered-table {
        border-collapse: collapse;
        width: 100%;
    }

    .bordered-table th,
    .bordered-table td {
        border: 1px solid black;
        padding: 3px;
        text-align: left;
    }

    .bordered-table thead th {
        background-color: #f2f2f2;
    }

    .bordered-table tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }
`;



export const invoiceHeader = (logo = null) => {
    let comnpany =  {}
    try {
        comnpany = JSON.parse(localStorage.getItem('company'))
    } catch (err) {}

    return `
            <div>
                <div style="width: 100%;position: relative;margin-bottom: 20px;display: flex;justify-content: center;align-items: center;gap: 20px">
                    <img style="width: 180px" src="${hostName}/${comnpany.image}" alt="">
                    <div style="text-align: center">
                        <div style='color: #24298d;font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;font-weight: bold;text-transform: uppercase;font-size: 27px;'>
                            ${comnpany.company_name}
                        </div>
                        <div style="text-align: center;">
                            <div style="white-space: nowrap; font-size: 15px;" class="whitespace-nowrap text-[15px]">
                            ${comnpany.address}
                            </div>
                            <div style="color: #24298d;">
                                Phone: ${comnpany.contact_us},
                                Email: ${comnpany.email}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
}


export const invoiceFooter = `
    <div>
    <div class="flex items-center justify-between" style="margin-top:20px;display: flex;align-items: center;justify-content:space-between;">
    <span class="font-bold text-[#24298d]" style="font-weight: bold;color: #24298d;">
        <div>_______________</div>
        <div>CUSTOMER SIGN</div>
    </span>
    <span class="font-bold text-[#24298d]" style="font-weight: bold;color: #24298d;">
        <div>________________</div>
        <div>AUTHORIZE SIGN</div>
    </span>
</div>
<div class="block h-2 blue-bg" style="display: block;height: 8px;background: #24298d;"></div>
</div>
`


export const handlePrint = async (options={}) =>{
    let printWindow = window.open('', 'PRINT', `width=${screen.width}, height=${screen.height}, left=0, top=0`);
    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>${options.title}</title>
            <style>
            ${invoiceStyle}
            </style>
        </head>
        <body>
            <div>
                <div class="container">
                    <table style="width:100%;">
                        <thead>
                            
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    ${invoiceHeader()}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="custom-row">
                                        <div style="text-align: center;font-size:18px;font-weight:bold;">
                                            ${options.title}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="custom-row">
                                        <div class="col-xs-12">
                                            ${options.content}
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>
                                    <div style="width:100%;height:50px;">&nbsp;</div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>    
            
        </body>
        </html>
    `);

    printWindow.moveTo(0, 0);
    
    printWindow.focus();
    await new Promise(resolve => setTimeout(resolve, 1000));
    printWindow.print();
    printWindow.close();
}