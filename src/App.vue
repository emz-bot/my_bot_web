<template>
  <n-config-provider :theme="darkTheme" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <router-view />
    </n-message-provider>
    <a id="record" href="https://beian.miit.gov.cn"> 陕ICP备2022002093号 </a>
  </n-config-provider>
</template>

<script>
import { NMessageProvider, darkTheme, NConfigProvider, zhCN, dateZhCN } from "naive-ui";
import { defineComponent } from 'vue'
export default  defineComponent({
  name: "App",
  components: {
    NMessageProvider,
    NConfigProvider,
  },
  setup() {
    return {
      darkTheme,
      zhCN,
      dateZhCN,
    }
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #c1d1e0;
  margin-top: 40px;
}
#record {
  color: #434649b9;
  display: block;
  text-align: center;
  margin-top: 200px;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
    width: 12px;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}

</style>
