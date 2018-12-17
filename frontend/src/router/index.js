import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Upload from "@/components/Upload";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/send',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/',
      name: 'Upload',
      component: Upload
    }
  ]
})
