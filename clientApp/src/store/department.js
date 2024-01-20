export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            departments: [],
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        departments(state) {
            return state.departments.map((item, sl) => {
                item.sl = sl + 1;
                return item;
            });
        },
    },

    mutations: {
        loading(state, isLoading) {
            state.loading = isLoading;
        },

        setDepartment(state, departments) {
            state.departments = departments;
        },
    },

    actions: {
        async getDepartments(context) {
            context.commit('loading', true);

            let departments = await axios.get(`${this.state.host}/get-departments`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.departments;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setDepartment', departments);

            context.commit('loading', false);
        },

        async saveDepartment(context, department) {
            let isSuccess = false;

            let url = 'add-department';

            if(department.id != null) {
                url = 'update-department';
            }

            await axios.post(`${this.state.host}/${url}`, department, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getDepartments');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteDepartment(context, id) {
            await axios.delete(`${this.state.host}/delete-department/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getDepartments');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
