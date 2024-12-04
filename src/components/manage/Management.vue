<template>
  <n-layout position="absolute">
    <n-layout-header bordered>
      <n-space justify="space-between">
        <n-space>
          <n-space>
            <n-space>
              <img @click="router.push({ path: '/' })" style="height:65px; color:#fff" src="@/assets/logo.svg">
            </n-space>
            <n-space vertical size="small">
              <n-text>
                <h2>二猫子管理</h2>
              </n-text>
            </n-space>
          </n-space>
          <n-space style="padding:23px 70px">
              <n-button text @click="router.push({ path: '/management/botmanage' })">
                机器人管理
              </n-button>
              <n-button text @click="router.push({ path: '/management/blacklist' })">
                黑名单管理
              </n-button>
              <n-button text @click="router.push({ path: '/management/chatlog' })" v-if="user_permission >= 5">
                聊天记录
              </n-button>
              <n-button text @click="router.push({ path: '/management/source' })">
                资源
              </n-button>
              <n-button text @click="router.push({ path: '/management/usermanage' })" v-if="user_permission >= 100">
                用户管理
              </n-button>
              <n-button text @click="router.push({ path: '/management/activation_code' })" v-if="user_permission >= 100">
                激活码管理
              </n-button>
              <n-button text @click="router.push({ path: '/management/configmanage' })" v-if="user_permission >= 100">
                配置管理
              </n-button>
          </n-space>
        </n-space>
        <n-space style="padding:15px">
          <n-button quaternary circle @click="router.push({ path: '/common' })">
              <n-icon size="22">
                <PersonCircle />
              </n-icon>
          </n-button>
          <n-button quaternary circle @click="logout">
              <n-icon size="22">
                <LogInOutline />
              </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-layout-header>
    <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
      <!-- <n-layout-sider bordered content-style="padding: 24px;"> </n-layout-sider> -->
      <n-layout content-style="padding: 24px;">
        <n-card style="margin-bottom: 16px" v-if="user_permission >= 3">
          <router-view />
        </n-card>
      </n-layout>
    </n-layout>
    <n-layout-footer
      position="absolute"
      style="height: 64px; padding: 24px"
    >
      <a id="record" href="https://beian.miit.gov.cn"> 陕ICP备2022002093号 </a>
    </n-layout-footer>
  </n-layout>
</template>

<script setup>
import { PersonCircle, LogInOutline } from '@vicons/ionicons5'
import {
  NIcon,
  NTabs,
  NTabPane,
  NCard,
  NButton,
  NSpace,
  NText,
  useMessage,
  NLayout,
  NLayoutHeader,
  NLayoutFooter,
  NLayoutContent,
} from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";

var user_permission = ref(localStorage.user_permission);

const router = useRouter();
const message = useMessage();

function logout() {
  message.success("登出成功");
  localStorage.token = 0;
  localStorage.user_permission = 0;
  localStorage.beforeRouter = null;
  router.push({ path: "/" });
}

function check_permission() {
  if (user_permission.value < 3) {
    message.warning("地址不存在");
    router.push({ path: "/login" });
  }
}
if (router.currentRoute.value.path == "/management"){
  router.push({ path: "/management/botmanage" })
}
check_permission();
</script>
<style>
.n-card--bordered {
  width: 1150px;
  margin: 0 auto;
}
</style>