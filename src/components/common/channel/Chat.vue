<template>
  <div ref="messageContainer" style="height: 500px; overflow: auto;">
    <n-space style="margin-left: 20px;" vertical size="medium" v-for="i in messages[props.chatRoomId]" :key="i.id">

      <n-space class="msg">
        <n-space>
          <n-avatar size="medium" :src="avatarbase_url + i.user_info._id + '.webp'"
            fallback-src="https://oss.ermaozi.cn/jianghu/default.webp" />
        </n-space>
        <n-space vertical style="max-width: 100%;margin-bottom: 20px;">
          <n-space>
            <div style="display: flex; align-items: center; max-width: 100%;">
              <span :style="{ color: i.user_info._id == self_id ? 'aquamarine' : 'darkcyan', fontSize: 'small' }">
                {{ i.user_info.nickname }}
              </span>
              <div class="msg_time" :style="{ color: 'cadetblue', marginLeft: '10px' }">
                {{ new Date(i.time * 1000).toLocaleString() }}
              </div>
            </div>
          </n-space>
          <n-space style="max-width: 320px; margin-top: -5px;">
            <div class="channel_msg bubble" v-html="i.message" />
          </n-space>
        </n-space>
        <n-space>
        </n-space>
      </n-space>
    </n-space>
  </div>
  <div style="margin-left: 20px;">
    <n-input ref="inputRef" v-model:value="message_content" type="textarea" placeholder="请输入消息内容"
      @keydown="handleKeyDown" />
    <div style="margin-top: 10px; display: flex; justify-content: flex-end;align-items: center;">
      <n-checkbox v-model:checked="is_markdown" size="medium" label="MarkDown" />
      <n-button @click="sendMessage">发送 (Ctrl+Enter)</n-button>
    </div>
  </div>
</template>

<style scoped>
.bubble {
  position: relative;
  background: #2c2929; 
  border-radius: 0.4em;
  padding: 10px;
}

.bubble:after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: -10;
  height: 0;
  border: 20px solid transparent;
  border-right-color: #000000;
  border-left: 0;
  border-right: 0;
  margin-top: -10px;
  margin-left: -10px;
}
.channel_msg :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.channel_msg {
  margin-top: 0px;
}

.msg_time {
  opacity: 0;
  transition: opacity 0.3s;
}

.msg:hover .msg_time {
  opacity: 1;
}
</style>


<script setup>
import { ref, inject, watch, nextTick, onMounted, defineProps, onUpdated } from 'vue';
import WebSocketService from '@/utils/websocket';
import { NInput, NButton, NSpace, NAvatar, NCheckbox } from "naive-ui";
import marked from 'marked';

const avatarbase_url = ref(`${window.gurl.OSS_BASE_URL}jianghu/avatar/`)
const self_id = ref(Number(localStorage.userid));

const wsService = ref(null);
const message_content = ref('');
const isAtBottom = ref(true);
const is_markdown = ref(false);

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
  let send_message = ""
  if (is_markdown.value) {
    send_message = marked(message_content.value);
  } else {
    send_message = formatMessage(message_content.value);
  }
  wsService.value.send({ message: send_message, type: 'channel_message', "channel_id": props.chatRoomId });
  message_content.value = '';
};

function getHistoryMessage(btn_type) {
  if (btn_type === 'ArrowUp' && current_history_index.value > 0) {
    current_history_index.value--;
  } else if (btn_type === 'ArrowDown' && current_history_index.value < message_history.value.length - 1) {
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

onUpdated(() => {
  inputRef.value.focus();
});


let storedMessages = localStorage.getItem('messages');
if (storedMessages) {
  messages.value = JSON.parse(storedMessages);
}

onMounted(() => {
  const observer = new MutationObserver(() => {
    if (isAtBottom.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
  });
  observer.observe(messageContainer.value, { childList: true });
  messageContainer.value.onscroll = () => {
    isAtBottom.value = messageContainer.value.scrollTop + messageContainer.value.clientHeight === messageContainer.value.scrollHeight;
  };
});

watch(messages.value, () => {
  nextTick(() => {
    let messagesJson = JSON.stringify(messages.value);
    // 检查 JSON 字符串的大小是否超过 1MB
    if (new Blob([messagesJson]).size > 1024 * 1024) {
      // 如果超过 1MB，删除最旧的消息，直到大小小于 1MB
      while (new Blob([messagesJson]).size > 1024 * 1024) {
        messages.value.shift();
        messagesJson = JSON.stringify(messages.value);
      }
    }
    localStorage.setItem('messages', messagesJson);
  });
});
</script>