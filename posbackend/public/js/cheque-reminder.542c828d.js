(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["cheque-reminder"],{"1f15":function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("v-container",{attrs:{fluid:""}},[a("v-row",{attrs:{"no-gutters":""}},[a("v-col",{staticClass:"pb-0 shadow1 white rounded",attrs:{cols:"12"}},[a("v-data-table",{staticClass:"custom-data-table",attrs:{headers:e.chequeInfoHeaders,items:e.$store.getters["cheque/cheques"]},scopedSlots:e._u([{key:"top",fn:function(){return[a("v-toolbar",{attrs:{dense:"",color:"white",elevation:0}},[a("v-toolbar-title",{staticClass:"subtitle-1"},[e._v("Reminder Cheque Information List")]),a("v-divider",{staticClass:"mx-4",attrs:{inset:"",vertical:""}}),a("v-form",{staticClass:"custom-form"},[a("v-text-field",{staticStyle:{width:"300px"},attrs:{outlined:"",dense:"","hide-details":"",placeholder:"Search Cheque","append-icon":"mdi-magnify"}})],1)],1)]},proxy:!0},{key:"item.cheque_status",fn:function(t){var r=t.item;return[a("v-btn",{attrs:{height:"24px",tile:"",block:"",small:"",color:"Dishonoured"==r.cheque_status?"error":"white"}},[e._v(e._s(r.cheque_status))])]}}],null,!0)})],1)],1)],1)},n=[],s=(a("96cf"),a("1da1")),u={name:"ChequeReminder",data:function(){return{chequeInfoHeaders:[{text:"Date",value:"date"},{text:"Cheq. Date",value:"cheque_date"},{text:"Remi. Date",value:"reminder_date"},{text:"Sub. Date",value:"submit_date"},{text:"Cheque No",value:"cheque_number"},{text:"Bank Name",value:"bank_name"},{text:"Customer Name",value:"customer.name"},{text:"Cheq. Status",value:"cheque_status"},{text:"Cheq. Amount",value:"cheque_amount"}]}},created:function(){var e=this;return Object(s["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,e.$store.dispatch("cheque/getCheques",{reminder:!0});case 2:case"end":return t.stop()}}),t)})))()}},o=u,i=(a("7523"),a("2877")),c=a("6544"),l=a.n(c),d=a("8336"),h=a("62ad"),m=a("a523"),v=a("8fea"),f=a("ce7e"),b=a("4bd4"),q=a("0fd9"),p=a("8654"),x=a("71d9"),w=a("2a7f"),C=Object(i["a"])(o,r,n,!1,null,"2e650b5c",null);t["default"]=C.exports;l()(C,{VBtn:d["a"],VCol:h["a"],VContainer:m["a"],VDataTable:v["a"],VDivider:f["a"],VForm:b["a"],VRow:q["a"],VTextField:p["a"],VToolbar:x["a"],VToolbarTitle:w["a"]})},"4ca8":function(e,t,a){},7523:function(e,t,a){"use strict";var r=a("4ca8"),n=a.n(r);n.a}}]);
//# sourceMappingURL=cheque-reminder.542c828d.js.map