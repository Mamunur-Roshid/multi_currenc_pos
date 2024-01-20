export default {
    namespaced: true,

    state: () => {
        return {
            loadingEmployees: false,
            employees: [],
            code: '',
            salarySheets: []
        }
    },

    getters: {
        loadingEmployees(state) {
            return state.loadingEmployees;
        },

        employees(state) {
            return state.employees.map(item => {
                item.display_text = `${item.emp_id} - ${item.name}`;
                return item;
            });
        },

        code(state) {
            return state.code;
        },

        salarySheets(state) {
            return state.salarySheets;
        }
    },

    mutations: {
        loadingEmployees(state, isLoading) {
            state.loadingEmployees = isLoading;
        },

        setEmployees(state, employees) {
            state.employees = employees;
        },

        setEmployeeId(state, code) {
            state.code = code;
        },

        setSalarySheet(state, salary) {
            state.salarySheets = salary;
        }
    },

    actions: {
        async generateEmployeeCode(context) {
            await axios.get(`${this.state.host}/generate-employee-code`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.commit('setEmployeeId', res.data.code);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })
        },

        async getEmployees(context, payload) {
            context.commit('loadingEmployees', true);

            let employees = await axios.post(`${this.state.host}/get-employees`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.employees;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('loadingEmployees', false);
            context.commit('setEmployees', employees);
        },

        async saveEmployee(context, {employee, image, signature, nominee}) {
            let isSuccess = false;
          
            let url = '';
            if(employee.id != null) {
                url = 'update-employee';
            } else {
                url = 'add-employee';
                delete employee.id;
            }

            let fd = new FormData();

            fd.append("employee", JSON.stringify(employee));

            if(image != null && image != undefined) {
                fd.append("image", image);
            }
            if (signature != null && signature != undefined) {
                fd.append("signature", signature);
            }
            if (nominee != null && nominee != undefined) {
                fd.append("nominee", nominee);
            }

            await axios.post(`${this.state.host}/${url}`, fd, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                isSuccess = true;
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                isSuccess = false;
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async deleteEmployee(context, id) {
            await axios.delete(`${this.state.host}/delete-employee/${id}`, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                context.dispatch('getEmployees');
                this.dispatch('snackbar/success', res.data.message);
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            });
        },

        async salaryGenerate(context, payload) {
            let isSuccess = false;
          
            let url = '';
            if(payload.salary.id != null) {
                url = 'update-salary-generate';
            } else {
                url = 'salary-generate'
                delete payload.salary.id;
            }

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
                isSuccess = false;
                this.dispatch('snackbar/error', error);
            });

            return isSuccess;
        },

        async getSalarySheet(context, payload) {
            context.commit('loadingEmployees', true);

            let salary = await axios.post(`${this.state.host}/get-salary-sheets`, payload, {
                headers: {
                    'Authorization': this.getters['authorized/jwt']
                }
            })
            .then(res => {
                return res.data.sheets;
            })
            .catch(error => {
                this.dispatch('snackbar/error', error);
            })

            context.commit('loadingEmployees', false);
            context.commit('setSalarySheet', salary);
        }
    }
  }

