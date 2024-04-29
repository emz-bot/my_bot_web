import { createWebHashHistory, createRouter } from "vue-router";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: "/", component: () => import("@/components/Index.vue") },
        { path: "/login", component: () => import("@/components/Login.vue") },
        { path: "/common/",
          component: () => import("@/components/common/Common.vue"),
          children: [
            {
              path: 'user',
              component: () => import("@/components/common/user/UserCente.vue"),
              children: [
                {
                  path: 'user_cente', 
                  component: () => import("@/components/common/user/UserCente.vue")
                },
              ]
            },
            {
              path: 'channel',
              component: () => import("@/components/common/channel/Channel.vue"),
            },
            {
              path: 'jianghu',
              component: () => import("@/components/common/jianghu/JiangHu.vue"),
            }
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
    if (!isLogin && to.path != "/login" ) {
        return { path: "/login" };
    }
    return true;
});

export default router;
