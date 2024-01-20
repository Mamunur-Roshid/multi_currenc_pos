import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import VueApexCharts from 'vue-apexcharts'
import helper from '../mixins/helper';
Vue.use(Vuetify);
Vue.use(VueApexCharts);
Vue.mixin(helper);

export default new Vuetify({
    // theme: {
    //     success: {
    //         lighter: '#E9FCD4',
    //         light: '#AAF27F',
    //         main: '#54D62C',
    //         dark: '#229A16',
    //         darker: '#08660D',
    //     }
    // },
    theme: {
      // dark: true,
        themes: {
          light: {
            // primary: '#54D62C',
            primary: '#522EA8',
            secondary: '#522EA8',
            accent: '#8c9eff',
            error: '#b71c1c',
          },
        },
    },

});
