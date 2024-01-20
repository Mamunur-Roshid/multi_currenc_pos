export default {
    namespaced: true,

    state: () => {
        return {
            loadingTransaction: false,
            transactions: [],
            currentBalance: 0,
            totalBalance: 0,
            banks: [],
            openingBalance: 0,
            ledgers: []
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

        currentBalance(state) {
            return state.currentBalance;
        },

        totalBankBalance(state) {
            return state.totalBalance;
        },

        banks(state) {
            return state.banks;
        },

        openingBalance(state) {
            return state.openingBalance;
        },

        ledgers(state) {
            return state.ledgers;
        }
    },

    mutations: {
        loadingTransaction(state, isLoading) {
            state.loadingTransaction = isLoading;
        },

        setTransaction(state, transactions) {
            state.transactions = transactions;
        },

        setCurrentBalance(state, balance) {
            state.currentBalance = balance;
        },

        setTotalBalance(state, balance) {
            state.totalBalance = balance;
        },

        setBankAccountBalance(state, banks) {
            state.banks = banks;
        },

        setOpeningBalance(state, balance) {
            state.openingBalance = balance;
        },

        setBankLedger(state, ledger) {
            state.ledgers = ledger;
        }
    },

    actions: {
        async getTransactions(context, payload) {
            context.commit('loadingTransaction', true);

            let transactions = await axios.post(`${this.state.host}/get-bank-transactions`, payload, {
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
                url = 'update-bank-transaction';
            } else {
                url = 'add-bank-transaction';
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
            await axios.delete(`${this.state.host}/delete-bank-transaction/${id}`, {
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
            let newCode = await axios.get(`${this.state.host}/generate-bank-transaction`, {
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

        async getCurrentBalance(context, payload) {
            let balance = await axios.post(`${this.state.host}/get-current-bank-balance`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.balance;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setCurrentBalance', balance);
        },

        async getTotalBankBalance(context) {
            let balance = await axios.get(`${this.state.host}/get-bank-balance`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.balance;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setTotalBalance', balance);
        },

        async getAccountBalance(context) {
            let balance = await axios.get(`${this.state.host}/get-account-balance`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.banks;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setBankAccountBalance', balance);
        },

        async getBankLedgers(context, payload) {
            await axios.post(`${this.state.host}/get-bank-ledger`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setOpeningBalance', res.data.bank.openingBalance);
                context.commit('setBankLedger', res.data.bank.ledgers);
            })
            .catch(err => {
                this.dispatch('snackbar/error', err.message)
            })
        }
    }
}
