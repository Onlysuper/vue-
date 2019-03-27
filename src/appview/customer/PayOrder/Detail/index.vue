<template>
        <div class="pay-order-detail">

                <!-- <mt-cell title="收款方式">{{payTypeDetail | analy("payTypeDetail")}}</mt-cell> -->
                <mt-cell title="商户号">{{merCode}}</mt-cell>
                <mt-cell title="商户名">{{merName}}</mt-cell>
                <mt-cell title="交易订单/参考号">{{retrivlRefNnum}}</mt-cell>
                <mt-cell title="商户手续费">{{merCommisionValue}}</mt-cell>
                <mt-cell title="">{{maxFee}}</mt-cell>

                <mt-cell title="交易金额">{{tranAmt}}</mt-cell>
                <mt-cell title="交易时间">{{tranDateTime | datenumFormatCN('yyyy-MM-dd hh:mm')}}</mt-cell>

                <!-- <mt-cell title="创建时间">{{createTime}}</mt-cell>
                <mt-cell title="交易时间">{{paySuccTime || "无"}}</mt-cell>
                <mt-cell title="交易状态">{{status | analy("payStatus")}}</mt-cell>
                <mt-cell title="交易类型">{{payType | analy('payType')}}</mt-cell>
                <mt-cell title="交易金额">
                        <span class="">{{amount | moneyFormatCN}}元</span>
                </mt-cell>
                <mt-cell title="交易手续费" v-if="settleMode == 'T0'">
                        <span class="green">{{fee | moneyFormatCN}}</span>
                </mt-cell> -->

                    <!-- this.merCode = item.merCode;//商户号
                        this.merName = item.merName;//商户名
                        this.retrivlRefNnum = item.retrivlRefNnum;//交易参考号或订单号
                        this.merCommisionValue = item.merCommisionValue;//商户手续费
                        this.maxFee = item.maxFee;
                        this.tranAmt = item.tranAmt;//交易金额
                        this.tranDateTime = item.tranDateTime;//交易金额 -->
        </div>
</template>

<script>
export default {
        data() {
                return {
                        merCode:"", //商户号
                        merName:"", //商户名
                        retrivlRefNnum:"",//交易参考号或订单号
                        merCommisionValue:"",//商户手续费
                        maxFee:"",
                        tranAmt:"",//交易金额
                        tranDateTime:""// 交易时间
                };
        },
        mounted() {
                this.init();
        },
        methods: {
                init() {
                        let item = this.$route.query;
                        this.merCode = item.merCode;//商户号
                        this.merName = item.merName;//商户名
                        this.retrivlRefNnum = item.retrivlRefNnum;//交易参考号或订单号
                        this.merCommisionValue = item.merCommisionValue;//商户手续费
                        this.maxFee = item.maxFee;
                        this.tranAmt = item.tranAmt;//交易金额
                        this.tranDateTime = item.tranDateTime;//交易时间
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
