<template>
    <n-tabs type="line" animated class="limited-height-tabs">
      <n-tab-pane name="未读" tab="未读">
        <n-space v-for="msg in unread_msg" :key="msg.id">
            <n-card :bordered="false" v-if="msg.type == 'channel_apply'">
                用户 {{ msg.user_id }} 申请加入频道 {{ msg.channel_id }}
                <span v-if="msg.status == '已同意' || msg.status == '已拒绝'">
                    <n-button quaternary disabled>{{ msg.status }}</n-button>
                </span>
                <span v-else>
                    <n-button quaternary type="primary" @click="acceptChannelApply(msg)">同意</n-button>
                    <n-button quaternary type="error" @click="rejectChannelApply(msg)">拒绝</n-button>
                </span>
                <p class="msg_datetime">{{formatDate(msg.create_time)}}</p>
            </n-card>
            <n-card :bordered="false" v-if="msg.type == 'channel_reject'">
                管理员 {{ msg.user_id }} 拒绝了您加入频道 {{ msg.channel_id }} 的申请
                <p class="msg_datetime">{{formatDate(msg.create_time)}}</p>
            </n-card>
        </n-space>
      </n-tab-pane>
      <n-tab-pane name="已读" tab="已读">
        <n-space v-for="msg in read_msg" :key="msg.id">
            <n-card :bordered="false" v-if="msg.type == 'channel_apply'">
                用户 {{ msg.user_id }} 申请加入频道 {{ msg.channel_id }}
                <span v-if="msg.status == '已同意' || msg.status == '已拒绝'">
                    <n-button quaternary disabled>{{ msg.status }}</n-button>
                </span>
                <span v-else>
                    <n-button quaternary type="primary" @click="acceptChannelApply(msg)">同意</n-button>
                    <n-button quaternary type="error" @click="rejectChannelApply(msg)">拒绝</n-button>
                </span>
            </n-card>
            <n-card :bordered="false" v-if="msg.type == 'channel_reject'">
                管理员 {{ msg.user_id }} 拒绝了您加入频道 {{ msg.channel_id }} 的申请
                <p class="msg_datetime">{{formatDate(msg.create_time)}}</p>
            </n-card>
        </n-space>
      </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import { ref } from 'vue';
import { accept_channel_apply, reject_channel_apply, read_sys_msg } from '@/utils/jianghu_api';
import { useMessage, NButton, NTabs, NTabPane, NSpace, NCard } from "naive-ui";

const props = defineProps({sys_message: Array})
const message = useMessage()
const sys_message = ref(props.sys_message)

// 已读消息
const read_msg = ref([])
// 未读消息
const unread_msg = ref([])

function init_msg() {
    // 时间倒叙排列消息
    sys_message.value.sort((a, b) => {
        return new Date(b.create_time) - new Date(a.create_time)
    })
    for (let i = 0; i < sys_message.value.length; i++) {
        if (sys_message.value[i].is_read) {
            read_msg.value.push(sys_message.value[i])
        } else {
            unread_msg.value.push(sys_message.value[i])
        }
    }
    var msg_id_list = sys_message.value.map(item => item._id);
    read_sys_msg({msg_id_list: msg_id_list});
}
init_msg()

async function acceptChannelApply(msg) {
    const res = await accept_channel_apply({ "channel_id": msg.channel_id, "user_id": msg.user_id });
    if (res.code == 200) {
        message.success('已同意')
        msg.status = '已同意'
    } else {
        message.error(res.msg)
    }
}

async function rejectChannelApply(msg) {
    const res = await reject_channel_apply({ "channel_id": msg.channel_id, "user_id": msg.user_id });
    if (res.code == 200) {
        message.success('已拒绝')
        msg.status = '已拒绝'
    } else {
        message.error(res.msg)
    }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\//g, '-');
}

</script>
<style scoped>
.limited-height-tabs {
  height: 500px;  /* 你可以根据需要修改这个值 */
  overflow-y: auto;
}
.msg_datetime {
  color: #999;
  font-size: 12px;
}
</style>