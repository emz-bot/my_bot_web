<template>
    <div class="avatar-container">
        <n-avatar :size="100" :src="avatarUrl" class="avatar" />
        <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none">
        <div class="avatar-buttons">
            <n-button class="avatar-button" text @click="fileInputClick">
                <n-icon size="22px">
                    <CreateOutline />
                </n-icon>
            </n-button>
            <n-button class="avatar-button" text @click="openDialog">
                <n-icon size="22px">
                    <EyeOutline />
                </n-icon>
            </n-button>
        </div>
        <n-modal v-model:show="showDialog">
            <n-card style="width: 445px; text-align: center;">
                <img :src="avatarUrl" alt="Avatar" style="width: 400px; height: auto;">
            </n-card>
        </n-modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { NAvatar, NButton, NModal, NIcon, NCard } from "naive-ui";
import { CreateOutline, EyeOutline } from '@vicons/ionicons5'
import { upload_avatar } from "@/utils/jianghu_api";

let avatarUrl = ref("https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg");
let fileInput = ref(null);
let showDialog = ref(false);

const handleFileUpload = (event) => {
    const file = event.target.files[0];
    uploadFile(file).then(url => {
        avatarUrl.value = url;
    });
};

const uploadFile = async (file) => {
    await upload_avatar(file).then((res) => {
    if (res.code == 200) {
      console.log(res.data);
    }
  });
};

const fileInputClick = () => {
    fileInput.value.click();
};

const openDialog = () => {
    showDialog.value = true;
};
</script>

<style scoped>
.avatar-container {
    position: relative;
    width: 100px;
    height: 100px;
}
.avatar {
    transition: filter 0.3s ease;
}

.avatar-container:hover .avatar {
    filter: brightness(50%);
}
.avatar-button {
    display: none;
}

.avatar-buttons {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    gap: 10px;
}

.avatar-container:hover .avatar-button {
    display: block;
}
</style>