import Vue from 'vue';
import Router from 'vue-router';
import index from '@/components/page/index.vue';
import cityList from '@/components/page/cityList.vue';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            meta: {
                hasBack: false
            },
            component: index
        },
        {
            path: '/cityList',
            name: 'cityList',
            meta: {
                hasBack: true
            },
            component: cityList
        }
    ]
});
