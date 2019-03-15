<template>
        <div class="invoice-fail page">
                <message :description="`原因：${failData.msg}`" :title="status[failData.type]">
                        <i slot="icon" class="icon-pop-failure"></i>
                </message>
                <br>
                <mt-button type="danger" size="large" @click="$router.push('/customer/eicCompletionInfo')">重新提交</mt-button>
                <div class="tip">客服电话：400-110-2662</div>
        </div>
</template>

<script>
import Message from "@src/components/Message";
export default {
        components: { Message },
        data() {
                return {
                        failData: {},
                        status: {
                                reject: "审核拒绝",
                                close: "已关闭"
                        }
                }
        },
        mounted() {
                this.failData = JSON.parse(sessionStorage.getItem("failData")) || {};
        }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/less/base.less";
.invoice-fail {
        background: #fff;
        padding: 20 / @rem;
        box-sizing: border-box;

        .tip {
                position: absolute;
                bottom: 50 / @rem;
                text-align: center;
                width: 100%;
                font-size: 30 / @rem;
        }
}

.icon-pop-failure {
        color: red;
}
</style>
