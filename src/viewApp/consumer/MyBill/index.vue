<template>
        <div class="mybill-container">
                <div class="bill-list" ref="wrapper" :style="{ height: wrapperHeight + 'px' }">
                        <loadmore ref="loadmore" :api="api" :openId="openId" :query="query" @watchDataList="watchDataList" @bindingMobile="bindingMobile">
                                <div class="item" v-for="(item,index) in invoiceList" :key="index" @click="showDetail(item)">
                                        <span class="ent_name">{{ item.entName}} </span>
                                        <span class="invoice_time">{{ item.invoiceTime && format(item.invoiceTime) }} </span>
                                        <span class="total_amount">{{item.totalAmount}} 元</span>
                                        <span class="billing_success" v-if="item.status === 'BILLING_SUCCESS'">开票成功</span>
                                        <span class="billing_wait" v-if="item.status !== 'BILLING_SUCCESS'">正在开票</span>
                                </div>
                        </loadmore>
                </div>
        </div>
</template>

<script>
import utils from "@src/common/utils.js";
import moment from "moment";
import loadmore from "./loadmore.vue";
import validator from "@src/common/validator.js";
import { getInvoiceList, bindingMobile } from "@src/apis/consumer";
import { saveScrollPosition } from "@src/common/mixins";

export default {
        components: { loadmore },
        mixins: [saveScrollPosition],
        data() {
                return {
                        wrapperHeight: 0,
                        api: getInvoiceList,
                        invoiceList: [],
                        openId: utils.getOpenId(),
                        query: {
                                pageNum: 1,
                                pageSize: 20
                        }
                };
        },
        mounted() {
                this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top;
                this.$refs.loadmore.loadTop();
        },
        methods: {
                watchDataList(list) {
                        this.invoiceList = list;
                },
                format(date) {
                        return moment(date).format("YYYY年MM月DD日 HH:mm");
                },
                bindingMobile() {
                        this.MessageBox.prompt("", "", {
                                title: "",
                                message: "请先绑定手机号",
                                showInput: true,
                                // inputValue: "",
                                showCancelButton: true
                        }).then(({ value }) => {

                                if (!validator.phoneNumber.reg.test(value)) {
                                        this.Toast("请输入正确的手机号");
                                        return;
                                }

                                bindingMobile()({
                                        openId: this.openId,
                                        telephone: value
                                }).then(data => {
                                        if (data.resultCode == "0") {
                                                this.Toast("绑定成功");
                                                this.$refs.loadmore.loadTop();
                                        } else {
                                                this.Toast(data.message);
                                        }
                                });
                        });
                },
                showDetail(item) {
                        //只有开票成功的才可以查看详情
                        if (item.status === "BILLING_SUCCESS") {
                                this.$router.push({
                                        path: "/consumer/myBillDetail",
                                        query: {
                                                orderNo: item.orderNo
                                        }
                                });
                        }
                }
        }
};
</script>

<style lang="less">
@import url(../../../assets/less/base.less);
.mybill-container {
        .transformPage();
        padding: 0 5px;
        .bill-list {
                // width: 100%;
                // height: 100%;
                overflow: scroll;
                font-size: 14px; // padding: 10px 2%;
                -webkit-overflow-scrolling: touch;
                .scroll-wrapper {
                        // padding-bottom: 50px
                }
        }
        .item {
                // width: 96%;
                height: 70px;
                background: #fff;
                border-radius: 5px;
                margin-top: 10px;
                position: relative;
                .ent_name {
                        position: absolute;
                        left: 20px;
                        top: 10px;
                        font-size: 16px;
                }
                .invoice_time {
                        position: absolute;
                        left: 20px;
                        bottom: 10px;
                        font-size: 14px;
                        color: #666;
                }
                .total_amount {
                        position: absolute;
                        right: 20px;
                        bottom: 10px;
                        font-size: 14px;
                        color: #666;
                }
                .billing_success {
                        position: absolute;
                        right: 20px;
                        top: 10px;
                        color: #21d131;
                }
                .billing_wait {
                        position: absolute;
                        right: 20px;
                        top: 10px;
                        color: #f8c836;
                }
        }
        .page-infinite-loading {
                text-align: center;
                height: 50px;
                line-height: 50px; // margin-top: -50px;
                div {
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 5px;
                }
        }
}
</style>
