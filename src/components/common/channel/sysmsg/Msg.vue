<template>
    <n-space v-if="sys_msg_list.length != 0">
        <template v-for="msg in sys_msg_list" :key="msg.id">
            <n-card :bordered="false" v-if="msg.type == 'channel_apply'">
                用户 {{ msg.apply_user }} 申请加入频道 {{ msg.channel_id }}
                <span v-if="msg.status == '已同意' || msg.status == '已拒绝'">
                    <n-button quaternary disabled>{{ msg.status }}</n-button>
                </span>
                <span v-else>
                    <n-button quaternary type="primary" @click="acceptChannelApply(msg)">同意</n-button>
                    <n-button quaternary type="error" @click="rejectChannelApply(msg)">拒绝</n-button>
                </span>
                <p class="msg_datetime">{{ formatDate(msg.create_time) }}</p>
            </n-card>
            <n-card :bordered="false" v-if="msg.type == 'channel_reject'">
                管理员 {{ msg.user_id }} 拒绝了您加入频道 {{ msg.channel_id }} 的申请
                <p class="msg_datetime">{{ formatDate(msg.create_time) }}</p>
            </n-card>
        </template>
    </n-space>
    <n-empty v-else size="large" description="牛逼，你没有消息！" />
</template>

<script setup>
import { ref } from 'vue';
import { accept_channel_apply, reject_channel_apply, read_sys_msg } from '@/utils/jianghu_api';
import { useMessage, NButton, NTabs, NTabPane, NSpace, NCard, NEmpty } from "naive-ui";

const props = defineProps({ sys_msg_list: Array })
const message = useMessage()
const sys_msg_list = ref(props.sys_msg_list)

async function acceptChannelApply(msg) {
    const res = await accept_channel_apply({ "channel_id": msg.channel_id, "user_id": msg.apply_user });
    if (res.code == 200) {
        message.success('已同意')
        msg.status = '已同意'
    } else {
        message.error(res.msg)
    }
}

async function rejectChannelApply(msg) {
    const res = await reject_channel_apply({ "channel_id": msg.channel_id, "user_id": msg.apply_user });
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