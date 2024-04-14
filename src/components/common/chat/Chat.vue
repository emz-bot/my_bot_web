<template>
  <div>
    <ul>
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
    <n-input
      v-model:value="message_content"
      type="textarea"
      placeholder="请输入消息内容"
      @keydown.ctrl.enter="sendMessage"
    />
    <n-button @click="sendMessage">发送 (Ctrl+Enter)</n-button>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import WebSocketService from '@/utils/websocket';
import { NInput, NButton } from "naive-ui";

const wsService = ref(null);
const message_content = ref('');

const messages = inject('chat_room_message');

wsService.value = new WebSocketService();

const init = () => {
  wsService.value.send({ message: "", type: ''});
};

init()

const sendMessage = () => {
  wsService.value.send({ message: message_content.value, type: 'chat_room_message', "chat_room_id": 1});
  message_content.value = '';
};
</script>