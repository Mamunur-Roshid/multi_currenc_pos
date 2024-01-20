export default {
    namespaced: true,

    state: () => {
        return {
            loadingProfitLoss: false,
            profitLoss: 0,
        }
    },

    getters: {
        loadingProfitLoss(state) {
            return state.loadingProfitLoss;
        },

        profitLoss(state) {
            return state.profitLoss
            // .map((item, sl) => {
            //     item.sl = sl + 1;
            //     return item;
            // });
        },
    },

    mutations: {
        setLoadingProfitLoss(state, isLoading) {
            state.loadingProfitLoss = isLoading;
        },

        setProfitLoss(state, profitLoss) {
            state.profitLoss = profitLoss;
        },
    },

    actions: {
        async getProfitLoss(context) {
            context.commit('setLoadingProfitLoss', true);

            let profitLoss = await axios.get(`${this.state.host}/profit-loss`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.profitloss;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setProfitLoss', profitLoss);

            context.commit('setLoadingProfitLoss', false);
        },

    }
}
