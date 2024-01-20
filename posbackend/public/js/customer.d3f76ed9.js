(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["customer"],{"1f9f":function(t,e,s){"use strict";var a=s("5643"),i=s.n(a);i.a},"2c64":function(t,e,s){},"3d86":function(t,e,s){},"43a6":function(t,e,s){"use strict";s("a9e3");var a=s("5530"),i=(s("ec29"),s("3d86"),s("c37a")),o=s("604c"),r=s("8547"),n=s("58df"),l=Object(n["a"])(r["a"],o["a"],i["a"]);e["a"]=l.extend({name:"v-radio-group",provide:function(){return{radioGroup:this}},props:{column:{type:Boolean,default:!0},height:{type:[Number,String],default:"auto"},name:String,row:Boolean,value:null},computed:{classes:function(){return Object(a["a"])(Object(a["a"])({},i["a"].options.computed.classes.call(this)),{},{"v-input--selection-controls v-input--radio-group":!0,"v-input--radio-group--column":this.column&&!this.row,"v-input--radio-group--row":this.row})}},methods:{genDefaultSlot:function(){return this.$createElement("div",{staticClass:"v-input--radio-group__input",attrs:{id:this.id,role:"radiogroup","aria-labelledby":this.computedId}},i["a"].options.methods.genDefaultSlot.call(this))},genInputSlot:function(){var t=i["a"].options.methods.genInputSlot.call(this);return delete t.data.on.click,t},genLabel:function(){var t=i["a"].options.methods.genLabel.call(this);return t?(t.data.attrs.id=this.computedId,delete t.data.attrs.for,t.tag="legend",t):null},onClick:o["a"].options.methods.onClick}})},4781:function(t,e,s){"use strict";s.r(e);var a=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("v-container",{attrs:{fluid:""}},[s("v-row",{attrs:{dense:""}},[s("v-col",{attrs:{cols:"12",md:"9"}},[s("v-row",[s("v-col",{staticClass:"py-0",attrs:{cols:"12"}},[s("v-card",{staticClass:"white shadow1 rounded"},[s("v-toolbar",{attrs:{color:"white",elevation:0}},[s("v-toolbar-title",{staticClass:"subtitle-1"},[t._v("Customer Entry")])],1),s("v-card-text",{staticClass:"py-0"},[s("v-form",{ref:"customerForm",staticClass:"custom-form",on:{submit:function(e){return e.preventDefault(),t.saveCustomer(e)}}},[s("v-row",[s("v-col",{staticClass:"pa-2",attrs:{cols:"6"}},[s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Customer Id")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t}]},model:{value:t.customer.code,callback:function(e){t.$set(t.customer,"code",e)},expression:"customer.code"}})],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Name")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t}]},model:{value:t.customer.name,callback:function(e){t.$set(t.customer,"name","string"===typeof e?e.trim():e)},expression:"customer.name"}})],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Company Name")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t}]},model:{value:t.customer.org_name,callback:function(e){t.$set(t.customer,"org_name","string"===typeof e?e.trim():e)},expression:"customer.org_name"}})],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Area")]),s("v-col",{staticClass:"py-0",attrs:{cols:"7"}},[s("v-combobox",{attrs:{dense:"",outlined:"","hide-details":"",items:t.$store.getters["area/areas"],loading:t.$store.getters["area/loadingAreas"],"item-text":"name","item-value":"id"},on:{focus:function(e){return t.$store.dispatch("area/getAreas")}},model:{value:t.area,callback:function(e){t.area=e},expression:"area"}})],1),s("v-col",{staticClass:"py-0 pa-0",staticStyle:{"margin-left":"-12px"},attrs:{cols:"1"}},[s("area-dialog",{ref:"areaDialog",attrs:{icon:!0}})],1)],1),s("v-row",[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Address")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t}]},model:{value:t.customer.address,callback:function(e){t.$set(t.customer,"address","string"===typeof e?e.trim():e)},expression:"customer.address"}})],1)],1)],1),s("v-col",{staticClass:"pa-2",attrs:{cols:"6"}},[s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Mobile")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t},function(){return t.validateMobile(t.customer.phone)}],type:"number"},model:{value:t.customer.phone,callback:function(e){t.$set(t.customer,"phone","string"===typeof e?e.trim():e)},expression:"customer.phone"}})],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Office Phone")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",type:"number"},model:{value:t.customer.org_phone,callback:function(e){t.$set(t.customer,"org_phone","string"===typeof e?e.trim():e)},expression:"customer.org_phone"}})],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Email")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",type:"email",rules:[function(){return t.validateEmail(t.customer.email)}]},model:{value:t.customer.email,callback:function(e){t.$set(t.customer,"email","string"===typeof e?e.trim():e)},expression:"customer.email"}})],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Credit Limit")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",rules:[function(t){return!!t}]},model:{value:t.customer.credit_limit,callback:function(e){t.$set(t.customer,"credit_limit",t._n(e))},expression:"customer.credit_limit"}})],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{staticClass:"py-1",attrs:{cols:"4"}},[t._v("Customer Type")]),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-radio-group",{attrs:{row:""},model:{value:t.customer.type,callback:function(e){t.$set(t.customer,"type",e)},expression:"customer.type"}},[s("v-radio",{attrs:{label:"Retail",value:"Retail"}}),s("v-radio",{attrs:{label:"Wholesale",value:"Wholesale"}})],1)],1)],1),s("v-row",{staticClass:"pb-2"},[s("v-col",{attrs:{cols:"4"}}),s("v-col",{staticClass:"py-0",attrs:{cols:"8"}},[s("v-row",{attrs:{"no-gutters":""}},[s("v-col",{attrs:{cols:"6"}},[s("v-btn",{attrs:{type:"submit",loading:t.waitingForSave,dark:"",block:"",color:"light-blue darken-2"}},[t._v("Save")])],1),s("v-col",{staticClass:"pl-1",attrs:{cols:"6"}},[s("v-btn",{attrs:{dark:"",block:"",color:"deep-orange"}},[t._v("Clear")])],1)],1)],1)],1)],1)],1)],1)],1)],1)],1)],1),s("v-row",[s("v-col",{staticClass:"pb-0",attrs:{cols:"12"}},[s("v-data-table",{staticClass:"custom-data-table white shadow1 rounded py-4 px-3",attrs:{headers:t.customerHeaders,items:t.$store.getters["customer/customers"],loading:t.$store.getters["product/loadingProducts"],search:t.searchCustomer,"loading-text":"Loading... Please wait"},on:{"click:row":t.showDetails},scopedSlots:t._u([{key:"top",fn:function(){return[s("v-toolbar",{attrs:{dense:"",color:"white",elevation:0}},[s("v-toolbar-title",{staticClass:"subtitle-2"},[t._v("Customer List")]),s("v-divider",{staticClass:"mx-4",attrs:{inset:"",vertical:""}}),s("v-form",{staticClass:"custom-form"},[s("v-text-field",{staticStyle:{width:"300px"},attrs:{outlined:"",dense:"","hide-details":"",placeholder:"Search Customer","append-icon":"mdi-magnify"},model:{value:t.searchCustomer,callback:function(e){t.searchCustomer=e},expression:"searchCustomer"}})],1)],1)]},proxy:!0}])})],1)],1)],1),s("v-col",{attrs:{cols:"12",md:"3"}},[s("v-card",{staticClass:"mx-auto white shadow_f rounded",staticStyle:{width:"100%"},attrs:{tile:"",height:"100%",elevation:0}},[s("v-card",{staticClass:"carv_img_wrap rounded",attrs:{dark:"",tile:"",flat:"",color:"#26ab68ad"}},[s("v-card-text",{staticClass:"text-center"},[s("img",{staticClass:"carv_img",attrs:{src:t.carv,alt:""}}),s("img",{staticClass:"uavatar",attrs:{src:"https://ui-avatars.com/api/?name="+t.selectedCustomer.name+"&background=26ab68ad&color=fff",alt:"alt"}})])],1),s("div",{staticClass:"actions_btns"},[s("h2",{staticClass:"subtitle-1"},[t._v(t._s(t.selectedCustomer.code))]),s("h1",{staticClass:"subtitle-1"},[t._v(t._s(t.selectedCustomer.name))]),"super_admin"==t.userType||"admin"==t.userType?s("div",[s("v-btn",{attrs:{icon:"",color:"black"},on:{click:function(e){return t.editCustomer(t.selectedCustomer)}}},[s("v-icon",[t._v("mdi-account-edit")])],1),s("v-btn",{attrs:{icon:"",color:"black"},on:{click:function(e){t.customerId=t.selectedCustomer.id,t.$refs.confirmDialog.dialog=!0}}},[s("v-icon",[t._v("mdi-delete")])],1)],1):t._e()]),s("v-list",{staticClass:"info_list",attrs:{dense:""}},[s("v-list-item",[s("v-list-item-icon",[s("v-icon",{attrs:{color:"light-blue darken-2"}},[t._v("mdi-cellphone")])],1),s("v-list-item-content",[s("v-list-item-title",[t._v(t._s(t.selectedCustomer.phone))])],1)],1),s("v-divider",{attrs:{inset:""}}),s("v-list-item",[s("v-list-item-icon",[s("v-icon",{attrs:{color:"light-blue darken-2"}},[t._v("mdi-phone")])],1),s("v-list-item-content",[s("v-list-item-title",[t._v(t._s(t.selectedCustomer.org_phone))])],1)],1),s("v-divider",{attrs:{inset:""}}),s("v-list-item",[s("v-list-item-icon",[s("v-icon",{attrs:{color:"light-blue darken-2"}},[t._v("mdi-email")])],1),s("v-list-item-content",[s("v-list-item-title",[t._v(t._s(t.selectedCustomer.email))])],1)],1),s("v-divider",{attrs:{inset:""}}),s("v-list-item",[s("v-list-item-icon",[s("v-icon",{attrs:{color:"light-blue darken-2"}},[t._v("mdi-credit-card")])],1),s("v-list-item-content",[s("v-list-item-title",[t._v(t._s(t.selectedCustomer.credit_limit))])],1)],1),s("v-divider",{attrs:{inset:""}}),s("v-list-item",[s("v-list-item-icon",[s("v-icon",{attrs:{color:"light-blue darken-2"}},[t._v("mdi-office-building")])],1),s("v-list-item-content",[s("v-list-item-title",[t._v(t._s(t.selectedCustomer.org_name))])],1)],1),s("v-divider",{attrs:{inset:""}}),s("v-list-item",[s("v-list-item-icon",[s("v-icon",{attrs:{color:"light-blue darken-2"}},[t._v("mdi-map-marker")])],1),s("v-list-item-content",[s("v-list-item-title",[t._v(t._s(t.selectedCustomer.address))]),s("v-list-item-subtitle",[t._v(t._s(t.selectedCustomer.area.name))])],1)],1)],1)],1)],1)],1),s("delete-confirm",{ref:"confirmDialog",on:{confirm:t.deleteCustomer}})],1)},i=[],o=(s("4160"),s("d81d"),s("b64b"),s("159b"),s("96cf"),s("1da1")),r=s("c711"),n=s("ad72"),l=s("b49a"),c=s("1713"),u=s.n(c),d={name:"Customer",mixins:[n["a"]],components:{"area-dialog":r["a"],"delete-confirm":l["a"]},data:function(){return{customerHeaders:[{text:"Id",value:"code"},{text:"Name",value:"name"},{text:"Company Name",value:"org_name"},{text:"Mobile",value:"phone"},{text:"Email",value:"email"}],searchCustomer:"",carv:u.a,customer:{id:null,code:"",name:"",phone:"",email:"",area_id:null,address:"",org_name:"",org_phone:"",credit_limit:0,type:"retail"},selectedCustomer:{id:null,code:"C0001",name:"Select a Customer",org_name:"Company Name",credit_limit:0,address:"Customer's Address",mobile:"01XXXXXXXXX",email:"Customer's Email",org_phone:"Office Phone",area:"Area"},area:null,customerId:null,waitingForSave:!1,userType:""}},watch:{area:function(t){void 0!=t&&(this.customer.area_id=t.id)}},created:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("customer/generateCustomerCode");case 2:return t.customer.code=e.sent,e.next=5,t.$store.dispatch("customer/getCustomers");case 5:s=JSON.parse(localStorage.getItem("userData")),t.userType=s.userType;case 7:case"end":return e.stop()}}),e)})))()},methods:{showDetails:function(t){this.selectedCustomer=t},editCustomer:function(t){var e=this;Object.keys(this.customer).forEach((function(s){e.customer[s]=t[s]})),this.area=t.area,this.customer.type=t.type},saveCustomer:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){var s;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.validateCustomer()){e.next=2;break}return e.abrupt("return");case 2:return t.waitingForSave=!0,e.next=5,t.$store.dispatch("customer/saveCustomer",t.customer);case 5:s=e.sent,s&&t.resetForm(),t.waitingForSave=!1;case 8:case"end":return e.stop()}}),e)})))()},deleteCustomer:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t.$store.dispatch("customer/deleteCustomer",t.customerId);case 2:t.$refs.confirmDialog.dialog=!1;case 3:case"end":return e.stop()}}),e)})))()},validateCustomer:function(){var t=!0;if(this.$refs.customerForm.validate(),this.$refs.customerForm.inputs.forEach((function(e){e.hasError&&(t=!1)})),t)return null==this.customer.area_id?(this.$store.dispatch("snackbar/error","Select a area"),t=!1,t):t},resetForm:function(){var t=this;return Object(o["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return Object.keys(t.customer).map((function(e){return t.customer[e]=""})),t.$refs.customerForm.resetValidation(),t.customer.id=null,t.area=null,e.next=6,t.$store.dispatch("customer/generateCustomerCode");case 6:t.customer.code=e.sent;case 7:case"end":return e.stop()}}),e)})))()}}},m=d,v=(s("1f9f"),s("2877")),p=s("6544"),h=s.n(p),f=s("8336"),b=s("b0af"),C=s("99d9"),g=s("62ad"),y=s("2b5d"),_=s("a523"),w=s("8fea"),x=s("ce7e"),k=s("4bd4"),V=s("132d"),S=s("8860"),$=s("da13"),I=s("5d23"),O=s("34c3"),D=s("67b6"),F=s("43a6"),j=s("0fd9"),A=s("8654"),R=s("71d9"),L=s("2a7f"),E=Object(v["a"])(m,a,i,!1,null,"208e16b9",null);e["default"]=E.exports;h()(E,{VBtn:f["a"],VCard:b["a"],VCardText:C["b"],VCol:g["a"],VCombobox:y["a"],VContainer:_["a"],VDataTable:w["a"],VDivider:x["a"],VForm:k["a"],VIcon:V["a"],VList:S["a"],VListItem:$["a"],VListItemContent:I["a"],VListItemIcon:O["a"],VListItemSubtitle:I["b"],VListItemTitle:I["c"],VRadio:D["a"],VRadioGroup:F["a"],VRow:j["a"],VTextField:A["a"],VToolbar:R["a"],VToolbarTitle:L["a"]})},5643:function(t,e,s){},"67b6":function(t,e,s){"use strict";s("b0c0");var a=s("5530"),i=(s("2c64"),s("ba87")),o=s("9d26"),r=s("c37a"),n=s("7e2b"),l=s("a9ad"),c=s("4e82"),u=s("5607"),d=s("2b0e"),m=d["a"].extend({name:"rippleable",directives:{ripple:u["a"]},props:{ripple:{type:[Boolean,Object],default:!0}},methods:{genRipple:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};return this.ripple?(t.staticClass="v-input--selection-controls__ripple",t.directives=t.directives||[],t.directives.push({name:"ripple",value:{center:!0}}),this.$createElement("div",t)):null}}}),v=s("7560"),p=(s("4de4"),s("45fc"),s("d3b7"),s("25f0"),s("8547")),h=s("58df");function f(t){t.preventDefault()}var b=Object(h["a"])(r["a"],m,p["a"]).extend({name:"selectable",model:{prop:"inputValue",event:"change"},props:{id:String,inputValue:null,falseValue:null,trueValue:null,multiple:{type:Boolean,default:null},label:String},data:function(){return{hasColor:this.inputValue,lazyValue:this.inputValue}},computed:{computedColor:function(){if(this.isActive)return this.color?this.color:this.isDark&&!this.appIsDark?"white":"primary"},isMultiple:function(){return!0===this.multiple||null===this.multiple&&Array.isArray(this.internalValue)},isActive:function(){var t=this,e=this.value,s=this.internalValue;return this.isMultiple?!!Array.isArray(s)&&s.some((function(s){return t.valueComparator(s,e)})):void 0===this.trueValue||void 0===this.falseValue?e?this.valueComparator(e,s):Boolean(s):this.valueComparator(s,this.trueValue)},isDirty:function(){return this.isActive},rippleState:function(){return this.isDisabled||this.validationState?this.validationState:void 0}},watch:{inputValue:function(t){this.lazyValue=t,this.hasColor=t}},methods:{genLabel:function(){var t=r["a"].options.methods.genLabel.call(this);return t?(t.data.on={click:f},t):t},genInput:function(t,e){return this.$createElement("input",{attrs:Object.assign({"aria-checked":this.isActive.toString(),disabled:this.isDisabled,id:this.computedId,role:t,type:t},e),domProps:{value:this.value,checked:this.isActive},on:{blur:this.onBlur,change:this.onChange,focus:this.onFocus,keydown:this.onKeydown,click:f},ref:"input"})},onBlur:function(){this.isFocused=!1},onClick:function(t){this.onChange(),this.$emit("click",t)},onChange:function(){var t=this;if(this.isInteractive){var e=this.value,s=this.internalValue;if(this.isMultiple){Array.isArray(s)||(s=[]);var a=s.length;s=s.filter((function(s){return!t.valueComparator(s,e)})),s.length===a&&s.push(e)}else s=void 0!==this.trueValue&&void 0!==this.falseValue?this.valueComparator(s,this.trueValue)?this.falseValue:this.trueValue:e?this.valueComparator(s,e)?null:e:!s;this.validate(!0,s),this.internalValue=s,this.hasColor=s}},onFocus:function(){this.isFocused=!0},onKeydown:function(t){}}}),C=s("80d2"),g=s("d9f7"),y=Object(h["a"])(n["a"],l["a"],m,Object(c["a"])("radioGroup"),v["a"]);e["a"]=y.extend().extend({name:"v-radio",inheritAttrs:!1,props:{disabled:Boolean,id:String,label:String,name:String,offIcon:{type:String,default:"$radioOff"},onIcon:{type:String,default:"$radioOn"},readonly:Boolean,value:{default:null}},data:function(){return{isFocused:!1}},computed:{classes:function(){return Object(a["a"])(Object(a["a"])({"v-radio--is-disabled":this.isDisabled,"v-radio--is-focused":this.isFocused},this.themeClasses),this.groupClasses)},computedColor:function(){return b.options.computed.computedColor.call(this)},computedIcon:function(){return this.isActive?this.onIcon:this.offIcon},computedId:function(){return r["a"].options.computed.computedId.call(this)},hasLabel:r["a"].options.computed.hasLabel,hasState:function(){return(this.radioGroup||{}).hasState},isDisabled:function(){return this.disabled||!!this.radioGroup&&this.radioGroup.isDisabled},isReadonly:function(){return this.readonly||!!this.radioGroup&&this.radioGroup.isReadonly},computedName:function(){return this.name||!this.radioGroup?this.name:this.radioGroup.name||"radio-".concat(this.radioGroup._uid)},rippleState:function(){return b.options.computed.rippleState.call(this)},validationState:function(){return(this.radioGroup||{}).validationState||this.computedColor}},methods:{genInput:function(t){return b.options.methods.genInput.call(this,"radio",t)},genLabel:function(){return this.hasLabel?this.$createElement(i["a"],{on:{click:f},attrs:{for:this.computedId},props:{color:this.validationState,focused:this.hasState}},Object(C["t"])(this,"label")||this.label):null},genRadio:function(){return this.$createElement("div",{staticClass:"v-input--selection-controls__input"},[this.$createElement(o["a"],this.setTextColor(this.validationState,{props:{dense:this.radioGroup&&this.radioGroup.dense}}),this.computedIcon),this.genInput(Object(a["a"])({name:this.computedName,value:this.value},this.attrs$)),this.genRipple(this.setTextColor(this.rippleState))])},onFocus:function(t){this.isFocused=!0,this.$emit("focus",t)},onBlur:function(t){this.isFocused=!1,this.$emit("blur",t)},onChange:function(){this.isDisabled||this.isReadonly||this.isActive||this.toggle()},onKeydown:function(){}},render:function(t){var e={staticClass:"v-radio",class:this.classes,on:Object(g["c"])({click:this.onChange},this.listeners$)};return t("div",e,[this.genRadio(),this.genLabel()])}})},ec29:function(t,e,s){}}]);
//# sourceMappingURL=customer.d3f76ed9.js.map