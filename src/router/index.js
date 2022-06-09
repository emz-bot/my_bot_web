import { createWebHashHistory, createRouter } from "vue-router";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{ path: "/", component: () => import("@/components/Index.vue") },
		{ path: "/login", component: () => import("@/components/Login.vue") },
		{
			path: "/management",
			component: () => import("@/components/manage/Management.vue"),
		},
		{ path: "/common", component: () => import("@/components/common/Common.vue") },
	],
});

// 路由全局守卫
router.beforeEach((to, from) => {
	// 获取到token状态
	const isLogin = localStorage.token;
	if (!isLogin && to.path != "/login") {
		debugger
		return { path: "/login" };
	}

	return true;
});

export default router;
