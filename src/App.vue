<template>
    <div id="app">
        <!--allmap->地图容器，无内容-->
        <div id="allmap"></div>
        <v-header></v-header>
        <keep-alive>
            <router-view :shouldChangeCity="shouldChangeCity" :cityName="cityName" :curCompany="curCompany" class="app-router"></router-view>
        </keep-alive>
    </div>
</template>

<script>
    import header from '@/components/header/header.vue';
    export default {
        name: 'app',
        data() {
            return {
                cityName: '正在定位',
                shouldChangeCity: true,
                headerTitle: '水费缴费',
                curCompany: {},
                backType: '',
                showSubTitle: false
            };
        },
        created() {
//            this.$util.forbidScal();
        },
        components: {
            'v-header': header
        }
    };
</script>

<style lang="scss">
    @import "../static/css/base.css";

    #app {
        .app-router {
            margin-top: 68px;
            position: absolute;
            bottom: 0;
            top: 0;
            background-color: #F5F4F9;
        }
    }
</style>
