<template>
  <n-space>
    <n-date-picker
      v-model:value="data.date_range"
      type="datetimerange"
      @update:value="update_date"
      clearable
    />
    <n-switch :rail-style="railStyle">
      <template #checked> 正序 ↑ </template>
      <template #unchecked> 倒序 ↓ </template>
    </n-switch>
    <n-input-group>
      <n-input type="text" v-model:value="data.qq" placeholder="QQ" clearable />
      <n-input
        type="text"
        v-model:value="data.group_id"
        placeholder="群号"
        clearable
      />
      <n-input
        type="text"
        v-model:value="data.message"
        placeholder="消息正则"
        clearable
      />
    </n-input-group>
    <n-input
      type="text"
      v-model:value="data.limit"
      placeholder="每页显示(默认100)"
      clearable
    />
    <n-button
      type="primary"
      :loading="loading"
      attr-type="button"
      @click="start"
    >
      搜索
    </n-button>
  </n-space>
  <n-card :bordered="false">
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
        <n-divider title-placement="left">{{ i.sent_time }}</n-divider>
        <n-space>
          <n-space>
            <n-avatar size="large" :src="i.qlogo" />
          </n-space>
          <n-space vertical size="small">
            <div class="user_info">{{ i.group_name }}({{ i.group_id }})</div>
            <div class="user_info">{{ i.nickname }}({{ i.user_id }})</div>
          </n-space>
        </n-space>
        <n-space vertical size="medium" v-for="n in i.message_list" :key="n.id">
          <n-image
            v-if="n.type == 'img'"
            class="user_message"
            :src="window.gurl.SERVICE_CONTEXT_PATH + '/get_chat_img?img=' + n.content"
          />
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
  NDatePicker,
  NInput,
  NInputGroup,
  NSpace,
  NButton,
  NAvatar,
  NImage,
  NDivider,
  NSkeleton,
  NPagination,
  NSwitch,
  NCard,
} from "naive-ui";
import { ref } from "vue";
import { get_chat_log } from "@/utils/api";

var data = ref({
  qq: "",
  group_id: "",
  message: "",
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

async function start() {
  loadingRef.value = true;
  reqData.qq = data.value.qq;
  reqData.group_id = data.value.group_id;
  reqData.message = data.value.message;
  reqData.limit = data.value.limit;
  reqData.page = data.value.page;
  resData.value = {};
  console.log(resData);
  await get_chat_log(reqData).then((res) => {
    if (res.code == 200) {
      data.value.page_show = true;
      loadingRef.value = false;
      resData.value = res.data;
      data.value.page_count = res.page_count;
      console.log(resData);
    } else {
      loadingRef.value = false;
      console.log(3333333);
    }
  });
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
var re_data = resData;
var loading = loadingRef;
</script>

<style>
body {
  background: #1d1d1d;
}
.user_message {
  border-radius: 15px;
  font-size: 14px;
  padding-left: 5%;
}

.user_info {
  font-size: 8px;
}
.n-card--bordered {
  width: 50%;
  margin: 0 auto;
}
.n-divider__title {
  font-size: 14px;
  color: darkgrey;
}
.user_message img {
  max-width: 80% !important;
  height: auto !important;
}
</style>