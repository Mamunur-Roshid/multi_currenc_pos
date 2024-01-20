export default {
    namespaced: true,

    state: () => {
        return {
            loadingAreas: false,
            areas: [],
        }
    },

    getters: {
        loadingAreas(state) {
            return state.loadingAreas;
        },

        areas(state) {
            return state.areas.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loadingAreas(state, isLoading) {
            state.loadingAreas = isLoading;
        },

        setAreas(state, areas) {
            state.areas = areas;
        },
    },

    actions: {
        async getAreas(context) {
            context.commit('loadingAreas', true);

            let areas = await axios.get(`${this.state.host}/get-areas`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.areas;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setAreas', areas);

            context.commit('loadingAreas', false);
        },

        async saveArea(context, area) {
            let isSuccess = false;
            let url = 'add-area';

            if(area.id != null) {
                url = 'update-area';
            }

            await axios.post(`${this.state.host}/${url}`, area, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getAreas');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteArea(context, id) {
            await axios.delete(`${this.state.host}/delete-area/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getAreas');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
