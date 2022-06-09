<template>
  <n-space vertical size="medium" v-for="item in teamList" :key="item._id">
    <n-divider />
    <n-space vertical>
      <div class="teamBox">
        <div class="teaminfo">
          <div>团长名称：{{ item.team_leader_name }}</div>
          <div>团队区服：{{ item.server }}</div>
          <div>团长 QQ：{{ item.user_id }}</div>
          <div>开团群号：{{ item.group_id }}</div>
          <div>团队限制: {{ item.team_configuration }}</div>
        </div>
        <div class="teambutton">
          <n-button @click="showDetail(item._id)">查看详情</n-button>
        </div>
      </div>
    </n-space>
  </n-space>

  <n-modal v-model:show="showModal" :mask-closable="false">
    <n-card
      style="width: 950px"
      title="团队详情"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button @click="closeDetail">X</n-button>
      </template>
      <div class="headerinfo">
        <div>{{ teamDetailInfo.info.team_leader_name }}</div>
        <div>{{ teamDetailInfo.info.server }}</div>
        <div>集合时间：{{ teamDetailInfo.info.meeting_time }}</div>
        <div>团队公告：{{ teamDetailInfo.info.team_announcements }}</div>
        <!-- <div>人数（20/{{ teamDetailInfo.info.team_configuration["人数"] }}）</div> -->
      </div>
      <div class="bodyinfo">
        <div  style="width: 50px" class="bodyinfo_teamitem">
          <div class="bodyinfo_box"></div>
          <div class="bodyinfo_box SortItem">1</div>
          <div class="bodyinfo_box SortItem">2</div>
          <div class="bodyinfo_box SortItem">3</div>
          <div class="bodyinfo_box SortItem">4</div>
          <div class="bodyinfo_box SortItem">5</div>
        </div>
        <template
          :key="index"
          v-for="(item, index) in teamDetailInfo.info.team_members"
        >
          <div :id="`bodyinfo_teamitem${index + 1}`" class="bodyinfo_teamitem">
            <div draggable="false" class="bodyinfo_box">
              队伍{{ index + 1 }}
            </div>
            <template v-for="(sitem, sindex) in item" :key="sitem.user_name">
              <div
                draggable="true"
                @dragstart="dragstart"
                @dragenter="dragenter"
                @dragover="dragover"
                @drop="drop"
                :data-index="index"
                :data-sindex="sindex"
                :id="Math.random(0, 9) * 100"
                class="bodyinfo_box SortItem"
              >
                 <img v-if="sitem.profession" style="width: 23px" :src="require(`@/assets/sect/${sitem.profession}.png`)">{{ sitem.user_name ? sitem.user_name : "无" }}
              </div>
            </template>
          </div>
        </template>
      </div>
      <!-- <template #footer> 尾部 </template> -->
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, reactive } from "vue";
import { NSpace, NDivider, NCard, NModal, NButton } from "naive-ui";
import { api_j3_team } from "@/utils/api";
const teamList = ref([]); // 原始数据

async function get_all_j3_team(){
    await api_j3_team({action: "get", data: {team_id: 0}}).then((res) => {
    if (res.code == 200) {
      console.log(res.data)
      console.log(teamList)
      teamList.value = res.data;
      console.log(teamList)
    }
  });
}
get_all_j3_team()

async function set_j3_team(team_data){
    await api_j3_team({action: "set", data: team_data}).then((res) => {
    if (res.code == 200) {
      console.log(res.data)
    }
  });
}

let teamDetailInfo = reactive({
  info: {},
}); //详细信息

const showModal = ref(false); // 是否显示弹窗
// let tritem = ref(null); // ref对象
const showDetail = function (id) {
  teamList.value.some((item) => {
    if (item._id == id) {
      teamDetailInfo.info = item;
      return true;
    }
  });
  showModal.value = true;
};

const closeDetail = function () {
  showModal.value = false;
};

let movedom,
  movedomText, // 移动DOM的text
  movedomID, // 移动的domID
  movedomIndex, // 移动的一维下标
  movedomSIndex, // 移动的二维下标
  replacedom,
  replacedomText, // 被替换DOM的text
  replacedomID, // 被替换的domID
  replacedomIndex, // 被替换的一维下标
  replacedomSIndex; // 被替换的二维下标

// 开始
const dragstart = function (ev) {
  movedomID = ev.target.id;
  movedomText = document.getElementById(ev.target.id).innerHtml;
  movedomIndex = document.getElementById(ev.target.id).dataset["index"];
  movedomSIndex = document.getElementById(ev.target.id).dataset["sindex"];

  ev.dataTransfer.setData("Text", ev.target.id);
};

// 进入时
const dragenter = function (ev) {
  replacedomID = ev.target.id;
  replacedomText = document.getElementById(ev.target.id).innerHtml;
  replacedomIndex = document.getElementById(ev.target.id).dataset["index"];
  replacedomSIndex = document.getElementById(ev.target.id).dataset["sindex"];
};
// 进入后
const dragover = function (ev) {
  ev.preventDefault();
};

// 放置
const drop = function (ev) {
  ev.preventDefault();
  var data = ev.dataTransfer.getData("Text");
  // ev.target.appendChild(document.getElementById(data));
  ev.target.innerHtml = movedomText; //更改移动text的值
  document.getElementById(movedomID).innerHtml = replacedomText; //更改被替换text的值

  let moveItem = teamDetailInfo.info.team_members[movedomIndex][movedomSIndex]; // 通过下标获取到移动的对象
  let replaceItem =
    teamDetailInfo.info.team_members[replacedomIndex][replacedomSIndex]; // 通过下标获取到被替换的对象

  teamDetailInfo.info.team_members[movedomIndex][movedomSIndex] = replaceItem; // 给移动的对象赋值 被替换的对象
  teamDetailInfo.info.team_members[replacedomIndex][replacedomSIndex] = moveItem; // 给被替换的对象 复制 移动的对象
  set_j3_team(teamDetailInfo)
};
</script>

<style scoped>
.teamBox {
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.bodyinfo {
  width: 100%;
  margin-top: 15px;
}
.bodyinfo_box {
  height: 40px;
  line-height: 40px;
  text-align: center;
  border: 1px black solid;
  border-collapse: collapse;
  margin-top: -1px;
  margin-left: -1px;
}
.SortItem {
  display: flex;
  align-items:center;
  justify-content: center;
}
.bodyinfo_teamitem {
  display: inline-block;
  width: 16%;
}

</style>
