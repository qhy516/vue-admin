import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import axios from 'axios'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from '../src/routes/Routes'
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(axios)

//NProgress.configure({ showSpinner: false });
Vue.prototype.axios = axios;

// axios默认配置
axios.defaults.timeout = 10000; // 超时时间
axios.defaults.baseURL = "http://localhost:9999"; // 默认地址

// axios请求拦截
axios.interceptors.request.use(
  config => {
    var user = JSON.parse(sessionStorage.getItem("user"));
    if (user != null && user.token) { // 判断是否存在token，如果存在的话，则每个http header都加上token
      config.headers.token = user.token;
      config.headers.userId = user.id;
      config.headers.companyId = user.companyId;
      config.headers.level = user.level;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  });

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    sessionStorage.removeItem('user');
  }
  let user = JSON.parse(sessionStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({
      path: '/login'
    })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')