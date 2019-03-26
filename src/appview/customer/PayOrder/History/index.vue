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
                        <loadmore :api="api" @watchDataList="watchDataList" @refresh="payOrderSum" ref="MypLoadmoreApi">
                                <div v-for="(item,index) in newlist" :key="index">
                                        <banner-date v-if="item.date" slot="top" :date="item.date | dateFormatCN">
                                        </banner-date>
                                        <pay-item 
                                        @click.native="toDetail(item)" 
                                        :entName="payType | analy('payType')"
                                        :time="item.tranDateTime | datenumFormatCN('yyyy-MM-dd hh:mm')" 
                                        :amount="item.tranAmt | moneyFormatCN"
                                        >
                                                <i :class="`icon-${iconname}`" slot="icon"></i>
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
import { payOrderQueryList, payOrderSum } from "@src/apis";
import utils from "@src/common/utils.js";
import { mapState } from "vuex";
import CONST from "@src/const";
import { scrollBehavior } from "@src/common/mixins";

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
                        hidden: false,
                        showTip: false,
                        api: payOrderQueryList,
                        newlist: [],
                        searchConfig: [],
                        amountCount: "",
                        amountSum: "",
                        payStatus: CONST.payStatus,
                        payType:"",
                        searchQuery: {
                                payType:"",
                                token: utils.storage.getStorage("token"),
                                merCode: utils.storage.getStorage("merCode"),
                                telePhone: utils.storage.getStorage("telePhone"),
                                md5Data: base.md5Data,
                                tranType:"",
                                startTime: utils.formatDate(new Date(Date.now() - 7 * (24 * 60 * 60 * 1000)), "yyyy-MM-dd"),
                                endTime: utils.formatDate(new Date(Date.now() - 0 * (24 * 60 * 60 * 1000)), "yyyy-MM-dd")
                        }
                };
        },
        computed:{
                iconname(){
                    let payType =this.searchQuery.payType;
                    if(payType=='0'){
                            // 刷卡
                            return "wechat";
                    }if(payType=='1'){
                            // 微信
                            return "wechat";
                    }if(payType=='2'){
                            // 支付宝
                            return "alipay";
                    }if(payType=='3'){
                            // 银联
                            return "wechat";
                    }
                }
        },
        mounted() {
                // this.payOrderSum();
                this.$refs.MypLoadmoreApi.load({
                        // token: utils.storage.getStorage("token"),
                        ...this.searchQuery
                });

                this.initSearch();
        },
        methods: {
                toDetail(item) {
                        // console.log(item);
                        // return false;
                        this.$router.push({
                                path: "/customer/payOrderDetail",
                                query: item
                        });
                },
                formatList(list) {
                        this.newlist = [...list];
                        // console.log(this.newlist);
                        // for (let i = 0; i < this.newlist.length; i++) {
                        //         let currentDate = this.newlist[i].tranDateTime.split(" ")[0];
                        //         if (i === 0) {
                        //                 this.newlist[i]["date"] = currentDate;
                        //         } else {
                        //                 let preDate = this.newlist[i - 1].tranDateTime.split(" ")[0];
                        //                 this.newlist[i]["date"] = "";
                        //                 if (currentDate !== preDate) {
                        //                         this.newlist[i]["date"] = currentDate;
                        //                 }
                        //         }
                        // }
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
                        // this.payOrderSum();
                },
                payOrderSum() {
                        this.showTip = false;
                        payOrderSum(utils.getOpenId())({
                                token: utils.storage.getStorage("token"),
                                ...this.searchQuery
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.amountCount = data.data.amountCount;
                                        // this.amountSum = utils.accMul(data.data.amountSum, 0.01);
                                        this.amountSum = data.data.amountSum;
                                        this.showTip = true;
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        })
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
                                        defaultValue: this.searchQuery.payType,
                                        values: utils.constToArr(CONST.payType),
                                        cb: value => {
                                                this.searchQuery.payType = value;
                                        }
                                });

                                this.searchConfig.push({
                                        title: "交易状态",
                                        type: "v-radio-list",
                                        defaultValue: this.searchQuery.status,
                                        values: utils.constToArr(CONST.payStatus),
                                        cb: value => {
                                                this.searchQuery.status = value;
                                        }
                                });

                                this.searchConfig.push({
                                        title: "快捷查询",
                                        type: "v-radio-list",
                                        defaultValue: "1",
                                        values: [
                                                {
                                                        name: "近7日交易",
                                                        code: "1"
                                                },
                                                {
                                                        name: "昨日交易",
                                                        code: "2"
                                                },
                                                {
                                                        name: "近30天交易",
                                                        code: "3"
                                                }
                                        ],
                                        cb: value => {
                                                this.setDate(value);
                                        }
                                });
                                this.searchConfig.push({
                                        title: "交易起始时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.startTime,
                                        id: "startTime",
                                        cb: value => {
                                                this.searchQuery.startTime = value;
                                        }
                                });
                                this.searchConfig.push({
                                        title: "交易结束时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.endTime,
                                        cb: value => {
                                                this.searchQuery.endTime = value;
                                        }
                                });
                        });
                }
        },
        watch:{
             
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
                .search-btn {
                }
        }
}
</style>
