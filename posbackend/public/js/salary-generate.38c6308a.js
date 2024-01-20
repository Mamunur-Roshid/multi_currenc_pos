(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["salary-generate"],{"0e30":function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("v-container",{staticClass:"white shadow1 rounded",attrs:{fluid:""}},[n("v-row",{attrs:{"no-gutters":""}},[n("v-col",{attrs:{cols:"12"}},[n("v-form",{staticClass:"custom-form"},[n("v-row",{attrs:{dense:""}},[n("v-col",{attrs:{cols:"3"}},[n("v-row",{staticStyle:{"margin-top":"3px",color:"#000","align-items":"center"},attrs:{"no-gutters":""}},[n("v-col",{attrs:{cols:"4"}},[t._v("Month")]),n("v-col",{attrs:{cols:"8"}},[n("v-combobox",{attrs:{dense:"",outlined:"","hide-details":"",items:t.$store.getters["month/months"],loading:t.$store.getters["month/loading"],"item-text":"name","item-value":"id"},on:{focus:function(e){return t.$store.dispatch("month/getMonths")}},model:{value:t.month,callback:function(e){t.month=e},expression:"month"}})],1)],1)],1),n("v-col",{staticClass:"d-flex align-center",attrs:{cols:"1"}},[n("v-btn",{attrs:{color:"text_bg_fave"},on:{click:t.getEmployee}},[t._v("View")])],1)],1),n("v-divider")],1)],1)],1),t.cart.length>0?n("v-row",{staticClass:"py-2",attrs:{"no-gutters":""}},[n("v-col",{attrs:{cols:"12"}},[n("form",{staticClass:"custom-form"},[n("v-simple-table",{scopedSlots:t._u([{key:"default",fn:function(){return[n("thead",[n("tr",[n("th",[t._v("Sl")]),n("th",[t._v("Employee Id")]),n("th",[t._v("Employee Name")]),n("th",[t._v("Department")]),n("th",[t._v("Designation")]),n("th",[t._v("Salary")]),n("th",[t._v("Deduction")]),n("th",[t._v("Advance")]),n("th",[t._v("Other Benefit")]),n("th",[t._v("Net Payable")])])]),n("tbody",[t._l(t.cart,(function(e,i){return n("tr",{key:i},[n("td",[t._v(t._s(i+1))]),n("td",[t._v(t._s(e.emp_id))]),n("td",[t._v(t._s(e.name))]),n("td",[t._v(t._s(e.department.name))]),n("td",[t._v(t._s(e.designation.name))]),n("td",[t._v(t._s(e.salary))]),n("td",{attrs:{width:"10%"}},[n("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",type:"number",min:"0"},on:{input:function(e){return t.calculateTotal(i)}},model:{value:e.deduction,callback:function(n){t.$set(e,"deduction",t._n(n))},expression:"employee.deduction"}})],1),n("td",{attrs:{width:"10%"}},[n("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",type:"number",min:"0"},on:{input:function(e){return t.calculateTotal(i)}},model:{value:e.advance,callback:function(n){t.$set(e,"advance",t._n(n))},expression:"employee.advance"}})],1),n("td",{attrs:{width:"10%"}},[n("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",type:"number",min:"0"},on:{input:function(e){return t.calculateTotal(i)}},model:{value:e.others,callback:function(n){t.$set(e,"others",t._n(n))},expression:"employee.others"}})],1),n("td",{attrs:{width:"10%"}},[t._v(" "+t._s(e.total)+" ")])])})),n("tr",[n("td",{staticClass:"text-center",attrs:{colspan:"8"}},[n("strong",[t._v("Total Salary: "+t._s(t.total))])]),n("td",[n("v-text-field",{attrs:{dense:"",outlined:"","hide-details":"",type:"date"},model:{value:t.salary.date,callback:function(e){t.$set(t.salary,"date",e)},expression:"salary.date"}})],1),n("td",[n("v-btn",{attrs:{height:"28px",dark:"",color:"light-blue darken-2",loading:t.loading},on:{click:t.salaryGenerate}},[t._v("Generate")])],1)])],2)]},proxy:!0}],null,!1,2392303631)})],1)])],1):t._e()],1)},s=[],a=(n("4de4"),n("d81d"),n("13d5"),n("b680"),n("96cf"),n("1da1")),r={name:"SalaryGenerate",data:function(){return{month:null,cart:[],loading:!1,total:0,salary:{id:null,date:(new Date).toISOString().substr(0,10),month_id:null}}},watch:{month:function(t){void 0!=t&&(this.salary.month_id=t.id)}},created:function(){},methods:{getEmployee:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.cart=[],null!=t.month){e.next=4;break}return t.$store.dispatch("snackbar/error","Select a month"),e.abrupt("return");case 4:return e.next=6,t.$store.dispatch("employee/getEmployees");case 6:t.cart=t.$store.getters["employee/employees"].filter((function(t){return"a"==t.status})),t.cart.map((function(t){return t.deduction=0,t.advance=0,t.others=0,t.total=t.salary,t}));case 8:case"end":return e.stop()}}),e)})))()},calculateTotal:function(t){var e=(+this.cart[t].salary+ +this.cart[t].others-(+this.cart[t].deduction+ +this.cart[t].advance)).toFixed(2);this.cart[t].total=e,this.total=this.cart.reduce((function(t,e){return+t+ +e.total}),0).toFixed(2)},salaryGenerate:function(){var t=this;return Object(a["a"])(regeneratorRuntime.mark((function e(){var n,i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(null!=t.month){e.next=3;break}return t.$store.dispatch("snackbar/error","Select a month"),e.abrupt("return");case 3:return t.loading=!0,n={salary:t.salary,cart:t.cart},e.next=7,t.$store.dispatch("employee/salaryGenerate",n);case 7:i=e.sent,i&&(t.cart=[],t.month=null,t.salary.date=(new Date).toISOString().substr(0,10)),t.loading=!1;case 10:case"end":return e.stop()}}),e)})))()}}},l=r,o=(n("f09c"),n("2877")),c=n("6544"),h=n.n(c),u=n("8336"),d=n("62ad"),m=n("2b5d"),p=n("a523"),f=n("ce7e"),v=n("4bd4"),g=n("0fd9"),I=n("1f4f"),S=n("8654"),y=Object(o["a"])(l,i,s,!1,null,"412350ae",null);e["default"]=y.exports;h()(y,{VBtn:u["a"],VCol:d["a"],VCombobox:m["a"],VContainer:p["a"],VDivider:f["a"],VForm:v["a"],VRow:g["a"],VSimpleTable:I["a"],VTextField:S["a"]})},"2b5d":function(t,e,n){"use strict";n("7db0"),n("c975"),n("fb6a"),n("a434"),n("b0c0"),n("d3b7"),n("25f0"),n("8a79");var i=n("5530"),s=(n("2bfd"),n("b974")),a=(n("4de4"),n("d81d"),n("45fc"),n("498a"),n("8654")),r=n("d9f7"),l=n("80d2"),o=Object(i["a"])(Object(i["a"])({},s["b"]),{},{offsetY:!0,offsetOverflow:!0,transition:!1}),c=s["a"].extend({name:"v-autocomplete",props:{allowOverflow:{type:Boolean,default:!0},autoSelectFirst:{type:Boolean,default:!1},filter:{type:Function,default:function(t,e,n){return n.toLocaleLowerCase().indexOf(e.toLocaleLowerCase())>-1}},hideNoData:Boolean,menuProps:{type:s["a"].options.props.menuProps.type,default:function(){return o}},noFilter:Boolean,searchInput:{type:String,default:void 0}},data:function(){return{lazySearch:this.searchInput}},computed:{classes:function(){return Object(i["a"])(Object(i["a"])({},s["a"].options.computed.classes.call(this)),{},{"v-autocomplete":!0,"v-autocomplete--is-selecting-index":this.selectedIndex>-1})},computedItems:function(){return this.filteredItems},selectedValues:function(){var t=this;return this.selectedItems.map((function(e){return t.getValue(e)}))},hasDisplayedItems:function(){var t=this;return this.hideSelected?this.filteredItems.some((function(e){return!t.hasItem(e)})):this.filteredItems.length>0},currentRange:function(){return null==this.selectedItem?0:String(this.getText(this.selectedItem)).length},filteredItems:function(){var t=this;return!this.isSearching||this.noFilter||null==this.internalSearch?this.allItems:this.allItems.filter((function(e){var n=Object(l["s"])(e,t.itemText),i=null!=n?String(n):"";return t.filter(e,String(t.internalSearch),i)}))},internalSearch:{get:function(){return this.lazySearch},set:function(t){this.lazySearch=t,this.$emit("update:search-input",t)}},isAnyValueAllowed:function(){return!1},isDirty:function(){return this.searchIsDirty||this.selectedItems.length>0},isSearching:function(){return this.multiple&&this.searchIsDirty||this.searchIsDirty&&this.internalSearch!==this.getText(this.selectedItem)},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!this.hideNoData)},$_menuProps:function(){var t=s["a"].options.computed.$_menuProps.call(this);return t.contentClass="v-autocomplete__content ".concat(t.contentClass||"").trim(),Object(i["a"])(Object(i["a"])({},o),t)},searchIsDirty:function(){return null!=this.internalSearch&&""!==this.internalSearch},selectedItem:function(){var t=this;return this.multiple?null:this.selectedItems.find((function(e){return t.valueComparator(t.getValue(e),t.getValue(t.internalValue))}))},listData:function(){var t=s["a"].options.computed.listData.call(this);return t.props=Object(i["a"])(Object(i["a"])({},t.props),{},{items:this.virtualizedItems,noFilter:this.noFilter||!this.isSearching||!this.filteredItems.length,searchInput:this.internalSearch}),t}},watch:{filteredItems:"onFilteredItemsChanged",internalValue:"setSearch",isFocused:function(t){t?(document.addEventListener("copy",this.onCopy),this.$refs.input&&this.$refs.input.select()):(document.removeEventListener("copy",this.onCopy),this.updateSelf())},isMenuActive:function(t){!t&&this.hasSlot&&(this.lazySearch=void 0)},items:function(t,e){e&&e.length||!this.hideNoData||!this.isFocused||this.isMenuActive||!t.length||this.activateMenu()},searchInput:function(t){this.lazySearch=t},internalSearch:"onInternalSearchChanged",itemText:"updateSelf"},created:function(){this.setSearch()},destroyed:function(){document.removeEventListener("copy",this.onCopy)},methods:{onFilteredItemsChanged:function(t,e){var n=this;t!==e&&(this.setMenuIndex(-1),this.$nextTick((function(){n.internalSearch&&(1===t.length||n.autoSelectFirst)&&(n.$refs.menu.getTiles(),n.setMenuIndex(0))})))},onInternalSearchChanged:function(){this.updateMenuDimensions()},updateMenuDimensions:function(){this.isMenuActive&&this.$refs.menu&&this.$refs.menu.updateDimensions()},changeSelectedIndex:function(t){this.searchIsDirty||(this.multiple&&t===l["z"].left?-1===this.selectedIndex?this.selectedIndex=this.selectedItems.length-1:this.selectedIndex--:this.multiple&&t===l["z"].right?this.selectedIndex>=this.selectedItems.length-1?this.selectedIndex=-1:this.selectedIndex++:t!==l["z"].backspace&&t!==l["z"].delete||this.deleteCurrentItem())},deleteCurrentItem:function(){var t=this.selectedIndex,e=this.selectedItems[t];if(this.isInteractive&&!this.getDisabled(e)){var n=this.selectedItems.length-1;if(-1!==this.selectedIndex||0===n){var i=this.selectedItems.length,s=t!==i-1?t:t-1,a=this.selectedItems[s];a?this.selectItem(e):this.setValue(this.multiple?[]:void 0),this.selectedIndex=s}else this.selectedIndex=n}},clearableCallback:function(){this.internalSearch=void 0,s["a"].options.methods.clearableCallback.call(this)},genInput:function(){var t=a["a"].options.methods.genInput.call(this);return t.data=Object(r["a"])(t.data,{attrs:{"aria-activedescendant":Object(l["q"])(this.$refs.menu,"activeTile.id"),autocomplete:Object(l["q"])(t.data,"attrs.autocomplete","off")},domProps:{value:this.internalSearch}}),t},genInputSlot:function(){var t=s["a"].options.methods.genInputSlot.call(this);return t.data.attrs.role="combobox",t},genSelections:function(){return this.hasSlot||this.multiple?s["a"].options.methods.genSelections.call(this):[]},onClick:function(t){this.isInteractive&&(this.selectedIndex>-1?this.selectedIndex=-1:this.onFocus(),this.isAppendInner(t.target)||this.activateMenu())},onInput:function(t){if(!(this.selectedIndex>-1)&&t.target){var e=t.target,n=e.value;e.value&&this.activateMenu(),this.internalSearch=n,this.badInput=e.validity&&e.validity.badInput}},onKeyDown:function(t){var e=t.keyCode;s["a"].options.methods.onKeyDown.call(this,t),this.changeSelectedIndex(e)},onSpaceDown:function(t){},onTabDown:function(t){s["a"].options.methods.onTabDown.call(this,t),this.updateSelf()},onUpDown:function(t){t.preventDefault(),this.activateMenu()},selectItem:function(t){s["a"].options.methods.selectItem.call(this,t),this.setSearch()},setSelectedItems:function(){s["a"].options.methods.setSelectedItems.call(this),this.isFocused||this.setSearch()},setSearch:function(){var t=this;this.$nextTick((function(){t.multiple&&t.internalSearch&&t.isMenuActive||(t.internalSearch=!t.selectedItems.length||t.multiple||t.hasSlot?null:t.getText(t.selectedItem))}))},updateSelf:function(){(this.searchIsDirty||this.internalValue)&&(this.valueComparator(this.internalSearch,this.getValue(this.internalValue))||this.setSearch())},hasItem:function(t){return this.selectedValues.indexOf(this.getValue(t))>-1},onCopy:function(t){if(-1!==this.selectedIndex){var e=this.selectedItems[this.selectedIndex],n=this.getText(e);t.clipboardData.setData("text/plain",n),t.clipboardData.setData("text/vnd.vuetify.autocomplete.item+plain",n),t.preventDefault()}}}});e["a"]=c.extend({name:"v-combobox",props:{delimiters:{type:Array,default:function(){return[]}},returnObject:{type:Boolean,default:!0}},data:function(){return{editingIndex:-1}},computed:{computedCounterValue:function(){return this.multiple?this.selectedItems.length:(this.internalSearch||"").toString().length},hasSlot:function(){return s["a"].options.computed.hasSlot.call(this)||this.multiple},isAnyValueAllowed:function(){return!0},menuCanShow:function(){return!!this.isFocused&&(this.hasDisplayedItems||!!this.$slots["no-data"]&&!this.hideNoData)}},methods:{onInternalSearchChanged:function(t){if(t&&this.multiple&&this.delimiters.length){var e=this.delimiters.find((function(e){return t.endsWith(e)}));null!=e&&(this.internalSearch=t.slice(0,t.length-e.length),this.updateTags())}this.updateMenuDimensions()},genInput:function(){var t=c.options.methods.genInput.call(this);return delete t.data.attrs.name,t.data.on.paste=this.onPaste,t},genChipSelection:function(t,e){var n=this,a=s["a"].options.methods.genChipSelection.call(this,t,e);return this.multiple&&(a.componentOptions.listeners=Object(i["a"])(Object(i["a"])({},a.componentOptions.listeners),{},{dblclick:function(){n.editingIndex=e,n.internalSearch=n.getText(t),n.selectedIndex=-1}})),a},onChipInput:function(t){s["a"].options.methods.onChipInput.call(this,t),this.editingIndex=-1},onEnterDown:function(t){t.preventDefault(),this.getMenuIndex()>-1||this.$nextTick(this.updateSelf)},onFilteredItemsChanged:function(t,e){this.autoSelectFirst&&c.options.methods.onFilteredItemsChanged.call(this,t,e)},onKeyDown:function(t){var e=t.keyCode;s["a"].options.methods.onKeyDown.call(this,t),this.multiple&&e===l["z"].left&&0===this.$refs.input.selectionStart?this.updateSelf():e===l["z"].enter&&this.onEnterDown(t),this.changeSelectedIndex(e)},onTabDown:function(t){if(this.multiple&&this.internalSearch&&-1===this.getMenuIndex())return t.preventDefault(),t.stopPropagation(),this.updateTags();c.options.methods.onTabDown.call(this,t)},selectItem:function(t){this.editingIndex>-1?this.updateEditing():c.options.methods.selectItem.call(this,t)},setSelectedItems:function(){null==this.internalValue||""===this.internalValue?this.selectedItems=[]:this.selectedItems=this.multiple?this.internalValue:[this.internalValue]},setValue:function(t){var e;s["a"].options.methods.setValue.call(this,null!=(e=t)?e:this.internalSearch)},updateEditing:function(){var t=this.internalValue.slice();t[this.editingIndex]=this.internalSearch,this.setValue(t),this.editingIndex=-1},updateCombobox:function(){var t=Boolean(this.$scopedSlots.selection)||this.hasChips;t&&!this.searchIsDirty||(this.internalSearch!==this.getText(this.internalValue)&&this.setValue(),t&&(this.internalSearch=void 0))},updateSelf:function(){this.multiple?this.updateTags():this.updateCombobox()},updateTags:function(){var t=this.getMenuIndex();if(!(t<0)||this.searchIsDirty){if(this.editingIndex>-1)return this.updateEditing();var e=this.selectedItems.indexOf(this.internalSearch);if(e>-1){var n=this.internalValue.slice();n.splice(e,1),this.setValue(n)}if(t>-1)return this.internalSearch=null;this.selectItem(this.internalSearch),this.internalSearch=null}},onPaste:function(t){if(this.multiple&&!this.searchIsDirty){var e=t.clipboardData.getData("text/vnd.vuetify.autocomplete.item+plain");e&&-1===this.findExistingIndex(e)&&(t.preventDefault(),s["a"].options.methods.selectItem.call(this,e))}}}})},"2bfd":function(t,e,n){},"8a79":function(t,e,n){"use strict";var i=n("23e7"),s=n("06cf").f,a=n("50c4"),r=n("5a34"),l=n("1d80"),o=n("ab13"),c=n("c430"),h="".endsWith,u=Math.min,d=o("endsWith"),m=!c&&!d&&!!function(){var t=s(String.prototype,"endsWith");return t&&!t.writable}();i({target:"String",proto:!0,forced:!m&&!d},{endsWith:function(t){var e=String(l(this));r(t);var n=arguments.length>1?arguments[1]:void 0,i=a(e.length),s=void 0===n?i:u(a(n),i),o=String(t);return h?h.call(e,o,s):e.slice(s-o.length,s)===o}})},"903c":function(t,e,n){},f09c:function(t,e,n){"use strict";var i=n("903c"),s=n.n(i);s.a}}]);
//# sourceMappingURL=salary-generate.38c6308a.js.map