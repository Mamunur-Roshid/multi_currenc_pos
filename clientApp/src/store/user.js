export default {
    namespaced: true,

    state: () => {
        return {
            users: [],
            loadingUser: false
        }
    },

    getters: {
        users(state) {
            return state.users.map((item, i) => {
                item.sl = i + 1;
                return item;
            });
        }
    },

    mutations: {
        setUser(state, user) {
            this.commit('authorized/setUser', user);
        },

        populateUsers(state, user) {
            state.users = user
        },

        loadingUser(state, isLoading) {
            state.loadingUser = isLoading;
        },
    },

    actions: {
        async getUsers(context, payload) {
            context.commit('loadingUser', true);

            let users = await axios.post(`${this.state.host}/get-users`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.users;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('populateUsers', users);

            context.commit('loadingUser', false);
        },

        async saveUser(context, user) {
            let isSuccess = false;

            let url = 'add-user';

            if(user.id != null) {
                url = 'update-user';
            }

            await axios.post(`${this.state.host}/${url}`, user, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getUsers');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteUser(context, id) {
            await axios.delete(`${this.state.host}/delete-user/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getUsers');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async userProfileUpdate(context, user) {
            let isSuccess = false;

            let url = 'user-profile-update';

            await axios.post(`${this.state.host}/${url}`, user, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async userPermission(context, payload) {
            let isSuccess = false;

            let url = 'update-user-permission';

            await axios.post(`${this.state.host}/${url}`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async login(context, user) {
            let isSuccess = false;
            
            let auth = await axios.post(`${this.state.host}/login`, user)
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                context.commit('setUser', { user: res.data.user, jwt: res.data.jwt });

                localStorage.setItem('jwtToken', res.data.jwt)
                localStorage.setItem('userData', JSON.stringify(res.data.user))
            })
            .catch(error => { 
                isSuccess = false;
                this.dispatch('snackbar/error', error);
            })

            return isSuccess;
        },

        async branchAccess(context, payload) {
            let isSuccess = false;

            await axios.post(`${this.state.host}/branch-access`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                context.commit('setUser', { user: res.data.user, jwt: res.data.jwt });
                localStorage.setItem('jwtToken', res.data.jwt)
                localStorage.setItem('userData', JSON.stringify(res.data.user))
            })
            .catch(error => { 
                isSuccess = false;
                this.dispatch('snackbar/error', error);
            })

            return isSuccess;
        }
    }
}
