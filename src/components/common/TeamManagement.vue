<template>
  <n-space vertical size="medium" v-for="item in teamList" :key="item._id">
    <n-divider />
    <n-space vertical>
      <div class="teamBox">
        <div class="teaminfo">
          <div>团队编号：{{ item._id }}</div>
          <div>团长名称：{{ item.team_leader_name }}</div>
          <div>团队区服：{{ item.server }}</div>
          <div>团长 QQ：{{ item.user_id }}</div>
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
      :title="'团队 ' + teamDetailInfo.info._id"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-button @click="closeDetail">X</n-button>
      </template>
      <div class="headerinfo">
        <div>团长：{{ teamDetailInfo.info.team_leader_name }}</div>
        <div>服务器：{{ teamDetailInfo.info.server }}</div>
        <div>集合时间：{{ teamDetailInfo.info.meeting_time }}</div>
        <div>团队公告：{{ teamDetailInfo.info.team_announcements }}</div>
        <div>
          <n-tag checkable>
            {{ teamDetailInfo.info.team_members_num }}/{{
              teamDetailInfo.info.team_configuration["人数"]
            }}
            <template #avatar>
              <n-avatar :src="require(`@/assets/sect/人数.png`)" />
            </template>
          </n-tag>
        </div>
        <div>
          <template :key="role" v-for="(role_num, role) in teamDetailInfo.info.role_num">
            <n-tag checkable v-if="role_num!=0 && !teamDetailInfo.info.team_configuration[role]">
              {{ role_num }}/{{
                teamDetailInfo.info.team_configuration[role]
                  ? teamDetailInfo.info.team_configuration[role]
                  : "-"
              }}
              <template #avatar>
                <n-avatar :src="require(`@/assets/sect/${role}.png`)" />
              </template>
            </n-tag>
          </template>
        </div>
        <div>
          <template :key="pro_num" v-for="(pro_num, pro) in teamDetailInfo.info.profession_num">
            <n-tag checkable v-if="pro_num!=0 && !teamDetailInfo.info.team_configuration[pro]">
              {{ pro_num }}/{{
                teamDetailInfo.info.team_configuration[pro]
                  ? teamDetailInfo.info.team_configuration[pro]
                  : "-"
              }}
              <template #avatar>
                <n-avatar :src="require(`@/assets/sect/${pro}.png`)" />
              </template>
            </n-tag>
          </template>
        </div>
      </div>
      <div class="bodyinfo">
        <div style="width: 50px" class="bodyinfo_teamitem">
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
                @contextmenu="handleContextMenu"
                @dragstart="dragstart"
                @dragenter="dragenter"
                @dragover="dragover"
                @drop="drop"
                :data-index="index"
                :data-sindex="sindex"
                :id="Math.random(0, 9) * 100"
                class="bodyinfo_box SortItem"
              >
                <img
                  v-if="sitem.role"
                  style="width: 23px"
                  :src="require(`@/assets/sect/${sitem.role}.png`)"
                />
                <img
                  v-if="sitem.profession"
                  style="width: 23px"
                  :src="require(`@/assets/sect/${sitem.profession}.png`)"
                />
                {{ sitem.user_name ? sitem.user_name : "" }}
              </div>
            </template>
          </div>
        </template>
          <n-dropdown
            placement="bottom-start"
            trigger="manual"
            :x="xRef"
            :y="yRef"
            :options="options"
            :show="showDropdownRef"
            :on-clickoutside="onClickoutside"
            @select="handleSelect"
          />
      </div>
      <!-- <template #footer> 尾部 </template> -->
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, reactive, nextTick } from "vue";
// import { defineComponent, ref, nextTick } from "vue";
import {
  NSpace,
  NDivider,
  NCard,
  NModal,
  NButton,
  NTag,
  NAvatar,
  NDropdown,
  useMessage
} from "naive-ui";
import { api_j3_team } from "@/utils/api";
import { useRouter } from "vue-router";
const teamList = ref([]); // 原始数据

const message = useMessage();

const showDropdownRef = ref(false);
const xRef = ref(0);
const yRef = ref(0);

const user_x = ref()
const user_y = ref()

const options = ref([
  {
    label: "删除",
    key: "del_user",
  },
  {
    label: "修改",
    key: "set_user",
  }]);

const router = useRouter();
var router_params = router.currentRoute.value.params;

async function get_all_j3_team() {
  await api_j3_team({
    action: "get",
    params: { team_id: router_params.team_id },
  }).then((res) => {
    if (res.code == 200) {
      teamList.value = res.data;
      if (router_params.team_id != 0 && showModal.value == false) {
        showDetail(router_params.team_id);
      }
    }
  });
}
get_all_j3_team();

let teamDetailInfo = reactive({
  info: {},
}); //详细信息

const showModal = ref(false); // 是否显示弹窗
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

const handleContextMenu = function (e) {
  user_x.value = parseInt(e.target.dataset.sindex)
  user_y.value = parseInt(e.target.dataset.index)
  let cur_user = teamDetailInfo.info.team_members[user_y.value][user_x.value]
  let cur_user_name = cur_user.user_name
  let cur_user_id = cur_user.user_id
  let cur_team_leader_name = teamDetailInfo.info.team_leader_name
  let cur_leader_id = teamDetailInfo.info.user_id
  if ( !cur_user_name ){
    message.warning("没东西")
    return
  } else if ( cur_user_name == cur_team_leader_name && cur_user_id==cur_leader_id){
    message.warning("这是团长")
    return
  }
  e.preventDefault();
  showDropdownRef.value = false;
  nextTick().then(() => {
    showDropdownRef.value = true;
    xRef.value = e.clientX;
    yRef.value = e.clientY;
  });
};

const handleSelect = function (key) {
  showDropdownRef.value = false;
  let user = teamDetailInfo.info.team_members[user_y.value][user_x.value]
  if (String(key) == "del_user"){
    teamDetailInfo.info.team_members[user_y.value][user_x.value] = {}
    teamDetailInfo.info.team_members_num -= 1
    teamDetailInfo.info.role_num[user["role"]] -= 1
    teamDetailInfo.info.profession_num[user["profession"]] -= 1
    teamDetailInfo.info["del_user"] = user
    api_j3_team({ action: "set", params: teamDetailInfo }).then((res) => {
    if (res.code == 200) {
      message.success("删除"+user.user_name+"成功")
    } else {
      message.error("删除"+user.user_name+"失败")
      teamDetailInfo.info.team_members[user_y.value][user_x.value] = user
    }})
    delete teamDetailInfo.info["del_user"]
  } else if (String(key) == "set_user") {
    message.success("修改"+user.user_name)
  }
};

const onClickoutside = function() {
  showDropdownRef.value = false;
}

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
  ev.target.innerHtml = movedomText; //更改移动text的值
  document.getElementById(movedomID).innerHtml = replacedomText; //更改被替换text的值

  let moveItem = teamDetailInfo.info.team_members[movedomIndex][movedomSIndex]; // 通过下标获取到移动的对象
  let replaceItem = teamDetailInfo.info.team_members[replacedomIndex][replacedomSIndex]; // 通过下标获取到被替换的对象

  teamDetailInfo.info.team_members[movedomIndex][movedomSIndex] = replaceItem; // 给移动的对象赋值 被替换的对象
  teamDetailInfo.info.team_members[replacedomIndex][replacedomSIndex] = moveItem; // 给被替换的对象 复制 移动的对象
  delete teamDetailInfo.info["del_user"]
  api_j3_team({ action: "set", params: teamDetailInfo}).then((res) => {
    if (res.code == 200) {
      return true;
    } else {
      teamDetailInfo.info.team_members[movedomIndex][movedomSIndex] = moveItem; // 给移动的对象赋值 被替换的对象
      teamDetailInfo.info.team_members[replacedomIndex][replacedomSIndex] = replaceItem; // 给被替换的对象 复制 移动的对象
    }
  });
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
  display: flex;
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

.TeamConfiguration {
  display: flex;
  align-items: center;
  display: inline-flex;
  /* justify-content: center; */
}

.SortItem {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bodyinfo_teamitem {
  display: inline-block;
  width: 16%;
}
</style>
