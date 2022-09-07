<template>
    <n-input
      v-model:value="content"
      type="textarea"
      placeholder="一次只能添加一个文案"
    />
    <br>
    <br>
    <n-button type="primary" @click="add_kfc">添加</n-button>
  <br>
  <br>
  <n-pagination
    v-model:page="page"
    :page-count="page_count"
    @update:page="get_kfc"
    show-quick-jumper
  />
  <br>
  <n-list hoverable clickable>
    <n-list-item v-for="i in kfcs" :key="i.id">
      <div v-html="i.content.replace(/\n/g, '<br>')">
      </div>
      <n-thing content-style="margin-top: 10px;">
        <template #description>
          <n-space size="small" style="margin-top: 4px">
            <n-button quaternary @click="del_kfc(i._id)" type="error" size="tiny">
              删除
            </n-button>
          </n-space>
        </template>
      </n-thing>
    </n-list-item>
  </n-list>
</template>

<script setup>
import { NCard, NList, NListItem, NThing, NSpace, NPagination, NButton, NModal, NInput } from "naive-ui";
import { api_get_kfc, api_kfc } from "@/utils/api";
import { ref } from "vue";
const kfcs = ref([]);
const page = ref(1)
const content = ref()
const page_count = ref()

async function del_kfc(kfc_id) {
    var req_data = {
        kfc_id: kfc_id,
        method: "del"
    }
    await api_kfc(req_data).then((res) => {
    if (res.code == 200) {
        get_kfc()
    } else {
        message.error(res.msg)
    }
  });
}

async function add_kfc() {
    var req_data = {
        content: content.value,
        method: "add"
    }
    await api_kfc(req_data).then((res) => {
    if (res.code == 200) {
        content.value = ""
        get_kfc()
    } else {
        message.error(res.msg)
    }
  });
}

async function get_kfc() {
    var req_data = {page: page.value}
    await api_get_kfc(req_data).then((res) => {
    if (res.code == 200) {
        kfcs.value = res.data;
        page_count.value = res.page_count
    } else {
        message.error(res.msg)
    }
  });
}
get_kfc()
</script>

<style type="text/css">
.kfcs {
  display: inline-block;
  position: relative;
}

.kfcs .delete {
  display: none;
  position: absolute;
  top: 35%;
  left: 30%;
}

.kfcs:hover .delete {
  display: inline-block;
}
</style>