<template>
  <n-table size="small" :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th style="width: 100px;">QQ</th>
        <th style="width: 200px;">名称</th>
        <th style="width: 120px;">加群</th>
        <th style="width: 200px;">登陆时间</th>
        <th>重启</th>
        <th>工作开关</th>
        <th v-if="user_permission >= 5">删除</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="i in re_data" :key="i.id">
        <td>{{ i._id }}</td>
        <td>
            <n-text :type="isOK[i.online_status]">
              {{ i.bot_name }}
            </n-text>
        </td>
        <td>
          <n-input-number v-model:value="i.access_group_num" :show-button="0" :bordered="0" @blur="set_group_num(i._id, i.access_group_num)">
            <template #prefix>
              <n-text :type="isOK[i.group_num<i.access_group_num]">
                {{ i.group_num }}
              </n-text> /
            </template>
          </n-input-number>

        </td>
        <td>{{ i.login_data }}</td>
        <td>
          <n-button quaternary circle type="primary" @click='manipulate("restart", i._id)'>
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M26 18A10 10 0 1 1 16 8h6.182l-3.584 3.585L20 13l6-6l-6-6l-1.402 1.414L22.185 6H16a12 12 0 1 0 12 12z" fill="currentColor"></path></svg>
            </template>
          </n-button>
        </td>
        <td>
          <n-switch v-model:value="i.work_stat" @update:value='manipulate("set_status", i._id)'>
            <template #checked-icon>
                🙃
            </template>
            <template #unchecked-icon>
                🙂
            </template>
          </n-switch>
        </td>
        <td  v-if="user_permission >= 5">
          <n-button quaternary circle type="error" @click='manipulate("del", i._id)'>
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M11.5 4a1.5 1.5 0 0 0-3 0h-1a2.5 2.5 0 0 1 5 0H17a.5.5 0 0 1 0 1h-.554L15.15 16.23A2 2 0 0 1 13.163 18H6.837a2 2 0 0 1-1.987-1.77L3.553 5H3a.5.5 0 0 1-.492-.41L2.5 4.5A.5.5 0 0 1 3 4h8.5zm3.938 1H4.561l1.282 11.115a1 1 0 0 0 .994.885h6.326a1 1 0 0 0 .993-.885L15.438 5zM8.5 7.5c.245 0 .45.155.492.359L9 7.938v6.125c0 .241-.224.437-.5.437c-.245 0-.45-.155-.492-.359L8 14.062V7.939c0-.242.224-.438.5-.438zm3 0c.245 0 .45.155.492.359l.008.079v6.125c0 .241-.224.437-.5.437c-.245 0-.45-.155-.492-.359L11 14.062V7.939c0-.242.224-.438.5-.438z" fill="currentColor"></path></g></svg>
            </template>
          </n-button>
        </td>
      </tr>
    </tbody>
    <br>
    <n-button quaternary circle @click="start">
      <template #icon>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 5V2L8 6l4 4V7c3.31 0 6 2.69 6 6c0 2.97-2.17 5.43-5 5.91v2.02c3.95-.49 7-3.85 7-7.93c0-4.42-3.58-8-8-8zm-6 8c0-1.65.67-3.15 1.76-4.24L6.34 7.34A8.014 8.014 0 0 0 4 13c0 4.08 3.05 7.44 7 7.93v-2.02c-2.83-.48-5-2.94-5-5.91z" fill="currentColor"></path></svg>
      </template>
    </n-button>
  </n-table>
</template>
<script setup>
import {
  NTable,
  NSwitch,
  NButton,
  NText,
  NInputNumber,
  useMessage
} from "naive-ui";
import { ref } from "vue";
import { get_bot_list, set_access_group_num, manipulate_bot } from "@/utils/api";
import { useRouter } from "vue-router";

var user_permission = ref(localStorage.user_permission)

const isOK = ref({
  true: "",
  false: "error"
})

const router = useRouter();

const resData = ref([]);

const message = useMessage();

async function start() {
    if (! localStorage.token) {
    message.error("账号未登录, 前往登录页面..", { duration: 5e3 });
    setTimeout(() =>{
      router.push({ path: "/login" });
    },1000);
  }
  await get_bot_list().then((res) => {
    if (res.code == 200) {
      resData.value = res.data
      console.log(resData);
    } else {
      message.error(res.msg, { duration: 5e3 });
    setTimeout(() =>{
      router.push({ path: "/login" });
    },1000);
    }
  });
}
start()
async function manipulate(action, bot_id) {
  var req_data = {
      action: action,
      data: {
        bot_id: bot_id
      }
  }
  await manipulate_bot(req_data).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
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
        bot_id: bot_id
      }
  }
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