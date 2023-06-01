<template>
    <n-space vertical size="medium" id="sand">
        <img
            style="max-width: 100%"
            :src="'https://www.ermaozi.cn/api/v1/jx3/sand/'+router.currentRoute.value.params.server+'?img=1'"
        />
    </n-space>
</template>
<script setup>
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { NSpace } from "naive-ui";

const router = useRouter();

</script>

<style>
</style>