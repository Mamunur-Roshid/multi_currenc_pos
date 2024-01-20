export default {
    namespaced: true,

    state: () => {
        return {
            loadingCustomers: false,
            customers: [],
            payments: [],
            customerDue: [],
            openingBalance: 0,
            ledgers: [],
            types: [],
        }
    },

    getters: {
        loadingCustomers(state) {
            return state.loadingCustomers;
        },

        customers(state) {
            return state.customers.map((item, sl) => {
                item.sl = sl + 1;
                item.display_text = `${item.code} - ${item.name} - ${item.phone}`;
                return item;
            });
        },

        payments(state) {
            return state.payments.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },

        customerDue(state) {
            return state.customerDue;
        },

        openingBalance(state) {
            return state.openingBalance;
        },

        ledgers(state) {
            return state.ledgers;
        },

        types(state) {
            return state.types.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            })
        }
    },

    mutations: {
        loadingCustomers(state, isLoading) {
            state.loadingCustomers = isLoading;
        },

        setCustomer(state, customers) {
            state.customers = customers;
        },

        setCustomerPayment(state, payments) {
            state.payments = payments;
        },

        setCustomerDue(state, customerDue) {
            state.customerDue = customerDue;
        },

        setOpeningBalance(state, balance) {
            state.openingBalance = balance;
        },

        setCustomerLedger(state, ledgers) {
            state.ledgers = ledgers;
        },
        
        setCustomerType(state, types) {
            state.types = types;
        }
    },

    actions: {
        async getCustomers(context, payload) {
            context.commit('loadingCustomers', true);

            let customers = await axios.post(`${this.state.host}/get-customers`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.customers;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setCustomer', customers);

            context.commit('loadingCustomers', false);
        },

        async saveCustomer(context, customer) {
            let isSuccess = false;

            let url = 'add-customer';

            if(customer.id != null) {
                url = 'update-customer';
            }

            await axios.post(`${this.state.host}/${url}`, customer, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getCustomers');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteCustomer(context, id) {
            await axios.delete(`${this.state.host}/delete-customer/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getCustomers');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async generateCustomerCode(context) {
            let newCode = await axios.get(`${this.state.host}/generate-customer-code`, {
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

        async getCustomerPayments(context, payload) {
            await axios.post(`${this.state.host}/get-customer-payment`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setCustomerPayment', res.data.payments);
            })
            .catch(error => this.dispatch('snackbar/error', error.message))
        },

        async saveCustomerPayment(context, payment) {
            let isSuccess = false;
            let url = '';

            if(payment.id != null) {
                url = '/update-customer-payment';
            } else {
                url = '/customer-payment'
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
                // context.dispatch('getCustomerPayments');
            })
            .catch( err => {
                isSuccess = false;
                this.dispatch('snackbar/error', err.response.data.message);
            })

            return isSuccess;
        },

        async deleteCustomerPayment(context, id) {
            let isSuccess = false;

            await axios.delete(`${this.state.host}/delete-customer-payment/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                // context.dispatch('getCustomerPayments');
            })
            .catch(err => {
                isSuccess = false;
                this.dispatch('snackbar/error', err.response.data.message);
            })
            
            return isSuccess;
        },

        async getCustomerDue(context, payload) {
            await axios.post(`${this.state.host}/get-customer-due`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setCustomerDue', res.data.customers);
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })
        },

        async getCustomerLedger(context, payload) {
            await axios.post(`${this.state.host}/get-customer-ledger`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setOpeningBalance', res.data.openingBalance);
                context.commit('setCustomerLedger', res.data.ledgers);
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })
        },
        
        async getTypes(context) {
            context.commit('loadingCustomers', true);

            let type = await axios.get(`${this.state.host}/get-customer-types`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.types;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })
            context.commit('setCustomerType', type);
            context.commit('loadingCustomers', false);
        },

        async addType(context, type) {
            let isSuccess = false;

            let url = 'add-customer-type';

            if(type.id != null) {
                url = 'update-customer-type';
            }

            await axios.post(`${this.state.host}/${url}`, type, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getTypes');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteType(context, id) {
            await axios.delete(`${this.state.host}/delete-customer-type/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getTypes');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
