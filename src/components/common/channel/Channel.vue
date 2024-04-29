<template>
  <!-- 搜索和创建频道按钮 -->
  <n-space>
    <n-input type="text" v-model:value="searchTerm" @keyup.enter="search" placeholder="搜索..." style="width: 180px;" />
    <n-button type="success" quaternary circle @click="showModal = true" style="margin-bottom: 10px;">
      <n-icon size="22">
        <Add />
      </n-icon>
    </n-button>
    <n-space style="font-size:large; color: cadetblue; margin-left: 30px;" v-if="CurrentChannelId">
      {{ ChannelInfoMap[CurrentChannelId.toString()]["channel_name"] }}({{ CurrentChannelId }})
    </n-space>
  </n-space>
  <n-space style="display: flex;">
    <div style="width: 230px;">
      <!-- 频道列表 -->
      <n-space vertical style="color: rgb(23, 24, 25);">
        <div v-for="(panel, index) in ChannelIdList" :key="index" class="panel-button"
          style="display: flex;  position: relative;">

          <n-space @click="handleClick(panel.channel_id)"
            :class="{ 'active-button': CurrentChannelId === panel.channel_id }"
            style="display: flex; align-items: center;width: 100%; text-overflow: ellipsis; white-space: nowrap;"
            @contextmenu="handleContextMenu(panel.channel_id, $event)">
            <n-avatar style="margin-left: 10px;margin-top: 8px;" size="large"
              :src="channelavatarbase_url + panel.channel_id + '.webp'"
              fallback-src="https://oss.ermaozi.cn/jianghu/default.webp" />
            <n-space vertical size="small" style="width: 110px;">
              <div>
                <div
                  style="color: cadetblue; font-size: medium; margin-top: 5px;max-width: 120px;overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ panel.channel_name }}
                </div>
                <div v-if="channel_new_msg[panel.channel_id]"
                  style="color: dimgrey; font-size:small; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  {{ channel_new_msg[panel.channel_id]["user_info"]["nickname"] }}:
                  {{ channel_new_msg[panel.channel_id]["message"] }}
                </div>
              </div>
            </n-space>
            <n-space vertical style="margin-right: 10px;justify-content: flex-end;">
              <div v-if="channel_new_msg[panel.channel_id] && channel_new_msg[panel.channel_id]['time']"
                style="color: dimgrey; font-size: small; margin-top: 5px;">
                {{ new Date(channel_new_msg[panel.channel_id]["time"] * 1000).toLocaleTimeString().slice(0, 5) }}
              </div>
              <n-badge v-if="panel.channel_id != CurrentChannelId" style="top: -8px;"
                :value="channel_new_msg_count[panel.channel_id]" :max="99" />
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
    <!-- 聊天室 -->
    <div style="width: 600px;">
      <Chat :chatRoomId="CurrentChannelId" v-if="CurrentChannelId" />
    </div>
    <div style="width:300px;" v-if="CurrentChannelId">
      <MemberList
        :channel_member="ChannelInfoMap[CurrentChannelId.toString()] ? ChannelInfoMap[CurrentChannelId.toString()]['channel_member'] : ''" />
    </div>
  </n-space>
  <!-- 创建或加入频道模态框模块 -->
  <n-modal v-model:show="showModal">
    <CreateJoin :fetchChannelList="fetchChannelList" />
  </n-modal>
  <!-- 退出频道模态框模块 -->
  <n-modal v-model:show="showLeaveModal">
    <LeaveChannel :channel_id="RightclickChannelId" :fetchChannelList="fetchChannelList" />
  </n-modal>
  <!-- 删除频道模态框模块 -->
  <n-modal v-model:show="showdeleteModal">
    <DeletChannel :channel_id="RightclickChannelId" :fetchChannelList="fetchChannelList" />
  </n-modal>
  <!-- 频道详情模态框模块 -->
  <n-modal v-model:show="showDetailsModal">
    备用
  </n-modal>
</template>

<style scoped>
.active-button {
  background-color: rgb(41, 43, 44) !important;
}

.panel-button:hover .close-button {
  visibility: visible !important;
}
</style>

<script setup>
import { Add } from '@vicons/ionicons5'
import { ref, onMounted, nextTick, inject, watch } from 'vue';
import Chat from "./Chat.vue";
import MemberList from "./MemberList.vue";
import CreateJoin from "./CreateJoin.vue";
import LeaveChannel from "./LeaveChannel.vue";
import DeletChannel from "./DeletChannel.vue";
import DetailsChannel from "./DetailsChannel.vue";
import { useMessage, NButton, NSpace, NIcon,  NModal, NInput, NDropdown, NAvatar, NBadge } from "naive-ui";
import { CloseOutline } from '@vicons/ionicons5'
import { get_channel_list } from '@/utils/jianghu_api';

const channelavatarbase_url = ref(`${window.gurl.OSS_BASE_URL}jianghu/channel_avatar/`)
const messages = inject('channel_message');
const nameRef = ref(1)
const message = useMessage()
const CurrentChannelId = ref(null)
const ChannelIdList = ref([])
const ChannelInfoMap = ref({})
const searchTerm = ref('');
const closedChannels = ref([]);

const xRef = ref(0)
const yRef = ref(0)

const channel_msg_count = ref({})
const channel_new_msg_count = ref({})
const channel_new_msg = ref({})
const RightclickChannelId = ref(null)

const showLeaveModal = ref(false)
const showModal = ref(false)
const showDetailsModal = ref(false)
const showdeleteModal = ref(false)
const showDropdownRef = ref(false)

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



//右键菜单
function handleContextMenu(channelId, e) {
  e.preventDefault()
  showDropdownRef.value = false
  RightclickChannelId.value = channelId
  nextTick().then(() => {
    showDropdownRef.value = true
    xRef.value = e.clientX
    yRef.value = e.clientY
  })
}
//右键菜单点击外部
function onClickoutside() {
  showDropdownRef.value = false
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


//点击频道列表
function handleClick(panel) {
  // 切换频道时重置新消息数量
  channel_new_msg_count.value[CurrentChannelId.value] = 0
  CurrentChannelId.value = panel
}

//刷新频道列表
const fetchChannelList = async () => {
  try {
    const res = await get_channel_list()
    if (res.code === 200) {
      var channel_list = res.data.channel_list
      ChannelInfoMap.value = res.data.channel_map
      ChannelIdList.value = channel_list.filter(panel => !closedChannels.value.includes(panel.channel_id)); //过滤掉已关闭的频道
      if (ChannelIdList.value.length === 0) {
          message.error('没有频道');
        } else {
          // 设置第一个频道为当前频道
          CurrentChannelId.value = ChannelIdList.value[0].channel_id;
        }
    } else {
      message.error(res.msg)
    }
  } finally {
    showModal.value = false
    showLeaveModal.value = false
    showdeleteModal.value = false
    showDetailsModal.value = false

  }
}
onMounted(async () => {
  await fetchChannelList()
});

function handleKeyDown(event) {
  if (event.key === 'Tab') {
    event.preventDefault(); // 阻止默认的Tab键行为
    switchTab(event.shiftKey);
  }
}

watch(messages, newVal => {
  for (const key in newVal) {
    if (!channel_new_msg_count.value[key]) {
      channel_new_msg_count.value[key] = 0
    }
    if (!channel_msg_count.value[key]) {
      channel_msg_count.value[key] = newVal[key].length
    }
    if (newVal[key].length > channel_msg_count.value[key]) {
      channel_new_msg_count.value[key] += newVal[key].length - channel_msg_count.value[key]
    }
    channel_msg_count.value[key] = newVal[key].length
    channel_new_msg.value[key] = newVal[key][newVal[key].length - 1]
  }
  // ChannelIdList 按照新消时间排序
  ChannelIdList.value.sort((a, b) => {
    if (channel_new_msg.value[a.channel_id] && channel_new_msg.value[b.channel_id]) {
      return channel_new_msg.value[b.channel_id]["time"] - channel_new_msg.value[a.channel_id]["time"]
    } else {
      return 0
    }
  })
}, { deep: true });

//切换频道
function switchTab(isShiftKey) {
  const { value: panels } = ChannelIdList;
  const currentIndex = panels.indexOf(nameRef.value);
  const nextIndex = isShiftKey
    ? (currentIndex - 1 + panels.length) % panels.length // 如果按下了Shift键，切换到上一个标签
    : (currentIndex + 1) % panels.length; // 否则，切换到下一个标签
  nameRef.value = panels[nextIndex];
}

//关闭频道
function handleClose(name) {
  const { value: panels } = ChannelIdList
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
