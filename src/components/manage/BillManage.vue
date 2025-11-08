<!-- 制作一个页面可以展示所有订单 -->
<template>
  <n-input-group>
    <n-input-number v-model:value="formData.user_id" min=1 max=999 :show-button="false" :bordered="false">
      <template #suffix>
        天
      </template>
    </n-input-number>
    <n-input-number v-model:value="formData.group_id" min=1 max=200 :show-button="false" :bordered="false">
      <template #suffix>
        个
      </template>
    </n-input-number>
    <n-button @click="search">查询</n-button>
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
import { api_get_bill, api_refund_bill } from '@/utils/api'
var formData = reactive({
  user_id: null,
  group_id: null
})

data = ref([])

function search() {
  api_get_bill({
    user_id: formData.user_id,
    group_id: formData.group_id
  }).then(res => {
    data.value = res.data
  })
}

const table_height = ref(window.innerHeight - 330);



</script>