<template>
    {{ jianghu_user_info }}
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { get_jianghu_user_info } from '@/utils/jianghu_api'
import { useMessage } from "naive-ui";

const message = useMessage()
const jianghu_user_info = ref({})


const init = async () => {
  const res = await get_jianghu_user_info()
  console.log(res)
  if (res.code === 200) {
    jianghu_user_info.value = res.data
  } else {
    message.error(res.msg)
  }
}
onMounted(async () => {
  await init();
});

</script>