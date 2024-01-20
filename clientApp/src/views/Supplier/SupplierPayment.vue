<template>
    <v-container fluid>
        <v-row no-gutters>
            <v-col cols="12">
                <v-form class="custom-form" ref="supplierPaymentForm" @submit.prevent="supplierpPayments">
                    <v-card color="white shadow1 theme_rounded overflow-hidden mb-5">
                        <v-row no-gutters>
                            <v-col cols="12">
                                <v-toolbar :elevation="0" style="border-bottom: 1px solid #ddd !important;">
                                    <v-toolbar-title class="subtitle-1">Supplier Payment Entry</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text class="mt-1 py-5">
                                    <v-row dense justify="center">
                                        <v-col cols="4">
                                            <v-row no-gutters class="mb-1">
                                                <v-col cols="3">P. Type</v-col>
                                                <v-col cols="9">
                                                    <v-combobox
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model="supplierPayment.type"
                                                        :items="['Cash', 'Bank']"
                                                    >
                                                    </v-combobox>
                                                </v-col>
                                            </v-row>
                                            <v-row no-gutters class="mb-1" v-if="supplierPayment.type == 'Bank'">
                                                <v-col cols="3">Bank Acc.</v-col>
                                                <v-col cols="9">
                                                    <v-combobox
                                                        dense
                                                        outlined
                                                        hide-details
                                                        @focus="$store.dispatch('bankAccount/getBankAccounts')"
                                                        :loading="$store.getters['bankAccount/loadingBankAccount']"
                                                        :items="$store.getters['bankAccount/accounts']"
                                                        item-text="display_text"
                                                        item-value="id"
                                                        v-model="bank"
                                                    >
                                                    </v-combobox>
                                                </v-col>
                                            </v-row>
                                            <v-row no-gutters class="mb-1">
                                                <v-col cols="3">Supplier</v-col>
                                                <v-col cols="9">
                                                    <v-combobox 
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model="selectedSupplier"
                                                        @focus="$store.dispatch('supplier/getSuppliers')"
                                                        :items="$store.getters['supplier/suppliers']"
                                                        :loading="$store.getters['supplier/loading']"
                                                        item-text="display_text"
                                                        item-value="id"
                                                    >
                                                    </v-combobox>
                                                </v-col>
                                            </v-row>
                                            <v-row no-gutters class="mb-1">
                                                <v-col cols="3">Due</v-col>
                                                <v-col cols="9">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model="due"
                                                        readonly
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="4">
                                            <v-row no-gutters class="mb-1"> 
                                                <v-col cols="3" class="text-right pr-2">Date</v-col>
                                                <v-col cols="9">
                                                    <v-menu
                                                        v-model="menu"
                                                        :close-on-content-click="false"
                                                        :nudge-right="0"
                                                        transition="scale-transition"
                                                        offset-y
                                                        min-width="auto"
                                                    >
                                                        <template v-slot:activator="{ on, attrs }">
                                                            <v-text-field
                                                                dense
                                                                outlined
                                                                hide-details
                                                                v-model="supplierPayment.date"
                                                                v-bind="attrs"
                                                                v-on="on"
                                                                autocomplete="off"
                                                                @change="getSupplierPayments"
                                                            >
                                                                <v-icon slot="prepend-inner">mdi-calendar-month</v-icon>
                                                            </v-text-field>
                                                        </template>
                                                        <v-date-picker
                                                            v-model="supplierPayment.date"
                                                            @input="menu = false"
                                                            @change="getSupplierPayments"
                                                        >
                                                        </v-date-picker>
                                                    </v-menu>
                                                </v-col>
                                            </v-row>
                                            <v-row no-gutters class="mb-1">
                                                <v-col cols="3" class="text-right pr-2">Description</v-col>
                                                <v-col cols="9">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model="supplierPayment.note"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row no-gutters class="mb-1">
                                                <v-col cols="3" class="text-right pr-2">Amount</v-col>
                                                <v-col cols="9">
                                                    <v-text-field
                                                        dense
                                                        outlined
                                                        hide-details
                                                        v-model="supplierPayment.amount"
                                                        :rules="[() => !!supplierPayment.amount || 'Enter Amount']"
                                                        type="number"
                                                    ></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row no-gutters class="mt-3">
                                                <v-col cols="3"></v-col>
                                                <v-col cols="9">
                                                    <v-row no-gutters>
                                                         <v-col cols="6" class="pr-1">
                                                            <v-btn height="40px" type="submit" dark block color="primary" :loading="saveLoading">Save</v-btn>
                                                        </v-col>
                                                        <v-col cols="6">
                                                            <v-btn height="40px" type="reset" dark block color="deep-orange" @click="resetForm">Clear</v-btn>
                                                        </v-col>
                                                    </v-row>
                                                </v-col>
                                            </v-row>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-form>
            </v-col>
        </v-row>
        <v-row dense class="mt-1">
            <v-col cols="12" class="pb-0 shadow1 theme_rounded overflow-hidden white">
                <v-data-table
                    class="custom-data-table"
                    :headers="supplierPaymentHeaders"
                    :items="$store.getters['supplier/payments']"
                    :loading="$store.getters['supplier/loading']"
                    :search="searchPayment"
                    loading-text="Loading... Please wait"
                >
                    <template v-slot:top>
                        <v-toolbar dense color="white" :elevation="0" style="border-bottom: 1px solid #ddd !important;height:60px;display: flex;align-items: center;">
                            <v-toolbar-title class="subtitle-1">Supplier Payment List</v-toolbar-title>
                            <v-divider class="mx-4" inset vertical></v-divider>
                            <v-form class="custom-form">
                                <v-text-field
                                    outlined
                                    dense
                                    hide-details
                                    placeholder="Search supplier payment"
                                    append-icon="mdi-magnify"
                                    style="width:300px;"
                                    v-model="searchPayment"
                                >
                                </v-text-field>
                            </v-form>
                        </v-toolbar>
                    </template>
                    <template v-slot:[`item.action`]="{ item }" v-if="userType == 'super_admin' || userType == 'admin'">
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-icon small @click="editSupplierPayment(item)" color="primary" v-on="on">mdi-circle-edit-outline</v-icon>
							</template>
							<span>Edit</span>
						</v-tooltip>
						<v-tooltip bottom>
							<template v-slot:activator="{ on }">
								<v-icon small @click="paymentId = item.id;$refs.confirmDialog.dialog = true" color="error" v-on="on" >mdi-delete-circle-outline</v-icon>
							</template>
							<span>Delete</span>
						</v-tooltip>
					</template>
                </v-data-table>
                <confirm-dialog ref="confirmDialog" @confirm="deleteSupplierPayment"></confirm-dialog>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import confirmDialog from '../../components/confirm-dialog.component.vue'

export default {
    name: 'SupplierPayment',

    components: {
		"confirm-dialog": confirmDialog,
    },

    data: ()=> ({
        menu: false,
        selectedSupplier: null,
        saveLoading: false,
        paymentId: null,
        bank: null,
        supplierPayment: {
            id: null,
            supplier_id : null,
            account_id : null,
            type: '',
            note: '',
            date: new Date().toISOString().substr(0, 10),
            amount: 0.00,
        },
        due: 0,
        supplierPaymentHeaders: [
            { text: 'Sl', value: 'sl' },
            { text: 'Date', value: 'date' },
            { text: 'Payment By', value: 'supplier.name' },
            { text: 'Payment Type', value: 'type' },
            { text: 'Amount', value: 'amount' },
            { text: 'Description', value: 'note' },
            { text: 'Action', value: 'action' },
        ],
        searchPayment: '',
        userType: ''
    }),

    watch: {
        async selectedSupplier(supplier) {
            if (supplier == null) return
            this.supplierPayment.supplier_id = supplier.id
            await this.$store.dispatch('supplier/getSupplierDue', {supplierId: supplier.id });
            this.due = this.$store.getters['supplier/supplierDue'][0].due;
        },

        bank(bank) {
            if(bank == null) return;
            this.supplierPayment.account_id = bank.id
        }
    },

    async created() {
        await this.getSupplierPayments();
        let userData = JSON.parse(localStorage.getItem('userData'))
		this.userType = userData.userType;
    },

    methods: {
        async getSupplierPayments() {
            let filer = {
                dateFrom: this.supplierPayment.date,
                dateTo: this.supplierPayment.date
            }
            await this.$store.dispatch('supplier/getSupplierPayments', filer);
        },

        async supplierpPayments() {
            if(! this.validationForm()) {
                return;
            }

            if(this.supplierPayment.type == '') {
                this.$store.dispatch('snackbar/error', "Select payment type");
                return;
            }

            if(this.supplierPayment.supplier_id == null) {
                this.$store.dispatch('snackbar/error', "Select supplier");
                return;
            }

            if(this.supplierPayment.amount == 0 || this.supplierPayment.amount == null) {
                this.$store.dispatch('snackbar/error', "Payment amount is required");
                return;
            }

            if(this.supplierPayment.type == 'Bank' && this.bank == null) {
                this.$store.dispatch('snackbar/error', "Select a bank");
                return;
            }
            
            this.saveLoading = true;

            let success = await this.$store.dispatch('supplier/saveSupplierPayment', this.supplierPayment);

            if(success) {
                this.resetForm();
                await this.getSupplierPayments();
            }
            this.saveLoading = false;
        },

        editSupplierPayment(payment) {
            Object.keys(this.supplierPayment).forEach(key => this.supplierPayment[key] = payment[key]);
            this.selectedSupplier = payment.supplier;
            this.selectedSupplier.display_text = `${payment.supplier.code} - ${payment.supplier.name} - ${payment.supplier.phone}`
            
            if(payment.bank_account != null) {
                this.bank = payment.bank_account;
                this.bank.display_text = `${payment.bank_account.account_name} - ${payment.bank_account.account_number} - ${payment.bank_account.bank_name}`
            }
        },

        async deleteSupplierPayment () {
            await this.$store.dispatch('supplier/deleteSupplierPayment', this.paymentId);
            await this.getSupplierPayments();
            this.$refs.confirmDialog.dialog = false;
        },

        validationForm() {
            let isValid = true;
            this.$refs.supplierPaymentForm.validate();
            this.$refs.supplierPaymentForm.inputs.forEach(input => {
                if(input.hasError) isValid = false;
            })

            return isValid;
        },

        resetForm() {
            this.supplierPayment.id = null;
            this.$refs.supplierPaymentForm.reset();
            this.supplierPayment.date = new Date().toISOString().substr(0, 10);
            this.$refs.supplierPaymentForm.resetValidation();
            this.supplierPayment.type = ''; 
            this.selectedSupplier = null;
            this.bank = null;
        }
    }
}
</script>

<style lang="scss" scoped>
    .v-icon.v-icon {
       font-size: 18px !important;
       top: 2px !important;
    }
    .v-icon.v-icon[data-v-1f38b4e5] {
        font-size: 14px !important;
        top: 0px !important; 
    }
    .v-messages {
        flex: 1 1 auto;
        font-size: 12px;
        min-height: 0px !important;
        max-height: 0px!important;
        min-width: 1px;
        position: relative;
    }
</style>
