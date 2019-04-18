<template>
        <div class="pay-order-detail">
                <input-wrapper>
                        <m-cell title="结算日期">{{item.settDate | dateFilter}}</m-cell>
                        <m-cell title="结算金额">{{item.settAmt | moneyFormatCN(true)}}元</m-cell>
                        <m-cell title="账户名称">{{item.merSettAcctName}}</m-cell>
                        <m-cell title="结算卡号">{{item.merSettAcct | accountNum}}</m-cell>
                        <m-cell title="出款状态">{{item.outState | valToName}}</m-cell>
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
        filters: {
                valToName: function (value) {
                        if( value=='00' || value=='4' ){
                                // 成功
                                return "出款成功"
                        }else if(value=='44'){
                                // 失败
                                return "出款失败"
                        }else{
                                return "出款中"
                        }
                }
        },
        mounted() {
        },
        methods: {

        }
};
</script>