<template>
        <div class="settle-query-page page">
                <full-page ref="FullPage">
                        <div class="m-page-header search-box clear" slot="header">
                                 <div class="search-info">{{searchQuery.startTime | dateFormatCN}} - {{searchQuery.endTime | dateFormatCN}}</div>
                                <div class="search-btn" @click="searchVisible = true">筛选</div>
                        </div>
                        <div class="wrapper" ref="wrapper" :style="{ height: ($store.state.winH - 40) + 'px' }">
                                <loadmore :api="api" @watchDataList="watchDataList" @refresh="loadmordFinishedHand" ref="MypLoadmoreApi" :handeleResault="handeleResault" :currentPageFn="currentPageFn">
                                        <settle-Item @click.native="toUrl(item)"
                                        v-for="(item,index) in newlist" :key="index" 
                                        :entName="item.merSettAcctName"
                                        :time="item.settDate"
                                        :status="'sort-'+item.outState | analyFilter(CONST,'outMoneyStatus')"
                                        :statuscolor="utils.valToColor(CONST,'outMoneyStatus',`${'sort-'+item.outState}`)"
                                        :amount="item.settAmt">
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
 
import SettleItem from "@src/componentsApp/SettleItem";
import FullPagePopup from "@src/componentsApp/FullPagePopup";
// import InfiniteScroll from "@src/componentsApp/InfiniteScroll";
import Loadmore from "@src/componentsApp/Loadmore";
import SearchPage from "@src/componentsApp/SearchPage";
import { listScrollFixedBanner, saveScrollPosition } from "@src/common/mixins";
import { settleQuery } from "@src/apis";
import utils from "@src/common/utils";
import base from "@src/apis/base.js";
import CONST from "@src/viewApp/customer/PayOrder/state.json";
import ChangePanel from "@src/componentsApp/ChangePanel";
import PanelBodyRow from "@src/componentsApp/PanelBodyRow";
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
                        CONST:CONST,
                        // 处理loadMore返回的数据，返回列表
                        handeleResault:(res)=>{
                                return res.result.data.merSettList
                        },
                         // 搜索条件处理
                        currentPageFn:(currentPage,loadQuery)=>{
                                let startTime = loadQuery.startTime.replace(/\/|\-/g,"");;
                                let endTime = loadQuery.endTime.replace(/\/|\-/g,"");;
                                let sendData = [loadQuery.telePhone,loadQuery.merCode,startTime,endTime,this.token+base.md5Data];
                                let md5Data = md5Encrypt(sendData.join(''));
                                loadQuery['startTime']=startTime;
                                loadQuery['endTime']=endTime;
                                loadQuery['md5Data']=md5Data;
                                return loadQuery
                        },
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
                        let endTime = utils.formatDate(new Date(), "yyyy-MM-dd");
                        this.$set(this.searchQuery,"token",this.token)
                        this.$set(this.searchQuery,"telePhone",this.phone)
                        this.$set(this.searchQuery,"merCode",this.merCode)
                        this.$set(this.searchQuery,"startTime",startTime)
                        this.$set(this.searchQuery,"endTime",endTime) 
                        this.setQueryMd5Data();
                },
                //需要传送给后台的Md5Data 加密数据
                setQueryMd5Data(){
                        let startTime = this.searchQuery.startTime;
                        let endTime = this.searchQuery.endTime;
                        let md5data = md5Encrypt(`${this.phone+this.merCode+startTime+endTime+this.token+base.md5Data}`);
                        this.$set(this.searchQuery,"md5Data",`${md5data}`)
                },
                watchDataList(list, count) {
                        // this.count = count || {};
                        this.newlist = list;
                },
                search() {
                        this.searchVisible = false;
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
                                                this.searchQuery.outState = utils.replaceSort(value);
                                                this.setQueryMd5Data()
                                        }
                                });
                                this.searchConfig.push({
                                        title: "交易起始时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.startTime,
                                        id: "startTime",
                                        cb: value => {
                                                console.log(value);
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
                line-height: 100 / @rem; 
                width: 100%;
                font-size: 14px;
                background: @main-color;
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
