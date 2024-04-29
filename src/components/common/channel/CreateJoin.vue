<template>
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
              <n-button @click="fetchChannelList">取消</n-button>
            </n-space>
          </div>
        </template>
      </n-card>
    </div>
</template>

<script setup>

import { ref, computed } from 'vue';

import { create_channel, join_channel, } from '@/utils/jianghu_api';
import { useMessage, NButton, NSpace, NCard, NInput, NRadio, } from "naive-ui";

const message = useMessage();
const channelAction = ref('join');
const props = defineProps({ fetchChannelList: Function })
const channelName = ref('')
const fetchChannelList = props.fetchChannelList

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
  try {
    const channelId = parseInt(channelName.value, 10);
    const res = await join_channel({ "channel_id": channelId, "user_id": localStorage.userid });
    if (res.code == 200) {
      message.success('申请成功')
      await fetchChannelList();
    } else {
      message.error(res.msg)
    }
  } catch (error) {
    message.error('请求失败: ' + error.message)
  }
}

//创建频道
async function api_create_channel() {
  try {
    const res = await create_channel({ "channel_name": channelName.value, "user_id": localStorage.userid });
    if (res.code == 200) {
      message.success('创建成功')
      await fetchChannelList();
    } else {
      message.error(res.msg)
    }
  } catch (error) {
    message.error('请求失败: ' + error.message)
  }
}

//提示文字
const placeholderText = computed(() => {
  const text = channelAction.value === 'create' ? '请输入频道名称' : '请输入频道id';
  return text;
});

</script>