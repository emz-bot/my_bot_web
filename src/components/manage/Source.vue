<template>
    <n-tabs type="line">
      <n-tab-pane name="表情包" tab="表情包">
        <MemesManage/>
      </n-tab-pane>
      <n-tab-pane name="疯狂星期四" tab="疯狂星期四">
        <KFC/>
      </n-tab-pane>
      <n-tab-pane name="吃什么" tab="吃什么">
        <Food/>
      </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import {
  NTabs,
  NTabPane,
  NButton,
  NSpace,
  useMessage
} from "naive-ui";
import MemesManage from './source/MemesManage.vue'
import KFC from './source/KFC.vue'
import Food from './source/Food.vue'
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