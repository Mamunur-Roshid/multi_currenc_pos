export default {
    namespaced: true,

    state: () => {
        return {
            user: {
                userId: null,
                name: '',
                username: '',
                phone: '',
                email: '',
                userType: '',
            },
            jwt: null,
        }
    },

    getters: {
        user(state) {
            return state.user;
        },
    
        jwt(state) {
            if (state.jwt) return state.jwt
            else return localStorage.getItem('jwtToken')
        }
    },

    mutations: {
        setUser(state, auth) {
            state.user = auth.user;
            state.jwt = auth.jwt;
        },

        resetUser(state) {
            state.user = {
                userId: null,
                name: '',
                username: '',
                phone: '',
                email: '',
                userType: '',
            }
            state.jwt = null;
            localStorage.setItem('jwtToken', '')
            localStorage.setItem('userData', '')
            // delete this.$axios.defaults.headers.common["Authorization"];
        },
    },

    actions: {
        logout(context) {
            context.commit('resetUser');
        },
    
        redirectDashboard(context) {
            this.$router.push('/');
        }
    }
}