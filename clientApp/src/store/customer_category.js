import _ from 'lodash'
export default {
    namespaced: true,

    state: () => {
        return {
            loadingCategories: false,
            categories: [],
        }
    },

    getters: {
        loadingCategories(state) {
            return state.loadingCategories;
        },

        categories(state) {
            if (_.isArray(state.categories)) {
                return state.categories.map((item, sl) => {
                    item.sl = sl + 1;
                    return item;
                });
            }
            return []
        },
    },

    mutations: {
        loadingCategories(state, isLoading) {
            state.loadingCategories = isLoading;
        },

        setCategory(state, categories) {
            state.categories = categories;
        },
    },

    actions: {
        async getCategories(context) {
            context.commit('loadingCategories', true);

            let categories = await axios.get(`${this.state.host}/get-customer-categories`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.customer_categories;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setCategory', categories);

            context.commit('loadingCategories', false);
        },

        async saveCategory(context, category) {
            let isSuccess = false;

            let url = 'add-customer-category';

            if(category.id != null) {
                url = 'update-customer-category';
            }

            await axios.post(`${this.state.host}/${url}`, category, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getCategories');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteCategory(context, id) {
            await axios.delete(`${this.state.host}/delete-customer-category/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getCategories');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
