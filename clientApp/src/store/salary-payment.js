export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            payments: [],
            paymentTotal: 0,
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        payments(state) {
            return state.payments.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },

        paymentTotal(state) {
            return state.paymentTotal;
        }
    },

    mutations: {
        loading(state, isLoading) {
            state.loading = isLoading;
        },

        setPayments(state, payments) {
            state.payments = payments;
        },

        setPaymentTotal(state, total) {
            state.paymentTotal = total
        }
    },

    actions: {
        async getPayments(context, payload) {
            context.commit('loading', true);

            let payments = await axios.post(`${this.state.host}/get-salary-payments`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.payments;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setPayments', payments);
            context.commit('loading', false);
        },

        async saveSalaryPayment(context, payload) {
            let isSuccess = false;
            let url = '';

            if(payload.id != null) {
                url = 'update-salary-payment';
            } else {
                url = 'add-salary-payment';
                delete payload.id;
            }

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                // context.dispatch('getPayments');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteSalaryPayment(context, id) {
            await axios.delete(`${this.state.host}/delete-salary-payment/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                // context.dispatch('getPayments');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async getSalaryDue(context, payload) {
            await axios.post(`${this.state.host}/get-salary-due`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setPaymentTotal', res.data.salary[0].due);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
