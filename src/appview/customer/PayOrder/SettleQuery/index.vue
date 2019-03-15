<template>
        <div class="list">

                <mt-header class="header" :fixed="false" :title="$route.meta.pageTitle">
                        <mt-button slot="left" @click="$refs.datePicker.open()"><i class="icon-date date-icon"></i></mt-button>
                        <mt-button slot="right" @click="searchVisible = true">筛选</mt-button>
                </mt-header>

                <div class="wrapper" ref="wrapper" :style="{ height: ($store.state.winH - 40) + 'px' }">
                        <div class="settleCard border-bottom-1px">
                                <panel-body-row title="商户名称" :desc="businessName"></panel-body-row>
                                <panel-body-row title="账户名称" :desc="settleCard.accountName"></panel-body-row>
                                <panel-body-row title="开户银行" :desc="settleCard.branchName"></panel-body-row>
                                <panel-body-row title="结算帐号" :desc="settleCard.accountNo"></panel-body-row>
                        </div>

                        <infinite-scroll :api="api" @watchDataList="watchDataList" ref="InfiniteScroll">
                                <!-- item -->
                                <pay-item @click.native="toUrl(item)" v-for="(item,index) in newlist" :key="index" :entName="item.settleType" :time="item.lastUpdateTime" :status="item.outMoneyStatus | analy('outMoneyStatus')" :statusClass="item.outMoneyStatus == 'OUT_SUCCESS'?'SUCCESS':''" :amount="item.settleAmount | moneyFormatCN(true)">
                                        <!-- <i slot="icon" class="icon-piao piao-icon" :class="{'red-icon':item.billAmount < 0}"></i> -->
                                </pay-item>
                        </infinite-scroll>

                </div>

                <full-page-popup class="search-popup" v-model="searchVisible" title="条件筛选" :showConfirm="true" @confirm="confirmQuery">
                        <search-page :config="searchConfig"></search-page>
                </full-page-popup>

                <v-mask class="v-mask" v-model="searchVisible"></v-mask>

                <mt-datetime-picker v-model="showDate" :endDate="new Date()" type="date" @confirm="setDate" ref="datePicker" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>

        </div>
</template>

<script>
import PayItem from "@src/appcomponents/PayItem";
import FullPagePopup from "@src/appcomponents/FullPagePopup";
import InfiniteScroll from "@src/appcomponents/InfiniteScroll";
import SearchPage from "@src/appcomponents/SearchPage";
import { listScrollFixedBanner, saveScrollPosition } from "@src/common/mixins";
import { settleQuery, getCustomerInfo } from "@src/apis";
import utils from "@src/common/utils";
import CONST from "@src/const";
import ChangePanel from "@src/appcomponents/ChangePanel";
import PanelBodyRow from "@src/appcomponents/PanelBodyRow";
export default {
        components: {
                PayItem,
                FullPagePopup,
                InfiniteScroll,
                SearchPage,
                ChangePanel,
                PanelBodyRow
        },
        mixins: [listScrollFixedBanner, saveScrollPosition],
        data() {
                return {
                        settleCard: {},
                        businessName: "",
                        showDate: new Date(),
                        searchVisible: false,
                        newlist: [],
                        count: {},
                        api: settleQuery,
                        list: [],
                        outMoneyStatus: CONST.outMoneyStatus,
                        searchQuery: {
                                openId: utils.getOpenId(),
                                token: utils.storage.getStorage("token"),
                                outMoneyStatus: "OUT_SUCCESS"
                        },
                        searchConfig: [],
                        wrapperHeight: "",
                        billTypes: CONST.billTypes
                }
        },
        created() {
                getCustomerInfo(utils.getOpenId())().then(data => {
                        if (data.resultCode == "0") {
                                if (data.data.customerConverge)
                                        this.settleCard = data.data.customerConverge.settleCard || {};
                                this.businessName = data.data.businessName;
                        } else {
                                this.Toast(data.resultMsg);
                        }
                })

        },
        mounted() {
                this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;

                this.$refs.InfiniteScroll.load({ ...this.searchQuery });
                this.initSearch();
        },
        methods: {
                watchDataList(list, count) {
                        this.count = count || {};
                        this.newlist = list;
                },
                confirmQuery() {
                        this.searchVisible = false;
                        this.$refs.InfiniteScroll.load({ ...this.searchQuery });
                },
                toUrl(item) {
                        this.$router.push({ path: `/customer/settleDetail`, query: item })
                },
                setDate(date) {
                        this.searchQuery.createTimeStart = utils.formatDate(date, "yyyy-MM-dd");
                        this.$refs.InfiniteScroll.load({ ...this.searchQuery });
                },
                initSearch() {
                        this.$nextTick(() => {
                                this.searchConfig.push({
                                        title: "结算状态",
                                        type: "v-radio-list",
                                        defaultValue: this.searchQuery.outMoneyStatus,
                                        values: utils.constToArr(this.outMoneyStatus),
                                        cb: value => {
                                                this.searchQuery.outMoneyStatus = value;
                                        }
                                });
                        });
                }
        }
}
</script>


<style lang="less">
@import "../../../../assets/less/base.less";
.settleCard {
        background-color: #fff;
        padding: 20 / @rem;
        box-sizing: border-box;
        .title {
                font-weight: 500;
        }
}
</style>

<style lang="less" scoped>
@import "../../../../assets/less/base.less";
.list {
        position: relative;
        overflow: hidden;
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
        //   padding-top: 40px;
        box-sizing: border-box;
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
