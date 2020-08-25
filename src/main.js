import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import qs from 'qs'
import * as $apis from './common/apis/index.js'
import {
  GetQueryString
} from '@/common/utils/mixin.js'
import loadings from './assets/images/loading.gif'
import {
  NavBar,
  Toast,
  Lazyload,
  Dialog
} from 'vant';
import '@/assets/css/rest.css'

import VueTouch from 'vue-touch'

Vue.config.productionTip = false
Vue.prototype.$api = $apis;
Vue.prototype.$dalog = Dialog;

Vue.prototype.$GetQueryString = GetQueryString;
Vue.prototype.$iconURL = "https://file.qingtingshuxia.com/"; //网络资源地址
Vue.use(Lazyload, {
  error: '@/assets/images/loadfail.png', //报错需要的图片
  loading: loadings // 替换需要的图片
})
Vue.use(VueTouch, {
  name: 'v-touch'
})

Vue.use(NavBar);
// Vue.use(Toast);
Vue.prototype.$toast = Toast;

router.beforeEach((to, from, next) => {
  function redirectUrl() {
    const url = window.location.href;
    // 解决多次登录url添加重复的code与state问题 
    const urlParams = qs.parse(url.split("?")[1]);
    let redirectUrl = url;
   
    // debugger
    if (urlParams.code) {
      store.dispatch('saveCode', GetQueryString('code'))
      delete urlParams.code;
      const query = qs.stringify(urlParams);
      if (query.length) {
        redirectUrl = `${url.split("?")[0]}?${query}`;
      } else {
        redirectUrl = `${url.split("?")[0]}`;
      }
      window.location.replace(redirectUrl)
    } else {
      next()
    }
  }
  if (to.path == '/h5/download') {
    next()
    return;
  }
  console.log(store.state.UserInfo.code,11);
  console.log(localStorage.getItem('code'));
  // console.log(GetQueryString('code'));

  if (GetQueryString('code')) {
    redirectUrl()
  } else if (store.state.UserInfo.code || localStorage.getItem('code')) {
    next()
    return false;
  } else if (store && !store.state.UserInfo.code || !localStorage.getItem('code')) {
    if (window.location.href.indexOf('answer') != -1) {
      window.location.href = store.state.UserInfo.baseURL.test + '/api/shareIndex?view=questionnaire';
    } else if(window.location.href.indexOf('article')!=-1){
      window.location.href = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=article&article_id=' + GetQueryString('article_id');
  }else {
    let url = store.state.UserInfo.baseURL.test+'/api/shareIndex?view=h5login&course_id=' + GetQueryString('course_id');
    if(GetQueryString('invite')){
        url = url+ "&invite=" + GetQueryString('invite')
    }
    window.location.href = url;
    }
  }
});
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')