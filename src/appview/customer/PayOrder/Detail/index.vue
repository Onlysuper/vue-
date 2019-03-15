<template>
        <div class="pay-order-detail">

                <!-- <mt-cell title="收款方式">{{payTypeDetail | analy("payTypeDetail")}}</mt-cell> -->
                <mt-cell title="交易订单号">{{orderNo}}</mt-cell>
                <mt-cell title="创建时间">{{createTime}}</mt-cell>
                <mt-cell title="交易时间">{{paySuccTime || "无"}}</mt-cell>
                <mt-cell title="交易状态">{{status | analy("payStatus")}}</mt-cell>
                <mt-cell title="交易类型">{{payType | analy('payType')}}</mt-cell>
                <mt-cell title="交易金额">
                        <span class="">{{amount | moneyFormatCN}}元</span>
                </mt-cell>
                <mt-cell title="交易手续费" v-if="settleMode == 'T0'">
                        <span class="green">{{fee | moneyFormatCN}}</span>
                </mt-cell>
        </div>
</template>

<script>
export default {
        data() {
                return {
                        payTypeDetail: "",
                        payType: "",
                        orderNo: "",
                        createTime: "",
                        paySuccTime: "",
                        status: "",
                        amount: "",
                        fee: "",
                        settleMode: ""
                };
        },
        mounted() {
                this.init();
        },
        methods: {
                init() {
                        let item = this.$route.query;
                        this.payTypeDetail = item.payTypeDetail;
                        this.payType = item.payType;
                        this.orderNo = item.orderNo;
                        this.paySuccTime = item.paySuccTime;
                        this.createTime = item.createTime;
                        this.status = item.status;
                        this.amount = item.amount;
                        this.fee = item.fee;
                        this.settleMode = item.settleMode;
                }
        }
};
</script>


<style lang="less" scoped>
@import url(../../../../assets/less/base.less);

.pay-order-detail {
        .transformPage();
        // .mint-cell {
        //   min-height: 42px;
        // }
        .mint-cell-wrapper {
                font-size: 15px;
        }
        .green {
                color: #2aa515;
        }
}
</style>
