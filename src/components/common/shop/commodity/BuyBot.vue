<template>
    <n-card>
        <h1>购买机器人</h1>
        <p>购买成功后我们会给你一个机器人的 QQ，你直接加它好友把它拉进群就可以了</p>
        <p>价格：15 元/月</p>
        <n-input-number min=1 max=12 :show-button="false" :bordered="false" placeholder="1 到 12">
        <template #prefix>
            购买
        </template>
        <template #suffix>
            个月
        </template>
        </n-input-number>
        <br>
        <n-input-number  :show-button="false" placeholder="千万别写错了啊">
        <template #prefix>
            群号
        </template>
        </n-input-number>
        <br>
        <n-button type="primary" block secondary strong >购买</n-button>
    </n-card>
</template>

<script setup>
import {
    NCard,
    NButton,
    NInputNumber
} from "naive-ui";

</script>