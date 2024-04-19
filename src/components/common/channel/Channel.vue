<template>
  <n-space style="display: flex;">
    <n-scrollbar style="max-height: 600px">
      <div style="width: 100px;">
        <n-space vertical>
          <n-button v-for="(panel, index) in panelsRef" :key="index" @click="handleClick(panel)"
            :class="{ 'active-button': selectedPanel === panel }"
            style="width: 100px; text-overflow: ellipsis; white-space: nowrap;">{{ panel }}</n-button>
        </n-space>
      </div>
    </n-scrollbar>
    <div style="width: 400px;">
      <Chat :chatRoomId="selectedPanel" />
    </div>
  </n-space>
</template>

<style scoped>
.active-button {
  background-color: rgb(51, 56, 53) !important;
}
</style>

<script setup>
import { ref, inject, watch, onMounted } from 'vue';
import Chat from "./Chat.vue";
import { useMessage, NButton, NSpace, NScrollbar } from "naive-ui";



const messages = inject('channel_message');

const nameRef = ref(1)
const message = useMessage()
const selectedPanel = ref(null)
const panelsRef = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])




function handleClick(panel) {
  selectedPanel.value = panel
}

function handleKeyDown(event) {
  if (event.key === 'Tab') {
    event.preventDefault(); // 阻止默认的Tab键行为
    switchTab(event.shiftKey);
  }
}

onMounted(() => {
  selectedPanel.value = panelsRef.value[0]
})

function switchTab(isShiftKey) {
  const { value: panels } = panelsRef;
  const currentIndex = panels.indexOf(nameRef.value);
  const nextIndex = isShiftKey
    ? (currentIndex - 1 + panels.length) % panels.length // 如果按下了Shift键，切换到上一个标签
    : (currentIndex + 1) % panels.length; // 否则，切换到下一个标签
  nameRef.value = panels[nextIndex];
}

watch(messages.value, () => {
  console.log('messages.value', messages.value[selectedPanel.value])
});

function handleClose(name) {
  const { value: panels } = panelsRef
  if (panels.length === 1) {
    message.error('最后一个了')
    return
  }
  message.info('关掉 ' + name)
  const index = panels.findIndex((v) => name === v)
  panels.splice(index, 1)
  if (nameRef.value === name) {
    nameRef.value = panels[index]
  }
}
</script>