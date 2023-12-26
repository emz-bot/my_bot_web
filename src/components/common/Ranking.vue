<template>
  <n-space vertical size="medium">
    <h3>{{ Data.server }}战功榜</h3>
    <div class="table-container">
      <n-data-table
        :data="tableData"
        size="small"
        striped
        :columns="columns"
        scroll-x="1000"
        :max-height="table_height"
        :row-class-name="rowClassName"
      >
      </n-data-table>
    </div>
  </n-space>
</template>
<script setup>
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { ref } from "vue";
import { NSpace, NDataTable } from "naive-ui";
import { get } from "@/utils/http";

const router = useRouter();

const table_height = ref(window.innerHeight - 330);

const Data = ref({
  server: "",
  e: [],
  h: [],
});

const server = ref({});

const tableData = ref([]);

const columns = ref([
  {
    title: "排名",
    key: "恶排名",
    width: 50,
    fixed: "left",
  },
  {
    title: "据点",
    key: "恶据点",
    width: 70,
  },
  {
    title: "人数",
    key: "恶人数",
    width: 70,
  },
  {
    title: "帮主",
    key: "恶帮主",
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "帮会",
    key: "恶帮会",
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "战功",
    key: "恶战功",
    width: 100,
  },
  {
    title: "优势",
    key: "优势",
    className: "youshi",
    width: 50,
  },
  {
    title: "战功",
    key: "浩战功",
    width: 100,
  },
  {
    title: "帮会",
    key: "浩帮会",
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "帮主",
    key: "浩帮主",
    width: 100,
    ellipsis: {
      tooltip: true
    }
  },
  {
    title: "人数",
    key: "浩人数",
    width: 70,
  },
  {
    title: "据点",
    key: "浩据点",
    width: 70,
  },
  {
    title: "排名",
    key: "浩排名",
    width: 50,
  },
]);
async function start(server) {
  var url =
    "https://www.ermaozi.cn/api/v1/jx3/zhangongbang/" + server + "/本周";
  Data.value.server = server;
  await get(url, {}).then((res) => {
    if (res.code == 200) {
      tableData.value = [];
      for (var i = 0; i < res.data[0].data.length; i++) {
        tableData.value.push({
          恶排名: i + 1,
          恶据点: res.data[0].data[i].castle,
          恶人数:
            res.data[0].data[i].nMemberCount +
            "/" +
            res.data[0].data[i].nMaxMemberCount,
          恶帮主: res.data[0].data[i].szMasterName,
          恶帮会: res.data[0].data[i].szTongName,
          恶战功: res.data[0].data[i].nTitlePoint,
          优势: res.data[0].data[i].nTitlePoint >  res.data[1].data[i].nTitlePoint ? "恶" : "浩",
          浩战功: res.data[1].data[i].nTitlePoint,
          浩帮会: res.data[1].data[i].szTongName,
          浩帮主: res.data[1].data[i].szMasterName,
          浩人数:
            res.data[1].data[i].nMemberCount +
            "/" +
            res.data[1].data[i].nMaxMemberCount,
          浩据点: res.data[1].data[i].castle,
          浩排名: i + 1,
        });
      }
      Data.value.e = res.data[0].data;
      Data.value.h = res.data[1].data;
    }
  });
}

const rowClassName = ref((row) => {
    if (row.恶战功 > row.浩战功) {
          return "e_youshi";
      } else {
          return "h_youshi";
      }
  });

start(router.currentRoute.value.params.server);

onBeforeRouteUpdate((to) => {
  start(to.params.server);
});
</script>

<style scoped>
:deep(.e_youshi .youshi) {
  color: rgba(252, 106, 106, 0.75) !important;
}
:deep(.h_youshi .youshi) {
  color: rgba(132, 132, 248, 0.75) !important;
}
</style>