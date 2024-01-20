export default {
    namespaced: true,

    state: () => {
        return {
            loadingUnits: false,
            units: [],
        }
    },

    getters: {
        loadingUnits(state) {
            return state.loadingUnits;
        },

        units(state) {
            return state.units.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loadingUnits(state, isLoading) {
            state.loadingUnits = isLoading;
        },

        setUnit(state, units) {
            state.units = units;
        },
    },

    actions: {
        async getUnits(context) {
            context.commit('loadingUnits', true);

            let units = await axios.get(`${this.state.host}/get-units`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.units;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setUnit', units);

            context.commit('loadingUnits', false);
        },

        async saveUnit(context, unit) {
            let isSuccess = false;

            let url = 'add-unit';

            if(unit.id != null) {
                url = 'update-unit';
            }

            await axios.post(`${this.state.host}/${url}`, unit, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getUnits');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteUnit(context, id) {
            await axios.delete(`${this.state.host}/delete-unit/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getUnits');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
