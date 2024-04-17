<template>
  <div ref="messageContainer" style="height: 500px; overflow: auto;">
    <n-space vertical size="medium" v-for="i in messages[chatRoomId]" :key="i.id">
      <div>
        <span style="color: aquamarine;">{{ i.nickname }}</span><span style="color:cadetblue;margin-left: 10px;"> {{ i.time }}</span>
      </div>
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
import { useRouter } from "vue-router";

const router = useRouter();
const wsService = ref(null);
const message_content = ref('');
const isAtBottom = ref(true);
const chatRoomId = ref(null)

let messageContainer = ref(null);
let message_history = ref([]);
let current_history_index = ref(-1);

const messages = inject('chat_room_message');


const sendMessage = () => {
  wsService.value = new WebSocketService();
  console.log(chatRoomId.value);
  if (!message_content.value) {
    return;
  }
  if (message_content.value != message_history.value[message_history.value.length - 1]) {
    message_history.value.push(message_content.value);
  }
  current_history_index.value = message_history.value.length;
  wsService.value.send({ message: message_content.value, type: 'chat_room_message', "chat_room_id": chatRoomId.value});
  message_content.value = '';
};

function getHistoryMessage(btn_type) {s
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
watch(() => router.params, () => {
      console.log(router.currentRoute.value.params.chat_room_id);
      let chat_room_id = router.currentRoute.value.params.chat_room_id
      chatRoomId.value = chat_room_id
    }, { immediate: true });

watch(messages.value, () => {
  nextTick(() => {
    if (isAtBottom.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
});
</script>