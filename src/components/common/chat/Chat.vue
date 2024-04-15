<template>
  <div ref="messageContainer" style="height: 500px; overflow: auto;">
    <n-space vertical size="medium" v-for="i in messages" :key="i.id">
      <span style="color: aquamarine;">{{ i.time }} {{ i.nickname }}</span>
      <div style="padding-left: 20px;">
        <span v-html="formatMessage(i.message)"></span>
      </div>
      <br>
    </n-space>
  </div>
  <n-input
    v-model:value="message_content"
    type="textarea"
    placeholder="请输入消息内容"
    @keydown="handleKeyDown"
  />
  <n-button @click="sendMessage">发送 (Ctrl+Enter)</n-button>
</template>

<script setup>
import { ref, inject, watch, nextTick, onMounted } from 'vue';
import WebSocketService from '@/utils/websocket';
import { NInput, NButton, NSpace } from "naive-ui";

const wsService = ref(null);
const message_content = ref('');
const isAtBottom = ref(true);

let messageContainer = ref(null);
let message_history = ref([]);
let current_history_index = ref(-1);

const messages = inject('chat_room_message');

wsService.value = new WebSocketService();


const sendMessage = () => {
  if (!message_content.value) {
    return;
  }
  if (message_content.value != message_history.value[message_history.value.length - 1]) {
    message_history.value.push(message_content.value);
  }
  current_history_index.value = message_history.value.length;
  wsService.value.send({ message: message_content.value, type: 'chat_room_message', "chat_room_id": 1});
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
  messageContainer.value.onscroll = () => {
    isAtBottom.value = messageContainer.value.scrollTop + messageContainer.value.clientHeight === messageContainer.value.scrollHeight;
    console.log(isAtBottom.value);
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