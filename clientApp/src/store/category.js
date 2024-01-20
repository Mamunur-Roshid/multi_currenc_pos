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
            return state.categories.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
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

            let categories = await axios.get(`${this.state.host}/get-categories`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.categories;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setCategory', categories);

            context.commit('loadingCategories', false);
        },

        async saveCategory(context, category) {
            let isSuccess = false;

            let url = 'add-category';

            if(category.id != null) {
                url = 'update-category';
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
            await axios.delete(`${this.state.host}/delete-category/${id}`, {
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
