import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Upload from "@/components/Upload";
import Login from "@/components/Login";

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/send",
      name: "HelloWorld",
      component: HelloWorld
    },
    {
      path: "/upload",
      name: "Upload",
      component: Upload
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "*",
      redirect: '/login'
    }
  ]
});
