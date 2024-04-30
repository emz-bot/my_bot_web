<template>
    <div id="home">
        <img src="@/assets/logo.svg" @click="login">
        <h1>问君何<span style="color: #336f87;">能</span>尔</h1>
        <h2>心<span style="color: #336f87;">远</span>地自偏</h2>
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
                router.push({ path: "/common" });
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