import { createWebHashHistory, createRouter } from "vue-router";

const Index = () => import('@/components/Index.vue')
const Management = () => import('@/components/manage/Management.vue')
const Common = () => import('@/components/common/Common.vue')
const Login = () => import('@/components/Login.vue')

const router = createRouter({
    history: createWebHashHistory(),
   routes: [
    { path: '/', component: Index },
    { path: '/login', component: Login },
    { path: '/management', component: Management },
    { path: '/common', component: Common }
  ]
})

export default router;