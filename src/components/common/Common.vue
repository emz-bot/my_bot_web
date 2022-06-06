<template>
  <n-card>
    <n-tabs size="large" justify-content="space-evenly">
      <n-tab-pane name="河灯"  tab="河灯">
        <RiverLantern />
      </n-tab-pane>
      <n-tab-pane name="none1" tab="还没开发" :disabled="true">
        没东西
      </n-tab-pane>
      <n-tab-pane name="none2" tab="还没开发" :disabled="true">
        没东西
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
<script setup>
  import {
    NTabs,
    NCard,
    NTabPane
  } from "naive-ui";
  import RiverLantern from './RiverLantern.vue'
</script>
