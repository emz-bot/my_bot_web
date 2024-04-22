<template>
    <div>
        <div v-for="msg in props.sys_message" :key="msg.id">
            <div v-if="msg.type == 'channel_apply'">
                用户 {{ msg.user_id }} 申请加入频道 {{ msg.channel_id }}
                <n-button quaternary type="primary" @click="acceptChannelApply(msg)">同意</n-button>
                <n-button quaternary type="error" @click="rejectChannelApply(msg)">拒绝</n-button>
            </div>
            <div v-if="msg.type == 'channel_reject'">
                管理员 {{ msg.user_id }} 拒绝了您加入频道 {{ msg.channel_id }} 的申请
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { accept_channel_apply, reject_channel_apply } from '@/utils/jianghu_api';
import { useMessage, NButton } from "naive-ui";
// Replace this with the actual method to fetch system messages
const props = defineProps({sys_message: Array})
const message = useMessage()

function aaa() {
    console.log(props.sys_message)
}
aaa()

async function acceptChannelApply(msg) {
    const res = await accept_channel_apply({ "channel_id": msg.channel_id, "user_id": msg.user_id });
    if (res.code == 200) {
        message.success('已同意')
    } else {
        message.error(res.msg)
    }
}

async function rejectChannelApply(msg) {
    const res = await reject_channel_apply({ "channel_id": msg.channel_id, "user_id": msg.user_id });
    if (res.code == 200) {
        message.success('已拒绝')
    } else {
        message.error(res.msg)
    }
}

</script>