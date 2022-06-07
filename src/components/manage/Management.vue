<template>
  <n-card style="margin-bottom: 16px" v-if="user_permission >= 3">
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
        <BlackList/>
      </n-tab-pane>
      <n-tab-pane name="聊天记录" tab="聊天记录" v-if="user_permission >= 5">
        <ChatLog/>
      </n-tab-pane>
      <n-tab-pane name="表情包" tab="表情包" v-if="user_permission >= 5">
        <MemesManage/>
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
import MemesManage from './MemesManage.vue'
import ChatLog from './ChatLog.vue'
import BotManage from './BotManage.vue'
import BlackList from './BlackList.vue'
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

function check_permission(){
  if (user_permission.value < 3){
    message.warning("地址不存在")
    router.push({ path: "/login" })
  }
}
check_permission()

</script>
<style>
.n-card--bordered {
  width: 800px;
  margin: 0 auto;
}
</style>