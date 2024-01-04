<template>
    <n-space vertical size="medium" id="sand">
        <n-image
            style="max-width: 100%"
            :src="base_url+'/api/v1/jx3/sand/'+router.currentRoute.value.params.server+'?img=1'"
        />
    </n-space>
</template>
<script setup>
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import { NSpace, NImage } from "naive-ui";
import { ref } from "vue";

const router = useRouter();

const base_url = ref(window.gurl.SERVICE_CONTEXT_PATH);

</script>

<style>
</style>