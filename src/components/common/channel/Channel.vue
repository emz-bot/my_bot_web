<template>
  <n-space>
    <n-button @click="">搜索</n-button>
    <n-button type="success" quaternary circle @click="showModal = true" style="margin-bottom: 10px;">
      <n-icon size="22">
        <Add />
      </n-icon>
    </n-button>
    <n-modal v-model:show="showModal">
    <n-card
      style="width: 600px"
      title="创建频道"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >

      <n-input v-model:value="channelName" placeholder="请输入频道名称"></n-input>
      <template #footer>
        <div style="display: flex; justify-content: flex-end;">
        <n-space>
          <n-button  @click="api_create_channel">确定</n-button>
          <n-button  @click="handleCancel">取消</n-button>
        </n-space>
      </div>
      <loading-spinner v-if="isLoading"></loading-spinner>
      </template>
    </n-card>
  </n-modal>
  </n-space>
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
import { Add } from '@vicons/ionicons5'
import { ref, inject, watch, onMounted } from 'vue';
import Chat from "./Chat.vue";
import { useMessage, NButton, NSpace, NScrollbar,NIcon,NCard,NModal,NInput,LoadingSpinner} from "naive-ui";
import { create_channel } from '@/utils/jianghu_api';



const messages = inject('channel_message');
const showModal= ref(false)
const channelName = ref('')
const nameRef = ref(1)
const message = useMessage()
const selectedPanel = ref(null)
const panelsRef = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])


let isLoading = ref(false)

async function api_create_channel(){
    isLoading.value = true
    await create_channel({"channel_name": channelName.value}).then((res) => {
    if (res.code == 200) {
      message.success('创建成功')
      showModal.value = false
    } else {
      console.log(res.msg)
    }
    isLoading.value = false
  }).catch((error) => {
    console.error(error)
    isLoading.value = false
  });
}

function handleCancel() {
  showModal.value = false
}

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
  if (panelsRef.value.length === 0) {
    message.error('没有频道')
    return
  }
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