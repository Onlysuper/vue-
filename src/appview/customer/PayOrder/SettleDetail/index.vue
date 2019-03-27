<template>
        <div class="pay-order-detail">
                <input-wrapper>
                        <mt-cell title="商户号">{{item.merCode}}</mt-cell>
                        <mt-cell title="商户名">{{item.merName}}</mt-cell>
                        <mt-cell title="结算卡号">{{item.merSettAcct}}</mt-cell>
                        <mt-cell title="结算银行">{{item.settBank}}</mt-cell>
                        <mt-cell title="结算人名字">{{item.merSettAcctName}}</mt-cell>
                        <mt-cell title="结算金额">{{item.settAmt}}元</mt-cell>
                        <mt-cell title="结算日期">{{item.settDate}}</mt-cell>
                        <mt-cell title="出款状态">{{item.outState}}</mt-cell>
                        <mt-cell title="结算类型">{{item.settType}}</mt-cell>
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