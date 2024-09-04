<template>
  <n-pagination
    v-model:page="page"
    :page-count="page_count"
    @update:page="get_meme"
    show-quick-jumper
  />
  <br>
  <n-image-group>
    <n-space>
      <div class="memes" v-for="i in memes" :key="i.id">
        <n-image height="100" :src="i.content" :fallback-src="getImageUrl('图片无法加载.svg')" />
        <n-button class="delete" type="error" round @click="del_meme(i._id)">x</n-button>
        </div>
    </n-space>
  </n-image-group>
</template>

<script setup>
import { NSpace, NImageGroup, NImage, NButton, NPagination } from "naive-ui";
import { api_get_memes, api_source } from "@/utils/api";
import { ref } from "vue";
const memes = ref([]);
const page = ref(1)
const page_count = ref()

const getImageUrl = (name) => {
    return new URL(`/src/assets/img/${name}`, import.meta.url).href
}

async function del_meme(meme_id) {
    var req_data = {
        source_type: "memes",
        source_id: meme_id,
        method: "del"
    }
    await api_source(req_data).then((res) => {
    if (res.code == 200) {
        get_meme()
    } else {
        message.error(res.msg)
    }
  });
}

async function get_meme() {
    await api_get_memes({page: page.value}).then((res) => {
    if (res.code == 200) {
        memes.value = res.data;
        page_count.value = res.page_count
    } else {
        message.error(res.msg)
    }
  });
}
get_meme()
</script>

<style type="text/css">
.memes {
  display: inline-block;
  position: relative;
}

.memes .delete {
  display: none;
  position: absolute;
  top: 35%;
  left: 30%;
}

.memes:hover .delete {
  display: inline-block;
}
</style>