export default {
    namespaced: true,

    state: () => {
        return {
            loadingExpense: false,
            expenses: [],
        }
    },

    getters: {
        loadingExpense(state) {
            return state.loadingExpense;
        },

        expenses(state) {
            return state.expenses.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loadingExpense(state, isLoading) {
            state.loadingExpense = isLoading;
        },

        setExpense(state, expenses) {
            state.expenses = expenses;
        },
    },

    actions: {
        async getExpenses(context) {
            context.commit('loadingExpense', true);

            let expenses = await axios.get(`${this.state.host}/get-expenses`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.expenses;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setExpense', expenses);

            context.commit('loadingExpense', false);
        },

        async saveExpense(context, expense) {
            let isSuccess = false;

            let url = 'add-expense';

            if(expense.id != null) {
                url = 'update-expense';
            }

            await axios.post(`${this.state.host}/${url}`, expense, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getExpenses');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteExpense(context, id) {
            await axios.delete(`${this.state.host}/delete-expense/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getExpenses');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
