<template>
<n-space>
  <n-button quaternary circle @click="start">
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6c0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93c0-4.42-3.58-8-8-8zm-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34A8.014 8.014 0 0 0 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91z" fill="currentColor"></path></svg>
    </template>
  </n-button>
  <n-button type="success" quaternary circle @click="add_bot">
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28">
        <g fill="none"><path d="M14.5 13V3.754a.75.75 0 0 0-1.5 0V13H3.754a.75.75 0 0 0 0 1.5H13v9.253a.75.75 0 0 0 1.5 0V14.5l9.25.003a.75.75 0 0 0 0-1.5L14.5 13z" fill="currentColor"></path></g>
      </svg>
    </template>
  </n-button>
  <n-input type="text" v-model:value="re_data.bot_id" placeholder="机器人QQ" clearable @input="start"/>
  <n-input type="text" v-model:value="re_data.master" placeholder="主人QQ" clearable @input="start"/>
</n-space>
<br>
  <n-pagination
    v-model:page="re_data.page"
    :page-count="re_data.page_count"
    @update:page="start"
    show-quick-jumper
  />
  <br>
  <n-table size="small" :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th style="width: 240px">QQ</th>
        <th>节点名称</th>
        <th style="width: 120px">加群</th>
        <th style="width: 200px">登陆时间</th>
        <th>重启</th>
        <th>是否公开</th>
        <th v-if="user_permission >= 4">更多</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in re_data.data" :key="i.id">
        <td>
          <n-space>
            <n-space>
              <n-avatar
                size="large"
                :src="'https://q1.qlogo.cn/g?b=qq&nk=' + i._id + '&s=1'"
              />
            </n-space>
            <n-space vertical size="small">
              <n-text :type="isOK[i.online_status]">
                <div>{{ i._id }}</div>
                <div>{{ i.bot_name }}</div>
              </n-text>
            </n-space>
          </n-space>
        </td>
        <td>
          {{ i.node_name }}
        </td>
        <td>
          <n-input-number
            v-model:value="i.access_group_num"
            :show-button="false"
            :bordered="false"
            @blur="set_group_num(i._id, i.access_group_num)"
          >
            <template #prefix>
              <n-text :type="isOK[i.group_num < i.access_group_num]">
                {{ i.group_num }}
              </n-text>
              /
            </template>
          </n-input-number>
        </td>
        <td>{{ i.login_data }}</td>
        <td>
          <n-button
            quaternary
            circle
            type="primary"
            @click="manipulate('restart', i._id, i.node_name)"
          >
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 32 32"
              >
                <path
                  d="M26 18A10 10 0 1 1 16 8h6.182l-3.584 3.585L20 13l6-6l-6-6l-1.402 1.414L22.185 6H16a12 12 0 1 0 12 12z"
                  fill="currentColor"
                ></path>
              </svg>
            </template>
          </n-button>
        </td>
        <td>
          <n-switch
            v-model:value="i.work_stat"
            @update:value="manipulate('set_status', i._id)"
          >
            <template #checked-icon> 🙃 </template>
            <template #unchecked-icon> 🙂 </template>
          </n-switch>
        </td>
        <td v-if="user_permission >= 5">
          <n-button
            quaternary
            circle
            :type="is_enable[i.enable]"
            @click="open_modal(i)"
          >
            <template #icon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 32 32"
              >
                <g fill="none">
                  <path
                    d="M9.5 16a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0zm9 0a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0zm6.5 2.5a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            </template>
          </n-button>
        </td>
      </tr>
    </tbody>
    <n-modal
      v-model:show="showModal"
      preset="dialog"
      title="机器人配置"
    >
      <template #header-extra />
      <br>
      <div>
        <n-input-group>
          允许使用
        <n-switch v-model:value="enable" />
        </n-input-group>
      </div>
      <br>
      <div>
        <n-input-group>
          <n-input-group-label>主人QQ</n-input-group-label>
          <n-input-number v-model:value="master" :show-button="false" />
        </n-input-group>
      </div>
      <template #action>
        <div>
          <n-button style="margin: 10px" type="error" @click="manipulate('del')">删除</n-button>
          <n-button @click="set_bot_info">确定</n-button>
        </div>
      </template>
    </n-modal>
    <n-modal
      v-model:show="addModal"
      title="添加机器人"
      preset="dialog"
    >
      <template #header-extra />
      <br>
      <div>
        <n-input-group>
          <n-input-group-label>主人QQ</n-input-group-label>
          <n-input-number v-model:value="master" :show-button="false" />
        </n-input-group>
      </div>
      <br>
      <div>
        <n-input-group>
          <n-input-group-label>机器人QQ</n-input-group-label>
          <n-input-number v-model:value="bot_id" :show-button="false" />
        </n-input-group>
      </div>
      <template #action>
        <div>
          <n-button @click="set_bot_info">确定</n-button>
        </div>
      </template>
    </n-modal>
  </n-table>
</template>
<script setup>
import {
  NInput,
  NInputGroup,
  NInputGroupLabel,
  NModal,
  NSpace,
  NAvatar,
  NTable,
  NSwitch,
  NButton,
  NText,
  NInputNumber,
  NPagination,
  useMessage,
} from "naive-ui";
import { ref } from "vue";
import {
  get_bot_list,
  set_access_group_num,
  manipulate_bot,
} from "@/utils/api";
import { useRouter } from "vue-router";

var user_permission = ref(localStorage.user_permission);

const isOK = ref({
  true: "",
  false: "error",
});

const is_enable = ref({
  true: "info",
  false: "warning",
});
const router = useRouter();
const resData = ref([]);
const message = useMessage();

const showModal = ref();
const enable = ref();
const master = ref(747761541);
const bot_id = ref();

function open_modal(data) {
  bot_id.value = data._id;
  enable.value = data.enable;
  master.value = data.master;
  showModal.value = true;
}

const addModal = ref(false);

function add_bot() {
  bot_id.value = null;
  master.value = null;
  addModal.value = true;
}

async function start() {
  if (!localStorage.token) {
    message.error("账号未登录, 前往登录页面..", { duration: 5e3 });
    setTimeout(() => {
      router.push({ path: "/login" });
    }, 1000);
  }
  let filter = {}
  if (resData.value.bot_id){
    filter._id = Number(resData.value.bot_id)
  }
  if (resData.value.master){
    filter.master = Number(resData.value.master)
  }
  await get_bot_list({page: resData.value.page, filter: filter}).then((res) => {
    if (res.code == 200) {
      resData.value = res;
      console.log(res);
    } else {
      message.error(res.msg, { duration: 5e3 });
      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1000);
    }
  });
}
start();

async function set_bot_info() {
  var req_data = {
    action: "set_info",
    data: {
      bot_id: bot_id.value,
      enable: enable.value,
      master: master.value,
    },
  };
  await manipulate_bot(req_data).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
      addModal.value = false;
      showModal.value = false;
      start();
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}

async function manipulate(action, ac_bot_id, node_name) {
  if (action == "del") {
    ac_bot_id = bot_id.value;
  }
  var req_data = {
    action: action,
    data: {
      bot_id: ac_bot_id,
      node_name: node_name,
    },
  };
  await manipulate_bot(req_data).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
      showModal.value = false;
      start();
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}

async function set_group_num(bot_id, access_group_num) {
  var req_data = {
    action: "set_access_group_num",
    data: {
      access_group_num: access_group_num,
      bot_id: bot_id,
    },
  };
  await set_access_group_num(req_data).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}
var re_data = resData;
</script>