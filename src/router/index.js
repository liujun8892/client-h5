import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../pages/Home.vue'
import NotFoundComponent from "@/components/NotFoundComponent"

Vue.use(VueRouter)

const routes = [ {
    path:'*', 
    component:NotFoundComponent
  },  {
    path:'/h5/loading', 
    name:' loading', 
    component:() => import(/* webpackChunkName: "about" */'../pages/loading.vue')
  },  {
    path:'/h5/download', 
    name:'home', 
    component:() => import(/* webpackChunkName: "about" */'../pages/download.vue')
  },  {
    path:'/h5/AudioDetails', 
    name:'AudioDetails', 
    component:() => import(/* webpackChunkName: "about" */'../pages/AudioDetails.vue')
  },  {
    path:'/h5/home', 
    name:'i_home', 
    component:Home
  },  {
    path:'/h5/about', 
    name:'About', 
    component:() => import(/* webpackChunkName: "about" */'../views/About.vue')
  },  {
    path:'/h5/pay', 
    name:'pay', 
    component:() => import(/* webpackChunkName: "about" */'../pages/Pay.vue')
  },  {
    path:'/h5/share', 
    name:'Share', 
    component:() => import(/* webpackChunkName: "about" */'../pages/Share.vue')
  },  {
    path:'/h5/course', 
    name:'course', 
    meta: {
    keepAlive:true, //此组件需要被缓存
	isBack:false, //用于判断上一个页面是哪个
}, 
    component:() => import(/* webpackChunkName: "about" */'../pages/Course.vue')
  },  {
    path:'/h5/answer', 
    name:'Answer', 
    component:() => import(/* webpackChunkName: "about" */'../pages/Answer.vue')
  },  {
    path:'/h5/join', 
    name:'JoinClass', 
    component:() => import('../pages/JoinClass.vue')
  },  {
    path:'/h5/download2', 
    name:'Download2', 
    component:() => import('../pages/Download2.vue')
  },  {
    path:'/h5/article', 
    name:'Article', 
    component:() => import('../pages/Article.vue')
  }
]

const router = new VueRouter( {
  mode:'history', 
  routes
})

export default router