export default {
    namespaced: true,

    state: () => {
        return {
            loadingSuppliers: false,
            suppliers: [],
            payments: [],
            supplierDue: [],
            openingBalance: 0,
            ledgers: []
        }
    },

    getters: {
        loadingSuppliers(state) {
            return state.loadingSuppliers;
        },

        suppliers(state) {
            return state.suppliers.map((item, sl) => {
                item.sl = sl + 1;
                item.display_text = `${item.code} - ${item.name} - ${item.phone}`;
                return item;
            });
        },

        payments(state) {
            return state.payments.map((item, i) => {
                item.sl = i + 1;
                return item;
            });
        },

        supplierDue(state) {
            return state.supplierDue;
        },

        ledgers(state) {
            return state.ledgers;
        },

        openingBalance(state) {
            return state.openingBalance;
        }
    },

    mutations: {
        loadingSuppliers(state, isLoading) {
            state.loadingSuppliers = isLoading;
        },

        setSupplier(state, suppliers) {
            state.suppliers = suppliers;
        },

        setSupplierPayment(state, payments) {
            state.payments = payments;
        },
        
        setSupplierDue(state, due) {
            state.supplierDue = due;
        },

        setSupplierLedger(state, ledgers) {
            state.ledgers = ledgers;
        },

        setOpeningBalance(state, balance) {
            state.openingBalance = balance;
        },
    },

    actions: {
        async getSuppliers(context) {
            context.commit('loadingSuppliers', true);

            let suppliers = await axios.get(`${this.state.host}/get-suppliers`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.suppliers;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setSupplier', suppliers);

            context.commit('loadingSuppliers', false);
        },

        async saveSupplier(context, supplier) {
            let isSuccess = false;

            let url = 'add-supplier';

            if(supplier.id != null) {
                url = 'update-supplier';
            }

            await  axios.post(`${this.state.host}/${url}`, supplier, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getSuppliers');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteSupplier(context, id) {
            await axios.delete(`${this.state.host}/delete-supplier/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getSuppliers');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async generateSupplierCode(context) {
            let newCode = await axios.get(`${this.state.host}/generate-supplier-code`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.code;
            })
            .catch(error => this.dispatch('snackbar/error', error))
    
            return newCode;
        },

        async getSupplierPayments(context, payload) {
            await axios.post(`${this.state.host}/get-supplier-payment`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setSupplierPayment', res.data.payments);
            })
            .catch(error => this.dispatch('snackbar/error', error.message))
        },

        async getSupplierDue(context, payload) {
            await axios.post(`${this.state.host}/get-supplier-due`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setSupplierDue', res.data.suppliers);
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })
        },

         async saveSupplierPayment(context, payment) {
            let isSuccess = false;
            let url = '';

            if(payment.id != null) {
                url = '/update-supplier-payment';
            } else {
                url = '/supplier-payment'
                delete payment.id
            }

            await axios.post(`${this.state.host}${url}`, payment, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            }) 
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                // context.dispatch('getSupplierPayments');
            })
            .catch( err => {
                isSuccess = false;
                this.dispatch('snackbar/error', err.response.data.message);
            })

            return isSuccess;
        },

        async deleteSupplierPayment(context, id) {
            let isSuccess = false;

            await axios.delete(`${this.state.host}/delete-supplier-payment/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                // context.dispatch('getSupplierPayments');
            })
            .catch(err => {
                isSuccess = false;
                this.dispatch('snackbar/error', err.response.data.message);
            })
            
            return isSuccess;
        },

        async getSupplierLedger(context, payload) {
            await axios.post(`${this.state.host}/get-supplier-ledger`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setOpeningBalance', res.data.openingBalance);
                context.commit('setSupplierLedger', res.data.ledgers);
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })
        }

    }
}
