<template>
    <div style="position: relative;">
      <n-card style="width: 600px" title="频道详情" :bordered="false" size="huge" role="dialog" aria-modal="true">
        <p>频道 ID: {{ channel_id }}</p>
        <p>频道 创建者 : {{ channel_author }}</p>
        <p>频道 管理员 : {{ channel_map[selectedPanel.toString()]["channel_manager"] }}</p>
        <template #footer>
          <div style="display: flex; justify-content: flex-end;">
            <n-space>
              <n-button @click="fetchChannelList">关闭</n-button>
            </n-space>
          </div>
        </template>
      </n-card>
    </div>
</template>

<script setup >
import { ref, onMounted, nextTick, inject, watch } from 'vue';

import { get_channel_list, delete_channel } from '@/utils/jianghu_api';
import { useMessage, NButton, NSpace, NIcon, NCard, NModal, NInput, NSpin, NDropdown, NAvatar, NBadge, } from "naive-ui";
 
const props = defineProps({ channel_id: Number, fetchChannelList: Function ,channel_author:String})
const channel_id = ref(props.channel_id)
const channel_author = ref(props.channel_author)
const fetchChannelList = props.fetchChannelList

</script>