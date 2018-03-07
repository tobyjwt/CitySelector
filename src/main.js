// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import pageAdjust from './common/vhomed.js';
import fastclick from 'fastclick';

Vue.config.productionTip = false;
Vue.use(pageAdjust);
// 消除手机端点击300ms延迟
fastclick.attach(document.body);
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
});
