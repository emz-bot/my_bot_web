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
        <n-image height="100" :src="i.url" />
        <n-button class="delete" type="error" round @click="del_meme(i._id)">x</n-button>
        </div>
    </n-space>
  </n-image-group>
</template>

<script setup>
import { NSpace, NImageGroup, NImage, NButton, NPagination } from "naive-ui";
import { api_get_meme, api_meme } from "@/utils/api";
import { ref } from "vue";
const memes = ref([]);
const page = ref()
const page_count = ref()

async function del_meme(meme_id) {
    var req_data = {
        meme_id: meme_id,
        method: "del"
    }
    await api_meme(req_data).then((res) => {
    if (res.code == 200) {
        get_meme()
    } else {
        message.error(res.msg)
    }
  });
}

async function get_meme() {
    var req_data = {page: page.value}
    await api_get_meme(req_data).then((res) => {
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