import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
// import Highcharts from "highcharts";
// import StockModule from "highcharts/modules/stock";
import HighchartsVue from 'highcharts-vue'

Vue.config.productionTip = false
// StockModule(Highcharts);
Vue.use(HighchartsVue)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
