import { Promise } from "q";

export default {
    namespaced: true,
    
    state: () => {
        return {
            text: '',
            color: '',
            show: false
        }
    },
    
    getters: {
        snackbar(state) {
            return state;
        }
    },
    
    mutations: {
        success(state, text) {
            state.text = text;
            state.color = 'green darken-4';
            state.show = true;
        },
        error(state, error) {
            state.text = error.response ? error.response.data.message : error;
            state.color = 'error';
            state.show = true;
        },
        hide(state) {
            state.show = false;
        }
    },
    
    actions: {
        async success(context, text) {
            context.commit('success', text);
            await new Promise(r => setTimeout(r, 1000));
            context.commit('hide');
        },
        async error(context, text) {
            context.commit('error', text);
            await new Promise(r => setTimeout(r, 1000));
            context.commit('hide');
        }
    }
}
