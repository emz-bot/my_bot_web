<template>
    <div style="width:300px;">
      <!-- 公告栏 -->
      <n-space  style="width: 200px; height: 200px; border: 1px solid rgb(34, 37, 42); padding: 10px;">
        公告
      </n-space>
      <!-- 成员列表 -->
      <n-space vertical style="width: 200px; height: 350px; border: 1px solid rgb(34, 37, 42); padding: 10px; margin-top: 10px"
         >
        <div v-for="(value, key, index) in channel_member" :key="index"
          :style="{ color: value.online ? 'white' : 'gray'}"
          style="display: flex; align-items: center;">

            <n-avatar style="margin-left: 10px; margin-top: 10px;"  size="tiny" :src="useravatarbase_url + key + '.webp'"
              :fallback-src="default_vatar_url" />
            <span style="margin-top: 5px; margin-left: 5px;">
                {{ key }}
            </span>
        </div>
      </n-space>

    </div>
</template>

<script setup>
import { ref } from "vue";  
import { NAvatar,NSpace} from 'naive-ui';
const useravatarbase_url = ref(`${window.gurl.OSS_BASE_URL}jianghu/avatar/`)
const default_vatar_url = ref(`${window.gurl.OSS_BASE_URL}jianghu/avatar/default.webp`)
const props = defineProps({ channel_member: Object})
const channel_member = ref(props.channel_member)











</script>