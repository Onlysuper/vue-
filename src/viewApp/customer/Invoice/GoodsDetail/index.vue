<template>
        <div class="page detail">
                <input-wrapper>
                        <mt-cell title="商品编号">{{data.goodsNo}}</mt-cell>
                        <mt-cell title="商品名称">{{data.goodsName}}</mt-cell>
                        <mt-cell title="统一编码">{{data.unionNo}}</mt-cell>
                        <mt-cell title="标准名称"><span class="row-overfloaw">{{data.goodsType}}</span></mt-cell>
                        <mt-cell title="税率">{{data.taxRate}}</mt-cell>
                        <mt-cell title="规格">{{data.model}}</mt-cell>
                        <mt-cell title="单位">{{data.unit}}</mt-cell>
                        <mt-cell title="含税单价（元）">{{data.unitPrice | toFixed}}</mt-cell>
                        <mt-cell title="免税类型">{{data.enjoyDiscount}}</mt-cell>
                        <mt-cell title="优惠政策">{{data.discountType}}</mt-cell>
                </input-wrapper>
        </div>
</template>

<script>
import taxJson from "@src/data/tax.json";
import taxTypeJson from "@src/data/enjoy.json";
import discountJson from "@src/data/discount.json";

export default {
        data() {
                return {
                        data: {}
                };
        },
        created() {
                this.echo(this.$route.query)
        },
        methods: {
                echo(data) {
                        data.taxRate = this.utils.queryJsonVal(taxJson, data.taxRate).name;
                        data.enjoyDiscount = this.utils.queryJsonVal(taxTypeJson, data.enjoyDiscount).name;
                        data.discountType = this.utils.queryJsonVal(discountJson, data.discountType).name;
                        this.data = data;
                }
        }
};
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);
.detail {
        z-index: 99;
        background: #fff;
        position: fixed;
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
}

.row-overfloaw {
        text-align: right;
        width: 200px;
}
</style>
