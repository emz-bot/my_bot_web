<template>
  <n-space>
    <n-space vertical style="width: 350px">
      <BuyBot />
    </n-space>
    <n-space vertical style="width: 350px">
      <RenewalBot />
    </n-space>
    <n-space vertical style="width: 350px" v-if="user_permission >= 1">
      <Recharge />
    </n-space>
  </n-space>
</template>

<script setup>
import {
  NGrid,
  NGridItem,
  NSpace
} from "naive-ui";
import { ref } from "vue";
import { useRouter } from "vue-router";
import Recharge from './commodity/Recharge.vue'
import BuyBot from './commodity/BuyBot.vue'
import RenewalBot from "./commodity/RenewalBot.vue";
var user_permission = ref(localStorage.user_permission);
</script>
<style scoped>
</style>
