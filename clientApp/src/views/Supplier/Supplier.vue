<template>
    <v-container fluid>
        <v-row dense>
            <v-col cols="12" md="9">
                <v-row>
                    <v-col cols="12" class="py-0">
                        <v-card class="shadow1 rounded white pb-5">
                            <v-toolbar color="white" :elevation="0" style="border-bottom:1px solid #ddd !important;">
                                <v-toolbar-title class="subtitle-2">Supplier Entry</v-toolbar-title>
                            </v-toolbar>

                            <v-card-text class="py-0">
                                <v-form ref="supplierForm" class="custom-form" @submit.prevent="saveSupplier">
                                    <v-row>
                                        <v-col cols="6" class="pa-2">
                                            <v-row class="align-center mt-2">
                                                <v-col cols="4" class="py-1">Supplier Id</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model="supplier.code"
                                                        :rules="[v => !!v]"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row class="align-center mt-2">
                                                <v-col cols="4" class="py-1">Name</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model.trim="supplier.name"
                                                        :rules="[v => !!v]"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row class="align-center mt-2">
                                                <v-col cols="4" class="py-1">Company Name</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model.trim="supplier.org_name"
                                                        :rules="[v => !!v]"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row class="align-center mt-2">
                                                <v-col cols="4" class="py-1">Area</v-col>
                                                <v-col cols="7" class="py-0">
                                                    <v-combobox
                                                        dense
                                                        outlined
                                                        hide-details
                                                        @focus="$store.dispatch('area/getAreas')"
                                                        :items="$store.getters['area/areas']"
                                                        :loading="$store.getters['area/loadingAreas']"
                                                        item-text="name"
                                                        item-value="id"
                                                        v-model="area"
                                                    >
                                                    </v-combobox>
                                                </v-col>
                                                <v-col cols="1" class="py-0 pa-0"  style="margin-left:-12px">
                                                    <area-dialog :icon="true" ref="areaDialog"></area-dialog>
                                                </v-col>
                                            </v-row>

                                            <v-row class="align-center mt-2">
                                                <v-col cols="4" class="py-1">Address</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model.trim="supplier.address"
                                                        :rules="[v => !!v]"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-col>

                                        <v-col cols="6" class="pa-2">
                                            <v-row class="mt-2">
                                                <v-col cols="4" class="py-1">Mobile</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model.trim="supplier.phone"
                                                        :rules="[v => !!v, () => validateMobile(supplier.phone)]"
                                                        type="number"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>

                                            <v-row class="mt-2">
                                                <v-col cols="4" class="py-1">Office Phone</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model.trim="supplier.org_phone"
                                                        type="number"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>

                                            <v-row class="mt-2">
                                                <v-col cols="4" class="py-1">Email</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model.trim="supplier.email"
                                                        type="email"
                                                        :rules="[() => validateEmail(supplier.email)]"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>

                                            <v-row class="mt-2">
                                                <v-col cols="4" class="py-1">Credit Limit</v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model.number="supplier.credit_limit"
                                                        :rules="[v => !!v]"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>

                                            <v-row class="mt-2">
                                                <v-col cols="4" class="py-1"></v-col>
                                                <v-col cols="8" class="py-0">
                                                    <v-row no-gutters>
                                                        <v-col cols="6">
                                                            <v-btn type="submit" :loading="waitingForSave" block class="text_bg_fave">Save</v-btn>
                                                        </v-col>
                                                        <v-col cols="6" class="pl-1">
                                                            <v-btn dark block color="deep-orange">Clear</v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>

                <v-row>
                    <v-col cols="12" class="pb-0">
                        <v-data-table
                            class="custom-data-table shadow1 rounded py-4"
                            :headers="supplierHeaders"
                            :items="$store.getters['supplier/suppliers']"
                            :loading="$store.getters['supplier/loadingSuppliers']"
                            :search="searchsupplier" 
					        loading-text="Loading... Please wait"
                            @click:row="showDetails"
                        >
                            <template v-slot:top>
                                <v-toolbar dense color="white" :elevation="0" style="border-bottom: 1px solid #ddd !important;">
                                    <v-toolbar-title class="subtitle-2">Supplier List</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-form class="custom-form">
                                        <v-text-field
                                            outlined
                                            dense
                                            hide-details
                                            placeholder="Search supplier"
                                            append-icon="mdi-magnify"
                                            style="width:300px;"
                                            v-model="searchsupplier"
                                        >
                                        </v-text-field>
                                    </v-form>
                                </v-toolbar>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
            </v-col>
            
            <v-col cols="12" md="3">
                <v-card
                    tile
                    width="100%"
                    class="mx-auto rounded shadow1_important"
                    height="100%"
                >
                    <v-card dark tile flat color="#26ab68ad" class="carv_img_wrap">
                        <v-card-text class="text-center">
                            <!-- <v-avatar color="blue lighten-2" size="50" class="my-2">
                                <span class="white--text headline">C</span>
                            </v-avatar> -->

                            <!-- <h2 class="caption">{{ selectedSupplier.code }}</h2>
                            <h1 class="subtitle-2">{{ selectedSupplier.name }}</h1>

                            <div v-if="userType == 'super_admin' || userType == 'admin'">
                                <v-btn icon color="white" @click="editSupplier(selectedSupplier)">
                                    <v-icon>mdi-account-edit</v-icon>
                                </v-btn>
                                <v-btn icon color="white" @click="supplierId = selectedSupplier.id;$refs.confirmDialog.dialog = true">
                                    <v-icon>mdi-delete</v-icon>
                                </v-btn>
                            </div> -->
                            <img class="carv_img" :src="carv" alt="">
                            <img class="uavatar" :src="`https://ui-avatars.com/api/?name=${selectedSupplier.name}&background=26ab68ad&color=fff`" alt="alt">
                        </v-card-text>
                    </v-card>

                    <div class="actions_btns">
                        <h2 class="subtitle-1">{{ selectedSupplier.code }}</h2>
                        <h1 class="subtitle-1">{{ selectedSupplier.name }}</h1>
                        <div v-if="userType == 'super_admin' || userType == 'admin'">
                            <v-btn icon color="black" @click="editSupplier(selectedSupplier)">
                                <v-icon>mdi-account-edit</v-icon>
                            </v-btn>
                            <v-btn icon color="black" @click="supplierId = selectedSupplier.id;$refs.confirmDialog.dialog = true">
                                <v-icon>mdi-delete</v-icon>
                            </v-btn>
                        </div>
                    </div>

                    <v-list dense>
                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="light-blue darken-2">mdi-cellphone</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ selectedSupplier.phone }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        
                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="light-blue darken-2">mdi-phone</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ selectedSupplier.org_phone }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="light-blue darken-2">mdi-email</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ selectedSupplier.email }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        
                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="light-blue darken-2">mdi-credit-card</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ selectedSupplier.credit_limit }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                        
                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="light-blue darken-2">mdi-office-building</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ selectedSupplier.org_name }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <v-divider inset></v-divider>

                        <v-list-item>
                            <v-list-item-icon>
                                <v-icon color="light-blue darken-2">mdi-map-marker</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ selectedSupplier.address }}</v-list-item-title>
                                <v-list-item-subtitle>
                                    <template v-if="selectedSupplier.area">
                                        {{ selectedSupplier.area.name }}
                                    </template>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>

        <delete-confirm ref="confirmDialog" @confirm="deletesupplier"></delete-confirm>
    </v-container>
</template>

<script>
import areaDialog from '../../components/area-dialog.component'
import utilities from '../../mixins/utility.mixin'
import confirmDialog from '../../components/confirm-dialog.component.vue'
import carv from '../../assets/shape_avatar.svg'

export default {
    name: 'Supplier',

    mixins: [utilities],

    components: {
        "area-dialog": areaDialog,
        "delete-confirm": confirmDialog
    },

    data() {
        return {
            supplierHeaders: [
                { text: 'SL.', value: 'sl' },
                { text: 'Id', value: 'code' },
                { text: 'Name', value: 'name' },
                { text: 'Company Name', value: 'org_name' },
                { text: 'Mobile', value: 'phone' },
                { text: 'Email', value: 'email' },
            ],
            searchsupplier: '',
            carv: carv,
            supplier: {
                id: null,
                code: '',
                name: '',
                phone: '',
                email: '',
                area_id: null,
                address: '',
                org_name: '',
                org_phone: '',
                credit_limit: 0
            },
            selectedSupplier: {
                id: null,
                code: 'C0001',
                name: 'Select a supplier',
                org_name: 'Company Name',
                credit_limit: 0,
                address: 'supplier\'s Address',
                mobile: '01XXXXXXXXX',
                email: 'supplier\'s Email',
                org_phone: 'Office Phone',
                area: 'Area',

            },
            area: null,
            supplierId: null,
            waitingForSave: false,
            userType: ''
        }
    },

    watch: {
        area(area) {
            if(area == undefined) return;
            this.supplier.area_id = area.id;
        }
    },

    async created() {
        this.supplier.code = await this.$store.dispatch('supplier/generateSupplierCode');
        await this.$store.dispatch('supplier/getSuppliers');
        let userData = JSON.parse(localStorage.getItem('userData'))
		this.userType = userData.userType;
    },

    methods: {
        showDetails(supplier) {
            this.selectedSupplier = supplier;
        },

        editSupplier(supplier) {
             Object.keys(this.supplier).forEach(key => {
                this.supplier[key] = supplier[key];
            })
            
            this.area = supplier.area;
        },

        async saveSupplier() {
             if(!this.validatesupplier()) {
                return;
            }
     
            this.waitingForSave = true
            let supplierccess = await this.$store.dispatch('supplier/saveSupplier', this.supplier);

            if(supplierccess) {
                this.resetForm();
            }

            this.waitingForSave = false
        },

        async deletesupplier() {
            await this.$store.dispatch('supplier/deleteSupplier', this.supplierId);
            this.$refs.confirmDialog.dialog = false;
        },

        validatesupplier() {
            let isValid = true;
            
            this.$refs.supplierForm.validate();

            this.$refs.supplierForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            if(!isValid) return;

            if(this.supplier.area_id == null) {
                this.$store.dispatch('snackbar/error', 'Select a area');
                isValid = false; 
                return isValid;
            }

            return isValid;
        },

        async resetForm() {
            Object.keys(this.supplier).map(k => this.supplier[k] = '');
            this.$refs.supplierForm.resetValidation();
            this.supplier.id = null;
            this.area = null;
            this.supplier.code = await this.$store.dispatch('supplier/generateSupplierCode');
        },
    }
}
</script>

<style lang="scss" scoped>

.carv_img_wrap {
    position: relative;
    padding-top: 84px;
}
.carv_img_wrap .carv_img {
    position: absolute;
    bottom: -26px;
    left: 0;
    right: 0;
    width: 144px;
    height: 62px;
    margin: 0 auto;
}
.uavatar {
    width: 64px;
    height: 64px;
    bottom: -32px;
    position: absolute;
    left: 0;
    right: 0;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto;
}
.shadow_f {
    box-shadow: rgba(145, 158, 171, 0.16) 0px 4px 8px 0px !important;
}

// .info_list {
//     padding-top: 50px !important;
// }
.actions_btns {
    padding-top: 45px;
    text-align: center;
}
</style>