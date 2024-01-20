export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            designations: [],
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        designations(state) {
            return state.designations.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loading(state, isLoading) {
            state.loading = isLoading;
        },

        setDesignation(state, designations) {
            state.designations = designations;
        },
    },

    actions: {
        async getDesignations(context) {
            context.commit('loading', true);

            let designations = await axios.get(`${this.state.host}/get-designations`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.designations;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setDesignation', designations);

            context.commit('loading', false);
        },

        async saveDesignation(context, designation) {
            let isSuccess = false;

            let url = 'add-designation';

            if(designation.id != null) {
                url = 'update-designation';
            }

            await axios.post(`${this.state.host}/${url}`, designation, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getDesignations');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteDesignation(context, id) {
            await axios.delete(`${this.state.host}/delete-designation/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getDesignations');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
