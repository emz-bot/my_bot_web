<template>
    <n-card>
        <h1>自建机器人充值</h1>
        <p>只有自建机器人可以买这个，可以将购买到的天数分配给自建机器人加的群，使其变成付费群</p>
        <p>价格：8 元/月</p>
        <n-input-number min=1 max=12 :show-button="false" :bordered="false" placeholder="1 到 12">
        <template #prefix>
            充
        </template>
        <template #suffix>
            个月
        </template>
        </n-input-number>
        <br>
        <n-button type="primary" block secondary strong >冲！</n-button>
    </n-card>
</template>

<script setup>
import {
    NCard,
    NButton,
    NInputNumber
} from "naive-ui";

</script>