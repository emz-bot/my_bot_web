<template>
    <div id="home">
        <img src="@/assets/logo.svg" @click="login">
        <h1>谓言挂席<span style="color: #336f87;">度</span>沧海</h1>
        <h2>却来<span style="color: #336f87;">应是</span>无长风</h2>
    </div>
</template>
<script setup>
    import { useRouter } from "vue-router";

    const router = useRouter();
    var click_num = 0
    function login() {
        click_num++
        if (click_num >= 5){
            if (localStorage.token != 0){
                if (localStorage.user_permission >= 3){
                    router.push({ path: "/management" });
                } else {
                    router.push({ path: "/common" });
                }
            }else{
                router.push({ path: "/login" });
            }
        }
    }
</script>
<style>
    #home {
        text-align: center;
        font-size: 3em;
        margin-top: 80px;
    }
</style>