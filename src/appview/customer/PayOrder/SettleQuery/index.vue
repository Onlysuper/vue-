<template>
        <div class="settle-query-page page">
                <full-page ref="FullPage">
                        <div class="m-page-header search-box clear" slot="header">
                                <!-- <div class="page-title">结算</div> -->
                                <div class="search-btn" @click="searchVisible = true">筛选</div>
                        </div>
                        <div class="wrapper" ref="wrapper" :style="{ height: ($store.state.winH - 40) + 'px' }">
                                <loadmore :api="api" @watchDataList="watchDataList" @refresh="loadmordFinishedHand" ref="MypLoadmoreApi" :handeleResault="handeleResault">
                                        <settle-Item @click.native="toUrl(item)"
                                        v-for="(item,index) in newlist" :key="index" 
                                        :entName="item.merSettAcctName"
                                        :time="item.settDate" 
                                        :status="item.outState | analy('outMoneyStatus')"
                                        :amount="item.settAmt | moneyFormatCN(true)">
                                        </settle-Item>
                                </loadmore>

                        </div>
                </full-page>
                <full-page-popup class="search-popup" v-model="searchVisible" title="条件筛选" :showConfirm="true" @confirm="search">
                        <search-page :config="searchConfig"></search-page>
                </full-page-popup>
                <mt-datetime-picker v-model="showDate" :endDate="new Date()" type="date" @confirm="setDate" ref="datePicker" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>
                 <v-mask v-model="searchVisible" class="z-index2"></v-mask>

        </div>
</template>

<script>
import SettleItem from "@src/appcomponents/SettleItem";
import FullPagePopup from "@src/appcomponents/FullPagePopup";
// import InfiniteScroll from "@src/appcomponents/InfiniteScroll";
import Loadmore from "@src/appcomponents/Loadmore";
import SearchPage from "@src/appcomponents/SearchPage";
import { listScrollFixedBanner, saveScrollPosition } from "@src/common/mixins";
// import { settleQuery, getCustomerInfo } from "@src/apis";
import { settleQuery } from "@src/apis";
import utils from "@src/common/utils";
import base from "@src/apis/base.js";
import CONST from "@src/const";
import ChangePanel from "@src/appcomponents/ChangePanel";
import PanelBodyRow from "@src/appcomponents/PanelBodyRow";
import {md5Encrypt} from "@src/common/secret.js";
export default {
        components: {
                SettleItem,
                FullPagePopup,
                // InfiniteScroll,
                Loadmore,
                SearchPage,
                ChangePanel,
                PanelBodyRow
        },
        mixins: [listScrollFixedBanner, saveScrollPosition],
        data() {
                return {
                        token:utils.storage.getStorage("token"),
                        phone:utils.storage.getStorage("telePhone"),
                        merCode:utils.storage.getStorage("merCode"),
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
                                currentPage:0,
                                pageSize:20,
                                token: "",
                                telePhone:"",
                                startTime:"",
                                endTime:"",
                                merCode:"",
                                outState:"",
                                md5Data:""
                        },
                        searchConfig: [],
                        wrapperHeight: "",
                        billTypes: CONST.billTypes,
                        // 处理loadMore返回的数据，返回列表
                        handeleResault:(res)=>{
                                console.log(res);
                                return res.result.data.merSettList
                        }
                }
        },
        computed:{
                currentPage(){
                        if(this.searchQuery.currentPage){
                             return this.searchQuery.currentPage   
                        }else{
                             return "1";
                        }
                },
                pageSize(){
                        if(this.searchQuery.pageSize){
                             return this.searchQuery.pageSize   
                        }else{
                             return "20";
                        }
                }
        },
        created() {
                this.setSearchQuerys();
        },
        mounted() {
                this.$refs.MypLoadmoreApi.load({
                        ...this.searchQuery
                });
                this.initSearch();
        },
        methods: {
                // 初始化默认搜索
                setSearchQuerys(){
                        let startTime = utils.formatDate(new Date(Date.now() - 7 * (24 * 60 * 60 * 1000)), "yyyy-MM-dd");
                        let endTime = utils.formatDate(new Date(Date.now() - 7 * (24 * 60 * 60 * 1000)), "yyyy-MM-dd");
                        this.$set(this.searchQuery,"token",this.token)
                        this.$set(this.searchQuery,"telePhone",this.phone)
                        this.$set(this.searchQuery,"merCode",this.merCode)
                        this.$set(this.searchQuery,"startTime",startTime)
                        this.$set(this.searchQuery,"endTime",endTime)
                        this.setQueryMd5Data();
                },
                //需要传送给后台的Md5Data 加密数据
                setQueryMd5Data(){
                        let startTime = this.searchQuery.startTime.replace(/\/|\-/g,"");
                        let endTime = this.searchQuery.endTime.replace(/\/|\-/g,"");
                        let md5data = md5Encrypt(`${this.phone+this.merCode+startTime+endTime+this.token+base.md5Data}`);
                        this.$set(this.searchQuery,"md5Data",`${md5data}`)
                },
                watchDataList(list, count) {
                        console.log(list);
                        // this.count = count || {};
                        this.newlist = list;
                },
                search() {
                        this.searchVisible = false;
                        console.log(this.searchQuery);
                        // return false;
                        this.$refs.MypLoadmoreApi.load({
                                ...this.searchQuery
                        });
                },
                toUrl(item) {
                        this.$router.push({ path: `/customer/payOrder/settleDetail`, query: item })
                },
                setDate(date) {
                        this.searchQuery.createTimeStart = utils.formatDate(date, "yyyy-MM-dd");
                },
                initSearch() {
                        this.$nextTick(() => {
                                this.searchConfig.push({
                                        title: "出款状态",
                                        type: "v-radio-list",
                                        defaultValue: this.searchQuery.outState,
                                        values: utils.constToArr(this.outMoneyStatus),
                                        cb: value => {
                                                this.searchQuery.outState = value;
                                                this.setQueryMd5Data()
                                        }
                                });
                                this.searchConfig.push({
                                        title: "交易起始时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.startTime,
                                        id: "startTime",
                                        cb: value => {
                                                this.searchQuery.startTime = value;
                                                this.setQueryMd5Data()
                                        }
                                });
                                this.searchConfig.push({
                                        title: "交易结束时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.endTime,
                                        cb: value => {
                                                this.searchQuery.endTime = value;
                                                this.setQueryMd5Data()
                                        }
                                });
                        });
                },
                loadmordFinishedHand(){
                       console.log('loadmordFinishedHand'); 
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
.settle-query-page{
        .search-popup{
                width:85%;
        }
        .m-page-header{
                // .search-box {
                        // height: 100/@rem;
                line-height: 100 / @rem;
                width: 100%;
                font-size: 14px;
                background: #0a7ae0;
                color: #fafafa;
                .search-info {
                        margin-left: 10px;
                        float: left;
                }
                .search-btn {
                        margin-right: 10px;
                        float: right;
                }
                .page-title{
                        float: left;
                }
                // }
        }
         
         .tip-color {
                background: #0a70cc;
        }

        .history-list {
                flex: 1;
                // background: #fff;
                position: relative;
                overflow-x: hidden;
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch;
                .list-item {
                        width: 100%;
                }
        }
}


// .header {
//         z-index: 3;
// }

// .search {
//         padding: 30 / @rem;
//         display: inline;
//         font-size: 32 / @rem;
// }

// .fixed {
//         position: fixed;
//         top: 10 / @rem;
//         right: 10 / @rem;
//         z-index: 2;
// }

// .v-mask {
//         z-index: 10;
// }

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
