import Vue from 'vue'
import Vuex from 'vuex'
import UserInfo from "./userInfo"
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    UserInfo
  }
})
