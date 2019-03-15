<template>
        <div class="pay-order-detail">
                <input-wrapper>
                        <mt-cell title="交易金额">{{item.payAmount}}元</mt-cell>
                        <mt-cell title="手续费">{{item.proceduresFee}}元</mt-cell>
                        <mt-cell title="出款手续费">{{item.outMoneyFee}}元</mt-cell>
                        <mt-cell title="冻结金额">{{item.freezeAmount}}元</mt-cell>
                        <mt-cell title="结算金额">{{item.settleAmount}}元</mt-cell>
                        <mt-cell title="银行名称">{{item.bankName}}</mt-cell>
                        <mt-cell title="银行帐号">{{item.accountNo}}</mt-cell>
                        <!-- <mt-cell title="身份证号">{{item.settleIdCard}}</mt-cell> -->
                        <mt-cell title="交易类型">{{item.settleType}}</mt-cell>
                        <mt-cell title="交易时间">{{item.lastUpdateTime}}</mt-cell>
                        <mt-cell title="创建时间">{{item.createTime}}</mt-cell>
                        <mt-cell title="出款状态">{{item.outMoneyStatus | analy('outMoneyStatus')}}</mt-cell>
                        <mt-cell title="备注">{{item.remark}}</mt-cell>
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