export default {
    namespaced: true,

    state: () => {
        return {
            loadingPurchase: false,
            purchases: [],
            returns: [],
            purchaseReturns: [],
            invoices: [],
        }
    },

    getters: {
        loadingPurchase(state) {
            return state.loadingPurchase;
        },

        purchases(state) {
            return state.purchases.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },

        invoices(state) {
            return state.invoices;
        },

        returns(state) {
            return state.returns;
        },

        purchaseReturns(state) {
            return state.purchaseReturns.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        }
    },

    mutations: {
        loadingPurchase(state, isLoading) {
            state.loadingPurchase = isLoading;
        },

        setPurchase(state, purchases) {
            state.purchases = purchases;
        },

        setInvoice(state, invoices) {
            state.invoices = invoices;
        },

        setForReturn(state, returns) {
            state.returns = returns;
        },

        setReturn(state, purchaseReturns) {
            state.purchaseReturns = purchaseReturns;
        }
    },

    actions: {
        async getPurchases(context, payload) {
            context.commit('loadingPurchase', true);

            let purchases = await axios.post(`${this.state.host}/get-purchases`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.purchases;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setPurchase', purchases);

            context.commit('loadingPurchase', false);
        },

        async savePurchase(context, payload) {
            let response = { isSuccess: false};

            let url = 'add-purchase';

            // if(payload.purchase.id != null) {
            //     url = 'update-purchase';
            // }

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                response.isSuccess = true;
                response.id = res.data;
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return response;
        },

        async deletePurchase(context, id) {
            await axios.delete(`${this.state.host}/delete-purchase/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getPurchases');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async generatePurchaseCode(context) {
            let newCode = await axios.get(`${this.state.host}/generate-purchase-code`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.invoice;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error)
            })

            return newCode;
        },
        
        async getInvoices(context) {
            let invoice = await axios.get(`${this.state.host}/get-purchase-invoices`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.invoices;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error)
            })
    
            context.commit('setInvoice', invoice);
        },

        async getPurchaseReteurnForDetails(context, payload) {
            let purchase = await axios.post(`${this.state.host}/get-purchase-for-return`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error)
            })

            context.commit('setForReturn', purchase);
        },

        async getPurchaseReturns(context, payload) {
            let purReturn = await axios.post(`${this.state.host}/get-purchase-returns`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.returns;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error)
            })

            context.commit('setReturn', purReturn);
        },

        async savePurchaseReturn(context, payload) {
            let isSuccess = false;

            let url = 'add-purchase-return';

            if(payload.purReturn.id != null) {
                url = 'update-purchase-return';
            }

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        }
    }
}