export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            records: {},
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        records(state) {
            return state.records
        },
    },

    mutations: {
        setLoading(state, isLoading) {
            state.loading = isLoading;
        },

        setRecord(state, records) {
            state.records = records;
        },
    },

    actions: {
        async getRecord(context, payload) {
            context.commit('setLoading', true);

            let records = await axios.post(`${this.state.host}/get-dashboard-data`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setRecord', records);

            context.commit('setLoading', false);
        },
    }
}
