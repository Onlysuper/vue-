<template>
        <div class="pay-order-detail">
                <input-wrapper>
                        <!-- <m-cell title="商户号">{{item.merCode}}</m-cell>
                        <m-cell title="商户名">{{item.merName}}</m-cell> -->
                        <m-cell title="结算日期">{{item.settDate | dateFilter}}</m-cell>
                        <!-- <m-cell title="共收款">{{}}元</m-cell>
                        <m-cell title="手续费">{{}}元</m-cell> -->
                        <m-cell title="结算金额">{{item.settAmt | moneyFormatCN(true)}}元</m-cell>
                        <m-cell title="账户名称">{{item.merSettAcctName}}</m-cell>
                        <m-cell title="结算卡号">{{item.merSettAcct | accountNum}}</m-cell>
                        <m-cell title="出款状态">{{item.outState | analyFilter(CONST,'outMoneyStatus-show','issort')}}</m-cell>
                        <!-- <m-cell title="结算银行">{{item.settBank}}</m-cell> -->
                        <!-- <m-cell title="结算类型">{{item.settType}}</m-cell> -->
                        <!-- <m-cell title="结算类型">{{item.settType || analyFilter(CONST,'settTypes','issort')}}</m-cell> -->
                </input-wrapper>
        </div>
</template>

<style lang="less" scoped> 
@import url(../../../../assets/less/base.less);

.pay-order-detail {
        .transformPage();
}
</style>

<script>
import CONST from "@src/viewApp/customer/PayOrder/state.json";
export default {
        data() {
                return {
                        CONST:CONST,
                        item: this.$route.query
                };
        },
        mounted() {
        },
        methods: {

        }
};
</script>