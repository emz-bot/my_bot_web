<template>
  <n-card id="login">
    <n-tabs v-model:value="tabValue" size="large">
      <n-tab-pane name="signin" tab="登录">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input
              type="text"
              v-model:value="login_data.user"
              placeholder="用户名"
              clearable
            />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input
              type="password"
              v-model:value="login_data.password"
              placeholder="密码"
              clearable
            />
          </n-form-item-row>
        </n-form>
        <n-space justify="space-between">
          <n-button
            id="login_button"
            type="primary"
            block
            secondary
            strong
            @click="start_login"
            style="width:260px"
          >
            登录
          </n-button>
          <!-- <n-button
            block
            secondary
            strong
            @click="router.push({ path: '/common/shop' })"
          >
            登个锤子，直接购买！
          </n-button> -->
        </n-space>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册/修改密码">
        <n-form>
          <n-form-item-row label="邮箱">
            <n-input
              type="text"
              v-model:value="register_data.user"
              placeholder="邮箱"
              clearable
            />
          </n-form-item-row>
          <n-form-item-row label="密码">
            <n-input
              type="password"
              v-model:value="register_data.password"
              placeholder="密码"
              clearable
            />
          </n-form-item-row>
          <n-form-item-row label="验证码">
            <n-input
              type="text"
              v-model:value="register_data.verifycode"
              placeholder="验证码"
              clearable
            />
            <n-button
              :disabled="buttonDisabled"
              attr-type="button"
              @click="send_verification_code"
            >
              {{ codeText }}
            </n-button>
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong @click="start_register">
          确定
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import {
  NTabs,
  NSpace,
  NTabPane,
  NButton,
  NCard,
  NForm,
  NFormItemRow,
  NInput,
  useMessage,
} from "naive-ui";
import { ref } from "vue";
import { login, register, api_verification_code } from "@/utils/api";
import { useRouter } from "vue-router";

const router = useRouter();
const message = useMessage();
var reqData = {};
let tabValue = ref("signin");

var login_data = ref({
  user: "",
  password: "",
});

var register_data = ref({
  user: "",
  password: "",
  verifycode: "",
});

async function start_login() {
  reqData.username = login_data.value.user;
  reqData.password = login_data.value.password;
  await login(reqData).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("user_permission", res.data.user_permission);
      if (localStorage.beforeRouter && localStorage.beforeRouter != "/") {
        router.push({ path: localStorage.beforeRouter });
      } else if (res.data.user_permission >= 3) {
        router.push({ path: "/management" });
      } else {
        router.push({ path: "/common" });
      }
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}

async function start_register() {
  reqData.username = register_data.value.user;
  reqData.password = register_data.value.password;
  reqData.verifycode = register_data.value.verifycode;
  await register(reqData).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
      // 赋值为空，并且跳转到登录
      register_data.value.username = "";
      register_data.value.password = "";
      register_data.value.verifycode = "";
      tabValue.value = "signin";
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}

let buttonDisabled = ref(false);
let codeText = ref("发送验证码");
let time = null;
let times = 0;

async function send_verification_code() {
  if (!register_data.value.user) {
    message.error("请填写邮箱");
  } else {
    buttonDisabled.value = true;
    buttonDisabledCountDown();
    await api_verification_code({ user: register_data.value.user }).then(
      (res) => {
        if (res.code == 200) {
          message.success("验证码发送成功");
        } else {
          message.error(res.msg);
        }
      }
    );
  }
}
function buttonDisabledCountDown() {
  times = 60;
  time = setInterval(() => {
    codeText.value = times + "s";
    times--;
    if (times == 0) {
      buttonDisabled.value = false;
      codeText.value = "发送验证码";
      clearInterval(time);
      time = null;
    }
  }, 1000);
}
</script>
<style>
#login {
  width: 500px;
  margin: 0 auto;
}
.n-divider__title {
  font-size: 14px;
  color: darkgrey;
}
</style>
