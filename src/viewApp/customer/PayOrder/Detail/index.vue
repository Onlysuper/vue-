<template>
        <div class="pay-order-detail">
                <!-- <m-cell title="商户号" >{{merCode}}</m-cell> -->
                <m-cell title="商户名">{{merName}}</m-cell>
                <m-cell title="订单编号" >{{retrivlRefNnum}}</m-cell>
                <m-cell title="订单金额">{{tranAmt | moneyFormatCN(true)}}元</m-cell>
                <m-cell title="交易时间">{{tranDateTime | dateTimeFilter}}</m-cell>
                <m-cell title="交易手续费">{{amount}}元</m-cell>
                <m-cell title="交易类型">{{tranType |  analyFilter(CONST,'payType-show','issort')}}</m-cell>
                <m-cell title="交易状态">{{revFlag |  analyFilter(CONST,'revFlag','issort')}}</m-cell>
                <!-- <m-cell title="商户手续费率">{{merCommisionValue}}%</m-cell> -->
               
        </div>
</template>

<script>
import CONST from "@src/viewApp/customer/PayOrder/state.json";
export default {
        data() {
                return {
                        CONST:CONST,
                        merCode:"", //商户号
                        merName:"", //商户名
                        retrivlRefNnum:"",//交易参考号或订单号
                        merCommisionValue:"",//商户手续费
                        maxFee:"",// 封顶费
                        tranAmt:"",//交易金额
                        tranDate:"",// 交易日期
                        tranDateTime:"",// 交易时间
                        amount:"",// 手续费
                        tranType:"",// 交易类型
                        revFlag:""// 交易状态
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
                        this.tranType = item.tranType;//交易类型
                        this.amount = item.amount;//手续费
                        this.revFlag = item.revFlag;//交易状态
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
