<template>
    <n-space vertical size="medium" id="ranking">
    <h1>
        {{Data.server}}战功榜
    </h1>
    <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>排名</th>
        <th>据点</th>
        <th>人数</th>
        <th>帮主</th>
        <th>帮会</th>
        <th>战功</th>
        <th>优势</th>
        <th>战功</th>
        <th>帮会</th>
        <th>帮主</th>
        <th>人数</th>
        <th>据点</th>
        <th>排名</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(i, index) in Data.e" :key="i.id">
        <td>
            <span v-if="i.rankingChanges > 0" style="color:#2a830f;">{{i.rankingChanges}}<img src="@/assets/img/向上.svg" width="10" height="10"></span>
            <span v-if="i.rankingChanges < 0" style="color:#8f1313;">{{-i.rankingChanges}}<img src="@/assets/img/向下.svg" width="10" height="10"></span>
            {{index + 1}}
        </td>

        <td>{{i.castle}}</td>
        <td>{{i.nMemberCount}}/{{i.nMaxMemberCount}}</td>
        <td>{{i.szMasterName}}</td>
        <td>{{i.szTongName}}</td>
        <td>{{i.nTitlePoint}}</td>
        <td v-if="i.nTitlePoint>Data.h[index].nTitlePoint" style="color: #f51212;">恶</td>
        <td v-else style="color: #1292f5;">浩</td>
        <td>{{Data.h[index].nTitlePoint}}</td>
        <td>{{Data.h[index].szTongName}}</td>
        <td>{{Data.h[index].szMasterName}}</td>
        <td>{{Data.h[index].nMemberCount}}/{{Data.h[index].nMaxMemberCount}}</td>
        <td>{{Data.h[index].castle}}</td>
        <td>{{index + 1}}
            <span v-if="Data.h[index].rankingChanges > 0" style="color:#2a830f;"><img src="@/assets/img/向上.svg" width="10" height="10">{{Data.h[index].rankingChanges}}</span>
            <span v-if="Data.h[index].rankingChanges < 0" style="color:#8f1313;"><img src="@/assets/img/向下.svg" width="10" height="10">{{-Data.h[index].rankingChanges}}</span>
        </td>
      </tr>
    </tbody>
  </n-table>
    </n-space>
</template>
<script setup>
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { ref } from "vue";
import { NSpace,NTable } from "naive-ui";
import { get } from "@/utils/http";

const router = useRouter();

const Data = ref({
    server: "",
    e: [],
    h: []
});

const server = ref({});

async function start(server) {
    var url = "https://www.ermaozi.cn/api/v1/jx3/zhangongbang/" + server + "/本周";
    Data.value.server = server;
    await get(url, {}).then((res) => {
    if (res.code == 200) {
      Data.value.e = res.data[0].data;
      Data.value.h = res.data[1].data;
    }
  });
}

start(router.currentRoute.value.params.server);

onBeforeRouteUpdate(to => {
    start(to.params.server);
})

</script>

<style>
#ranking {
  width: 1200px;
}
</style>