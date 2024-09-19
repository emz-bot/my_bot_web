<template>
  <n-input-group>
    <n-input-number v-model:value="formData.days" min=1 max=999 :show-button="false" :bordered="false">
      <template #suffix>
        天
      </template>
    </n-input-number>
    <n-input-number v-model:value="formData.num" min=1 max=200 :show-button="false" :bordered="false">
      <template #suffix>
        个
      </template>
    </n-input-number>
    <n-button @click="createCode">发码</n-button>
  </n-input-group>
  <br><br>
  <n-data-table
    ref="table"
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :max-height="table_height"
  />
</template>

<script setup>
import { ref, reactive } from 'vue'
import { NDataTable, NInputGroup, NInputNumber, NButton, useMessage } from "naive-ui"
import { create_activation_code, get_activation_code } from '@/utils/api'

const table_height = ref(window.innerHeight - 330);

const message = useMessage()

const formData = reactive({
  days: 31,
  num: 100
})

const columns = [
  {
    title: '激活码',
    key: 'code',
    defaultSortOrder: 'ascend',
  },
  {
    title: '状态',
    key: 'stat',
    sorter: 'default',
    defaultFilterOptionValues: ['未使用'],
    filterOptions: [
      {
        label: '未使用',
        value: '未使用'
      },
      {
        label: '已使用',
        value: '已使用'
      }
    ],
    filter(value, row) {
      return row.stat == value
    }
  },
  {
    title: '发码人',
    key: 'user',
  },
  {
    title: '发码时间',
    sorter: 'default',
    key: 'create_time',
  }
]


const table = ref(null)
const pagination = { pageSize: 20 }

async function createCode() {
  const req_data = {
    days: formData.days,
    num: formData.num
  }
  await create_activation_code(req_data).then((res) => {
    if (res.code == 200) {
      message.success(res.msg)
    } else {
      message.error(res.msg)
    }
  })
}

const data = ref([])
async function start() {
  await get_activation_code().then((res) => {
    console.log(res)
    if (res.code == 200) {
      data.value = res.data
    } else {
      message.error(res.msg)
    }
  })
}

start()

</script>