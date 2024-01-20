export default {
    namespaced: true,

    state: () => {
        return {
            loadingBrands: false,
            brands: [],
        }
    },

    getters: {
        loadingBrands(state) {
            return state.loadingBrands;
        },

        brands(state) {
            return state.brands.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loadingBrands(state, isLoading) {
            state.loadingBrands = isLoading;
        },

        setBrand(state, brands) {
            state.brands = brands;
        },
    },

    actions: {
        async getBrands(context) {
            context.commit('loadingBrands', true);

            let brands = await axios.get(`${this.state.host}/get-brands`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.brands;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setBrand', brands);

            context.commit('loadingBrands', false);
        },

        async saveBrand(context, brand) {
            let isSuccess = false;

            let url = 'add-brand';

            if(brand.id != null) {
                url = 'update-brand';
            }

            await axios.post(`${this.state.host}/${url}`, brand, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getBrands');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteBrand(context, id) {
            await axios.delete(`${this.state.host}/delete-brand/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getBrands');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
