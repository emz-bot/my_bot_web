<template>
  <n-space>
      <n-date-picker
        v-model:value="data.date_range"
        type="datetimerange"
        @update:value="update_date"
        clearable
      />
      <n-input type="text" v-model:value="data.qq" placeholder="QQ" clearable />
      <n-input type="text" v-model:value="data.nickname" placeholder="昵称" clearable />
      <n-input type="text" v-model:value="data.group_id" placeholder="群号" clearable />
      <n-input type="text" v-model:value="data.group_name" placeholder="群名" clearable />
      <n-input type="text" v-model:value="data.bot_id" placeholder="机器人" clearable />
      <n-input type="text" v-model:value="data.message" placeholder="消息正则" clearable />
    <div>
      <n-switch :rail-style="railStyle">
        <template #checked> 正序 ↑ </template>
        <template #unchecked> 倒序 ↓ </template>
      </n-switch>
      <n-button style="width: 100px;margin: 10px" type="primary" :loading="loading" attr-type="button" @click="start" >
        搜索
      </n-button>
    </div>
  </n-space>
  <n-card :bordered="false" style="overflow: auto; height: 720px">
    <n-pagination
      v-if="data.page_show"
      v-model:page="data.page"
      :page-count="data.page_count"
      @update:page="start"
      show-quick-jumper
    />
    <n-skeleton v-if="loadingRef" text :repeat="6" />
    <template v-else>
      <n-space vertical size="medium" v-for="i in re_data" :key="i.id">
        <n-divider title-placement="left">{{ i.sent_time }} ({{ i.bot_id }})</n-divider>
        <n-space>
          <n-space>
            <n-avatar size="large" :src="i.qlogo" />
          </n-space>
          <n-space vertical size="small">
            <div class="user_info">
              <div>
                {{ i.group_name }} (<n-tag size="small" checkable @click="find_group(i.group_id)">{{ i.group_id }}</n-tag>)
                <n-tag v-if="i.role=='owner'" size="small" type="warning"> 群主 </n-tag>
                <n-tag v-else-if="i.role=='admin'" size="small" type="success"> 管理 </n-tag>
              </div>
              <div>
                {{ i.nickname }} (<n-tag size="small" checkable @click="find_user(i.user_id)">{{ i.user_id }}</n-tag>)
              </div>
            </div>
          </n-space>
        </n-space>
        <n-space vertical size="medium" v-for="n in i.message_list" :key="n.id">
          <div class="container" v-if="n.type == 'img'">
            <n-image
              class="user_message user_image"
              :src="n.content"
            />
            <n-button class="meme_btn" type="info" round @click="add_meme(n.content)">
              +
            </n-button>
          </div>
          <p class="user_message" v-if="n.type == 'text'">
            {{ n.content }}
          </p>
        </n-space>
      </n-space>
      <n-pagination
        v-if="data.page_show"
        v-model:page="data.page"
        :page-count="data.page_count"
        @update:page="start"
        show-quick-jumper
      />
    </template>
  </n-card>
</template>
<script setup>
import {
  NTag,
  NDatePicker,
  NInput,
  NSpace,
  NButton,
  NAvatar,
  NImage,
  NDivider,
  NSkeleton,
  NPagination,
  NSwitch,
  NCard,
  useMessage
} from "naive-ui";
import { ref } from "vue";
import { get_chat_log, api_meme } from "@/utils/api";

const message = useMessage();

var data = ref({
  page: 1,
  page_count: 1,
  limit: null,
  page_show: false,
  date_range: [Date.now(), Date.now()],
});
const loadingRef = ref(false);
const resData = ref([]);
var reqData = {};

function update_date() {
  reqData.date_start = data.value.date_range[0];
  reqData.date_end = data.value.date_range[1];
}

async function start(is_login) {
  loadingRef.value = is_login;
  reqData.qq = data.value.qq;
  reqData.nickname = data.value.nickname;
  reqData.group_id = data.value.group_id;
  reqData.group_name = data.value.group_name;
  reqData.bot_id = data.value.bot_id;
  reqData.message = data.value.message;
  reqData.page = data.value.page;
  await get_chat_log(reqData).then((res) => {
    if (res.code == 200) {
      data.value.page_show = true;
      loadingRef.value = false;
      resData.value = res.data;
      console.log(res.data)
      data.value.page_count = res.page_count;
    } else {
      loadingRef.value = false;
    }
  });
}
start()

function find_user(user_id) {
  data.value.qq = user_id
  data.value.group_id = null
  data.value.message = null
  start()
}
function find_group(group_id) {
  data.value.qq = null
  data.value.group_id = group_id
  data.value.message = null
  start()
}

function railStyle({ focused, checked }) {
  const style = {};
  if (checked) {
    style.background = "#d03050";
    reqData.sort = 1;
    if (focused) {
      style.boxShadow = "0 0 0 2px #d0305040";
    }
  } else {
    reqData.sort = -1;
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
}

async function add_meme(meme_url) {
    var req_data = {
        meme_url: meme_url,
        method: "add"
    }
    await api_meme(req_data).then((res) => {
    if (res.code == 200) {
        message.success(res.msg)
    } else {
        message.error(res.msg)
    }
  });
}

var re_data = resData;
var loading = loadingRef;
</script>

<style>

.container {
  display: inline-block;
  position: relative;
}

.container .meme_btn {
  position: absolute;
  top: 3px;
  right: 10px;
  display: none;
}

.user_message {
  border-radius: 15px;
  font-size: 14px;
  padding-left: 20px;
}
.user_message .user_image {
  max-width: 80%;
}
.user_image img {
  width: 100%;
}

.user_info {
  font-size: 10px;
}

.n-divider__title {
  font-size: 14px;
  color: darkgrey;
}


.container:hover .meme_btn {
  display: inline-block;
}

</style>