<template>
  <n-space vertical>
    网站相关
    <n-input placeholder="manage_url" v-model:value="data.manage_url" size="small">
        <template #prefix>
            管理链接：
        </template>
    </n-input>
    <n-input placeholder="secret_key" type="password" v-model:value="data.secret_key" size="small">
        <template #prefix>
            密钥：
        </template>
    </n-input>

    邮箱
    <n-input placeholder="sender" v-model:value="data.sender" size="small">
        <template #prefix>
            发送人：
        </template>
    </n-input>
    <n-input placeholder="default_host" v-model:value="data.default_host" size="small">
        <template #prefix>
            默认服务器：
        </template>
    </n-input>
    <n-input placeholder="default_pord" v-model:value="data.default_pord" size="small">
        <template #prefix>
            默认端口：
        </template>
    </n-input>
    <n-input placeholder="default_passwd" type="password" v-model:value="data.default_passwd" size="small">
        <template #prefix>
            默认密码：
        </template>
    </n-input>
    <n-space>
        <n-switch v-model:value="show">
            <template #checked>
                点击隐藏
            </template>
            <template #unchecked>
                点击显示
            </template>
        </n-switch>
        <n-collapse-transition :show="show">
            <n-input-group v-for="(mail, index) in data.mail_list" :key="index">
                <n-input :style="{ width: '25%' }" placeholder="mail" v-model:value="mail.mail" />
                <n-input :style="{ width: '25%' }" placeholder="password" type="password" v-model:value="mail.password" />
                <n-input :style="{ width: '10%' }" placeholder="port" v-model:value="mail.port" />
                <n-input :style="{ width: '25%' }" placeholder="host" v-model:value="mail.host" />
                <n-button tertiary @click="test_mail(mail)">测试</n-button>
                <n-button tertiary type="error" @click="del_mail(index)">x</n-button>
            </n-input-group>
            <n-button @click="add_mail">添加</n-button>
        </n-collapse-transition>
    </n-space>

    机器人
    <n-button @click="add_super_manage">添加超级管理员</n-button>
    <n-space>
        <n-input placeholder="超级管理员" size="small" v-model:value="data.super_manage[index]" v-for="(item, index) in data.super_manage" :key="index" />
    </n-space>
    <n-button @click="add_manage_group">添加管理群</n-button>
    <n-space>
        <n-input placeholder="管理群" size="small" v-model:value="data.manage_group[index]" v-for="(item, index) in data.manage_group" :key="index" />
    </n-space>

    剑三相关
    <n-input placeholder="jx3_url" v-model:value="data.jx3_url" size="small">
        <template #prefix>
            API地址：
        </template>
    </n-input>
    <n-input placeholder="jx3_token" type="password" v-model:value="data.jx3_token" size="small">
        <template #prefix>
            Token：
        </template>
    </n-input>
    <n-input placeholder="ws_path" v-model:value="data.ws_path" size="small">
        <template #prefix>
            WS 地址:
        </template>
    </n-input>
    <n-input placeholder="ws_token" type="password" v-model:value="data.ws_token" size="small">
        <template #prefix>
            WS Token：
        </template>
    </n-input>
    <n-input placeholder="account" v-model:value="data.account" size="small">
        <template #prefix>
            沙盘用户：
        </template>
    </n-input>
    <n-input placeholder="password" type="password" v-model:value="data.password" size="small">
        <template #prefix>
            沙盘密码：
        </template>
    </n-input>

    其他
    <n-input placeholder="baidusdkcore_client_id" v-model:value="data.baidusdkcore_client_id" size="small">
        <template #prefix>
            百度违禁词 ID：
        </template>
    </n-input>
    <n-input placeholder="baidusdkcore_client_secret" type="password" v-model:value="data.baidusdkcore_client_secret" size="small">
        <template #prefix>
            百度违禁词密钥：
        </template>
    </n-input>
    <n-input placeholder="nlp_secretId" v-model:value="data.nlp_secretId" size="small">
        <template #prefix>
            腾讯自然语言 ID：
        </template>
    </n-input>
    <n-input placeholder="nlp_secretKey" type="password" v-model:value="data.nlp_secretKey" size="small">
        <template #prefix>
            腾讯自然语言密钥：
        </template>
    </n-input>
    <n-input placeholder="nlp_secretKey" type="password" v-model:value="data.alipay_app_id" size="small">
        <template #prefix>
            阿里当面付 app_id：
        </template>
    </n-input>
    <n-input placeholder="nlp_secretKey" type="password" v-model:value="data.alipay_app_private_key" size="small">
        <template #prefix>
            阿里当面付 app 私钥：
        </template>
    </n-input>
    <n-input placeholder="nlp_secretKey" type="password" v-model:value="data.alipay_public_key" size="small">
        <template #prefix>
            阿里当面付公钥：
        </template>
    </n-input>
    <n-button
        type="primary"
        block
        secondary
        strong
        @click="update"
    >
        更新
    </n-button>
  </n-space>
</template>
<script setup>
import {
  NSpace,
  NInput,
  NButton,
  NInputGroup,
  NInputGroupLabel,
  NCollapseTransition,
  NSwitch,
  useMessage
} from "naive-ui";
import { ref } from "vue";
import { api_get_config, api_set_config, api_test_mail } from "@/utils/api";
import { useRouter } from "vue-router";


const router = useRouter();

const message = useMessage();

const show = ref(false)

const data = ref({
    secret_key: "",
    ws_path: "wss://socket.nicemoe.cn",
    ws_token: "",
    jx3_url: "https://www.jx3api.com",
    jx3_token: "",
    account: "",
    password: "",
    sender: "",
    default_host: "",
    default_pord: 465,
    default_passwd: "",
    baidusdkcore_client_id: "",
    baidusdkcore_client_secret: "",
    nlp_secretId: "",
    nlp_secretKey: "",
})

async function init() {
    await api_get_config().then((res) => {
        if (res.code == 200) {
            if ( res.data ){
                data.value = res.data
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

init()

function add_super_manage() {
    if ( !data.value.super_manage ){
        data.value.super_manage = []
    }
    data.value.super_manage.push("")
}
function add_manage_group() {
    if ( !data.value.manage_group ){
        data.value.manage_group = []
    }
    data.value.manage_group.push("")
}
function add_mail() {
    if ( !data.value.mail_list ){
        data.value.mail_list = []
    }
    data.value.mail_list.push({
        "mail": "",
        "password": "",
        "port": "",
        "host": ""
    })
}
function del_mail(index) {
    data.value.mail_list.splice(index, 1)
}

async function test_mail(mail) {
    console.log(mail)
    await api_test_mail({data: [mail]}).then((res) => {
        if (res.code == 200) {
            message.success("发送成功")
        } else {
            console.log(res.msg)
            message.error(res.msg)
        }
    });
}

async function update() {
    console.log(data.value)
    await api_set_config({data: data.value}).then((res) => {
        if (res.code == 200) {
            data.value = res.data;
            message.success("更新成功")
            init()
        } else {
            message.error(res.msg)
        }
    });
}

</script>