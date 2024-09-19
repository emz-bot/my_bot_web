<template>
  <div class="shop-container">
    <div class="shop-item">
      <BuyBot />
    </div>
    <div class="shop-item">
      <RenewalBot />
    </div>
    <div class="shop-item" v-if="user_permission >= 1">
      <Recharge />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BuyBot from './commodity/BuyBot.vue'
import RenewalBot from "./commodity/RenewalBot.vue";
import Recharge from './commodity/Recharge.vue'

var user_permission = ref(localStorage.user_permission);
</script>

<style scoped>
.shop-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.shop-item {
  flex: 1 1 calc(33.333% - 12px); /* 每个项目占据三分之一的宽度，减去间距 */
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .shop-item {
    flex: 1 1 calc(50% - 12px); /* 屏幕宽度小于768px时，每个项目占据二分之一的宽度 */
  }
}

@media (max-width: 480px) {
  .shop-item {
    flex: 1 1 100%; /* 屏幕宽度小于480px时，每个项目占据100%的宽度 */
  }
}
</style>