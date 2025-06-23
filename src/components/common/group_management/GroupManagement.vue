<template>
  <n-table size="small" :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th style="width: 280px">群</th>
        <th>群开关</th>
        <th>服务器</th>
        <th>活跃值</th>
        <th>到期时间</th>
        <th>群配置</th>
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
        <td><n-switch v-model:value="i.group_switch" /></td>
        <td>
          <n-select v-model:value="i.server" />
        </td>
        <td>
          <n-input-number
            v-model:value="i.robot_active"
            :min="0"
            :max="99"
          />
        </td>
        <td>
          {{ i.expire_date }}({{ i.expire_days }}天)
        </td>
        <td>
          <n-button
            quaternary
            type="info"
            size="small"
            @click="show_conf_modal(i)"
            >配置
          </n-button>
        </td>
      </tr>
    </tbody>
    <n-modal
      v-model:show="showConfModal"
      title="群配置"
      :width="1200"
      :max-width="`calc(100vw - 32px)`"
    >
      <GroupConf :group_data="GroupData" />
    </n-modal>
  </n-table>
</template>
<script setup>
import { Add, EllipsisHorizontal, Reload } from '@vicons/ionicons5'
import {
  NSelect,
  NSpace,
  NAvatar,
  NTable,
  NSwitch,
  NButton,
  NInputNumber,
  NModal,
  useMessage,
} from "naive-ui";
import { ref } from "vue";
import {
  get_group_list_for_master,
} from "@/utils/api";
import { useRouter } from "vue-router";
import GroupConf from "./GroupConf.vue";

var user_permission = ref(localStorage.user_permission);

const router = useRouter();
const resData = ref([]);
const message = useMessage();

const group_list = ref([])

const delbot = ref(false);

const showConfModal = ref(false);
const GroupData = ref({});

async function show_conf_modal(group_data) {
  GroupData.value = group_data;
  showConfModal.value = true;
};

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
