<template>
  <div ref="messageContainer" style="height: 500px; overflow: auto;">
    <n-space style="margin-left: 20px;" vertical size="medium" v-for="i in messages[props.chatRoomId]" :key="i.id">
      <n-space>
        <n-space>
          <n-avatar size="medium" :src="avatarbase_url + i.user_info._id + '.webp'" />
        </n-space>
        <n-space vertical size="small">
          <div style="margin-left: 10px;">
            <div style="color: cadetblue;"> {{ i.time }}</div>
            <div><span :style="{ color: i.user_info._id === self_id ? 'aquamarine' : 'darkcyan' }">
              {{ i.user_info.nickname }}( {{ i.user_info._id }} )
            </span></div>
          </div>
        </n-space>
      </n-space>
      <div style="padding-left: 20px;" class="channel_msg">
        <span v-html="formatMessage(i.message)"></span>
      </div>
      <br>
    </n-space>
  </div>
  <div style="margin-left: 20px;">
    <n-input
      ref="inputRef"
      v-model:value="message_content"
      type="textarea"
      placeholder="请输入消息内容"
      @keydown="handleKeyDown"
    />
    <n-button @click="sendMessage">发送 (Ctrl+Enter)</n-button>
  </div>
</template>

<script setup>
import { ref, inject, watch, nextTick, onMounted, defineProps, onUpdated } from 'vue';
import WebSocketService from '@/utils/websocket';
import { NInput, NButton, NSpace, NAvatar } from "naive-ui";

const avatarbase_url = ref(`${window.gurl.OSS_BASE_URL}jianghu/avatar/`)
const self_id = ref(localStorage.userid);

const wsService = ref(null);
const message_content = ref('');
const isAtBottom = ref(true);

let messageContainer = ref(null);
let message_history = ref([]);
let current_history_index = ref(-1);

const messages = inject('channel_message');
const inputRef = ref(null);
const props = defineProps({
  chatRoomId: Number
})

const sendMessage = () => {
  wsService.value = new WebSocketService();
  if (!message_content.value) {
    return;
  }
  if (message_content.value != message_history.value[message_history.value.length - 1]) {
    message_history.value.push(message_content.value);
  }
  current_history_index.value = message_history.value.length;
  wsService.value.send({ message: message_content.value, type: 'channel_message', "channel_id": props.chatRoomId});
  message_content.value = '';
};

function getHistoryMessage(btn_type) {
    if (btn_type === 'ArrowUp' && current_history_index.value > 0) {
      current_history_index.value--;
    } else if (btn_type === 'ArrowDown' && current_history_index.value < message_history.value.length - 1){
      current_history_index.value++;
    }
    message_content.value = message_history.value[current_history_index.value];
  }

function handleKeyDown(event) {
  if (event.key === 'Enter' && event.ctrlKey) {
    sendMessage();
  } else if (event.key === 'ArrowUp') {
    getHistoryMessage('ArrowUp');
  } else if (event.key === 'ArrowDown') {
    getHistoryMessage('ArrowDown');
  }
}

function formatMessage(message) {
  return message.replace(/\n/g, '<br/>');
}

onMounted(() => {
  inputRef.value.focus();
});

onUpdated(() => {
  inputRef.value.focus();
});

onMounted(() => {
  messageContainer.value.onscroll = () => {
    isAtBottom.value = messageContainer.value.scrollTop + messageContainer.value.clientHeight === messageContainer.value.scrollHeight;
  };
});

watch(messages.value, () => {
  nextTick(() => {
    if (isAtBottom.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
});
</script>
<style scoped>
.channel_msg >>> img {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}
</style>