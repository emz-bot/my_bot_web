import { createWebHashHistory, createRouter } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: () => import("@/components/Index.vue") },
        { path: "/login", component: () => import("@/components/Login.vue") },
        {
            path: "/management",
            component: () => import("@/components/manage/Management.vue"),
            children: [
                {path: 'botmanage', component: () => import("@/components/manage/BotManage.vue"),},
                {path: 'blacklist', component: () => import("@/components/manage/BlackList.vue"),},
                {path: 'chatlog', component: () => import("@/components/manage/ChatLog.vue"),},
                {path: 'source', component: () => import("@/components/manage/Source.vue"),},
                {path: 'configmanage', component: () => import("@/components/manage/ConfigManage.vue"),},
            ]
        },
        { path: "/common/",
          component: () => import("@/components/common/Common.vue"),
          children: [
            {
              path: 'j3team/:team_id',
              component: () => import("@/components/common/TeamManagement.vue"),
            },
            {
              path: 'botmanage',
              component: () => import("@/components/manage/BotManage.vue"),
            },
          ],
        },
    ],
});

// 路由全局守卫
router.beforeEach((to, from) => {
    // 获取到token状态
    const isLogin = localStorage.token;
    if (to.path != "/login"){
      localStorage.setItem("beforeRouter", to.path)
    }
    if (!isLogin && to.path != "/login") {
        debugger
        return { path: "/login" };
    }

    return true;
});

export default router;
