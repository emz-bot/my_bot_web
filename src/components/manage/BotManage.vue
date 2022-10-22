<template>
<n-input-group style="width: 380px;text-align:center">
<n-input-group-label>还剩 <strong>{{ re_data.time_left }}</strong> 天可分配</n-input-group-label>
<n-input-number v-model:value="purchase_quantity" min=1 :max="max - parseInt(re_data.time_left / 31)" :show-button="false" :bordered="false" :placeholder="`1 到 ${max - parseInt(re_data.time_left / 31)} 个月`">
  <template #prefix>
    再冲它
  </template>
  <template #suffix>
    个月
  </template>
</n-input-number>
<n-button @click="buy">冲！</n-button>
</n-input-group>
<br>
<br>
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
          <n-button quaternary type="error" @click="manipulate('del', i._id)">删除</n-button>
        </td>
        <td v-if="user_permission >= 1">
          <n-button
            quaternary
            circle
            :type="is_enable[i.enable]"
            @click="open_modal(i._id)"
          >
            <n-icon size="22">
              <EllipsisHorizontal />
            </n-icon>
          </n-button>
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
          <n-button tertiary @click="set_bot_info">确定</n-button>
        </n-input-group>
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
            <td>{{i.expire_date}}</td>
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
          <n-input-number v-model:value="input_bot_id" :show-button="false" />
        </n-input-group>
      </div>
      <template #action>
        <div>
          <n-button @click="set_bot_info">确定</n-button>
        </div>
      </template>
    </n-modal>
  </n-table>
  <n-modal
    id="paying"
    v-model:show="paying"
    title="打钱"
    preset="dialog"
  >
    <template #header-extra />
    <div v-for="i in pay_data.msg" :key="i.id">
      <h4>{{i}}</h4>
    </div>
    <img :src="`data:image/png;base64, ${pay_data.rqcode_str}`"/>
    <n-button @click="cancel_order(pay_data.order_id)">取消订单</n-button>
  </n-modal>
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
  api_get_group_list,
  api_renewal,
  api_pay,
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

const max = ref(12)

const router = useRouter();
const resData = ref([]);
const message = useMessage();

const purchase_quantity = ref()
const pay_data = ref({})

const showModal = ref();
const paying = ref();

const bot_data = ref({});

const input_bot_id = ref();

const cur_bot_id = ref();

const group_list = ref([])
const renewal_num = ref({})

const addModal = ref(false);

function add_bot() {
  bot_id.value = null;
  master.value = null;
  addModal.value = true;
}

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

async function renewal(bot_id, group_id){
  console.log(bot_id, group_id, renewal_num.value[group_id])
  if (!renewal_num.value[group_id]){
    message.warning("输入具体时间!");
    return
  }
  await api_renewal({bot_id: bot_id, group_id: group_id, renewal_day: renewal_num.value[group_id]}).then((res) => {
    if (res.code == 200) {
      open_modal(bot_id);
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
  });
}
async function buy(){
  if (!purchase_quantity.value) {
    message.warning("你得写上冲几个月吧")
    retuen
  }
  await api_pay({subject: "机器人", num: purchase_quantity.value}).then((res) => {
    if (res.code == 200) {
      pay_data.value["rqcode_str"] = res.img_base64
      pay_data.value["msg"] = res.msg
      pay_data.value["order_id"] = res.order_id
      paying.value = true
      // message.success(res.msg);
    } else {
      message.error(res.msg);
    }
  });
}

async function cancel_order(order_id){
  await api_cancel_order({order_id: order_id}).then((res) => {
      if (res.code == 200) {
        message.success(res.msg);
        paying.value = false
      } else {
        message.error(res.msg);
      }
    });
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
      for (var i=0;i<res.data.length;i++)
      {
        let bot_id = res.data[i]["_id"]
          let master = res.data[i]["master"]
          let enable = res.data[i]["enable"]
          bot_data.value[bot_id] = {
            "master": master,
            "enable": enable
          };
      }
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

async function set_bot_info() {
  var req_data = {
    action: "set_info",
    data: {
      bot_id: cur_bot_id.value,
      enable: bot_data.value[cur_bot_id.value].enable,
      master: bot_data.value[cur_bot_id.value].master,
    },
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