<template>
    <n-card>
        <h1>首次引入机器人</h1>
        <n-tabs
        class="card-tabs"
        default-value="activation_code"
        size="large"
        animated
        pane-wrapper-style="margin: 0 -4px"
        pane-style="padding-left: 4px; padding-right: 4px; box-sizing: border-box;"
        >
        <n-tab-pane name="activation_code" tab="使用激活码">
            <p>在他处购买激活码后，可以使用激活码直接获取机器人</p>
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
            <n-button type="primary" block secondary strong >获得机器人</n-button>
        </n-tab-pane>
        <n-tab-pane name="buy" tab="直接购买">
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