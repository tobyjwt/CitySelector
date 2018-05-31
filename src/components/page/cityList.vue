<template>
    <div class="cityList" ref="citylistpage">
        <div>
            <div class="search-bar">
                <div class="search-input-bar">
                    <div v-show="!showCancelIcon" class="search-icon">匨
                    </div>
                    <form action="javascript: return false;">
                        <input type="search" autocomplete="off" @keyup.enter="keyupSearch(searchMsg)"
                               placeholder="请输入城市名" v-model="searchMsg">
                    </form>
                    <div class="close-icon" @click="cancelSearch()" v-show="showCancelIcon">慶</div>
                </div>
            </div>
            <div class="allcity-bar" v-if="!showSearchInfo" ref="allcitybar">
                <div v-if="cityList" class="city-item-list" v-for="(list, word) in cityList">
                    <div class="city-title">{{word}}</div>
                    <ul>
                        <li @click="selectCity(city.name)" class="city-item" v-for="(city, index) in list">{{city.name}}
                        </li>
                    </ul>
                </div>
            </div>
            <div class="city-search-bar" v-if="showSearchInfo">
                <ul>
                    <li @click="selectCity(city.name)" class="city-item" v-for="(city, index) in searchRes">{{city.name}}
                    </li>
                </ul>
            </div>
        </div>
        <div class="fast-sel-bar" v-show="!showSearchInfo">
            <p class="fast-sel-item" :class="{fastSelActive: index === curCityListIndex}"
               v-for="(list, word, index) in cityList" :data-index="index" @touchstart="onSelectFastTouchStart"
               @touchmove.stop.prevent="onSelectFastTouchMove">
                {{word}}
            </p>
        </div>
    </div>
</template>

<script>
    import {cityList} from '@/common/city.js';
    import BScroll from 'better-scroll';
    export default {
        props: ['shouldChangeCity'],
        data() {
            return {
                searchMsg: '', // 搜索的信息
                cityList: {}, // 所有城市
                showSearchInfo: false, // 是否显示搜索提示框
                searchRes: [], // 搜索结果
                listHeight: [], // 每组城市的高度
                scrollY: 0, // Y方向距离
                touch: {}, //
                cityDomList: null, // 城市dom
                htmlFontSize: 0, // 用于计算高度
                curCityListIndex: 0 // 当前快速选择index
            };
        },
        created() {
            this.cityList = cityList;
            let that = this;
            setTimeout(() => {
                that._initScroll();
                that.calculateHeight();
            }, 20);
        },
        mounted() {
            let that = this;
            this.cityDomList = this.$refs.allcitybar.getElementsByClassName('city-item-list');
            setTimeout(() => {
                that.htmlFontSize = window.document.getElementsByTagName('html')[0].style.fontSize;
            }, 20);
        },
        computed: {
            // 计算是否显示搜索提示框
            showCancelIcon() {
                return this.searchMsg !== '';
            }
        },
        watch: {
            scrollY(newY) {
                const listHeight = this.listHeight;
                // 当滚动到顶部，newY>0
                if (newY > 0) {
                    this.curCityListIndex = 0;
                    return;
                }
                // 在中间部分滚动
                for (let i = 0; i < listHeight.length - 1; i++) {
                    let height1 = listHeight[i];
                    let height2 = listHeight[i + 1];
                    if (-newY >= height1 && -newY < height2) {
                        this.curCityListIndex = i;
                        this.diff = height2 + newY;
                        return;
                    }
                }
                // 当滚动到底部，且-newY大于最后一个元素的上限;
                this.currentIndex = listHeight.length - 2;
            },
            // 观测搜索框内输入的文字
            searchMsg() {
                if (this.searchMsg) {
                    this.cityListScroll.refresh();
                }
                this.searchRes = [];
                // 事件截留
                if (this.searchMsgTimeoutFlag) {
                    window.clearTimeout(this.searchMsgTimeoutFlag);
                }
                this.searchMsgTimeoutFlag = window.setTimeout(() => {
                    if (this.searchMsg !== '') {
                        this.showSearchInfo = true;
                        this.searchCityByName(this.searchMsg);
                        this.cityListScroll.refresh();
                    } else {
                        this.showSearchInfo = false;
                    }
                }, 200);
            },
            showSearchInfo() {
                this.$nextTick(() => {
                    this.cityListScroll.refresh();
                });
            }
        },
        methods: {
            /**
             * [选择城市]
             * @param  {[type]}         [无入参]
             * @return {[type]}         [无返回值]
             */
            selectCity(cityName) {
                this.$parent.cityName = cityName;
                this.$parent.shouldChangeCity = false;
                this.$router.go(-1);
            },
            /**
             * [退出文字搜索(输入框X号功能)]
             * @param  {[type]}         [无入参]
             * @return {[type]}         [无返回值]
             */
            cancelSearch() {
                this.searchMsg = '';
            },
            /**
             * [keyup事件的触发，当输入框的内容包含于城市列表时触发城市选择]
             * @param  {[string]} searchMsg  [搜索框内的文字]
             * @return {[type]}              [无返回值]
             */
            keyupSearch(searchMsg) {
                if (this.searchRes.length > 0 && searchMsg === this.searchRes[0].name) {
                    this.selectCity(searchMsg);
                }
                return false;
            },
            /**
             * [根据输入的文字在所有城市中检索]
             * @param  {[string]} cityName  [搜索框内的文字]
             * @return {[type]}             [无返回值]
             */
            searchCityByName(cityName) {
                let hasChinese = /.*[\u4e00-\u9fa5]+.*$/.test(cityName); // 是否有中文
                let hasWord = /^[a-zA-Z]/.test(cityName); // 是否有英文
                if (hasChinese && hasWord) {
                    return;
                } else if (hasChinese) {
                    for (let i in cityList) {
                        for (let m of cityList[i]) {
                            if (m.name.indexOf(cityName) > -1) {
                                this.searchRes.push(m);
                            }
                        }
                    }
                } else if (hasWord) {
                    for (let i in cityList) {
                        for (let m of cityList[i]) {
                            if (m.pinyin.indexOf(cityName) > -1) {
                                this.searchRes.push(m);
                            }
                        }
                    }
                }
            },
            /**
             * [初始化scroll]
             * @param  {[type]}         [无入参]
             * @return {[type]}         [无返回值]
             */
            _initScroll() {
                this.cityListScroll = new BScroll(this.$refs.citylistpage, {
                    click: true,
                    probeType: 3
                });
                this.cityListScroll.on('scroll', (pos) => {
                    this.scrollY = pos.y;
                });
            },
            /**
             * [计算每个城市区块的高度]
             * @param  {[type]}         [无入参]
             * @return {[type]}         [无返回值]
             */
            calculateHeight() {
                this.$nextTick(() => {
                    let cityList = this.$refs.allcitybar.getElementsByClassName('city-item-list');
                    let height = 0;
                    this.listHeight.push(height);
                    for (let i = 0; i < cityList.length; i++) {
                        let item = cityList[i];
                        height += item.clientHeight;
                        this.listHeight.push(height);
                    }
                });
            },
            /**
             * [跳转到快速检索对应首字母的位置]
             */
            onSelectFastTouchStart(e) {
                let anchorIndex = e.target.getAttribute('data-index');
                let firstTouch = e.touches[0];
                this.touch.y1 = firstTouch.pageY;
                this.touch.anchorIndex = anchorIndex;
                let el = this.cityDomList[anchorIndex];
                this.scrollY = -this.listHeight[anchorIndex];
                this.cityListScroll.scrollToElement(el);
            },
            /**
             * [滑动到快速检索对应首字母的位置]
             */
            onSelectFastTouchMove(e) {
                let firstTouch = e.touches[0];
                this.touch.y2 = firstTouch.pageY;
                let itemHeight = 0.4 * parseInt(this.htmlFontSize); // 高度为0.4rem，换算为实际高度
                let delta = (this.touch.y2 - this.touch.y1) / itemHeight | 0;
                let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
                let el = this.cityDomList[anchorIndex];
                this.scrollY = -this.listHeight[anchorIndex];
                this.cityListScroll.scrollToElement(el);
            }
        }
    };
</script>

<style lang="scss">
    .cityList {
        width: 100%;
        position: absolute;
        overflow: hidden;
        .search-bar {
            /*position: fixed;*/
            z-index: 10;
            background-color: #ffffff;
            width: 100%;
            height: 104px;
            border-bottom: solid 1px #f0f0f0;
            .search-input-bar {
                position: relative;
                top: 0.24rem;
                display: flex;
                height: 0.55rem;
                line-height: 0.55rem;
                margin: 0 20px;
                padding: 0 0.27rem;
                background-color: #eeeeee;
                font-size: 0.24rem;
                border-radius: 0.27rem;
                .search-icon, .close-icon {
                    flex: 0 0 auto;
                    font-family: iconfont;
                    font-size: 0.25rem;
                    color: #999999;
                }
                form {
                    flex: 1 0 auto;
                    input {
                        position: relative;
                        top: -0.03rem;
                        outline: none;
                        appearance: textfield;
                        color: #999999;
                        background-color: #eeeeee;
                        text-indent: 0.05rem;
                    }
                    input[type="search"]::-webkit-search-cancel-button {
                        display: none;
                    }
                }
            }
        }
        .allcity-bar {
            width: 100%;
            background-color: #FFFFFF;
            .city-item-list {
                .city-title {
                    padding-left: 0.56rem;
                    height: 0.5rem;
                    line-height: 0.5rem;
                    color: #666666;
                    background-color: #EEEEEE;
                }
            }
        }
        .fast-sel-bar {
            position: fixed;
            top: 2rem;
            right: 0;
            width: 0.5rem;
            text-align: center;
            .fast-sel-item {
                height: 0.4rem;
                line-height: 0.4rem;
                color: #999999;
            }
            .fastSelActive {
                color: #F28300;
            }
        }
        ul {
            padding: 0 20px;
            font-size: 0.28rem;
            background-color: #FFFFFF;
            .city-item {
                padding-left: 0.23rem;
                height: 1.01rem;
                line-height: 1.01rem;
                border-bottom: 0.01rem solid #EEEEEE;
            }
        }
    }
</style>
