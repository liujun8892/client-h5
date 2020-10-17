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
  Dialog,
  Area,
  Popup
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
Vue.use(Area);
Vue.use(Popup);
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
      // store.dispatch('saveToken', GetQueryString('code'))
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
  // if (to.path == '/h5/activityIndex') {
  //   next()
  //   return;
  // }
  // console.log(store.state.UserInfo.code,11);
  // console.log(localStorage.getItem('code'));
  // console.log(GetQueryString('code'));

  if (GetQueryString('code')) {
    redirectUrl()
  } else if (store.state.UserInfo.code || localStorage.getItem('code')) {
    next()
    return false;
  } else if (store && !store.state.UserInfo.code || !localStorage.getItem('code')) {
    console.log(1111111)
    let url = window.location.href;
    let indexBegin = url.indexOf('h5/');
    let indexEnd = url.indexOf('?');
    let str = url.slice(indexBegin+3,indexEnd)
    let urlParams='';
    switch(str){
      case 'answer':
        urlParams='questionnaire'
        break;
      case 'article':
        urlParams='article&relation_id=' + GetQueryString('article_id')
        break;
      case 'userPostDetail':
        urlParams='userPostDetail&relation_id=' + GetQueryString('post_id')
        break;  
      case 'userTopicDetail':
        urlParams='userTopicDetail&relation_id=' + GetQueryString('topic_id');
        break;  
      case 'woodsDetail':
        urlParams='woodsDetail&relation_id=' + GetQueryString('woods_id');
        break; 
      case 'notice':
        urlParams='notice&relation_id=' + GetQueryString('notice_id');
        break;
      case 'woodsPost':
        urlParams='woodsPost&relation_id=' + GetQueryString('woods_post_id');
        break;
      case 'thing':
        urlParams='thing&relation_id=' + GetQueryString('thing_id');
        break;
      case 'activityIndex':
          urlParams='activityIndex&relation_id=' + GetQueryString('activity_id');
        break;
      case 'activities':
          urlParams='activities&relation_id=' +  GetQueryString('relation_id');
        break;
      case 'activitiesPay':
        urlParams = 'activitiesPay' + "&relation_id=" + GetQueryString('relation_id') + "&gift_id=" + GetQueryString('gift_id');
        if(GetQueryString('invite')){
          urlParams = urlParams+ "&invite=" + GetQueryString('invite')
        }
      break;
      default:
        urlParams='h5login&relation_id=' + GetQueryString('course_id');
        if(GetQueryString('invite')){
          urlParams = urlParams+ "&invite=" + GetQueryString('invite')
        }
        break;
    }
    //  window.location.href = store.state.UserInfo.baseURL.test + '/api/shareIndex?view=' + urlParams;
    window.location.href = store.state.UserInfo.baseURL.production+'/api/shareIndex?view='+urlParams;
  }
});
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')