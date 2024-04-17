<template>
     <div>
    <n-tabs
    v-model:value="nameRef"
    type="card"
    closable
    tab-style="min-width: 80px;"
    @keydown="handleKeyDown"
    @close="handleClose"
  >
    <n-tab-pane
      v-for="panel in panelsRef"
      :key="panel"
      :tab="panel.toString()"
      :name="panel"
    >
      <Chat :chatRoomId="panel" />
    </n-tab-pane>
  </n-tabs>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import Chat from "./Chat.vue";
import {useMessage,NTabs,NTabPane} from "naive-ui";

const nameRef = ref(1)
const message = useMessage()
const panelsRef = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

function handleKeyDown(event) {
  console.log(event.key)
  if (event.key === 'Tab') {
    event.preventDefault(); // 阻止默认的Tab键行为
    switchTab(event.shiftKey);
  }
}

function switchTab(isShiftKey) {
  const { value: panels } = panelsRef;
  const currentIndex = panels.indexOf(nameRef.value);
  const nextIndex = isShiftKey
    ? (currentIndex - 1 + panels.length) % panels.length // 如果按下了Shift键，切换到上一个标签
    : (currentIndex + 1) % panels.length; // 否则，切换到下一个标签
  nameRef.value = panels[nextIndex];
}

function handleClose (name) {
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