<template>
  <n-space>
    <n-input type="text" v-model:value="searchTerm" @keyup.enter="search" placeholder="搜索..." style="width: 50px;" />
    <n-button type="success" quaternary circle @click="showModal = true" style="margin-bottom: 10px;">
      <n-icon size="22">
        <Add />
      </n-icon>
    </n-button>
    <n-modal v-model:show="showModal">
      <div style="position: relative;">

        <n-card style="width: 600px" title="创建频道" :bordered="false" size="huge" role="dialog" aria-modal="true">

          <n-input v-model:value="channelName" placeholder="请输入频道名称"></n-input>
          <template #footer>
            <div style="display: flex; justify-content: flex-end;">
              <n-space>
                <n-button @click="api_create_channel">确定</n-button>
                <n-button @click="handleCancel">取消</n-button>
              </n-space>
            </div>
          </template>
        </n-card>
        <n-spin v-if="isLoading"
          style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></n-spin>
      </div>
    </n-modal>
  </n-space>
  <n-space style="display: flex;">
    <n-scrollbar style="max-height: 600px">
      <div style="width: 100px;">
        <n-space vertical>
          <div v-for="(panel, index) in panelsRef" :key="index" class="panel-button"
            style="display: flex; align-items: center; position: relative;">
            <n-button @click="handleClick(panel.channel_id)" :class="{ 'active-button': selectedPanel === panel.channel_id }"
              style="width: 100%; text-overflow: ellipsis; white-space: nowrap;">{{ panel.channel_name }}</n-button>
            <n-button class="close-button" @click="handleClose(panel.channel_id)" text
              style="padding: 5px; visibility: hidden; position: absolute; right: 0; top: 50%; transform: translateY(-50%);">
              <n-icon>
                <CloseOutline />
              </n-icon>
            </n-button>
          </div>
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

.panel-button:hover .close-button {
  visibility: visible !important;
}
</style>

<script setup>
import { Add } from '@vicons/ionicons5'
import { ref, inject, watch, onMounted } from 'vue';
import Chat from "./Chat.vue";
import { useMessage, NButton, NSpace, NScrollbar, NIcon, NCard, NModal, NInput, NSpin, NTooltip } from "naive-ui";
import { CloseOutline } from '@vicons/ionicons5'
import { create_channel, get_channel_list } from '@/utils/jianghu_api';



const messages = inject('channel_message');
const showModal = ref(false)
const channelName = ref('')
const nameRef = ref(1)
const message = useMessage()
const selectedPanel = ref(null)
const panelsRef = ref([])
const isLoading = ref(false)
const searchTerm = ref('');

async function api_create_channel() {
  isLoading.value = true
  try {
    const res = await create_channel({ "channel_name": channelName.value });
    if (res.code == 200) {
      message.success('创建成功')
      showModal.value = false
    } else {
      console.log(res.msg)
    }
  } catch (error) {
    console.error(error)
    message.error('请求失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
}


function search() {
  const searchValue = Number(searchTerm.value);
  const panel = panelsRef.value.find(p => p === searchValue);
  console.log( searchValue,panelsRef.value, panel);
  if (panel) {
    handleClick(panel);
  } else {
    console.log('未找到匹配的聊天室');
  }
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

const fetchChannelList = async () => {
      const res = await get_channel_list()
      if (res.code === 200) {
        console.log(res.data)
        panelsRef.value = res.data
      } else {
        console.log(res.msg)
      }
    }

onMounted(() => {
  fetchChannelList()
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
  // message.info('关掉 ' + name)
  const index = panels.findIndex((v) => name === v)
  panels.splice(index, 1)
  if (nameRef.value === name) {
    nameRef.value = panels[index]
  }
}
</script>