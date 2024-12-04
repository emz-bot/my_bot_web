<template>
  <n-space vertical size="medium" v-for="item in teamList" :key="item._id">
    <n-divider />
    <n-space vertical>
      <div class="teamBox">
        <div class="teaminfo">
          <div>团队编号：{{ item._id }}</div>
          <div>团长名称：{{ item.team_leader_name }}</div>
          <div>团队区服：{{ item.server }}</div>
          <div>团队公告：{{ item.team_announcements }}</div>
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
        <h2>团长：{{teamDetailInfo.info.user_id}}</h2>
        <n-input-group>
          <n-input-group-label>服务器</n-input-group-label>
          <n-select :style="{ width: '33%' }" v-model:value="teamDetailInfo.info.server" :options="selectOptions" @update:value="set_j3_team"/>
          <n-input-group-label>集合时间</n-input-group-label>
          <n-date-picker v-model:value="teamDetailInfo.info.meeting_time" type="datetime" clearable @update:value="set_j3_team"/>
        </n-input-group>
        <br>
        <h3>团队公告</h3>
        <n-input
        v-model:value="teamDetailInfo.info.team_announcements"
        type="textarea"
        placeholder="公告"
        @blur="set_j3_team"
      />
      <br>
        <div>
          <n-tag checkable>
            {{ teamDetailInfo.info.team_members_num }}/{{
              teamDetailInfo.info.team_configuration["人数"]
            }}
            <template #avatar>
              <n-avatar :src="getImageUrl('人数.png')" />
            </template>
          </n-tag>
          <template :key="role" v-for="(role_num, role) in teamDetailInfo.info.role_num">
            <n-tag checkable v-if="role_num!=0 || teamDetailInfo.info.team_configuration[role]">
              {{ role_num }}{{
                teamDetailInfo.info.team_configuration[role]
                  ? "/" + teamDetailInfo.info.team_configuration[role]
                  : ""
              }}
              <template #avatar>
                <n-avatar :src="getImageUrl(`${role}.png`)" />
              </template>
            </n-tag>
          </template>
        </div>
        <div>
          <template :key="pro_num" v-for="(pro_num, pro) in teamDetailInfo.info.profession_num">
            <n-tag checkable v-if="pro_num!=0 || teamDetailInfo.info.team_configuration[pro]">
              {{ pro_num }}{{
                teamDetailInfo.info.team_configuration[pro]
                  ? "/" + teamDetailInfo.info.team_configuration[pro]
                  : ""
              }}
              <template #avatar>
                <n-avatar :src="getImageUrl(`${pro}.png`)" />
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
                :src="getImageUrl(`${sitem.role}.png`)"
              />
              <img
                v-if="sitem.profession"
                style="width: 23px"
                :src="getImageUrl(`${sitem.profession}.png`)"
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
    </n-card>
  </n-modal>
  <n-modal v-model:show="showDelUserModal">
    <n-card
      style="width: 500px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true">
      <h2>是否确认删除成员 {{ teamDetailInfo.info.team_members[user_y][user_x].user_name }}</h2>
      <n-button @click="del_user">确认删除</n-button>
      <n-button @click="showDelUserModal=false">取消</n-button>
    </n-card>
  </n-modal>
  <n-modal v-model:show="showSetUserModal">
    <n-card
      style="width: 500px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true">
      <h2>修改成员信息</h2>
      <n-input-group>
        <n-input-group-label>名称</n-input-group-label>
        <n-input v-model:value="teamDetailInfo.info.team_members[user_y][user_x].user_name"/>
      </n-input-group>
      <br><br>
      <n-input-group>
        <n-input-group-label>QQ</n-input-group-label>
        <n-input-number v-model:value="teamDetailInfo.info.team_members[user_y][user_x].user_id"/>
      </n-input-group>
      <br><br>
      <n-input-group>
        <n-input-group-label>定位</n-input-group-label>
        <n-select v-model:value="teamDetailInfo.info.team_members[user_y][user_x].role" filterable :options="selectRole"/>
        <n-input-group-label>心法</n-input-group-label>
        <n-select v-model:value="teamDetailInfo.info.team_members[user_y][user_x].profession" filterable :options="selectProfession[teamDetailInfo.info.team_members[user_y][user_x].role]"/>
      </n-input-group>
      <br><br>
      <n-button @click="set_j3_team">确认修改</n-button>
    </n-card>
  </n-modal>
</template>

<script setup>
import { ref, reactive, nextTick, h } from "vue";
import {
  NSpace,
  NDivider,
  NCard,
  NModal,
  NButton,
  NTag,
  NAvatar,
  NDropdown,
  NInput,
  NInputNumber,
  NInputGroup,
  NSelect,
  NInputGroupLabel,
  NDatePicker,
  useMessage
} from "naive-ui";
import { api_j3_team } from "@/utils/api";
import { useRouter } from "vue-router";
const teamList = ref([]); // 原始数据

const message = useMessage();

const getImageUrl = (name) => {
    return new URL(`/src/assets/sect/${name}`, import.meta.url).href
}

const selectOptions = ref([
  {label: "破阵子", value: "破阵子"},
  {label: "唯我独尊", value: "唯我独尊"},
  {label: "天鹅坪", value: "天鹅坪"},
  {label: "梦江南", value: "梦江南"},
  {label: "斗转星移", value: "斗转星移"},
  {label: "幽月轮", value: "幽月轮"},
  {label: "绝代天骄", value: "绝代天骄"},
  {label: "龙争虎斗", value: "龙争虎斗"},
  {label: "蝶恋花", value: "蝶恋花"},
  {label: "长安城", value: "长安城"},
  {label: "剑胆琴心", value: "剑胆琴心"},
  {label: "乾坤一掷", value: "乾坤一掷"},
  {label: "飞龙在天", value: "飞龙在天"},
  {label: "青梅煮酒", value: "青梅煮酒"},
  {label: "眉间雪", value: "眉间雪"},
  {label: "有人赴约", value: "有人赴约"},
  {label: "山海相逢", value: "山海相逢"},
  {label: "万象长安", value: "万象长安"},
])

const selectRole = ref([
    {label: "坦克", value: "坦克"},
    {label: "治疗", value: "治疗"},
    {label: "输出", value: "输出"},
    {label: "老板", value: "老板"}
])

const selectProfession = ref({
  "坦克": [
    {label: "洗髓经", value: "洗髓经"},
    {label: "铁牢律", value: "铁牢律"},
    {label: "明尊琉璃体", value: "明尊琉璃体"},
    {label: "铁骨衣", value: "铁骨衣"}
  ],
  "治疗": [
    {label: "离经易道", value: "离经易道"},
    {label: "云裳心经", value: "云裳心经"},
    {label: "补天诀", value: "补天诀"},
    {label: "相知", value: "相知"},
    {label: "灵素", value: "灵素"}
  ],
  "输出": [
    {label: "易筋经", value: "易筋经"},
    {label: "太虚剑意", value: "太虚剑意"},
    {label: "紫霞功", value: "紫霞功"},
    {label: "花间游", value: "花间游"},
    {label: "傲血战意", value: "傲血战意"},
    {label: "冰心诀", value: "冰心诀"},
    {label: "毒经", value: "毒经"},
    {label: "惊羽诀", value: "惊羽诀"},
    {label: "天罗诡道", value: "天罗诡道"},
    {label: "山居剑意", value: "山居剑意"},
    {label: "笑尘诀", value: "笑尘诀"},
    {label: "焚影圣诀", value: "焚影圣诀"},
    {label: "分山劲", value: "分山劲"},
    {label: "莫问", value: "莫问"},
    {label: "北傲诀", value: "北傲诀"},
    {label: "凌海诀", value: "凌海诀"},
    {label: "隐龙诀", value: "隐龙诀"},
    {label: "太玄经", value: "太玄经"},
    {label: "无方", value: "无方"},
    {label: "孤锋诀", value: "孤锋诀"},
    {label: "山海心诀", value: "山海心诀"},
    {label: "周天功", value: "周天功"}
  ],
  "老板": [
    {label: "洗髓经", value: "洗髓经"},
    {label: "铁牢律", value: "铁牢律"},
    {label: "明尊琉璃体", value: "明尊琉璃体"},
    {label: "铁骨衣", value: "铁骨衣"},
    {label: "离经易道", value: "离经易道"},
    {label: "云裳心经", value: "云裳心经"},
    {label: "补天诀", value: "补天诀"},
    {label: "相知", value: "相知"},
    {label: "灵素", value: "灵素"},
    {label: "易筋经", value: "易筋经"},
    {label: "太虚剑意", value: "太虚剑意"},
    {label: "紫霞功", value: "紫霞功"},
    {label: "花间游", value: "花间游"},
    {label: "傲血战意", value: "傲血战意"},
    {label: "冰心诀", value: "冰心诀"},
    {label: "毒经", value: "毒经"},
    {label: "惊羽诀", value: "惊羽诀"},
    {label: "天罗诡道", value: "天罗诡道"},
    {label: "山居剑意", value: "山居剑意"},
    {label: "笑尘诀", value: "笑尘诀"},
    {label: "焚影圣诀", value: "焚影圣诀"},
    {label: "分山劲", value: "分山劲"},
    {label: "莫问", value: "莫问"},
    {label: "北傲诀", value: "北傲诀"},
    {label: "凌海诀", value: "凌海诀"},
    {label: "隐龙诀", value: "隐龙诀"},
    {label: "太玄经", value: "太玄经"},
    {label: "无方", value: "无方"},
    {label: "孤锋诀", value: "孤锋诀"},
    {label: "山海心诀", value: "山海心诀"},
    {label: "周天功", value: "周天功"}
  ]
})
const showDropdownRef = ref(false);
const xRef = ref(0);
const yRef = ref(0);

const user_x = ref()
const user_y = ref()

const options = ref([
  {
    label: "修改",
    key: "set_user",
  },
  {
    label: "删除",
    key: "del_user",
    props: { style: "color: #e98b8b" },
  }]);


const router = useRouter();
var router_params = router.currentRoute.value.params;

async function del_user() {
  let user = teamDetailInfo.info.team_members[user_y.value][user_x.value]
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
  showDelUserModal.value = false
}

async function set_j3_team() {
  teamDetailInfo.info.role_num = {}
  teamDetailInfo.info.profession_num = {}
  for (const i of teamDetailInfo.info.team_members){
    for (const j of i){
      if (j.role) {
        if (!(j.role in teamDetailInfo.info.role_num)){
          teamDetailInfo.info.role_num[j.role] = 0
        }
        teamDetailInfo.info.role_num[j.role] += 1
        if (!(j.profession in teamDetailInfo.info.profession_num)){
          teamDetailInfo.info.profession_num[j.profession] = 0
        }
        teamDetailInfo.info.profession_num[j.profession] += 1
      }
    }
  }
  api_j3_team({ action: "set", params: teamDetailInfo}).then((res) => {
    if (res.code == 200) {
      message.success("修改成功")
      showSetUserModal.value = false
    } else {
      message.error(res.data)
    }
  });
}

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

const showSetUserModal = ref(false);

const showDelUserModal = ref(false);

const handleSelect = function (key) {
  showDropdownRef.value = false;
  if (String(key) == "del_user"){
    showDelUserModal.value = true;
  } else if (String(key) == "set_user") {
    showSetUserModal.value = true
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
  width: 117%;
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
