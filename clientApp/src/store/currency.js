import _ from 'lodash'
export default {
    namespaced: true,

    state: () => {
        return {
            loadingCurrency: false,
            Currency: [],
        }
    },

    getters: {
        loadingCurrency(state) {
            return state.loadingCurrency;
        },

        currencies(state) {
            if(!_.isArray(state.currencies)) return [];

            return state.currencies.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loadingCurrency(state, isLoading) {
            state.loadingCurrencies = isLoading;
        },

        setCurrency(state, areas) {
            state.areas = areas;
        },
    },

    actions: {
        async getCurrency(context) {
            context.commit('loadingCurrency', true);

            let currencies = await axios.get(`${this.state.host}/get-currencies`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.currencies;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setCurrency', currencies);

            context.commit('loadingCurrency', false);
        },

        async saveCurrency(context, area) {
            let isSuccess = false;
            let url = 'add-currencies';

            if(area.id != null) {
                url = 'update-currencies';
            }

            await axios.post(`${this.state.host}/${url}`, area, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getCurrency');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteCurrency(context, id) {
            await axios.delete(`${this.state.host}/delete-currencies/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getCurrency');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
