<template>
    <n-button v-if="user_permission >= 5" @click="is_edit = !is_edit">编辑</n-button>
    <div v-if="!is_edit" class="preview-container">
        <n-scrollbar class="responsive-preview" :style="{ height: table_height + 'px' }">
            <MdPreview :modelValue="state.text" :editorId="state.id" :theme="state.theme" :previewTheme="state.pre_theme"
            @onGetCatalog="onGetCatalog" />
        </n-scrollbar>
        <n-scrollbar class="responsive-anchor" :style="{ height: table_height + 'px' }">
            <n-anchor
            listen-to=".document-scroll-container"
            :trigger-top="24"
            :top="88"
            style="z-index: 1"
            :bound="24"
            >
            <n-anchor-link :title="lv1.text" :href="'#'+lv1.text" v-for="lv1 in state.catalogData" :key="lv1.id">
                <n-anchor-link :title="lv2.text" :href="'#'+lv2.text" v-for="lv2 in lv1.children" :key="lv2.id" >
                    <n-anchor-link :title="lv3.text" :href="'#'+lv3.text" v-for="lv3 in lv2.children" :key="lv3.id" >
                        <n-anchor-link :title="lv4.text" :href="'#'+lv4.text" v-for="lv4 in lv3.children" :key="lv4.id" >
                        </n-anchor-link>
                    </n-anchor-link>
                </n-anchor-link>
            </n-anchor-link>
            </n-anchor>
        </n-scrollbar>
    </div>
    <div v-if="user_permission >= 5 && is_edit">
        <MdEditor v-model="state.text" theme="dark" :style="{ height: table_height - 100 + 'px', width: '100%' }" />
        <br>
        <n-button type="success" @click="update_doc" style="width: 100%;">提交</n-button>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { MdPreview, MdEditor, MdCatalog } from 'md-editor-v3';
import { NButton, useMessage, NScrollbar, NAnchor, NAnchorLink } from "naive-ui";
import { api_update_doc, api_get_doc } from "@/utils/api";
import 'md-editor-v3/lib/style.css';

const table_height = ref(window.innerHeight - 280);

var user_permission = ref(localStorage.user_permission);

const is_edit = ref(false);
const message = useMessage();

const state = reactive({
    theme: 'dark',
    pre_theme: 'github',
    text: '',
    id: 'mybot_doc',
    
    catalogData: []
});

const onGetCatalog = (list) => {
    const root = { level: 0, text: '', children: [] };
    const path = [root];

    for (let item of list) {
        const node = { level: item.level, text: item.text, children: [] };

        while (path.length - 1 >= item.level) {
            path.pop();
        }

        if (path.length < 5) { // 限制最多四层
            path[path.length - 1].children.push(node);
            path.push(node);
        }
    }
    if (root.children.length > 0){
        state.catalogData = root.children[0].children;
    }
};

function update_doc() {
    api_update_doc({ "content": state.text }).then((res) => {
        if (res.code == 200) {
            message.success(res.msg);
        } else {
            message.error(res.msg);
        }
    });
}

function get_doc() {
    api_get_doc().then((res) => {
        if (res.code == 200) {
            state.text = res.data.content;
        } else {
            message.error(res.msg);
        }
    });
}
get_doc();

</script>

<style>
#mybot_doc {
    background-color: #0000;
}
.responsive-anchor {
    width: 20%;
    overflow: auto;
}
.responsive-preview {
    width: 80%
}
@media (max-width: 800px) {
  .responsive-anchor {
    display: none;
  }
  .responsive-preview {
    width: 100%;
  }
}
.preview-container,
.editor-container {
    display: flex;
    flex-direction: row;
}
</style>