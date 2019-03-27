<template>
        <div class="pay-order-history page">
                <full-page ref="FullPage">
                        <div class="search-box clear" slot="header">
                                <div class="search-info">{{searchQuery.startTime | dateFormatCN}} - {{searchQuery.endTime | dateFormatCN}}</div>
                                <div class="search-btn" @click="hidden = true">筛选</div>
                        </div>
                        <tip slot="header" class="tip-color" :showClose="false" v-if="showTip">
                                {{searchQuery.status | analy('payStatus')}}：{{amountCount}}笔 金额：{{amountSum | moneyFormatCN}}元
                        </tip>
                        <!-- <div class="history-list"> -->
                        <loadmore :api="api" @watchDataList="watchDataList" :handeleResault="handeleResault" @currentPageChange="currentPageChange" ref="MypLoadmoreApi">
                                <div v-for="(item,index) in newlist" :key="index">
                                        <banner-date v-if="item.date" slot="top" :date="item.date | dateFormatCN">
                                        </banner-date>
                                        <pay-item  
                                        @click.native="toDetail(item)" 
                                        :entName="item.merName"
                                        :time="item.tranDate" 
                                        :amount="item.tranAmt | moneyFormatCN"
                                        >
                                        <!-- :entName="item.tranType | analy('payType')" -->
                                                <!-- <i :class="`icon-${iconname}`" slot="icon"></i> -->
                                        </pay-item>
                                </div>
                        </loadmore>
                        <!-- </div> -->

                </full-page>
                <full-page-popup class="search" v-model="hidden" title="条件筛选" :showConfirm="true" @confirm="search">
                        <search-page ref="searchPage" :config="searchConfig"></search-page>
                </full-page-popup>
                <v-mask v-model="hidden" class="z-index2"></v-mask>
        </div>
</template>

<script>
import PayItem from "@src/appcomponents/PayItem";
import BannerDate from "@src/appcomponents/BannerDate";
import Loadmore from "@src/appcomponents/Loadmore";
import FullPagePopup from "@src/appcomponents/FullPagePopup";
import SearchPage from "@src/appcomponents/SearchPage";
import Tip from "@src/appcomponents/Tip";
import base from "@src/apis/base.js";
import { payOrderQueryList } from "@src/apis";
import utils from "@src/common/utils.js";
import { mapState } from "vuex";
import CONST from "@src/const";
import { scrollBehavior } from "@src/common/mixins";
import {md5Encrypt} from "@src/common/secret.js";

export default {
        mixins: [scrollBehavior],
        components: {
                PayItem,
                BannerDate,
                Loadmore,
                FullPagePopup,
                SearchPage,
                Tip
        },
        data() {
                return {
                      
                        token:utils.storage.getStorage("token"),
                        merCode:utils.storage.getStorage("merCode"),
                        phone:utils.storage.getStorage("telePhone"),
                        hidden: false,
                        showTip: false,
                        api: payOrderQueryList,
                        newlist: [],
                        searchConfig: [],
                        amountCount: "",
                        amountSum: "",
                        payStatus: CONST.payStatus,
                        tranType:"",
                        currentPage:1,
                        searchQuery: {
                                startTime: "",
                                endTime:"",
                                tranType:"3",
                                token:"",
                                merCode:"",
                                telePhone: "",
                                md5Data: "",
                                currentPage:0,
                                pageSize:20
                        },
                        // 处理loadMore返回的数据，返回列表
                        handeleResault:(res)=>{
                                console.log(res.result.data.merTranList);
                                return res.result.data.merTranList
                        }
                };
        },
        computed:{
                iconname(){
                    let tranType =this.searchQuery.tranType;
                    if(tranType=='0'){
                            // 刷卡
                            return "wechat";
                    }if(tranType=='1'){
                            // 微信
                            return "wechat";
                    }if(tranType=='2'){
                            // 支付宝
                            return "alipay";
                    }if(tranType=='3'){
                            // 银联
                            return "wechat";
                    }
                },
                pageSize(){
                        if(this.searchQuery.pageSize){
                             return this.searchQuery.pageSize   
                        }else{
                             return "20";
                        }
                },
        },
        created(){
                let startTime = utils.formatDate(new Date(Date.now() - 7 * (24 * 60 * 60 * 1000)), "yyyy-MM-dd");
                let endTime = utils.formatDate(new Date(Date.now() - 7 * (24 * 60 * 60 * 1000)), "yyyy-MM-dd");
                this.$set(this.searchQuery,"token",this.token)
                this.$set(this.searchQuery,"merCode",this.merCode)
                this.$set(this.searchQuery,"telePhone",this.phone)
                this.$set(this.searchQuery,"startTime",startTime)
                this.$set(this.searchQuery,"endTime",endTime)
                this.setQueryMd5Data();
        },
        mounted() {
                this.$refs.MypLoadmoreApi.load({
                        ...this.searchQuery
                });

                this.initSearch();
        },
        methods: {
                
                setQueryMd5Data(){
                        let startTime = this.searchQuery.startTime.replace(/\/|\-/g,"");
                        let endTime = this.searchQuery.endTime.replace(/\/|\-/g,"");
                        let sendData=[this.phone,this.merCode,startTime,endTime,this.currentPage,this.searchQuery.pageSize,this.token+base.md5Data];
                        sendData =sendData.join('');
                        let md5data = md5Encrypt(sendData);
                        this.$set(this.searchQuery,"md5Data",md5data)
                },
                toDetail(item) {
                        this.$router.push({
                                path: "/customer/payOrderDetail",
                                query: item
                        });
                },
                formatList(list) {
                        if(list.length>0){
                                this.newlist = [...list];
                        }
                },
                watchDataList(list) {
                        this.formatList(list);
                },
                getDate(num) {
                        return utils.formatDate(new Date(Date.now() - num * (24 * 60 * 60 * 1000)), "yyyy-MM-dd");
                },
                search() {
                        this.hidden = false;
                        this.$refs.MypLoadmoreApi.load({
                                token: utils.storage.getStorage("token"),
                                ...this.searchQuery
                        });
                },
                setDate(type) {
                        switch (type) {
                                //近7日
                                case "1":
                                        this.$refs.searchPage.$refs.configDate[3].value = this.getDate(7);
                                        this.$refs.searchPage.$refs.configDate[4].value = this.getDate(0);
                                        break;
                                //昨日
                                case "2":
                                        this.$refs.searchPage.$refs.configDate[3].value = this.getDate(1);
                                        this.$refs.searchPage.$refs.configDate[4].value = this.getDate(1);
                                        break;
                                //本月交易
                                case "3":
                                        this.$refs.searchPage.$refs.configDate[3].value = this.getDate(30);
                                        this.$refs.searchPage.$refs.configDate[4].value = this.getDate(0);
                                        break;
                        }
                },
                initSearch() {
                        this.$nextTick(() => {
                                this.searchConfig.push({
                                        title: "交易类型",
                                        type: "v-radio-list",
                                        defaultValue: this.searchQuery.tranType,
                                        values: utils.constToArr(CONST.payType),
                                        cb: value => {
                                                this.searchQuery.tranType = value;
                                        }
                                });

        
                                // this.searchConfig.push({
                                //         title: "快捷查询",
                                //         type: "v-radio-list",
                                //         defaultValue: "1",
                                //         values: [
                                //                 {
                                //                         name: "近7日交易",
                                //                         code: "1"
                                //                 },
                                //                 {
                                //                         name: "昨日交易",
                                //                         code: "2"
                                //                 },
                                //                 {
                                //                         name: "近30天交易",
                                //                         code: "3"
                                //                 }
                                //         ],
                                //         cb: value => {
                                //                 this.setDate(value);
                                //                 this.setQueryMd5Data()
                                //         }
                                // });
                                this.searchConfig.push({
                                        title: "交易起始时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.startTime,
                                        id: "startTime",
                                        cb: value => {
                                                this.$set(this.searchQuery,"startTime",value)
                                                this.setQueryMd5Data()
                                        }
                                });
                                this.searchConfig.push({
                                        title: "交易结束时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.endTime,
                                        cb: value => {
                                                 this.$set(this.searchQuery,"endTime",value)
                                                this.setQueryMd5Data()
                                        }
                                });
                        });
                },
                currentPageChange(val){
                       this.currentPage=val;
                       this.setQueryMd5Data();
                }
        }
        
};
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);
// html,
// body,
// #app,
// #customer {
//   height: 100%;
// }
.pay-order-history {
        .transformPage();
        display: flex;
        flex-direction: column;
        .search-box {
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
        .search {
                width: 85%;
        }
}
</style>
