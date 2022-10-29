<template>
    <n-space vertical size="medium">
        <div id="server">
            <h1 class="text" :text="sand_data.server">{{sand_data.server}}</h1>
        </div>
        <div class="sand_map" style="position: relative;left: -82px;top: 8px;transform: scale(0.85);">
            <div>
                <img style="position: absolute;max-width: 100%; left: 122px;top: 189px;width: 708px;height: 478px;z-index:1" :src="require(`@/assets/sand/阵营防线.png`)">
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 225px;top: 58px;" :src="require(`@/assets/sand/恶_恶人谷.png`)">
                <img style="position: absolute;max-width: 100%; left: 287px;top: 105px;" :src="require(`@/assets/sand/图标_恶_恶人谷.png`)">
                <span class="u-name" style="left: 367px;top: 105px;z-index:3;position: absolute;">恶人谷</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 300px;top: 110px;" :src="require(`@/assets/sand/${sand_data.凛风堡}_凛风堡.png`)">
                <img style="position: absolute;max-width: 100%;left: 432px;top: 187px;" :src="require(`@/assets/sand/图标_${sand_data.凛风堡}_凛风堡.png`)">
                <span class="u-name" style="left: 482px;top: 177px;z-index:3;position: absolute;">凛风堡</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 262px;top: 248px;" :src="require(`@/assets/sand/${sand_data.神池岭}_神池岭.png`)">
                <img style="position: absolute;max-width: 100%;left: 283px;top: 288px;" :src="require(`@/assets/sand/图标_${sand_data.神池岭}_02.png`)">
                <span class="u-name" style="left: 323px;top: 278px;z-index:3;position: absolute;">神池岭</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 167px;top: 310px;" :src="require(`@/assets/sand/${sand_data.烈日岗}_烈日岗.png`)">
                <img style="position: absolute;max-width: 100%;left: 230px;top: 368px;" :src="require(`@/assets/sand/图标_${sand_data.烈日岗}_01.png`)">
                <span class="u-name" style="left: 276px;top: 358px;z-index:3;position: absolute;">烈日岗</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 443px;top: 227px;" :src="require(`@/assets/sand/${sand_data.扶风郡}_扶风郡.png`)">
                <img style="position: absolute;max-width: 100%;left: 475px;top: 265px;" :src="require(`@/assets/sand/图标_${sand_data.扶风郡}_01.png`)">
                <span class="u-name" style="left: 525px;top: 255px;z-index:3;position: absolute;">扶风郡</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 383px;top: 274px;" :src="require(`@/assets/sand/${sand_data.世外坡}_世外坡.png`)">
                <img style="position: absolute;max-width: 100%;left: 445px;top: 334px;" :src="require(`@/assets/sand/图标_${sand_data.世外坡}_05.png`)">
                <span class="u-name" style="left: 485px;top: 324px;z-index:3;position: absolute;">世外坡</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 507px;top: 181px;" :src="require(`@/assets/sand/${sand_data.飞沙关}_飞沙关.png`)">
                <img style="position: absolute;max-width: 100%;left: 530px;top: 204px;" :src="require(`@/assets/sand/图标_${sand_data.飞沙关}_01.png`)">
                <span class="u-name" style="left: 570px;top: 194px;z-index:3;position: absolute;">飞沙关</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 540px;top: 162px;" :src="require(`@/assets/sand/${sand_data.龙门镇}_龙门镇.png`)">
                <img style="position: absolute;max-width: 100%;left: 597px;top: 188px;" :src="require(`@/assets/sand/图标_${sand_data.龙门镇}_02.png`)">
                <span class="u-name" style="left: 637px;top: 178px;z-index:3;position: absolute;">龙门镇</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 178px;top: 530px;" :src="require(`@/assets/sand/${sand_data.凤鸣堡}_凤鸣堡.png`)">
                    <img style="position: absolute;max-width: 100%;left: 222px;top: 575px;" :src="require(`@/assets/sand/图标_${sand_data.凤鸣堡}_04.png`)">
                    <span class="u-name" style="left: 262px;top: 565px;z-index:3;position: absolute;">凤鸣堡</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 166px;top: 422px;" :src="require(`@/assets/sand/${sand_data.惊虬谷}_惊虬谷.png`)">
                    <img style="position: absolute;max-width: 100%;left: 275px;top: 476px;" :src="require(`@/assets/sand/图标_${sand_data.惊虬谷}_01.png`)">
                    <span class="u-name" style="left: 315px;top: 466px;z-index:3;position: absolute;">惊虬谷</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 406px;top: 394px;" :src="require(`@/assets/sand/${sand_data.日月崖}_日月崖.png`)">
                    <img style="position: absolute;max-width: 100%;left: 494px;top: 472px;" :src="require(`@/assets/sand/图标_${sand_data.日月崖}_02.png`)">
                    <span class="u-name" style="left: 534px;top: 462px;z-index:3;position: absolute;">日月崖</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 375px;top: 508px;" :src="require(`@/assets/sand/${sand_data.卧龙坡}_卧龙坡.png`)">
                    <img style="position: absolute;max-width: 100%;left: 469px;top: 553px;" :src="require(`@/assets/sand/图标_${sand_data.卧龙坡}_03.png`)">
                    <span class="u-name" style="left: 509px;top: 543px;z-index:3;position: absolute;">卧龙坡</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 643px;top: 196px;" :src="require(`@/assets/sand/${sand_data.啖杏林}_啖杏林.png`)">
                    <img style="position: absolute;max-width: 100%;left: 651px;top: 230px;" :src="require(`@/assets/sand/图标_${sand_data.啖杏林}_01.png`)">
                    <span class="u-name" style="left: 671px;top: 270px;z-index:3;position: absolute;">啖杏林</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 636px;top: 246px;" :src="require(`@/assets/sand/${sand_data.枫湖寨}_枫湖寨.png`)">
                    <img style="position: absolute;max-width: 100%;left: 713px;top: 284px;" :src="require(`@/assets/sand/图标_${sand_data.枫湖寨}_03.png`)">
                    <span class="u-name" style="left: 743px;top: 274px;z-index:3;position: absolute;">枫湖寨</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 536px;top: 405px;" :src="require(`@/assets/sand/${sand_data.不空关}_不空关.png`)">
                <img style="position: absolute;max-width: 100%;left: 630px;top: 436px;" :src="require(`@/assets/sand/图标_${sand_data.不空关}_04.png`)">
                <span class="u-name" style="left: 670px;top: 426px;z-index:3;position: absolute;">不空关</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 575px;top: 467px;" :src="require(`@/assets/sand/${sand_data.激流坞}_激流坞.png`)">
                <img style="position: absolute;max-width: 100%;left: 597px;top: 505px;" :src="require(`@/assets/sand/图标_${sand_data.激流坞}_01.png`)">
                <span class="u-name" style="left: 637px;top: 495px;z-index:3;position: absolute;">激流坞</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 274px;top: 654px;" :src="require(`@/assets/sand/${sand_data.澜沧城}_澜沧城.png`)">
                <img style="position: absolute;max-width: 100%;left: 330px;top: 747px;" :src="require(`@/assets/sand/图标_${sand_data.澜沧城}_03.png`)">
                <span class="u-name" style="left: 370px;top: 737px;z-index:3;position: absolute;">澜沧城</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 205px;top: 630px;" :src="require(`@/assets/sand/${sand_data.霜戈堡}_霜戈堡.png`)">
                <img style="position: absolute;max-width: 100%;left: 256px;top: 676px;" :src="require(`@/assets/sand/图标_${sand_data.霜戈堡}_01.png`)">
                <span class="u-name" style="left: 296px;top: 666px;z-index:3;position: absolute;">霜戈堡</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 773px;top: 168px;" :src="require(`@/assets/sand/${sand_data.金门关}_金门关.png`)">
                <img style="position: absolute;max-width: 100%;left: 823px;top: 250px;" :src="require(`@/assets/sand/图标_${sand_data.金门关}_04.png`)">
                <span class="u-name" style="left: 863px;top: 240px;z-index:3;position: absolute;">金门关</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 867px;top: 189px;" :src="require(`@/assets/sand/${sand_data.青云坞}_青云坞.png`)">
                <img style="position: absolute;max-width: 100%;left: 901px;top: 218px;" :src="require(`@/assets/sand/图标_${sand_data.青云坞}_01.png`)">
                <span class="u-name" style="left: 941px;top: 208px;z-index:3;position: absolute;">青云坞</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 712px;top: 427px;" :src="require(`@/assets/sand/${sand_data.逐鹿坪}_逐鹿坪.png`)">
                <img style="position: absolute;max-width: 100%;left: 773px;top: 485px;" :src="require(`@/assets/sand/图标_${sand_data.逐鹿坪}_03.png`)">
                <span class="u-name" style="left: 813px;top: 475px;z-index:3;position: absolute;">逐鹿坪</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 641px;top: 511px;" :src="require(`@/assets/sand/${sand_data.盘龙坞}_盘龙坞.png`)">
                <img style="position: absolute;max-width: 100%;left: 732px;top: 556px;" :src="require(`@/assets/sand/图标_${sand_data.盘龙坞}_05.png`)">
                <span class="u-name" style="left: 772px;top: 546px;z-index:3;position: absolute;">盘龙坞</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 453px;top: 611px;width: 288px;height: 196px;" :src="require(`@/assets/sand/${sand_data.千岩关}_千岩关.png`)">
                    <img style="position: absolute;max-width: 100%;left: 530px;top: 751px;" :src="require(`@/assets/sand/图标_${sand_data.千岩关}_01.png`)">
                    <span class="u-name" style="left: 570px;top: 741px;z-index:3;position: absolute;">千岩关</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 453px;top: 634px;width: 171px;height: 101px;" :src="require(`@/assets/sand/${sand_data.大理山城}_大理山城.png`)">
                    <img style="position: absolute;max-width: 100%;left: 487px;top: 660px;" :src="require(`@/assets/sand/图标_${sand_data.大理山城}_04.png`)">
                    <span class="u-name" style="left: 527px;top: 650px;z-index:3;position: absolute;">大理山城</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 761px;top: 359px;" :src="require(`@/assets/sand/${sand_data.秋雨堡}_秋雨堡.png`)">
                <img style="position: absolute;max-width: 100%;left: 828px;top: 405px;" :src="require(`@/assets/sand/图标_${sand_data.秋雨堡}_01.png`)">
                <span class="u-name" style="left: 868px;top: 395px;z-index:3;position: absolute;">秋雨堡</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 745px;top: 300px;" :src="require(`@/assets/sand/${sand_data.红莲岗}_红莲岗.png`)">
                <img style="position: absolute;max-width: 100%;left: 849px;top: 334px;" :src="require(`@/assets/sand/图标_${sand_data.红莲岗}_02.png`)">
                <span class="u-name" style="left: 889px;top: 324px;z-index:3;position: absolute;">红莲岗</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 701px;top: 466px;width: 251px;height: 272px;" :src="require(`@/assets/sand/${sand_data.武王城}_武王城.png`)">
                <img style="position: absolute;max-width: 100%;left: 842px;top: 599px;" :src="require(`@/assets/sand/图标_${sand_data.武王城}_武王城.png`)">
                <span class="u-name" style="left: 902px;top: 589px;z-index:3;position: absolute;">武王城</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%; left: 815px;top: 552px;" :src="require(`@/assets/sand/浩_浩气盟.png`)">
                <img style="position: absolute;max-width: 100%;left: 887px;top: 661px;" :src="require(`@/assets/sand/图标_浩_浩气盟.png`)">
                <span class="u-name" style="left: 957px;top: 671px;z-index:3;position: absolute;">浩气盟</span>
            </div>
            <div>
                <img style="position: absolute;max-width: 100%;left: 418px;top: 180px;" :src="require(`@/assets/sand/昆仑.png`)">
                <img style="position: absolute;max-width: 100%;left: 431px;top: 283px;" :src="require(`@/assets/sand/马嵬驿.png`)">
                <img style="position: absolute;max-width: 100%;left: 332px;top: 328px;" :src="require(`@/assets/sand/融天岭.png`)">
                <img style="position: absolute;max-width: 100%;left: 576px;top: 171px;" :src="require(`@/assets/sand/龙门荒漠.png`)">
                <img style="position: absolute;max-width: 100%;left: 236px;top: 492px;" :src="require(`@/assets/sand/黑龙沼.png`)">
                <img style="position: absolute;max-width: 100%;left: 462px;top: 478px;" :src="require(`@/assets/sand/白龙口.png`)">
                <img style="position: absolute;max-width: 100%;left: 691px;top: 217px;" :src="require(`@/assets/sand/枫华谷战乱.png`)">
                <img style="position: absolute;max-width: 100%;left: 607px;top: 424px;" :src="require(`@/assets/sand/瞿塘峡.png`)">
                <img style="position: absolute;max-width: 100%;left: 321px;top: 687px;" :src="require(`@/assets/sand/无量山.png`)">
                <img style="position: absolute;max-width: 100%;left: 879px;top: 211px;" :src="require(`@/assets/sand/金水镇.png`)">
                <img style="position: absolute;max-width: 100%;left: 576px;top: 695px;" :src="require(`@/assets/sand/苍山洱海.png`)">
                <img style="position: absolute;max-width: 100%;left: 749px;top: 486px;" :src="require(`@/assets/sand/巴陵县.png`)">
                <img style="position: absolute;max-width: 100%;left: 815px;top: 349px;" :src="require(`@/assets/sand/洛道.png`)">
                <img style="position: absolute;max-width: 100%;left: 810px;top: 571px;" :src="require(`@/assets/sand/南屏山.png`)">
            </div>
        </div>
        <img style="max-width: 100%;" :src="require(`@/assets/sand/backgroud.png`)">
    </n-space>
</template>
<script setup>
import { ref, watch } from "vue";
import { api_get_sand } from "@/utils/api";
import { useRouter, onBeforeRouteUpdate } from "vue-router";
import {
  NSpace,
} from "naive-ui";

const router = useRouter();
var router_params = router.currentRoute.value.params;

const sand_data = ref({
  "server": "",
  "不空关": "恶",
  "世外坡": "恶",
  "凛风堡": "恶",
  "凤鸣堡": "恶",
  "千岩关": "恶",
  "卧龙坡": "恶",
  "啖杏林": "恶",
  "大理山城": "恶",
  "惊虬谷": "恶",
  "扶风郡": "恶",
  "日月崖": "恶",
  "枫湖寨": "恶",
  "武王城": "恶",
  "澜沧城": "恶",
  "激流坞": "恶",
  "烈日岗": "恶",
  "盘龙坞": "恶",
  "神池岭": "恶",
  "秋雨堡": "恶",
  "红莲岗": "恶",
  "逐鹿坪": "恶",
  "金门关": "恶",
  "霜戈堡": "恶",
  "青云坞": "恶",
  "飞沙关": "恶",
  "龙门镇": "恶"
})
const server_name = ref("")
async function get_sand(server) {
  await api_get_sand(server).then((res) => {
    if (res.code == 200) {
      sand_data.value = res.data
      server_name.value = res.data.server
    }
  });
}
get_sand(router_params.server);

onBeforeRouteUpdate((to) => {
    get_sand(to.params.server);
});

</script>

<style>

.u-name {
    display: block;
    color: #fffcd0;
    font-size: 12px;
    line-height: 18px;
    width: 1em;
    text-shadow: 1px 1px 1px #000;
}

#server {
    font-family: xingkai;
    position: absolute;
    max-width: 100%;
    left: 50%;
    transform: translate(-50%,0);
    top: 35px;
    z-index: 1;
}

.text {
    font-weight: 800;
    font-size: 50px;
    position: relative;
    text-shadow: 2px 2px 5px black;
  }

.text::after {
    content: attr(text);
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    background-image: linear-gradient(to bottom, #ffeebc, #ce893b);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: none;
}
</style>