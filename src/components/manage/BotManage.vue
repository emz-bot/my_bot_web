<template>
<n-space v-if="user_permission >= 3">
  <n-button quaternary circle @click="start">
    <n-icon size="22">
      <Reload />
    </n-icon>
  </n-button>
  <n-button type="success" quaternary circle @click="add_bot" >
    <n-icon size="22">
      <Add />
    </n-icon>
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
        <th style="width: 280px">QQ</th>
        <th>节点名称</th>
        <th style="width: 120px">加群</th>
        <th style="width: 160px">登陆时间</th>
        <th>是否公开</th>
        <th v-if="user_permission >= 1">更多</th>
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
          <n-switch
            v-model:value="i.work_stat"
            @update:value="manipulate('set_status', i._id)"
          >
            <template #checked-icon> 🙃 </template>
            <template #unchecked-icon> 🙂 </template>
          </n-switch>
        </td>
        <td v-if="user_permission >= 1">
          <n-button
            quaternary
            circle
            :type="is_enable[i.enable]"
            @click="open_modal(i)"
          >
            <n-icon size="22">
              <EllipsisHorizontal />
            </n-icon>
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
import { Add, EllipsisHorizontal, Reload } from '@vicons/ionicons5'
import {
  NIcon,
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
  await manipulate_bot(req_data).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}
var re_data = resData;
</script>