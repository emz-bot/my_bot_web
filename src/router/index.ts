import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: () => import("../components/Index.vue") },
    { path: "/login", component: () => import("../components/Login.vue") },
    {
      path: "/management",
      component: () => import("../components/manage/Management.vue"),
      children: [
        { path: 'botmanage', component: () => import("../components/manage/BotManage.vue"), },
        { path: 'blacklist', component: () => import("../components/manage/BlackList.vue"), },
        { path: 'chatlog', component: () => import("../components/manage/ChatLog.vue"), },
        { path: 'source', component: () => import("../components/manage/SourceManage/main.vue"), },
        { path: 'usermanage', component: () => import("../components/manage/UserManage/main.vue"), },
        { path: 'billmanage', component: () => import("../components/manage/BillManage.vue"), },
        { path: 'activation_code', component: () => import("../components/manage/ActivationCode.vue"), },
        { path: 'configmanage', component: () => import("../components/manage/ConfigManage.vue"), },
      ]
    },
    {
      path: "/common/",
      component: () => import("../components/common/Common.vue"),
      children: [
        {path: 'doc', component: () => import("../components/common/Doc.vue"),},
        {path: 'shop', component: () => import("../components/common/shop/Shop.vue"),},
        {path: 'groupmanage', component: () => import("../components/common/group_management/GroupManagement.vue"),},
        {path: 'botmanage', component: () => import("../components/manage/BotManage.vue"),},
        {path: 'j3team/:team_id', component: () => import("../components/common/TeamManagement.vue"),},
        {path: 'sand/:server', component: () => import("../components/common/Sand.vue"),},
        {path: 'ranking/:server', component: () => import("../components/common/Ranking.vue"),},
        {path: 'role_online', component: () => import("../components/common/RoleOnline.vue"),}
      ],
    },
  ],
})

// 路由全局守卫
router.beforeEach((to, from) => {
  // 获取到token状态
  const isLogin = localStorage.token;
  if (to.path != "/login") {
    localStorage.setItem("beforeRouter", to.path)
  }
  if (!isLogin && to.path != "/login" && to.path.substring(0, 11) != "/common/doc" && to.path != "/common/shop" && to.path.substring(0, 12) != "/common/sand" && to.path.substring(0, 15) != "/common/ranking") {
    return { path: "/login" };
  }
  return true;
});

export default router
