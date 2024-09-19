<template>
    <n-card>
        <h1>机器人续费</h1>
        <n-tabs
        class="card-tabs"
        default-value="activation_code"
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
        <n-tab-pane name="activation_code" tab="使用激活码">
            <p>在他处购买激活码后直接使用激活码将时间冲入对应的群。</p>
            <n-input placeholder="这里输入激活码">
                <template #prefix>
                    激活码：
                </template>
            </n-input>
            <br><br>
            <n-input-number  :show-button="false" placeholder="千万别写错了啊">
            <template #prefix>
                群号
            </template>
            </n-input-number>
            <br>
            <n-button type="primary" block secondary strong >续费</n-button>
        </n-tab-pane>
        <n-tab-pane name="buy" tab="直接续费">
            <p>通过二维码续费，续费成功后，所支付的天数会直接冲入对应的群。</p>
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
                群号
            </template>
            </n-input-number>
            <br>
            <n-button type="primary" block secondary strong >续费</n-button>
        </n-tab-pane>
        </n-tabs>
    </n-card>
</template>

<script setup>
import {
    NCard,
    NButton,
    NTabs,
    NTabPane,
    NInput,
    NInputNumber
} from "naive-ui";

</script>