(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["customer-point"],{"0270":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-container",[a("v-row",[a("v-col",{attrs:{cols:"6"}},[a("v-card",[a("v-toolbar",{attrs:{color:"white",elevation:1,height:"30px"}},[a("v-toolbar-title",{staticClass:"subtitle-1"},[t._v("Point Earn Rate")])],1),a("v-card-text",{staticClass:"py-5"},[a("v-form",{ref:"customerForm",staticClass:"custom-form",on:{submit:function(e){return e.preventDefault(),t.savePointRate(e)}}},[a("v-row",[a("v-col",{attrs:{cols:"4"}},[a("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t}]},model:{value:t.point,callback:function(e){t.point=e},expression:"point"}})],1),a("v-col",{staticClass:"font-weight-black",attrs:{cols:"2"}},[t._v(" BDT")]),a("v-col",{staticClass:"font-weight-black",attrs:{cols:"1"}},[t._v(" =")]),a("v-col",{staticClass:"font-weight-black",attrs:{cols:"2"}},[t._v("1 Point")]),a("v-col",{attrs:{cols:"3"}},[a("v-btn",{attrs:{type:"submit",loading:t.loading,height:"28px",dark:"",block:"",color:"light-blue darken-2"}},[t._v("Update")])],1)],1)],1)],1)],1)],1),a("v-col",{attrs:{cols:"6"}},[a("v-card",[a("v-toolbar",{attrs:{color:"white",elevation:1,height:"30px"}},[a("v-toolbar-title",{staticClass:"subtitle-1"},[t._v("Point Expense Rate")])],1),a("v-card-text",{staticClass:"py-5"},[a("v-form",{ref:"customerForm",staticClass:"custom-form",on:{submit:function(e){return e.preventDefault(),t.saveExpensePoint(e)}}},[a("v-row",[a("v-col",{staticClass:"font-weight-black",attrs:{cols:"2"}},[t._v("1 Point")]),a("v-col",{staticClass:"font-weight-black",attrs:{cols:"1"}},[t._v(" =")]),a("v-col",{attrs:{cols:"4"}},[a("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t}]},model:{value:t.rate,callback:function(e){t.rate=e},expression:"rate"}})],1),a("v-col",{staticClass:"font-weight-black",attrs:{cols:"2"}},[t._v(" BDT")]),a("v-col",{attrs:{cols:"3"}},[a("v-btn",{attrs:{type:"submit",loading:t.saveLoading,height:"28px",dark:"",block:"",color:"light-blue darken-2"}},[t._v("Update")])],1)],1)],1)],1)],1)],1)],1)],1)},r=[],n=(a("96cf"),a("1da1")),s={name:"CustomerPoint",data:function(){return{point:0,rate:0,loading:!1,saveLoading:!1}},created:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("companyProfile/getCompanyProfile");case 2:t.point=t.$store.getters["companyProfile/company"].point,t.rate=t.$store.getters["companyProfile/company"].rate;case 4:case"end":return e.stop()}}),e)})))()},methods:{savePointRate:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a={point:t.point},t.loading=!0,e.next=4,t.$store.dispatch("companyProfile/saveCompanyProfile",{company:a});case 4:t.loading=!1;case 5:case"end":return e.stop()}}),e)})))()},saveExpensePoint:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var a;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a={rate:t.rate},t.saveLoading=!0,e.next=4,t.$store.dispatch("companyProfile/saveCompanyProfile",{company:a});case 4:t.saveLoading=!1;case 5:case"end":return e.stop()}}),e)})))()}}},i=s,c=a("2877"),l=a("6544"),u=a.n(l),v=a("8336"),p=a("b0af"),d=a("99d9"),f=a("62ad"),m=a("a523"),b=a("4bd4"),h=a("0fd9"),g=a("8654"),w=a("71d9"),x=a("2a7f"),C=Object(c["a"])(i,o,r,!1,null,null,null);e["default"]=C.exports;u()(C,{VBtn:v["a"],VCard:p["a"],VCardText:d["b"],VCol:f["a"],VContainer:m["a"],VForm:b["a"],VRow:h["a"],VTextField:g["a"],VToolbar:w["a"],VToolbarTitle:x["a"]})}}]);
//# sourceMappingURL=customer-point.edd2fba9.js.map