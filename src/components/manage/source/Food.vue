<template>
    <n-input
      v-model:value="content"
      type="textarea"
      placeholder="用换行或空格分开"
    />
    <br>
    <br>
    <n-button type="primary" @click="add_food">
      添加
    </n-button>
    <br>
    <br>
    <n-pagination
        v-model:page="page"
        :page-count="page_count"
        @update:page="get_food"
        show-quick-jumper
    />
    <br>
    <n-tag class="tag" v-for="i in food" :key="i.id" closable @close="del_food(i._id)"> {{i._id}} </n-tag>
</template>

<script setup>
import { NTag, NInput, NPagination, NButton, useMessage } from "naive-ui";
import { api_get_food, api_food } from "@/utils/api";
import { ref } from "vue";

const message = useMessage();

const food = ref([]);
const content = ref()
const page = ref(1)
const page_count = ref()

const add_food = () => {
    var req_data = {
        content: content.value,
        method: "add"
    }
    api_food(req_data).then((res) => {
        if (res.code == 200) {
            content.value = ""
            get_food()
            message.success(res.msg)
        } else {
            message.error(res.msg)
        }
    });
    return label;
}


async function del_food(food_id) {

    var req_data = {
        food_id: food_id,
        method: "del"
    }
    await api_food(req_data).then((res) => {
    if (res.code == 200) {
        get_food()
    } else {
        message.error(res.msg)
    }
  });
}

async function get_food() {
    var req_data = {page: page.value}
    await api_get_food(req_data).then((res) => {
    if (res.code == 200) {
        food.value = res.data;
        page_count.value = res.page_count
    } else {
        message.error(res.msg)
    }
  });
}
get_food()
</script>

<style type="text/css">
.tag {
    margin: 3px;
}

</style>