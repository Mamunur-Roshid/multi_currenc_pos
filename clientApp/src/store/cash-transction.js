export default {
    namespaced: true,

    state: () => {
        return {
            loadingTransaction: false,
            transactions: [],
            cashBalance: 0,
            ledgers: [],
            openingBalance: 0,
            ghraps: [],
            profit: {
                daily: 0,
                weekly: 0,
                monthly: 0,
                yearly: 0
            }
        }
    },

    getters: {
        loadingTransaction(state) {
            return state.loadingTransaction;
        },

        transactions(state) {
            return state.transactions.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },

        totalCashBalance(state) {
            return state.cashBalance;
        },

        ledgers(state) {
            return state.ledgers;
        },

        openingBalance(state) {
            return state.openingBalance;
        },

        ghraps(state) {
            return state.ghraps;
        },

        profit(state) {
            return state.profit;
        }
    },

    mutations: {
        loadingTransaction(state, isLoading) {
            state.loadingTransaction = isLoading;
        },

        setTransaction(state, transactions) {
            state.transactions = transactions;
        },

        setCashBalance(state, balance) {
            state.cashBalance = balance;
        },

        setCashLedger(state, ledger) {
            state.ledgers = ledger;
        },

        setOpeningBalance(state, balance) {
            state.openingBalance = balance;
        },

        setGhraps(state, ghraps) {
            state.ghraps = ghraps;
        },

        setProfit(state, profit) {
            state.profit = profit;
        }
    },

    actions: {
        async getTransactions(context, payload) {
            context.commit('loadingTransaction', true);

            let transactions = await axios.post(`${this.state.host}/get-cash-transactions`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.transactions;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setTransaction', transactions);
            context.commit('loadingTransaction', false);
        },

        async saveTransaction(context, payload) {
            let isSuccess = false;

            let url = '';

            if(payload.id != null) {
                url = 'update-cash-transaction';
            } else {
                url = 'add-cash-transaction';
                delete payload.id;
            }

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                // context.dispatch('getTransactions');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteTransaction(context, id) {
            await axios.delete(`${this.state.host}/delete-cash-transaction/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                // context.dispatch('getTransactions');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async generateTransactionCode(context) {
            let newCode = await axios.get(`${this.state.host}/generate-transaction-code`, {
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

        async getCashBalance(context) {
            let balance = await axios.get(`${this.state.host}/get-cash-balance`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.balance;
            })
            .catch(error => this.dispatch('snackbar/error', error))

            context.commit('setCashBalance', balance);
        },

        async getCashLedgers(context, payload) {
            await axios.post(`${this.state.host}/get-cash-ledger`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setOpeningBalance', res.data.cash.openingBalance);
                context.commit('setCashLedger', res.data.cash.ledgers);
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })
        },

        async getGhrap(context) {
            let ghrap = await axios.get(`${this.state.host}/get-ghrap-data`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })

            context.commit('setGhraps', ghrap)
        },

        async getProfit(context) {
            await axios.get(`${this.state.host}/get-profits`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setProfit', res.data.profit)
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })

        }
    }
}
