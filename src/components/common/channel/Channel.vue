<template>
  <!-- 搜索和创建频道按钮 -->
  <n-space>
    <n-input type="text" v-model:value="searchTerm" @keyup.enter="search" placeholder="搜索..." style="width: 150px;" />
    <n-button type="success" quaternary circle @click="showModal = true" style="margin-bottom: 10px;">
      <n-icon size="22">
        <Add />
      </n-icon>
    </n-button>
  </n-space>
  <!-- 频道列表 -->
  <n-space style="display: flex;">
    <div style="width: 200px;">
      <n-space vertical>
        <div v-for="(panel, index) in panelsRef" :key="index" class="panel-button"
          style="display: flex;  position: relative;">

          <n-space @click="handleClick(panel.channel_id)"
            :class="{ 'active-button': selectedPanel === panel.channel_id }"
            style="display: flex; align-items: center;width: 100%; text-overflow: ellipsis; white-space: nowrap;"
            @contextmenu="handleContextMenu(panel.channel_id, $event)">
            <n-avatar style="margin-left: 10px;margin-top: 7px;" size="medium" src="https://p0.ssl.qhimg.com/t019b1a140f615d4b0b.jpg" />
            <n-space vertical size="small">
              <div >
                <div style="color: cadetblue; font-size: small; margin-top: 5px;"> {{ panel.channel_name }}</div>
                <div
                  style="color: dimgrey; font-size:xx-small; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ messages[panel.channel_id][messages[panel.channel_id].length - 1]["user_info"]["nickname"] }}:
                  {{ messages[panel.channel_id][messages[panel.channel_id].length - 1]["message"] }}
                </div>

              </div>
            </n-space>
            <n-button class="close-button" @click="handleClose(panel.channel_id)" text
              style="padding: 5px; visibility: hidden; position: absolute; right: 0; top: 50%; transform: translateY(-50%);">
              <n-icon>
                <CloseOutline />
              </n-icon>
            </n-button>
          </n-space>
        </div>
        <!-- 右键菜单 -->
        <n-dropdown placement="bottom-start" trigger="manual" :x="xRef" :y="yRef" :options="options"
          :show="showDropdownRef" :on-clickoutside="onClickoutside" @select="handleSelect" />
      </n-space>
    </div>
    <div style="width: 400px;">
      <Chat :chatRoomId="selectedPanel" />
    </div>
  </n-space>
  <!-- 创建或加入频道模态框模块 -->
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
        <n-input v-model:value="channelName" :placeholder="placeholderText"></n-input>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <n-space>
              <n-button @click="handleChannelAction">确定</n-button>
              <n-button @click="handleCancel">取消</n-button>
            </n-space>
          </div>
        </template>
      </n-card>
      <!-- 加载中 -->
      <n-spin v-if="isLoading"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></n-spin>
    </div>
  </n-modal>
  <!-- 退出频道模态框模块 -->
  <n-modal v-model:show="showLeaveModal">
    <div style="position: relative;">
      <n-spin v-if="isLoading"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></n-spin>
      <n-card style="width: 600px" title="确认退出频道" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <p>您确定要退出此频道吗？</p>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <n-space>
              <n-button @click="confirmLeaveChannel">确定</n-button>
              <n-button @click="cancelLeaveChannel">取消</n-button>
            </n-space>
          </div>
        </template>
      </n-card>
    </div>
  </n-modal>
  <n-modal v-model:show="showdeleteModal">
    <div style="position: relative;">
      <n-spin v-if="isLoading"
        style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></n-spin>
      <n-card style="width: 600px" title="确认删除频道" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <p>您确定要删除此频道吗？</p>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <n-space>
              <n-button @click="deleteChannel">确定</n-button>
              <n-button @click="canceldeleteChannel">取消</n-button>
            </n-space>
          </div>
        </template>
      </n-card>
    </div>
  </n-modal>
  <!-- 频道详情模态框模块 -->
  <n-modal v-model:show="showDetailsModal">
    <div style="position: relative;">
      <n-card style="width: 600px" title="频道详情" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <p>频道 ID: {{ channel_id }}</p>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <n-space>
              <n-button @click="closeDetailsModal">关闭</n-button>
            </n-space>
          </div>
        </template>
      </n-card>
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
import { ref, onMounted, computed, nextTick, inject, watch } from 'vue';
import Chat from "./Chat.vue";
import { useMessage, NButton, NSpace, NIcon, NCard, NModal, NInput, NSpin, NRadio, NDropdown, NAvatar } from "naive-ui";
import { CloseOutline } from '@vicons/ionicons5'
import { create_channel, get_channel_list, join_channel, leave_channel, delete_channel } from '@/utils/jianghu_api';


const messages = inject('channel_message');
const channelAction = ref('join');
const channelName = ref('')
const nameRef = ref(1)
const message = useMessage()
const selectedPanel = ref(null)
const panelsRef = ref([])
const isLoading = ref(false)
const searchTerm = ref('');
const closedChannels = ref([]);
const showLeaveModal = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const showdeleteModal = ref(false)
const showDropdownRef = ref(false)
const channel_id = ref(0)
const currentChannelId = ref('')
const xRef = ref(0)
const yRef = ref(0)
const latestMessages = ref({});

// 其他代码

// 处理新消息



//右键菜单选项
const options = [
  {
    label: '退出频道',
    key: 'key1',
  },
  {
    label: '频道详情',
    key: 'key2',
  },
  {
    label: '删除频道',
    key: 'key3',
  },
]

//右键菜单点击(退出频道)
function handleSelect(key) {
  showDropdownRef.value = false
  if (key === 'key1') {
    showLeaveModal.value = true
  } else if (key === 'key2') {
    showDetailsModal.value = true
  } else if (key === 'key3') {
    showdeleteModal.value = true
  }
}


watch(messages, () => {
  nextTick(() => {
    // 将相应聊天室的最新消息更新为新消息
    console.log('handleNewMessage', messages.value)
    console.log('messages.content', messages.content)
    latestMessages.value[messages.channel_id] = messages.content;

  })
});

//退出频道
async function confirmLeaveChannel() {
  isLoading.value = true;
  showLeaveModal.value = false
  try {
    const res = await leave_channel({ "channel_id": channel_id.value, "user_id": localStorage.userid })
    if (res.code == 200) {
      message.success('退出成功')
      await fetchChannelList();
    } else {
      message.error(res.msg)
    }
  } catch (error) {
    console.error('Error leaving channel:', error)
  } finally {
    isLoading.value = false;
  }
}

//删除频道
async function deleteChannel() {
  isLoading.value = true
  showdeleteModal.value = false
  try {
    const res = await delete_channel({ "channel_id": channel_id.value, "user_id": localStorage.userid })
    if (res.code == 200) {
      message.success('删除成功')
      await fetchChannelList();
    } else {
      message.error(res.msg)
    }
  } catch (error) {
    console.error('Error leaving channel:', error)
  } finally {
    isLoading.value = false;
  }
}




//取消退出频道
function cancelLeaveChannel() {
  showLeaveModal.value = false
}
//取消删除频道
function canceldeleteChannel() {
  showdeleteModal.value = false
}
//关闭频道详情
function closeDetailsModal() {
  showDetailsModal.value = false
}

//右键菜单
function handleContextMenu(channelId, e) {
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
    const res = await create_channel({ "channel_name": channelName.value, "user_id": localStorage.userid });
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
  const searchValue = searchTerm.value;
  const panel = res.find(p => p.channel_name === searchValue);
  if (panel) {
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
