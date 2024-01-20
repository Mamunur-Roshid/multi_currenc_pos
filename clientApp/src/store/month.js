export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            months: [],
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        months(state) {
            return state.months.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loading(state, isLoading) {
            state.loading = isLoading;
        },

        setMonth(state, months) {
            state.months = months;
        },
    },

    actions: {
        async getMonths(context) {
            context.commit('loading', true);

            let months = await axios.get(`${this.state.host}/get-months`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.months;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setMonth', months);

            context.commit('loading', false);
        },

        async saveMonth(context, month) {
            let isSuccess = false;

            let url = 'add-month';

            if(month.id != null) {
                url = 'update-month';
            }

            await axios.post(`${this.state.host}/${url}`, month, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getMonths');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteMonth(context, id) {
            await axios.delete(`${this.state.host}/delete-month/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getMonths');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
