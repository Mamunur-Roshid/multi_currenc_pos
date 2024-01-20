export default {
    namespaced: true,

    state: () => {
        return {
            loadingDiscountCode: false,
            discount_code: [],
        }
    },

    getters: {
        loadingDiscountCode(state) {
            return state.loadingDiscountCode;
        },

        discount_code(state) {
            return state.discount_code.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loadingDiscountCode(state, isLoading) {
            state.loadingDiscountCode = isLoading;
        },

        setDiscountCode(state, code) {
            state.discount_code = code;
        },
    },

    actions: {
        async getDiscountCode(context) {
            context.commit('loadingDiscountCode', true);

            let discount_code = await axios.get(`${this.state.host}/get-discount-code`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.discount_code;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setDiscountCode', discount_code);

            context.commit('loadingDiscountCode', false);
        },

        async saveDiscountCode(context, discount_code) {
            let isSuccess = false;

            let url = 'add-discount-code';

            if(discount_code.id != null) {
                url = 'update-discount-code';
            }

            await axios.post(`${this.state.host}/${url}`, discount_code, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getDiscountCode');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteDiscountCode(context, id) {
            await axios.delete(`${this.state.host}/delete-discount-code/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getDiscountCode');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
