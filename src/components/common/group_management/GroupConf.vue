<template>
    <n-card>
        <h1>
            {{ group_data.group_name }}({{ group_data._id }})
        </h1>
        <n-tabs type="line" animated>
            <n-tab-pane name="通知设置" tab="通知设置">
                <n-table>
                    <thead>
                        <tr>
                            <th>名称</th>
                            <th>通知条件</th>
                            <th>通知模板</th>
                            <th>开关</th>
                            <th>恢复默认</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="[notice_name, data] in Object.entries(group_data.notice)">
                            <td>{{ notice_name }}</td>
                            <td>
                                <template v-if="data.condition">
                                    <n-space v-for="[a, b] in Object.entries(data.condition)">
                                        <n-space>
                                            {{ a }}
                                        </n-space>
                                        <n-space>
                                            {{ b }}
                                        </n-space>
                                    </n-space>
                                </template>
                            </td>
                            <td>{{ data.template }}</td>
                            <td>
                                <n-switch v-model:value="data.switch" />
                            </td>
                            <td>
                                <n-button type="info" size="small">恢复默认</n-button>
                            </td>
                        </tr>
                    </tbody>
                </n-table>
            </n-tab-pane>
            <!-- <n-tab-pane name="定时提醒" tab="定时提醒">
            </n-tab-pane>
            <n-tab-pane name="避雷名单" tab="避雷名单">
            </n-tab-pane> -->
        </n-tabs>
    </n-card>
</template>
<script setup>
import {
    NCard,
    NTabs,
    NTabPane,
    NTable,
    NButton,
    NSwitch,
    NSpace
} from "naive-ui"

import { defineProps } from 'vue'

const props = defineProps({
    group_data: {
        type: Object,
        required: true
    }
})

</script>