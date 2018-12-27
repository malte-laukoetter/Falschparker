import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/send',
      name: 'Send',
      component: () => import(/* webpackChunkName: "send" */ './views/Send.vue')
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import(/* webpackChunkName: "upload" */ './views/Upload.vue')
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '*',
      redirect: '/login'
    }
  ]
})
