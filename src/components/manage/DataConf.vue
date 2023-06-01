<template>
  <n-card :bordered="false">
    <h1>烂柯山</h1>
    <n-table size="small" :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th>区服</th>
          <th>关隘</th>
          <th>阵营</th>
          <th>进攻时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in resData.data" :key="i.id">
          <td>
            {{ i.server }}
          </td>
          <td>
            {{ i.stronghold }}
          </td>
          <td>
            <n-select
              :options="selectcamp"
              v-model:value="i.camp"
              @update:value="set_lankeshan(i)"
            />
          </td>
          <td>
            <n-date-picker
              v-model:value="i.time"
              type="datetime"
              format="yyyy-MM-dd HH:mm:ss"
              @update:value="set_lankeshan(i)"
              clearable
            />
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>
<script setup>
import {
  NTable,
  NInput,
  NDatePicker,
  NSelect,
  NInputNumber,
  NInputGroup,
  NInputGroupLabel,
  NSpace,
  NTime,
  NButton,
  NCard,
  useMessage,
} from "naive-ui";
import { h, ref } from "vue";
import { api_get_lankeshan, api_set_lankeshan } from "@/utils/api";

const Y = ref(0);
const M = ref(0);
const D = ref(0);
const selectcamp = ref([
  {
    label: "恶人谷",
    value: "恶人谷",
  },
  {
    label: "浩气盟",
    value: "浩气盟",
  },
  {
    label: "中立",
    value: "中立",
  },
]);
const resData = ref([]);
const message = useMessage();

async function set_lankeshan(updateData) {
    updateData = {
        name: updateData.server+updateData.stronghold,
        data: {
            camp: updateData.camp,
            time: updateData.time/1000,
        }
    }
    console.log(updateData)
    await api_set_lankeshan(updateData).then((res) => {
        if (res.code == 200) {
        message.success("设置成功");
        } else {
        message.error(res.msg);
        }
    });
}

async function get_lankeshan() {
  await api_get_lankeshan().then((res) => {
    if (res.code == 200) {
      for (let i = 0; i < res.data.length; i++) {
        res.data[i].time *= 1000;
      }
      resData.value = res;
    } else {
      message.error(res.msg);
    }
  });
}
get_lankeshan();
</script>
