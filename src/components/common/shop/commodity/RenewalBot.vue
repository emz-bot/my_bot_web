<template>
    <n-card>
        <h1>机器人续费</h1>
        <p>可以给已购买的机器人续费，不过通常可以在群里发送“续费 月数”进行续费</p>
        <p>价格：15 元/月</p>
        <n-input-number min=1 max=12 :show-button="false" :bordered="false" placeholder="1 到 12">
        <template #prefix>
            续费
        </template>
        <template #suffix>
            个月
        </template>
        </n-input-number>
        <br>
        <n-input-number  :show-button="false" placeholder="千万别写错了啊">
        <template #prefix>
            机器人QQ
        </template>
        </n-input-number>
        <br>
        <n-input-number  :show-button="false" placeholder="千万别写错了啊">
        <template #prefix>
            群号
        </template>
        </n-input-number>
        <br>
        <n-button type="primary" block secondary strong >续费</n-button>
    </n-card>
</template>

<script setup>
import {
    NCard,
    NButton,
    NInputNumber
} from "naive-ui";

</script>