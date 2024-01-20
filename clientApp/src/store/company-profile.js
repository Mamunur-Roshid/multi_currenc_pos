export default {
    namespaced: true,

    state: () => ({
        company: null,
    }),

    getters: {
        company: state => state.company,
    },

    mutations: {
        changeCompanyProfile: (state, payload) => state.company = payload,    
    },

    actions: {
        async getCompanyProfile(context) {
            await axios.get(`${this.state.host}/get-company-profile`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('changeCompanyProfile', res.data.company_profile);
            })
            .catch(error => this.dispatch('snackbar/error', error.message))
        },

        async saveCompanyProfile(context, { company, image }) {
            let isSuccess = false
            let url = 'update-company-profile';

            let fd = new FormData();
            fd.append('company', JSON.stringify(company));

            if(image != null && image != undefined) {
                fd.append('image', image);
            }

            await axios.post(`${this.state.host}/${url}`, fd, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            }).then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
                context.dispatch('getCompanyProfile');
            }).catch(err => {
                isSuccess = false;
                this.dispatch('snackbar/error', err.response.data.message);
            })

            return isSuccess;
        },
    }
}
