export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            damages: [],
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        damages(state) {
            return state.damages.map((item, sl) => {
                item.sl = sl + 1;
                item.display_text = `${item.code} - ${item.name}`;
                return item;
            });
        }
    },

    mutations: {
        loading(state, isLoading) {
            state.loading = isLoading;
        },

        setDamage(state, damages) {
            state.damages = damages;
        }
    },

    actions: {
        async getDamages(context, payload) {
            context.commit('loading', true);

            let damages = await axios.post(`${this.state.host}/get-damages`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.damages;

            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setDamage', damages);

            context.commit('loading', false);
        },

        async saveDamage(context, payload) {
            let response = {isSuccess: false};

            let url = '';

            if(payload.damage.id != null) {
                url = 'update-damage';
            } else {
                url = 'add-damage';
                delete payload.damage.id;
            }

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                response.isSuccess = true;
                response.id = res.data.id;
                context.dispatch('getDamages');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return response;
        },

        async deleteDamage(context, id) {
            await axios.delete(`${this.state.host}/delete-damage/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getDamages');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async generateDamageCode(context) {
            let newCode = await axios.get(`${this.state.host}/generate-damage-code`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.invoice;
            })
            .catch(error => this.dispatch('snackbar/error', error))
    
            return newCode;
        }
    }
}
