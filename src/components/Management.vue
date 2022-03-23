<template>
  <n-card style="margin-bottom: 16px">
    <n-space justify="space-between">
      <h2>二猫子管理</h2>
      <n-button quaternary circle @click="logout">
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M6 30h12a2.002 2.002 0 0 0 2-2v-3h-2v3H6V4h12v3h2V4a2.002 2.002 0 0 0-2-2H6a2.002 2.002 0 0 0-2 2v24a2.002 2.002 0 0 0 2 2z" fill="currentColor"></path><path d="M20.586 20.586L24.172 17H10v-2h14.172l-3.586-3.586L22 10l6 6l-6 6l-1.414-1.414z" fill="currentColor"></path></svg>
        </template>
      </n-button>
    </n-space>
    <n-tabs type="line">
      <n-tab-pane name="机器人管理" tab="机器人管理">
        <BotManage/>
      </n-tab-pane>
      <n-tab-pane name="黑名单管理" tab="黑名单管理">
        黑黑黑
      </n-tab-pane>
      <n-tab-pane name="聊天记录" tab="聊天记录" v-if="user_permission >= 5">
        <ChatLog/>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import {
  NTabs,
  NTabPane,
  NCard,
  NButton,
  NSpace,
  useMessage
} from "naive-ui";
import ChatLog from './ChatLog.vue'
import BotManage from './BotManage.vue'
import { ref } from "vue";
import { useRouter } from "vue-router";

var user_permission = ref(localStorage.user_permission)


const router = useRouter();
const message = useMessage();

function logout(){
  message.success("登出成功")
  localStorage.token = 0
  localStorage.user_permission = 0
  router.push({ path: "/" });
}

</script>
<style>
body {
  background: #1d1d1d;
}

.user_info {
  font-size: 8px;
}

.n-card--bordered {
  width: 50%;
  min-width:600px;
  margin: 0 auto;
}

.n-divider__title {
  font-size: 14px;
  color: darkgrey;
}
</style>