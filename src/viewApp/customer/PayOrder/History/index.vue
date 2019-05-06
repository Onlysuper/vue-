<template>
        <div class="pay-order-history page">
                <full-page ref="FullPage">
                        <div class="search-box clear" slot="header">
                                <div class="search-info">{{searchQuery.startTime | dateFormatCN}} - {{searchQuery.endTime | dateFormatCN}}</div>
                                <div class="search-btn" @click="hidden = true">筛选</div>
                        </div>
                        <tip slot="header" class="tip-color" :showClose="false" v-if="showTip">
                                <!-- {{searchQuery.tranType | analyFilter(CONST,'payType','issort')}}：{{amountCount}}笔 金额：{{amountSum | moneyFormatCN}}元 -->
                                {{searchTranType}}：{{amountCount}}笔 金额：{{amountSum | moneyFormatCN}}元
                        </tip>
                        <loadmore :api="api" @watchDataList="watchDataList" :handeleResault="handeleResault" :currentPageFn="currentPageFn"  ref="MypLoadmoreApi">
                                <div v-for="(item,index) in newlist" :key="index">
                                        <banner-date v-if="item.date" slot="top" :date="item.date | dateFormatCN">
                                        </banner-date>
                                        <settle-item  
                                        @click.native="toDetail(item)" 
                                        :entName="item.merName"
                                        :time="item.tranDateTime | dateTimeFilter"
                                        :amount="item.tranAmt | moneyFormatCN(true)"
                                        :status="[
                                                {
                                                name:(utils.valToName(CONST,'revFlag',`${item.revFlag}`,'issort')=='成功'?'':utils.valToName(CONST,'revFlag',`${item.revFlag}`,'issort')),
                                                color:utils.valToColor(CONST,'revFlag',`${item.revFlag}`,'issort'),
                                                border:true
                                                }
                                        ]">
                                        <div class="icon-box" slot="icon" >
                                                <img  class="icon-img" :src="whichPayHandle(item.tranType) | imgUrl" alt="">
                                        </div>
                                        </settle-item>
                                </div>
                        </loadmore>
                </full-page>
                <full-page-popup class="search" v-model="hidden" title="条件筛选" :showConfirm="true" @confirm="search">
                        <search-page ref="searchPage" :config="searchConfig"></search-page>
                </full-page-popup>
                <v-mask v-model="hidden" class="z-index2"></v-mask>
        </div> 
</template>

<script>
// import settleItem from "@src/componentsApp/PayItem";
import SettleItem from "@src/componentsApp/SettleItem";
import BannerDate from "@src/componentsApp/BannerDate";
import Loadmore from "@src/componentsApp/Loadmore";
import FullPagePopup from "@src/componentsApp/FullPagePopup"; 
import SearchPage from "@src/componentsApp/SearchPage";
import Tip from "@src/componentsApp/Tip";
import base from "@src/apis/base.js";
import { payOrderQueryList } from "@src/apis";
import utils from "@src/common/utils.js";
import { mapState } from "vuex";
import CONST from "@src/viewApp/customer/PayOrder/state.json";
import { scrollBehavior } from "@src/common/mixins";
import {md5Encrypt} from "@src/common/secret.js";

export default {
        mixins: [scrollBehavior],
        components: {
                SettleItem,
                BannerDate,
                Loadmore,
                FullPagePopup,
                SearchPage,
                Tip
        },
        data() {
                return {
                        searchTranType:"", //搜索选择的支付方式类型
                        CONST:CONST,
                        openid: utils.getOpenId(),
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
                        searchQuery: {
                                startTime: "",
                                endTime:"",
                                tranType:"all",
                                revFlag:"",
                                token:"",
                                merCode:"",
                                telePhone: "",
                                md5Data: "",
                                currentPage:0,
                                pageSize:20
                        },
                        // 处理loadMore返回的数据，返回列表
                        handeleResault:(res)=>{
                                if(res.result.data){
                                   this.amountCount=res.result.data.totalCount;
                                   this.amountSum=res.result.data.totalTranAmtSum;
                                   this.showTip=true;
                                   this.searchTranType=this.searchTranTypeHandle(this.searchQuery.tranType,CONST,'payType','issort');
                                   return res.result.data.merTranList;
                                   
                                }
                               
                        },
                        // 搜索条件处理
                        currentPageFn:(currentPage,loadQuery)=>{
                                let startTime = loadQuery.startTime.replace(/\/|\-/g,"");
                                let endTime = loadQuery.endTime.replace(/\/|\-/g,"");
                                let sendData = [loadQuery.telePhone,loadQuery.merCode,startTime,endTime,loadQuery.currentPage,loadQuery.pageSize,this.token+base.md5Data];
                                let md5Data = md5Encrypt(sendData.join(''));
                                loadQuery['startTime']=startTime;
                                loadQuery['endTime']=endTime;
                                loadQuery['openid']=this.openid;
                                loadQuery['md5Data']=md5Data;
                                return loadQuery
                        },
                };
        },
        computed:{
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
                let endTime = utils.formatDate(new Date(Date.now() - 1 * (24 * 60 * 60 * 1000)), "yyyy-MM-dd");
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
         filters: {
                imgUrl: function (value) {
                       if(value=='Cardpay'){
                                 // 刷卡
                            return require('@/assets/images/iconUnionPay.png');
                       }else if(value=='Wxpay'){
                               // 微信
                            return require('@/assets/images/iconWxpay.png');
                       }else if(value=='Alipay'){
                                // 支付宝
                             return require('@/assets/images/iconAlipay.png');
                       }else if(value=='Unipay'){
                                //银联二维码
                             return require('@/assets/images/iconCloudUnipay.png');
                       }else if(value=='Qqpay'){
                                 // qq
                             return require('@/assets/images/iconQQ.png');
                       }else if(value=='Nocardpay'){
                                 // 无卡快捷
                             return require('@/assets/images/iconNocardPay.png');
                       }else{
                               return ""
                       }
                }
        },
        methods: {
                searchTranTypeHandle(data,json, type,issort){
                        let value = data;
                        if(issort=='issort'){
                                // 要求属性是sort-开头的 如果没有需要加上
                                if(!(/sort-/g.test(value))){
                                        value=`${'sort-'+value}`
                                }
                        }else{
                                //要求属性不能是sort-开头的 如果有需要去掉
                                if(/sort-/g.test(value)){
                                        value=value.replace('sort-','');
                                }
                        }
                        try{
                        return json[type][value]['name'] || value;
                        }catch(error){
                        //     return value=='sort-'? "":value;
                        return "";
                        }
                },
                whichPayHandle(item){
                        if(item=='00'){
                                // 刷卡
                                return "Cardpay";
                        }else if(item=='01'||item=='03'||item=='15'){
                                // 微信
                                return "Wxpay"
                        }else if(item=='04'||item=='16'){
                                // 支付宝
                                return "Alipay"
                        }else if(item=='06'||item=='17'){
                                //银联二维码
                                 return "Unipay"
                        }else if(item=='07'){
                                // qq
                               return "Qqpay";
                        }else if(item=='05'||item=='12'||item=='08'||item=='09'){
                                // 无卡快捷
                              return "Nocardpay";
                        }
                },
                setQueryMd5Data(){
                        let startTime = this.searchQuery.startTime.replace(/\/|\-/g,"");
                        let endTime = this.searchQuery.endTime.replace(/\/|\-/g,"");
                        let sendData=[this.phone,this.merCode,startTime,endTime,this.searchQuery.currentPage,this.searchQuery.pageSize,this.token+base.md5Data];
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
                watchDataList(list) {
                         this.newlist = list;
                },
                getDate(num) {
                        return utils.formatDate(new Date(Date.now() - num * (24 * 60 * 60 * 1000)), "yyyy-MM-dd");
                },
                search() {
                        this.showTip = false;
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
                                        title: "交易状态",
                                        type: "v-radio-list",
                                        defaultValue: this.searchQuery.revFlag,
                                        values: utils.constToArr(CONST.revFlag),
                                        cb: value => {
                                                this.searchQuery.revFlag =utils.replaceSort(value);
                                        }
                                });
                                this.searchConfig.push({
                                        title: "交易类型",
                                        type: "v-radio-list",
                                        defaultValue: this.searchQuery.tranType,
                                        values: utils.constToArr(CONST.payType),
                                        cb: value => {
                                                this.searchQuery.tranType =utils.replaceSort(value);
                                        }
                                });
                                this.searchConfig.push({
                                        title: "起始时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.startTime,
                                        id: "startTime",
                                        endTimeLimitFn:()=>{
                                          return new Date(Date.now() - 1 * (24 * 60 * 60 * 1000))      
                                        },
                                        cb: value => {
                                                this.$set(this.searchQuery,"startTime",value)
                                                this.setQueryMd5Data()
                                        }
                                });
                                this.searchConfig.push({
                                        title: "结束时间",
                                        type: "myp-date",
                                        defaultValue: this.searchQuery.endTime,
                                        endTimeLimitFn:()=>{
                                          return new Date(Date.now() - 1 * (24 * 60 * 60 * 1000))      
                                        },
                                        cb: value => {
                                                 this.$set(this.searchQuery,"endTime",value)
                                                this.setQueryMd5Data()
                                        }
                                });
                        });
                }
        }
        
};
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);
.pay-order-history {
        .transformPage();
        display: flex;
        flex-direction: column;
        .search-box {
                // height: 100/@rem;
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
        }

        .tip-color {
                background: #0a70cc;
                // background: @main-color;
        }

        .history-list {
                flex: 1;
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
