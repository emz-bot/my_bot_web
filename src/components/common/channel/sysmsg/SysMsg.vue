<template>
    <n-tabs type="line" animated class="limited-height-tabs">
      <n-tab-pane name="未读" tab="未读">
        <Msg :sys_msg_list="unread_msg"/>
      </n-tab-pane>
      <n-tab-pane name="已读" tab="已读">
        <Msg :sys_msg_list="read_msg"/>
      </n-tab-pane>
    </n-tabs>
</template>

<script setup>
import { ref } from 'vue';
import Msg from './Msg.vue';
import { NTabs, NTabPane } from "naive-ui";
import { read_sys_msg } from '@/utils/jianghu_api';

const props = defineProps({sys_message: Array})
const sys_message = ref(props.sys_message)

const unread_msg = ref([])
const read_msg = ref([])

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
    read_sys_msg({ msg_id_list: msg_id_list });
}
init_msg()

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