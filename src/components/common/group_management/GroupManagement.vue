<template>
  <n-table size="small" :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th style="width: 280px">群</th>
        <th>群开关</th>
        <th>服务器</th>
        <th>活跃值</th>
        <th>通知开关</th>
        <th>到期时间</th>
        <th>配置</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in group_list" :key="i.id">
        <td>
          <n-space>
            <n-space>
              <n-avatar
                size="large"
                :src="`http://p.qlogo.cn/gh/${i._id}/${i._id}/100/`"
              />
            </n-space>
            <n-space vertical size="small">
              <div>{{ i._id }}</div>
              <div>{{ i.group_name }}</div>
            </n-space>
          </n-space>
        </td>
        <td>{{ i.group_switch }}</td>
        <td>
          {{ i.server }}
        </td>
        <td>
          {{ i.robot_active }}
        </td>
        <td>开关</td>
        <td>
          {{ i.expire_date }}({{ i.expire_days }})
        </td>
        <td>
          配置
        </td>
      </tr>
    </tbody>
    <n-modal
      id="bot_conf"
      v-model:show="showModal"
      preset="dialog"
      title="机器人配置"
    >
      <template #header-extra />
      <br>
      <div>
        <n-input-group>
          <n-button
            v-model:value="bot_data[cur_bot_id].enable"
            :type="isOK[bot_data[cur_bot_id].enable]"
            @click="bot_data[cur_bot_id].enable=!bot_data[cur_bot_id].enable"
          >
            {{ enable_stat[bot_data[cur_bot_id].enable] }}
          </n-button>
          <n-input-group-label>主人QQ</n-input-group-label>
          <n-input-number v-model:value="bot_data[cur_bot_id].master" :show-button="false" />
          <n-button tertiary @click="set_bot_info(cur_bot_id)">确定</n-button>
        </n-input-group>
        <br>
        <span>
          开启收费<n-switch v-model:value="bot_data[cur_bot_id].is_com" @update:value="set_bot_info(cur_bot_id)" />
        </span>
      </div>
      <br>
      <n-table :bordered="false" :single-line="false">
        <thead>
          <tr>
            <th style="width: 250px">群</th>
            <th>群开关</th>
            <th>服务器</th>
            <th>活跃值</th>
            <th>最后发言</th>
            <th>到期时间</th>
            <th>退群</th>
            <th>续费</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in group_list" :key="i.id">
            <td>
              <n-space>
                <n-space>
                  <n-avatar
                    size="large"
                    :src="`http://p.qlogo.cn/gh/${i._id}/${i._id}/100/`"
                  />
                </n-space>
                <n-space vertical size="small">
                  <div>{{ i._id }}</div>
                  <div>{{ i.group_name }}</div>
                </n-space>
              </n-space>
            </td>
            <td>{{i.group_switch}}</td>
            <td>{{i.server}}</td>
            <td>{{i.robot_active}}</td>
            <td>{{i.last_sent}}</td>
            <td>{{i.expire_date}}({{i.expire_days}})</td>
            <td><n-button type="error" quaternary @click="exit_group(i.bot_id, i._id)">退群</n-button></td>
            <td>
              <n-input-group>
                <n-input-number v-model:value="renewal_num[i._id]" :show-button="false" :bordered="false">
                  <template #suffix>
                    天
                  </template>
                </n-input-number>
                <n-button @click="renewal(i.bot_id, i._id)">续费</n-button>
              </n-input-group>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-modal>
    <n-modal
      v-model:show="delbot"
      title="删除机器人"
      preset="dialog"
    >
      <template #header-extra />
      <br>
      确定删除 {{delbot_id}} ?
      <div>
        <n-input-number :status="del_stat" @input="check_del_bot" v-model:value="cur_delbot_id" placeholder="重复输入上面的QQ" :show-button="false"></n-input-number>
      </div>
      <template #action>
        <div>
          <n-button type="error" :disabled="del_btn" @click="manipulate('del', cur_delbot_id)">删除</n-button>
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
  get_group_list_for_master,
  manipulate_bot,
  api_get_group_list,
  api_renewal,
  api_pay,
  api_exit_group,
  api_cancel_order
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

const enable_stat = ref({
  true: "正在使用",
  false: "已停用",
});

const router = useRouter();
const resData = ref([]);
const message = useMessage();

const showModal = ref();

const bot_data = ref({});

const cur_bot_id = ref();

const group_list = ref([])
const renewal_num = ref({})

const delbot = ref(false);
const delbot_id = ref();
const cur_delbot_id = ref();
const del_stat = ref()
const del_btn = ref(true)

async function open_modal(bot_id) {
  showModal.value = true;
  cur_bot_id.value = bot_id;
  console.log(cur_bot_id.value)
  await api_get_group_list({bot_id: bot_id}).then((res) => {
    if (res.code == 200) {
      group_list.value = res.data
    } else {
      message.error("账号未登录, 前往登录页面..");
      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1000);
      message.error(res.msg);
    }
  });
}


async function start() {
  delbot.value = false
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
  if (resData.value.bot_name){
    filter.bot_name = resData.value.bot_name
  }
  if (resData.value.master){
    filter.master = Number(resData.value.master)
  }

  await get_group_list_for_master({}).then((res) => {
    if (res.code == 200) {
      group_list.value = res.data
      if (res.token) {
        localStorage.token = res.token
      }
    } else {
      message.error("账号未登录, 前往登录页面..", { duration: 5e3 });
      setTimeout(() => {
        router.push({ path: "/login" });
      }, 1000);
      message.error(res.msg, { duration: 5e3 });
    }
  });
}
start();

async function set_bot_info(bot_id=null) {
  if (!bot_id){
    bot_id = cur_bot_id.value
  }
  var set_data = {
    "is_com": bot_data.value[bot_id]["is_com"],
    "enable": bot_data.value[bot_id]["enable"],
    "master": bot_data.value[bot_id]["master"]
  }
  var req_data = {
    action: "set_info",
    data: {bot_id: bot_id, data: set_data},
  };
  await manipulate_bot(req_data).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
      addModal.value = false;
      showModal.value = false;
      open_modal(cur_bot_id.value);
      start();
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}

async function manipulate(action, ac_bot_id, node_name) {
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
async function set_bot_name(bot_id, bot_name) {
  var req_data = {
    action: "set_bot_name",
    data: {
      bot_name: bot_name,
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
<style>
#bot_conf {
    width: 1200px;
    max-width: calc(100vw - 32px);
}
#paying {
    width: 470px;
    max-width: calc(100vw - 32px);
}
</style>
