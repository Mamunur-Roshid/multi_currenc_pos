export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            cheques: [],
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        cheques(state) {
            return state.cheques.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loading(state, isLoading) {
            state.loading = isLoading;
        },

        setCheque(state, cheques) {
            state.cheques = cheques;
        },
    },

    actions: {
        async getCheques(context, payload) {
            context.commit('loading', true);

            let cheques = await axios.post(`${this.state.host}/get-cheques`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.cheques;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setCheque', cheques);
            context.commit('loading', false);
        },

        async saveCheque(context, payload) {
            let isSuccess = false;

            let url = '';

            if(payload.id != null) {
                url = 'update-cheque';
            } else {
                url = 'add-cheque';
                delete payload.id;
            }

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                // context.dispatch('getCheques');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteCheque(context, id) {
            await axios.delete(`${this.state.host}/delete-cheque/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                // context.dispatch('getCheques');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async changeStatus(context, payload) {
            let isSuccess = false;
            let url = 'change-status';

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                context.dispatch('getCheques');
            })
            .catch(err => {
                isSuccess = false;
                this.dispatch('snackbar/error', err.response.data.message);
            })
            
            return isSuccess;
        }
    }
}
