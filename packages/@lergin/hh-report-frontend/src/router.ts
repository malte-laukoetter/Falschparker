import Vue from 'vue'
import Router from 'vue-router'
import { auth } from 'firebase/app'
import 'firebase/auth'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/send',
      name: 'Send',
      beforeEnter: (to, from, next) => {
        if (auth().currentUser) {
          next()
        } else {
          next('/login')
        }
      },
      component: () => import(/* webpackChunkName: "send" */ './views/Send.vue')
    },
    {
      path: '/upload',
      name: 'Upload',
      beforeEnter: (to, from, next) => {
        if (auth().currentUser) {
          next()
        } else {
          next('/login')
        }
      },
      component: () => import(/* webpackChunkName: "upload" */ './views/Upload.vue')
    },
    {
      path: '/login',
      name: 'Login',
      beforeEnter: (to, from, next) => {
        if(auth().currentUser) {
          next(false)
        } else {
          next()
        }
      },
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue')
    },
    {
      path: '*',
      beforeEnter: (to, from, next) => {
        if (auth().currentUser) {
          next('/upload')
        } else {
          next('/login')
        }
      }
    }
  ]
})
