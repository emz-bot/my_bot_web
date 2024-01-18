<template>
  <n-space>
    <n-select v-model:value="server" :options="options" :consistent-menu-width="false" />
    <n-input v-model:value="names_str"/>
    <n-button @click="input">批量导入</n-button>
    <n-button @click="start" :loading="loading">查询</n-button>
    <n-switch size="large" v-model:value="auto_update" @update:value="start">
      <template #checked>
        自动刷新
      </template>
      <template #unchecked>
        停止刷新
      </template>
    </n-switch>
  </n-space>
  <br>
  <n-space>
    <n-dynamic-tags v-model:value="names" />
  </n-space>
  <br>
  <n-space vertical size="medium">
    <n-data-table
      :data="tableData"
      striped
      :columns="columns"
      scroll-x="1000"
      :max-height="table_height"
    >
    </n-data-table>
  </n-space>
</template>
<script setup>
import { ref } from "vue";
import { api_get_role_online } from "@/utils/api";
import { NSpace, NDataTable, NSwitch, NButton, NDynamicTags, NSelect, NInput, useMessage } from "naive-ui";
const message = useMessage();
const table_height = ref(window.innerHeight - 330);

const options = ref([
  {label: "破阵子", value: "破阵子"},
  {label: "唯我独尊", value: "唯我独尊"},
  {label: "天鹅坪", value: "天鹅坪"},
  {label: "梦江南", value: "梦江南"},
  {label: "斗转星移", value: "斗转星移"},
  {label: "幽月轮", value: "幽月轮"},
  {label: "绝代天骄", value: "绝代天骄"},
  {label: "龙争虎斗", value: "龙争虎斗"},
  {label: "蝶恋花", value: "蝶恋花"},
  {label: "长安城", value: "长安城"},
  {label: "剑胆琴心", value: "剑胆琴心"},
  {label: "乾坤一掷", value: "乾坤一掷"},
  {label: "飞龙在天", value: "飞龙在天"},
  {label: "青梅煮酒", value: "青梅煮酒"},
])

const auto_update = ref(false);
const loading = ref(false);
const server = ref("破阵子");
const names = ref([]);
const names_str = ref();

const tableData = ref([]);

const columns = ref([
  {
    title: "角色名",
    key: "name",
    width: 50,
  },
  {
    title: "体型",
    key: "body",
    width: 70,
  },
  {
    title: "阵营",
    key: "camp",
    width: 70,
  },
  {
    title: "帮会",
    key: "tong",
    width: 70,
  },
  {
    title: "位置",
    key: "map",
    width: 70,
    sorter: 'default',
    defaultFilterOptionValues: ['离线'],
    filterOptions: [
      {
        label: '不显示离线',
        value: '离线'
      },
    ],
    filter (value, row) {
      return row.map != value
    }
  },
  ]);

let intervalId = null;

function request() {
  localStorage.role_online_server = server.value;
  localStorage.role_online_names = names.value.join(",");
  api_get_role_online({"server": server.value, "names": names.value}).then((res) => {
    if (res.code == 200) {
      tableData.value = res.data
    } else {
      message.error(res.msg);
    }
    loading.value = false;
  });
}

function input() {
  names.value = Array.from(new Set([...names.value, ...names_str.value.split(/\s+/)]))
}

function start() {
  loading.value = true;
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (auto_update.value) {
    intervalId = setInterval(request, 5000);
  } else {
    request();
  }
}

function init() {
  if (localStorage.role_online_server) {
    server.value = localStorage.role_online_server;
  }
  if (localStorage.role_online_names) {
    names.value = localStorage.role_online_names.split(",");
  }
}
init()
</script>

<style scoped>
</style>