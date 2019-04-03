<template>
        <div class="pay-order-detail">
                <m-cell title="商户号" >{{merCode}}</m-cell>
                <m-cell title="商户名">{{merName}}</m-cell>
                <m-cell title="交易订单号" >{{retrivlRefNnum}}</m-cell>
                <m-cell title="商户手续费">{{merCommisionValue | moneyFormatCN(true) }}元</m-cell>
                <m-cell title="封顶费">{{maxFee | moneyFormatCN(true)}}元</m-cell>
                <m-cell title="交易金额">{{tranAmt | moneyFormatCN(true)}}元</m-cell>
                <m-cell title="交易时间">{{tranDateTime | dateTimeFilter}}</m-cell>
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
                        maxFee:"",// 封顶费
                        tranAmt:"",//交易金额
                        tranDate:"",// 交易日期
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
                        this.maxFee = item.maxFee;//封顶费
                        this.tranAmt = item.tranAmt;//交易金额
                        this.tranDate = item.tranDate;//交易日期
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
