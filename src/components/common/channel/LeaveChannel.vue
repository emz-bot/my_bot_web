<template>
  <div style="position: relative;">
    <n-spin style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"></n-spin>
    <n-card style="width: 600px" title="确认退出频道" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <p>您确定要退出此频道吗？</p>
      <template #footer>
        <div style="display: flex; justify-content: flex-end;">
          <n-space>
            <n-button @click="confirmLeaveChannel">确定</n-button>
            <n-button @click="fetchChannelList">取消</n-button>
          </n-space>
        </div>
      </template>
    </n-card>
  </div>
</template>


<script setup>
import { ref } from 'vue';

import { leave_channel } from '@/utils/jianghu_api';
import { useMessage, NButton, NSpace, NCard, NSpin } from "naive-ui";

const message = useMessage();

const props = defineProps({ channel_id: Number, fetchChannelList: Function })
const channel_id = ref(props.channel_id)
const fetchChannelList = props.fetchChannelList
//退出频道
async function confirmLeaveChannel() {
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
  }
}








</script>