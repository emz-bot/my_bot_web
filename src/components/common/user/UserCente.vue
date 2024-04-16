<template>
    <n-space>
        <n-space>
            <n-avatar
            :size="50"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
        </n-space>
        <n-space vertical size="small">
            <div>
                <div>
                    <n-text style="font-size: 20px;">名称</n-text>
                </div>
                <div>
                    <n-text>123123</n-text>
                </div>
            </div>
        </n-space>
    </n-space>
    <br>
    <div>邮箱</div>
    <br>
    <div>修改密码</div>
    <br>
    <n-button>保存</n-button>
</template>
<script setup>
import { ref } from 'vue';
import { NAvatar, NSpace, NText, NButton } from "naive-ui";

</script>