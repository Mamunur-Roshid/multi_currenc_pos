export default {
    namespaced: true,

    state: () => {
        return {
            loadingBankAccount: false,
            accounts: [],
        }
    },

    getters: {
        loadingBankAccount(state) {
            return state.loadingBankAccount;
        },

        accounts(state) {
            return state.accounts.map((item, sl) => {
                item.sl = sl + 1;
                item.display_text = `${item.account_name} - ${item.account_number} - ${item.bank_name}` 
                return item;
            });
        },
    },

    mutations: {
        loadingBankAccount(state, isLoading) {
            state.loadingBankAccount = isLoading;
        },

        setBankAccount(state, accounts) {
            state.accounts = accounts;
        },
    },

    actions: {
        async getBankAccounts(context) {
            context.commit('loadingBankAccount', true);

            let accounts = await axios.get(`${this.state.host}/get-bank-accounts`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.accounts;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setBankAccount', accounts);
            context.commit('loadingBankAccount', false);
        },

        async saveBankAccount(context, bankaccount) {
            let isSuccess = false;

            let url = '';

            if(bankaccount.id != null) {
                url = 'update-bank-account';
            } else {
                url = 'add-bank-account'
                delete bankaccount.id;
            }

            await axios.post(`${this.state.host}/${url}`, bankaccount, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getBankAccounts');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteBankAccount(context, id) {
            await axios.delete(`${this.state.host}/delete-bank-account/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getBankAccounts');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
