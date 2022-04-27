<template>
    <div id="home">
        <img src="@/assets/logo.svg" @click="login">
        <h1>老月唱花<span style="color: #336f87;">相</span>尽酒</h1>
        <h2>日暮<span style="color: #336f87;">江湖</span>满杯楼</h2>
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
                    router.push({ path: "/index/management" });
                } else {
                    router.push({ path: "/index/common" });
                }
            }else{
                router.push({ path: "/index/login" });
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