<template>
  <n-space vertical size="medium" v-for="i in re_data" :key="i.id">
      <n-divider />
    <n-space>
      <n-space>
        <n-avatar size="large" :src="i.qlogo" />
      </n-space>
      <n-space vertical>
        <div>{{ i.last_sent }} {{ i.views_num }}</div>
        <div>{{ i._id }} {{ i.user_name }}</div>
      </n-space>
    </n-space>
    {{ i.content }}
  </n-space>
</template>

<script setup>
import { NSpace, NAvatar, NDivider } from "naive-ui";
import { ref } from "vue";
import { get_river_lantern } from "@/utils/api";
var reqData = {};
const resData = ref([]);
async function start() {
  await get_river_lantern(reqData).then((res) => {
    if (res.code == 200) {
      resData.value = res.data;
    }
  });
}
start();
var re_data = resData;
</script>
<style>
body {
  background: #1d1d1d;
}
</style>