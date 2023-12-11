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
                <h2>二猫子机器人</h2>
              </n-text>
            </n-space>
          </n-space>
          <n-space style="padding:23px 70px">
              <n-button text @click="router.push({ path: '/common/botmanage' })" v-if="user_permission >= 1">
                机器人管理
              </n-button>
              <n-button text @click="router.push({ path: '/common/j3team/0' })" v-if="user_permission >= 1">
                团队大厅
              </n-button>
              <n-dropdown trigger="hover" :options="options" @select="sandHandleSelect">
                <n-button text @click="router.push({ path: '/common/sand/破阵子' })">
                  沙盘
                </n-button>
              </n-dropdown>
              <n-dropdown trigger="hover" :options="options" @select="rankingHandleSelect">
                <n-button text @click="router.push({ path: '/common/ranking/破阵子' })">
                  战功榜
                </n-button>
              </n-dropdown>
              <!-- <n-button text @click="router.push({ path: '/common/shop' })">
                商店
              </n-button> -->
          </n-space>
        </n-space>
        <n-space style="padding:15px">
          <n-button quaternary circle @click="router.push({ path: '/management' })" v-if="user_permission >= 3">
              <n-icon size="22">
                <PersonCircleOutline />
              </n-icon>
          </n-button>
          <n-button quaternary circle @click="logout" v-if="user_permission >= 1">
              <n-icon size="22">
                <LogInOutline />
              </n-icon>
          </n-button>
        </n-space>
      </n-space>
    </n-layout-header>
    <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
      <n-layout-sider bordered content-style="padding: 24px;"> </n-layout-sider>
      <n-layout content-style="padding: 24px;">
        <n-card style="margin-bottom: 16px;width: 1150px;margin: 0 auto;">
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
import { PersonCircleOutline, LogInOutline } from '@vicons/ionicons5'
import {
  NDropdown,
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

const options = ref([
  {label: "破阵子", key: "破阵子"},
  {label: "唯我独尊", key: "唯我独尊"},
  {label: "天鹅坪", key: "天鹅坪"},
  {label: "梦江南", key: "梦江南"},
  {label: "斗转星移", key: "斗转星移"},
  {label: "幽月轮", key: "幽月轮"},
  {label: "绝代天骄", key: "绝代天骄"},
  {label: "龙争虎斗", key: "龙争虎斗"},
  {label: "蝶恋花", key: "蝶恋花"},
  {label: "长安城", key: "长安城"},
  {label: "剑胆琴心", key: "剑胆琴心"},
  {label: "乾坤一掷", key: "乾坤一掷"},
  {label: "飞龙在天", key: "飞龙在天"},
  {label: "青梅煮酒", key: "青梅煮酒"},
])

function sandHandleSelect(key) {
  router.push({ path: '/common/sand/'+key })
}

function rankingHandleSelect(key) {
  router.push({ path: '/common/ranking/'+key })
}

function logout() {
  message.success("登出成功");
  localStorage.token = 0;
  localStorage.user_permission = 0;
  localStorage.beforeRouter = null;
  router.push({ path: "/" });
}

if (router.currentRoute.value.path == "/common"){
  router.push({ path: "/common/botmanage" })
}
</script>
<style>
</style>