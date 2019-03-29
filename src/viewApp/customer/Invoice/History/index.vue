<template>
        <div id="scrollBanner" class="list">

                <div class="wrapper" ref="wrapper" :style="{ height: ($store.state.winH - 0) + 'px' }">

                        <infinite-scroll :api="api" :openId="openId" @watchDataList="watchDataList" :query="searchQuery" ref="InfiniteScroll">
                                <div class="header">
                                        <span @click="searchVisible = true">{{searchQuery.status | analy('eicStatus')}} <i class="icon-arrow"></i></span>
                                </div>
                                <div class="date-banner" v-if="newlist.length == 0">
                                        <div class="fixed-main border-bottom-1px">
                                                <div class="le">
                                                        <div class="date" @click="openDataPicker(searchQuery.createTimeEnd)">
                                                                {{searchQuery.createTimeEnd || '全部日期'}}
                                                                <i class="icon-arrow"></i>
                                                        </div>
                                                </div>
                                        </div>
                                </div>
                                <div v-for="(item,index) in newlist" :key="index" class="_av" v-if="!(item.status == 'ORDER' && item.billAmount < 0)">
                                        <!-- 日期 -->
                                        <div class="date-banner" v-if="item.date">
                                                <div class="fixed-main border-bottom-1px">
                                                        <div class="le">
                                                                <div class="date" @click="openDataPicker(item.date)">
                                                                        {{item.date}}
                                                                        <i class="icon-arrow"></i>
                                                                </div>
                                                                <div class="total">{{`共计${count[item.date]}张`}}</div>
                                                        </div>
                                                </div>
                                        </div>
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
                <mt-datetime-picker v-model="currDate" :endDate="new Date()" type="date" @confirm="setDate" ref="datePicker" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>
        </div>
</template>

<script>
import EicItem from "@src/componentsApp/EicItem";
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
                FullPagePopup,
                InfiniteScroll,
                SearchPage
        },
        mixins: [listScrollFixedBanner, saveScrollPosition],
        data() {
                return {
                        currDate: new Date(),
                        ccD: utils.formatDate(new Date(), "yyyy-MM-dd"),
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
                        this.$nextTick(() => {
                                this.mixinsInitScrollBanner(document.getElementById("scrollBanner"), 0);
                        })
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
                        // this.searchQuery.createTimeStart = utils.formatDate(date, "yyyy-MM-dd");
                        this.searchQuery.createTimeEnd = utils.formatDate(date, "yyyy-MM-dd");
                        this.$nextTick(() => {
                                this.$refs.InfiniteScroll.loadTop();
                        })
                },
                openDataPicker(date) {
                        date && (this.currDate = new Date(date));
                        this.$nextTick(() => {
                                this.$refs.datePicker.open()
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
        // padding-top: 40px;
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

.date-banner {
        height: 130 / @rem;
        position: relative;
        .fixed-main {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 130 / @rem;
                padding: 20 / @rem;
                box-sizing: border-box;
                font-size: 32 / @rem;
                background-color: #f8f8f8;
                // border-top: 1px solid #ccc;
                // border-bottom: 1px solid #ccc;
                z-index: 1;
                display: flex;
        }
        .le {
                align-items: center;
                display: flex;
                flex: 1;
                i {
                        display: inline-block;
                        transform: rotate(90deg);
                }
        }
        .total {
                flex: 1;
                text-align: right;
                // height: 100/@rem;
                // width: 120/@rem;
                // border: 1px solid #ccc;
                vertical-align: middle;
        }
        // display: flex;
        .date {
                flex: 1;
        }
        .total {
                font-size: 30 / @rem;
                color: #8e8e8e;
        }
}
.scroll-no-fixed {
        .ri {
                display: none;
        }
}
.scroll-fixed .fixed-main {
        position: fixed;
        left: 0;
        top: 0px;
        width: 100%;
        z-index: 1;
        .ri {
                display: block;
        }
}
.header {
        display: flex;
        height: 40px;
        text-align: center;
        font-size: 34 / @rem;
        span {
                flex: 1;
                display: flex;
                align-items: center;
                text-align: center;
                justify-content: center;
                height: 100%;
        }
        i {
                margin-left: 5px;
                transform: rotate(90deg);
        }
}
</style>
