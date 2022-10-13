<template>
    <n-input
      v-model:value="content"
      type="textarea"
      placeholder="用换行或空格分开"
    />
    <br>
    <br>
    <n-button type="primary" @click="add_drink">
      添加
    </n-button>
    <br>
    <br>
    <n-pagination
        v-model:page="page"
        :page-count="page_count"
        @update:page="get_drink"
        show-quick-jumper
    />
    <br>
    <n-tag class="tag" v-for="i in drink" :key="i.id" closable @close="del_drink(i._id)"> {{i.content}} </n-tag>
</template>

<script setup>
import { NTag, NInput, NPagination, NButton, useMessage } from "naive-ui";
import { api_get_drink, api_source } from "@/utils/api";
import { ref } from "vue";

const message = useMessage();

const drink = ref([]);
const content = ref()
const page = ref(1)
const page_count = ref()

const add_drink = () => {
    var req_data = {
        source_type: "drink",
        content: content.value,
        method: "add"
    }
    api_source(req_data).then((res) => {
        if (res.code == 200) {
            content.value = ""
            get_drink()
            message.success(res.msg)
        } else {
            message.error(res.msg)
        }
    });
    return label;
}


async function del_drink(drink_id) {

    var req_data = {
        source_type: "drink",
        source_id: drink_id,
        method: "del"
    }
    await api_source(req_data).then((res) => {
    if (res.code == 200) {
        get_drink()
    } else {
        message.error(res.msg)
    }
  });
}

async function get_drink() {
    var req_data = {page: page.value}
    await api_get_drink(req_data).then((res) => {
    if (res.code == 200) {
        drink.value = res.data;
        page_count.value = res.page_count
    } else {
        message.error(res.msg)
    }
  });
}
get_drink()
</script>

<style type="text/css">
.tag {
    margin: 3px;
}

</style>