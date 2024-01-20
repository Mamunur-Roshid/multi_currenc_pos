import _ from 'lodash'
export default {
    namespaced: true,

    state: () => {
        return {
            loadingAttendance: false,
            attendances: [],
        }
    },

    getters: {
        loadingAttendance(state) {
            return state.loadingAttendance;
        },

        attendances(state) {
            if (_.isArray(state.attendances)) {
                return state.attendances.map((item, sl) => {
                    item.sl = sl + 1;
                    return item;
                });
            }
            return [];
        },
    },

    mutations: {
        loadingAttendance(state, isLoading) {
            state.loadingAttendance = isLoading;
        },

        setAttendance(state, attendances) {
            state.attendances = attendances;
        },
    },

    actions: {
        async getAttendance(context, payload) {
            context.commit('loadingAttendance', true);

            let attendances = await axios.post(`${this.state.host}/get-attendances`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.attendances;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('setAttendance', attendances);

            context.commit('loadingAttendance', false);
        },

        async saveAttendance(context, attendance) {
            let isSuccess = false;
            let url = 'add-attendance';

            if(attendance.id != null) {
                url = 'update-attendance';
            }

            await axios.post(`${this.state.host}/${url}`, attendance, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                context.dispatch('getAttendance');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteAttendance(context, id) {
            await axios.delete(`${this.state.host}/delete-attendance/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getAttendance');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        }
    }
}
