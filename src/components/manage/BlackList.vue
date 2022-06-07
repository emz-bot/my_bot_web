<template>
  <n-space>
    <n-input-group>
      <n-input type="text" v-model:value="number" placeholder="号码" clearable />
      <n-select :style="{ width: '33%' }" :options="selectOptions" v-model:value="singleValue"/>
      <n-input type="text" v-model:value="remark" placeholder="备注" clearable />
    </n-input-group>
    <n-input-group>
      <n-input-number :show-button="0" v-model:value="Y" @update:value="add_date"/>
      <n-input-group-label>年</n-input-group-label>
      <n-input-number :show-button="0" v-model:value="M" @update:value="add_date"/>
      <n-input-group-label>月</n-input-group-label>
      <n-input-number :show-button="0" v-model:value="D" @update:value="add_date"/>
      <n-input-group-label>日</n-input-group-label>
      <n-date-picker v-model:value="timestamp" type="date" clearable/>
    </n-input-group>
    <n-input-group>
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
      <h1>QQ黑名单</h1>
      <n-data-table
        ref="table"
        :key="(row) => row.key"
        :columns="qq_columns"
        :data="resData.user_black_list"
        :pagination="pagination"
      />
      <h1>群黑名单</h1>
      <n-data-table
        ref="table"
        :key="(row) => row.key"
        :columns="group_columns"
        :data="resData.group_black_list"
        :pagination="pagination"
      />
  </n-card>
</template>
<script setup>
import {
  NDataTable,
  NInput,
  NDatePicker,
  NSelect,
  NInputNumber,
  NInputGroup,
  NInputGroupLabel,
  NSpace,
  NTime,
  NButton,
  NCard,
  useMessage
} from "naive-ui";
import { h, ref } from "vue";
import { get_black_list, post_black_list } from "@/utils/api";

var now = new Date()
const timestamp = ref(now)
const number = ref()
const remark = ref()
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
const group_columns = ref([
  {
    title: '群号',
    key: '_id',
  },
  {
    title: '拉黑次数',
    key: 'black_num',
  },
  {
    title: '解封时间',
    key: 'block_time',
    render (row) {
      return h(
        NTime,
        {
          format: "yyyy-MM-dd",
          time: row.block_time
        },
        { default: () => row.block_time }
      )
    }
  },
  {
    title: '备注',
    key: 'remark',
  },
  {
    title: '删除',
    key: 'actions',
    render (row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => del_black_list(row._id, "群号")
        },
        { default: () => '删除' }
      )
    }
  }
])

const qq_columns = ref([
  {
    title: 'QQ',
    key: '_id',
  },
  {
    title: '拉黑次数',
    key: 'black_num',
  },
  {
    title: '解封时间',
    key: 'block_time',
    render (row) {
      return h(
        NTime,
        {
          format: "yyyy-MM-dd",
          time: row.block_time
        },
        { default: () => row.block_time }
      )
    }
  },
  {
    title: '备注',
    key: 'remark',
  },
  {
    title: '删除',
    key: 'actions',
    render (row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => del_black_list(row._id, "QQ")
        },
        { default: () => '删除' }
      )
    }
  }
])

function add_date(){
    var now = new Date()
    now.setDate(now.getDate()+D.value)
    now.setMonth(now.getMonth()+M.value)
    now.setFullYear(now.getFullYear()+Y.value)
    timestamp.value = now
}

async function add_black_list(){
    var req_data = {
        actiom: "add",
        num_type: singleValue.value,
        number: number.value,
        remark: remark.value,
        block_time: timestamp.value
    }
    await post_black_list(req_data).then((res) => {
    if (res.code == 200) {
        message.success(res.msg)
        black_list()
    } else {
        message.error(res.msg)
    }
  });
}

async function del_black_list(number, num_type){
    var req_data = {
        actiom: "del",
        num_type: num_type,
        number: number,
    }
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
