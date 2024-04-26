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
            <n-button text @click="router.push({ path: '/common/channel' })">
              频道
            </n-button>
          </n-space>
        </n-space>
        <n-space style="padding:15px">
          <n-dropdown trigger="hover" :options="user_options" @select="userHandleSelect">
            <n-badge :value="sys_message_count" :max="99">
              <n-avatar round size="medium" :src="vatar_url" />
            </n-badge>
          </n-dropdown>
        </n-space>
      </n-space>
    </n-layout-header>
    <n-layout has-sider position="absolute" style="top: 64px; bottom: 64px">
      <n-layout content-style="padding: 24px;">
        <n-card style="margin-bottom: 16px;margin: 0 auto;">
          <router-view />
        </n-card>
      </n-layout>
    </n-layout>
    <n-layout-footer position="absolute" style="height: 64px; padding: 24px">
      <a id="record" href="https://beian.miit.gov.cn"> 陕ICP备2022002093号 </a>
    </n-layout-footer>
  </n-layout>
  <n-modal
      v-model:show="sys_message_show"
      @after-leave="get_sys_message"
      title="系统消息"
      preset="dialog"
    >
      <template #action>
        <SysMsg :sys_message="sys_message"/>
      </template>
  </n-modal>
</template>

<script setup>
import { PersonCircleOutline, LogInOutline, NotificationsOutline } from '@vicons/ionicons5'
import {
  NModal,
  NBadge,
  NAvatar,
  NDropdown,
  NIcon,
  NCard,
  NButton,
  NSpace,
  NText,
  useMessage,
  NLayout,
  NLayoutHeader,
  NLayoutFooter,
} from "naive-ui";

import { ref, onMounted, provide, h, computed, watchEffect } from "vue";
import { useRouter } from "vue-router";
import WebSocketService from '@/utils/websocket';
import { get_sys_msg } from '@/utils/jianghu_api';
import SysMsg from "./channel/sysmsg/SysMsg.vue";

const vatar_url = ref(`${window.gurl.OSS_BASE_URL}jianghu/avatar/${localStorage.userid}.webp`)

var sys_message = ref([]);
var sys_message_count = ref(0);
const sys_message_show = ref(false);

const channel_message = ref({});
const wsService = ref(null);
wsService.value = new WebSocketService();
// 连接成功后发送消息
wsService.value.socket.onopen = () => {
  wsService.value.send({
    type: "connect",
    user_id: localStorage.userid,
    token: localStorage.token
  });
};
provide('channel_message', channel_message);

onMounted(() => {
  wsService.value.socket.onmessage = (event) => {
    const messageJson = JSON.parse(event.data);
    if (messageJson.type == "channel_message") {
      if (!channel_message.value[messageJson.channel_id]) {
        channel_message.value[messageJson.channel_id] = []
      }
      channel_message.value[messageJson.channel_id].push(messageJson)
    }
  };
});


const router = useRouter();
const message = useMessage();

const computedMessageCount = ref("");

watchEffect(() => {
  computedMessageCount.value = computed(() => {
    if (sys_message_count.value === 0) {
      return '消息';
    } else if (sys_message_count.value > 99) {
      return '消息 (99+)';
    } else {
      return `消息 (${sys_message_count.value})`;
    }
  });
});

const user_options = ref([
  { label: "个人中心", key: "个人中心", icon: renderIcon(PersonCircleOutline) },
  { label: "退出登录", key: "退出登录", icon: renderIcon(LogInOutline) },
  { label: computedMessageCount.value, key: "消息", icon: renderIcon(NotificationsOutline) }
]);

function userHandleSelect(key) {
  if (key == "退出登录") {
    logout();
  } else if (key == "个人中心") {
    router.push({ path: '/common/user' })
  } else if (key == "消息") {
    show_sys_message()
  }
}

function show_sys_message() {
    sys_message_show.value = true;
}

function renderIcon(icon) {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon)
    });
  };
};

function get_sys_message() {
  get_sys_msg().then(res => {
    if (res.code == 200) {
      sys_message.value = res.data
      sys_message_count.value = res.data.filter(item => item.is_read == false).length
    }
  })
}

get_sys_message()

function logout() {
  message.success("登出成功");
  localStorage.token = 0;
  localStorage.user_permission = 0;
  localStorage.beforeRouter = null;
  router.push({ path: "/" });
}

if (router.currentRoute.value.path == "/common") {
  router.push({ path: "/common/channel" })
}
</script>
<style>
.n-card--bordered {
  width: 1220px;
  margin: 0 auto;
}

@media screen and (max-width: 1000px) {
  .n-card--bordered {
    width: 100%;
  }
}
</style>