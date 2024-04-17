<template>
     <div>
    <n-tabs
    v-model:value="nameRef"
    type="card"
    closable
    tab-style="min-width: 80px;"
    @update:value="handleTabChange"
    @close="handleClose"
  >
    <n-tab-pane
      v-for="panel in panelsRef"
      :key="panel"
      :tab="panel.toString()"
      :name="panel"
    >
    <router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
</router-view>


    </n-tab-pane>
  </n-tabs>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import {useMessage,NTabs,NTabPane} from "naive-ui";
import { useRouter } from "vue-router";
const router = useRouter();

const nameRef = ref(1)
const message = useMessage()
const panelsRef = ref([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15])

function handleTabChange (tabName){
    console.log(11111111111);
    router.push({ path: '/common/chat_room/chat/' + tabName })

}

function handleClose (name) {
    const { value: panels } = panelsRef
    if (panels.length === 1) {
    message.error('最后一个了')
    return
    }
    message.info('关掉 ' + name)
    const index = panels.findIndex((v) => name === v)
    panels.splice(index, 1)
    if (nameRef.value === name) {
    nameRef.value = panels[index]
    }
}
</script>