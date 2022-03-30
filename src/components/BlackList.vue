<template>
  <n-space>
    <n-input-group >
      <n-input type="text" v-model:value="number" placeholder="号码" clearable />
      <n-select :style="{ width: '33%' }" :options="selectOptions" v-model:value="singleValue"/>
    </n-input-group>
    <n-input-group >
      <n-input-number :show-button="0" v-model:value="Y" @update:value="add_date"/>
      <n-input-group-label>年</n-input-group-label>
      <n-input-number :show-button="0" v-model:value="M" @update:value="add_date"/>
      <n-input-group-label>月</n-input-group-label>
      <n-input-number :show-button="0" v-model:value="D" @update:value="add_date"/>
      <n-input-group-label>日</n-input-group-label>
      <n-date-picker v-model:value="timestamp" type="date" clearable/>
    </n-input-group>
    <n-input-group >
      <n-button
        type="primary"
        :loading="loading"
        attr-type="button"
        @click="add_black_list"
        >
        加入黑名单
      </n-button>
    </n-input-group>
  </n-space>
  <n-card :bordered="false">
      <p v-for="i in resData.user_black_list" :key="i.id">
          {{ i._id }} {{ i.block_time }} {{ i.black_num }}
      </p>
  </n-card>
</template>
<script setup>
import {
  NInput,
  NDatePicker,
  NSelect,
  NInputNumber,
  NInputGroup,
  NInputGroupLabel,
  NSpace,
  NButton,
  NCard,
  useMessage
} from "naive-ui";
import { ref } from "vue";
import { get_black_list, post_black_list } from "@/utils/api";

var now = new Date()
const timestamp = ref(now)
const number = ref()
const Y = ref(0)
const M = ref(0)
const D = ref(0)
const resData = ref([]);
const singleValue = ref('QQ')
const message = useMessage();
const selectOptions = ref([{
          label: "QQ",
          value: "QQ"
        },
        {
            label: "群号",
            value: "群号"
        }])
function add_date(){
    console.log(Y.value)
    console.log(M.value)
    console.log(D.value)
    var now = new Date()
    now.setDate(now.getDate()+D.value)
    now.setMonth(now.getMonth()+M.value)
    now.setFullYear(now.getFullYear()+Y.value)
    timestamp.value = now
    console.log(D.value)
}

async function add_black_list(){
    var req_data = {
        num_type: singleValue.value,
        number: number.value,
        block_time: timestamp.value
    }
    console.log(req_data)
    await post_black_list(req_data).then((res) => {
    if (res.code == 200) {
        message.success(res.msg)
        black_list()
    } else {
        message.error(res.msg)
    }
  });
}

async function black_list(){
    await get_black_list().then((res) => {
    if (res.code == 200) {
            resData.value = res.data
        } else {
            message.error(res.msg)
        }
  });
}
black_list()
</script>

<style>
body {
  background: #1d1d1d;
}
.user_message {
  border-radius: 15px;
  font-size: 14px;
  padding-left: 5%;
}

.user_info {
  font-size: 8px;
}
.n-card--bordered {
  width: 50%;
  margin: 0 auto;
}
.n-divider__title {
  font-size: 14px;
  color: darkgrey;
}
.user_message img {
  max-width: 80% !important;
  height: auto !important;
}
</style>