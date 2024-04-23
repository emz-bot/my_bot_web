<template>
  <n-space>
    <n-input type="text" v-model:value="searchTerm" @keyup.enter="search" placeholder="搜索..." style="width: 150px;" />
    <n-button type="success" quaternary circle @click="showModal = true" style="margin-bottom: 10px;">
      <n-icon size="22">
        <Add />
      </n-icon>
    </n-button>
  </n-space>
  <n-space style="display: flex;">
    <div style="width: 200px;">
      <n-space vertical>
        <div v-for="(panel, index) in panelsRef" :key="index" class="panel-button"
          style="display: flex; align-items: center; position: relative;">
          <n-button @click="handleClick(panel.channel_id)"
            :class="{ 'active-button': selectedPanel === panel.channel_id }"
            style="width: 100%; text-overflow: ellipsis; white-space: nowrap;" @contextmenu="handleContextMenu(panel.channel_id,$event)">
            {{ panel.channel_name }}
          </n-button>
          <n-button class="close-button" @click="handleClose(panel.channel_id)" text
            style="padding: 5px; visibility: hidden; position: absolute; right: 0; top: 50%; transform: translateY(-50%);">
            <n-icon>
              <CloseOutline />
            </n-icon>
          </n-button>
        </div>
        <n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="options"
          :show="showDropdownRef" :on-clickoutside="onClickoutside " @select="handleSelect" />
      </n-space>
    </div>
    <div style="width: 400px;">
      <Chat :chatRoomId="selectedPanel" />
    </div>
  </n-space>
  <n-modal v-model:show="showModal">
    <div style="position: relative;">
      <n-card style="width: 600px" title="创建或加入频道" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <n-radio value="join" :default-checked="true" :checked="channelAction === 'join'"
          @change="channelAction = 'join'">
          加入频道
        </n-radio>
        <n-radio value="create" :checked="channelAction === 'create'" @change="channelAction = 'create'">
          创建频道
        </n-radio>

        <n-input v-model:value="channelName" :placeholder="placeholderText" @keyup.enter="handleChannelAction"
          @keyup.esc="handleCancel"></n-input>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <n-space>
              <n-button @click="handleChannelAction">确定</n-button>
              <n-button @click="handleCancel">取消</n-button>
            </n-space>
          </div>
        </template>
      </n-card>
      <n-spin v-if="isLoading"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></n-spin>
    </div>
  </n-modal>
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
import { ref,onMounted, computed, nextTick } from 'vue';
import Chat from "./Chat.vue";
import { useMessage, NButton, NSpace, NScrollbar, NIcon, NCard, NModal, NInput, NSpin, NRadio, NDropdown } from "naive-ui";
import { CloseOutline } from '@vicons/ionicons5'
import { create_channel, get_channel_list, join_channel,leave_channel } from '@/utils/jianghu_api';



const channelAction = ref('join');

const showModal = ref(false)
const channelName = ref('')
const nameRef = ref(1)
const message = useMessage()
const selectedPanel = ref(null)
const panelsRef = ref([])
const isLoading = ref(false)
const searchTerm = ref('');
const closedChannels = ref([]);


//右键点击
const xRef = ref(0)
const yRef = ref(0)
const showDropdownRef = ref(false)
const channel_id = ref(0)

const options = [
  {
    label: '退出频道',
    key: 'key1', 
  },
]

//右键菜单点击
async function handleSelect() {
  showDropdownRef.value = false
  try {
    await leave_channel({ "channel_id": channel_id.value })
    message.info(channel_id.value)
  } catch (error) {
    console.error('Error leaving channel:', error)
  }
}
//右键菜单
function handleContextMenu(channelId,e) {
  e.preventDefault()
  showDropdownRef.value = false
  nextTick().then(() => {
    showDropdownRef.value = true
    channel_id.value = channelId
    xRef.value = e.clientX
    yRef.value = e.clientY
  })
}
//右键菜单点击外部
function onClickoutside() {
  showDropdownRef.value = false
}

//提示文字
const placeholderText = computed(() => {
  const text = channelAction.value === 'create' ? '请输入频道名称' : '请输入频道id';
  return text;
});

//加号单选卡
async function handleChannelAction() {
  if (channelAction.value === 'create') {
    await api_create_channel()
  } else if (channelAction.value === 'join') {
    await api_join_channel()
  }
}
//加入频道
async function api_join_channel() {
  isLoading.value = true
  try {
    const channelId = parseInt(channelName.value, 10);
    const res = await join_channel({ "channel_id": channelId, "user_id": localStorage.userid });
    if (res.code == 200) {
      message.success('申请成功')
      showModal.value = false
      await fetchChannelList();
    } else {
      message.error(res.msg)
    }
  } catch (error) {
    message.error('请求失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
}
//创建频道
async function api_create_channel() {
  isLoading.value = true
  try {
    const res = await create_channel({ "channel_name": channelName.value });
    if (res.code == 200) {
      message.success('创建成功')
      showModal.value = false
      await fetchChannelList();
    } else {
      message.error(res.msg)
    }
  } catch (error) {
    message.error('请求失败: ' + error.message)
  } finally {
    isLoading.value = false
  }
}

//搜索
async function search() {
  const res = await fetchChannelList()
  console.log('search', res);
  const searchValue = searchTerm.value;
  console.log('searchValue', searchValue);
  const panel = res.find(p => p.channel_name === searchValue);
  console.log(panel);
  if (panel) {
    console.log('panel', panel);
    handleClick(panel.channel_id);
  } else {
    message.error('未找到匹配的聊天室');
  }
}

//关闭单选卡
function handleCancel() {
  showModal.value = false
}

//点击频道列表
function handleClick(panel) {
  selectedPanel.value = panel
}

//刷新频道列表
const fetchChannelList = async () => {
  const res = await get_channel_list()
  if (res.code === 200) {
    // console.log(res.data)
    panelsRef.value = res.data.filter(panel => !closedChannels.value.includes(panel.channel_id)); //过滤掉已关闭的频道
    return panelsRef.value
  } else {
    message.error(res.msg)
  }
}
onMounted(async () => {
  const channels = await fetchChannelList();
  if (channels.length === 0) {
    message.error('没有频道');
  } else {
    // 设置第一个频道为当前频道
    selectedPanel.value = channels[0].channel_id;
  }
});

function handleKeyDown(event) {
  if (event.key === 'Tab') {
    event.preventDefault(); // 阻止默认的Tab键行为
    switchTab(event.shiftKey);
  }
}

//切换频道
function switchTab(isShiftKey) {
  const { value: panels } = panelsRef;
  const currentIndex = panels.indexOf(nameRef.value);
  const nextIndex = isShiftKey
    ? (currentIndex - 1 + panels.length) % panels.length // 如果按下了Shift键，切换到上一个标签
    : (currentIndex + 1) % panels.length; // 否则，切换到下一个标签
  nameRef.value = panels[nextIndex];
}


//关闭频道
function handleClose(name) {
  const { value: panels } = panelsRef
  if (panels.length === 1) {
    message.error('最后一个了')
    return
  }
  closedChannels.value.push(name);
  // message.info('关掉 ' + name)
  const index = panels.findIndex((v) => name === v)
  panels.splice(index, 1)
  if (nameRef.value === name) {
    nameRef.value = panels[index]
  }
}
</script>