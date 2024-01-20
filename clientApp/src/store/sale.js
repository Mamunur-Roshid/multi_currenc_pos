export default {
    namespaced: true,

    state: () => {
        return {
            loadingSale: false,
            sales: [],
            returns: [],
            saleReturns: [],
            invoices: [],
        }
    },

    getters: {
        loadingSale(state) {
            return state.loadingSale;
        },

        sales(state) {
            return state.sales.map((item, sl) => {
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

        saleReturns(state) {
            return state.saleReturns.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        }
    },

    mutations: {
        loadingSale(state, isLoading) {
            state.loadingSale = isLoading;
        },

        setSales(state, sales) {
            state.sales = sales;
        },

        setInvoice(state, invoices) {
            state.invoices = invoices;
        },

        setForReturn(state, returns) {
            state.returns = returns;
        },

        setReturn(state, saleReturns) {
            state.saleReturns = saleReturns;
        }
    },

    actions: {
        async getSales(context, payload) {
            context.commit('loadingSale', true);

            let sales = await axios.post(`${this.state.host}/get-sales`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.sales;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setSales', sales);

            context.commit('loadingSale', false);
        },

        async saveSale(context, payload) {
            let response = { isSuccess: false};

            let url = '';

            if(payload.sale.id != null) {
                url = 'update-sale';
            } else {
                url = 'add-sale';
                delete payload.sale.id;
            }

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                response.isSuccess = true;
                response.id = res.data.id;
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return response;
        },

        async deleteSale(context, id) {
            await axios.delete(`${this.state.host}/delete-sale/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getSales');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async generateSaleCode(context) {
            let newCode = await axios.get(`${this.state.host}/generate-sale-code`, {
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
            let invoice = await axios.get(`${this.state.host}/get-sale-invoices`, {
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

        async getSaleReteurnForDetails(context, payload) {
            let sale = await axios.post(`${this.state.host}/get-sale-for-return`, payload, {
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

            context.commit('setForReturn', sale);
        },

        async getSaleReturns(context, payload) {
            let saleReturn = await axios.post(`${this.state.host}/get-sale-returns`, payload, {
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

            context.commit('setReturn', saleReturn);
        },

        async saveSaleReturn(context, payload) {
            let isSuccess = false;

            let url = '';

            if(payload.saleReturn.id != null) {
                url = 'update-sale-return';
            } else {
                url = 'add-sale-return';
                delete payload.saleReturn.id
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