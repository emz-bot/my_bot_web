import { createWebHistory, createRouter } from "vue-router";
import Management from "@/components/Management.vue";
import Login from "@/components/Login.vue";
import Index from "@/components/Index.vue";

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Index
    },
    {
      path: '/index/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index/management',
      name: 'Management',
      component: Management
    }
  ]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;