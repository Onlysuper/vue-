// pc端入口文件
import Vue from 'vue'
import App from './index.vue'
import router from '@src/routerPc';
/*-----------------------------------------------------*/
Vue.config.productionTip = false
new Vue({
    // router,
    render: h => h(App)
}).$mount('#app') 
