<template>
        <div id="scrollBanner" class="list">
                <mt-header class="header" :fixed="true" :title="$route.meta.pageTitle">
                        <mt-button slot="left" @click="$refs.datePicker.open()"><i class="icon-date date-icon"></i></mt-button>
                        <mt-button slot="right" @click="searchVisible = true">筛选</mt-button>
                </mt-header>
                <div class="wrapper" ref="wrapper" :style="{ height: ($store.state.winH - 40) + 'px' }">

                        <infinite-scroll :api="api" :openId="openId" @watchDataList="watchDataList" :query="searchQuery" ref="InfiniteScroll">
                                <div v-for="(item,index) in newlist" :key="index" class="_av" v-if="!(item.status == 'ORDER' && item.billAmount < 0)">
                                        <!-- 日期 -->
                                        <banner-date v-if="item.date" slot="top" :date="item.date" :total="`共计${count[item.date]}张`">
                                        </banner-date>
                                        <!-- item -->
                                        <eic-item @click.native="toUrl(item)" :entName="item.enterpriseName" :time="item.createTime" :status="item.status | analy('eicStatus')" :redEicIcon="item.status == 'AT_RED'" :statusClass="(item.status == 'BILLING_SUCCESS' || item.status == 'AT_RED')?'SUCCESS':''" :amount="item.billAmount | moneyFormatCN(true)">
                                                <i slot="icon" class="icon-piao piao-icon" :class="{'red-icon':item.billAmount < 0}"></i>
                                        </eic-item>
                                </div>
                        </infinite-scroll>

                </div>
                <full-page-popup class="search-popup" v-model="searchVisible" title="条件筛选" :showConfirm="true" @confirm="confirmQuery">
                        <search-page :config="searchConfig"></search-page>
                </full-page-popup>
                <v-mask class="v-mask" v-model="searchVisible"></v-mask>
                <mt-datetime-picker v-model="date" :endDate="new Date()" type="date" @confirm="setDate" ref="datePicker" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>
        </div>
</template>

<script>
import EicItem from "@src/componentsApp/EicItem";
import BannerDate from "@src/componentsApp/BannerDate";
import FullPagePopup from "@src/componentsApp/FullPagePopup";
import InfiniteScroll from "./loadmore.vue";
import SearchPage from "@src/componentsApp/SearchPage";
import { listScrollFixedBanner, saveScrollPosition } from "@src/common/mixins";
import { queryEicList } from "@src/apis";
import utils from "@src/common/utils";
import CONST from "@src/const";
let defaultQuery = {
        status: "",
        limit: 20,
        page: 1
};
export default {
        components: {
                EicItem,
                BannerDate,
                FullPagePopup,
                InfiniteScroll,
                SearchPage
        },
        mixins: [listScrollFixedBanner, saveScrollPosition],
        data() {
                return {
                        date: new Date(),
                        searchVisible: false,
                        newlist: [],
                        count: {},
                        api: queryEicList,
                        openId: utils.getOpenId(),
                        eicStatus: CONST.eicStatus,
                        searchQuery: {},
                        searchConfig: [],
                        billTypes: CONST.billTypes
                }
        },
        beforeRouteEnter(to, from, next) {
                if (from.name == "added") {
                        next(vm => {
                                vm.init();
                        })
                } else {
                        next(vm => {
                                if (vm.searchConfig.length === 0) {
                                        vm.init();
                                }
                        });
                }
        },
        methods: {
                init() {
                        this.searchQuery = { ...defaultQuery };
                        this.initSearch();
                        this.$nextTick(() => {
                                this.$refs.InfiniteScroll.loadTop();
                        })
                },
                formatList(list) {
                        this.newlist = [...list];
                        for (let i = 0; i < this.newlist.length; i++) {
                                let currentDate = this.newlist[i].createTime.split(" ")[0];
                                if (i === 0) {
                                        this.newlist[i]["date"] = currentDate;
                                } else {
                                        let preDate = this.newlist[i - 1].createTime.split(" ")[0];
                                        this.newlist[i]["date"] = "";
                                        if (currentDate !== preDate) {
                                                this.newlist[i]["date"] = currentDate;
                                        }
                                }
                        }
                },
                watchDataList(list, count) {
                        this.count = count || {};
                        this.formatList(list);
                        // this.$nextTick(() => {
                        //         this.mixinsInitScrollBanner(document.getElementById("scrollBanner"), 40);
                        // })
                },
                confirmQuery() {
                        this.searchVisible = false;
                        this.$nextTick(() => {
                                this.$refs.InfiniteScroll.loadTop();
                        })
                },
                toUrl(item) {
                        switch (item.status) {
                                case "ORDER":
                                        //蓝票生成二维码，红票提示未开票
                                        if (item.billAmount < 0) {
                                                // this.MessageBox.alert("请在易票插件开具此发票！");
                                        } else {
                                                this.$router.push({ path: "/customer/eicQrcode", query: { orderNo: item.orderNo } });
                                        }
                                        break;
                                default:
                                        this.$router.push({ path: `/customer/eicDetail/${item.billRecordNo}` })
                                        break;
                        }
                },
                setDate(date) {
                        this.searchQuery.createTimeStart = utils.formatDate(date, "yyyy-MM-dd");
                        this.searchQuery.createTimeEnd = utils.formatDate(date, "yyyy-MM-dd");
                        this.$nextTick(() => {
                                this.$refs.InfiniteScroll.loadTop();
                        })
                },
                initSearch() {
                        this.searchConfig = [];
                        this.$nextTick(() => {

                                this.searchConfig.push({
                                        title: "发票代码",
                                        type: "myp-text",
                                        defaultValue: this.searchQuery.invoiceCode,
                                        cb: value => {
                                                this.searchQuery.invoiceCode = value;
                                        }
                                });

                                this.searchConfig.push({
                                        title: "发票号码",
                                        type: "myp-text",
                                        defaultValue: this.searchQuery.invoiceNo,
                                        cb: value => {
                                                this.searchQuery.invoiceNo = value;
                                        }
                                });

                                this.searchConfig.push({
                                        title: "购方名称",
                                        type: "myp-text",
                                        defaultValue: this.searchQuery.enterpriseName,
                                        cb: value => {
                                                this.searchQuery.enterpriseName = value;
                                        }
                                });

                                this.searchConfig.push({
                                        title: "购方电话",
                                        type: "myp-text",
                                        defaultValue: this.searchQuery.phoneNo,
                                        cb: value => {
                                                this.searchQuery.phoneNo = value;
                                        }
                                });

                                this.searchConfig.push({
                                        title: "交易状态",
                                        type: "v-radio-list",
                                        defaultValue: this.searchQuery.status,
                                        values: utils.constToArr(this.eicStatus),
                                        cb: value => {
                                                this.searchQuery.status = value;
                                        }
                                });
                        });
                }
        }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/less/base.less";
.list {
        position: relative;
        overflow: hidden;
        padding-top: 40px;
}

.header {
        z-index: 3;
}

.search {
        padding: 30 / @rem;
        display: inline;
        font-size: 32 / @rem;
}

.fixed {
        position: fixed;
        top: 10 / @rem;
        right: 10 / @rem;
        z-index: 2;
}

.v-mask {
        z-index: 10;
}

.search-popup {
        width: 90%;
}

.wrapper {
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
}

.piao-icon {
        color: #06dc29;
        font-size: 80 / @rem;
}

.red-icon {
        color: red;
}

.date-icon {
        font-size: 50 / @rem;
}
</style>
