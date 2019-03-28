<template>
        <div class="pay-order-detail">
                <input-wrapper>
                        <m-cell title="商户号">{{item.merCode}}</m-cell>   
                        <m-cell title="商户名">{{item.merName}}</m-cell>
                        <m-cell title="结算卡号">{{item.merSettAcct}}</m-cell>
                        <m-cell title="结算银行">{{item.settBank}}</m-cell>
                        <m-cell title="结算人名字">{{item.merSettAcctName}}</m-cell>
                        <m-cell title="结算金额">{{item.settAmt}}元</m-cell>
                        <m-cell title="结算日期">{{item.settDate}}</m-cell>
                        <m-cell title="出款状态">{{item.outState}}</m-cell>
                        <m-cell title="结算类型">{{item.settType}}</m-cell>
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
export default {
        data() {
                return {
                        item: this.$route.query
                };
        },
        mounted() {
        },
        methods: {

        }
};
</script>