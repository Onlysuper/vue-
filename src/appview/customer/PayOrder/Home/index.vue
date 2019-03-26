<template>
        <div class="pay-order-container page">
                <div class="pay-order-open">
                        <div class="today-total-box" ref="header" v-if="scroll < 10">
                                <div class="income-today-title">今日{{payType | analy('payType')}}收入(元)</div>
                                <div class="income-today-amount">
                                        <span>{{totalAmount | moneyFormatCN}}</span>
                                </div>
                                <div class="income-today-number">交易共 {{totalAllCount}} 笔</div>
                                <div class="income-today-numbers clearfix">
                                        <div class="income-today-weixin-number">微信 {{totalWechatCount}} 笔</div>
                                        <div class="income-today-alipay-number">支付宝 {{totalAlipayCount}} 笔</div>
                                        <div class="income-today-alipay-number">刷卡 {{totalSkCount}} 笔</div>
                                        <div class="income-today-alipay-number">银联二维码 {{totalSkCount}} 笔</div>
                                </div>
                        </div>
                        <div class="navbar-box">
                                <div class="navbar-item _av">
                                        <select class="navbar-select" v-model="payType" @change="selectChange">
                                                <option v-for="(item,index) in payTypes" :key="index" v-bind:value="item.code">{{item.name}}</option>
                                        </select>
                                </div>
                                <div class="navbar-item navbar-line _av" @click="toHistory">
                                        历史记录
                                </div>
                        </div>
                        <!-- <div class="today-pay-order-list" ref="scrollWarpper" v-if="false"> -->
                                <!-- <loadmore :api="api" @watchDataList="watchDataList" @refresh="refresh" ref="MypLoadmoreApi">
                                        <pay-item v-for="(item,index) in list" :key="index" @click.native="toDetail(item)" 
                                        :entName="payType | analy('payType')" 
                                        :time="item.tranDateTime | dateFormatCN('hhmm')" 
                                        :amount="item.tranAmt | moneyFormatCN"
                                        >
                                                <i :class="`icon-${payType.toLowerCase()}`" slot="icon"></i>
                                        </pay-item>
                                </loadmore> -->
                        <!-- </div> -->
                </div>
        </div>
</template>

<script>
import PayItem from "@src/appcomponents/PayItem";
import utils from "@src/common/utils.js";
import base from "@src/apis/base.js";
import Loadmore from "@src/appcomponents/Loadmore";
import CONST from "@src/const";
import { Toast } from "mint-ui";
import {
        payOrderQuery,
        payOrderTodayTotal,
        payOrderQueryList
} from "@src/apis";
export default {
        components: {
                PayItem,
                Loadmore
        },
        data() {
                return {
                        scroll: 0,
                        openId: utils.getOpenId(),
                         payType: "",
                        payTypes: utils.constToArr(CONST.payType),
                        totalCount: 0,
                        totalAmount: 0,
                        totalAllCount:0,
                        totalWechatCount: 0,
                        totalAlipayCount: 0,
                        totalSkCount: 0,
                        ylCount: 0,
                        api: payOrderQueryList,
                        list: []
                };
        },
        mounted() {
                this.init();
        },
        computed:{
        },
        methods: {
                scrollChanged() {
                        this.scroll = this.$refs.scrollWarpper.scrollTop;
                },
                selectChange(e) {
                        this.init();
                },
                refresh() {
                        this.payTotal();
                },
                init() {
                        this.scroll = 0;
                        this.payTotal();
                },
                payTotal() {
                        payOrderTodayTotal(this.openId)({
                                token: utils.storage.getStorage("token"),
                                merCode: utils.storage.getStorage("merCode"),
                                telePhone: utils.storage.getStorage("telePhone"),
                                md5Data: base.md5Data,
                                startTime:utils.formatDate(new Date(), "yyyy-MM-dd"),
                                endTime:utils.formatDate(new Date(), "yyyy-MM-dd"),
                                payType: this.payType
                        }).then(res => {
                                if (res.code === "001") {
                                        let data = res.result.data.merTodayTranAllInfo;
                                        this.totalAmount = data.totalTranAmtSum; // 今日微信交易金额
                                        this.totalAllCount = data.totalCount; //  当天总交易条数

                                        this.totalWechatCount = data.wxCount; //  当天微信交易条数
                                        this.totalAlipayCount = data.zfbCount; // 当前支付宝交易条数
                                        this.totalSkCount = data.skCount; // 当前刷卡交易条数
                                        this.ylCount = data.ylCount; // 当前刷卡交易条数
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                toDetail(item) {
                        this.$router.push({
                                path: "/customer/payOrderDetail",
                                query: item
                        });
                },
                toHistory() {
                        this.$router.push({ path: "/customer/payOrderHistory" });
                },
                watchDataList(list) {
                        // lists.pop();
                        this.list = list;
                        /*
                        * 根据判断在“全屏模式下”是否否和监听事件的条件，控制header显示隐藏。解决ios滚动时抖动的BUG。
                        */
                        this.$refs.scrollWarpper.removeEventListener("scroll", this.scrollChanged);
                        this.$nextTick(() => {
                                //定时器是解决下拉刷新时，等顶部loadingd元素的归位动画完毕后在注册事件，否则会计算出误。
                                setTimeout(() => {
                                        let items = this.$refs.scrollWarpper.querySelectorAll(".list-item");
                                        let lastItem = items[items.length - 1];
                                        let headerHeight = this.$refs.header.getBoundingClientRect().height;
                                        //判断条件：数组中最后一项元素距离顶部的距离 必须大于 window的高度的时候在监听滚动事件。
                                        //减去header的高度是要考虑全屏模式下的高度
                                        if (lastItem && lastItem.getBoundingClientRect().top - headerHeight > window.innerHeight) {
                                                this.$refs.scrollWarpper.addEventListener("scroll", this.scrollChanged);
                                        }
                                }, 500)
                        })
                }
        }
};
</script>


<style lang="less" scoped>
@import url(../../../../assets/less/base.less);
.pay-order-container {
        .transformPage();
        @front-color: #000;
        @total-background-color: #0a7ae0;
        @navbar-background-color: #fff;
        @item-background-color: @front-color;
        .pay-order-open {
                display: flex;
                flex-direction: column;
                height: 100%;
                .today-total-box {
                        width: 100%;
                        background: @total-background-color;
                        color: #fff;
                        text-align: center;
                        font-size: 30 / @rem;
                        .income-today-title {
                                padding-top: 50 / @rem;
                        }
                        .income-today-amount {
                                padding-top: 10 / @rem;
                                span {
                                        font-size: 100 / @rem;
                                        font-weight: 400;
                                        padding-right: 20 / @rem;
                                        padding-left: 20 / @rem;
                                }
                        }
                        .income-today-number {
                                padding-top: 20 / @rem;
                        }
                        .income-today-numbers {
                                height: 100 / @rem;
                                display: flex;
                                div {
                                        flex: 1;
                                        line-height: 100 / @rem;
                                        text-align: center;
                                }
                        }
                }
                .navbar-box {
                        border-bottom: 1px solid #eee;
                        background: @navbar-background-color;
                        // padding: 20/@rem 0 20/@rem 0;
                        color: @front-color;
                        font-size: 28 / @rem;
                        select {
                                margin-top: -15 / @rem;
                                border: 0;
                                width: 140 / @rem;
                                text-align: center;
                                /*很关键：将默认的select选择框样式清除*/
                                appearance: none;
                                /*在选择框的最右侧中间显示小箭头图片*/
                                background: url("../../../../assets/images/arrow.png")
                                        no-repeat scroll right center
                                        transparent;
                                background-size: 12px 7px;
                                /*为下拉小箭头留出一点位置，避免被文字覆盖*/
                                padding: 5px 5px 5px 14px;
                                color: @front-color;
                                option {
                                        background: @navbar-background-color;
                                }
                        }
                        .navbar-item {
                                width: 50%;
                                height: 90 / @rem;
                                line-height: 90 / @rem;
                                float: left;
                                text-align: center;
                        }
                        .navbar-line {
                                //border-left: 1px solid rgba(255, 255, 255, 0.5);
                                border-left: 1px solid #ccc;
                                box-sizing: border-box;
                        }
                }
                .today-pay-order-list {
                        position: relative;
                        // margin-top: 5px;
                        // padding-left: 20/@rem;
                        background: #fff;
                        flex: 1;
                        overflow-x: hidden;
                        overflow-y: auto;
                        -webkit-overflow-scrolling: touch;
                        .list-item:last-child {
                                border: 0px;
                        }
                }
        }
}
</style>
