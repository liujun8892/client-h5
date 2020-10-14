import Vue from 'vue'
import Vuex from 'vuex'
import UserInfo from "./userInfo"
import Activities from "./activities"
Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    UserInfo,
    Activities
  }
})
