import _ from 'lodash'
export default {
    namespaced: true,

    state: () => {
        return {
            loading: false,
            branches: [],
        }
    },

    getters: {
        loading(state) {
            return state.loading;
        },

        branches(state) {
            if (_.isArray(state.branches)) {
                return state.branches.map((item, sl) => {
                    item.sl = sl + 1;
                    return item;
                });
            }
            return []
        }
    },

    mutations: {
        setLoading(state, loading) {
            state.loading = loading
        },

        setBranch(state, branches) {
            state.branches = branches
        },
    },

    actions: {
        async getBranches(context) {
            context.commit('setLoading', true);
        
            await axios.get(`${this.state.host}/get-branches`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setBranch', res.data.branches);
            })
            .catch(error => this.dispatch('snackbar/error', error))

            context.commit('setLoading', false);
        },

        async saveBranch(context, {branch, image}) {
            let isSuccess = false;

            let url = '';
            if(branch.id != null) {
                url = 'update-branch';
            } else {
                url = 'add-branch';
                delete branch.id
            }

            let fd = new FormData();
            fd.append('branch', JSON.stringify(branch));

            if(image != null && image != undefined) {
                fd.append('image', image);
            }

            await axios.post(`${this.state.host}/${url}`, fd, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                context.dispatch('getBranches');
            })
            .catch(error => { 
                isSuccess = false;
                this.dispatch('snackbar/error', error);
            })

            return isSuccess;
        },

        async deleteBranch(context, id) {
            let isSuccess = false;

            await axios.delete(`${this.state.host}/delete-branch/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                context.dispatch('getBranches');
            })
            .catch(error => { 
                isSuccess = false;
                this.dispatch('snackbar/error', error);
            })

            return isSuccess;
        },
    }
}
