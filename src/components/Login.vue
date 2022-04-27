<template>
  <n-card id="login">
    <n-tabs default-value="signin" size="large">
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
        <n-button id="login_button" type="primary" block secondary strong @click="start_login">
          登录
        </n-button>
      </n-tab-pane>
      <n-tab-pane name="signup" tab="注册">
        <n-form>
          <n-form-item-row label="用户名">
            <n-input
              type="text"
              v-model:value="register_data.user"
              placeholder="用户名"
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
          <n-form-item-row label="重复密码">
            <n-input type="password" placeholder="密码" clearable />
          </n-form-item-row>
          <n-form-item-row label="授权码">
            <n-input
              type="text"
              v-model:value="register_data.authorization_code"
              placeholder="授权码"
              clearable
            />
          </n-form-item-row>
        </n-form>
        <n-button type="primary" block secondary strong @click="start_register">
          注册
        </n-button>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script setup>
import {
  NTabs,
  NTabPane,
  NButton,
  NCard,
  NForm,
  NFormItemRow,
  NInput,
  useMessage,
} from "naive-ui";
import { ref } from "vue";
import { login, register } from "@/utils/api";
import { useRouter } from "vue-router";

const router = useRouter();
const message = useMessage();
var reqData = {};

var login_data = ref({
  user: "",
  password: "",
});

var register_data = ref({
  user: "",
  password: "",
  authorization_code: "",
});

async function start_login() {
  reqData.user = login_data.value.user;
  reqData.password = login_data.value.password;
  await login(reqData).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("user_permission", res.data.user_permission);
      if (res.data.user_permission >= 3){
        router.push({ path: "/index/management" });
      } else {
        router.push({ path: "/index/common" });
      }
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}

async function start_register() {
  reqData.user = register_data.value.user;
  reqData.password = register_data.value.password;
  reqData.authorization_code = register_data.value.authorization_code;
  await register(reqData).then((res) => {
    if (res.code == 200) {
      message.success(res.msg, { duration: 5e3 });
    } else {
      message.error(res.msg, { duration: 5e3 });
    }
  });
}
</script>
<style>
body {
  background: #1d1d1d;
}

#login {
  width: 30%;
  margin: 0 auto;
}
.n-divider__title {
  font-size: 14px;
  color: darkgrey;
}
</style>