<template>
        <div class="added-container">
                <div class="menu-box">
                        <div class="menu" @click="handleInvoiceBtn">
                                <div class="menu-icon">
                                        <img :src="require('@src/assets/images/menu-icon2.png')" alt="">
                                </div>
                                <div class="menu-label">开票配置</div>
                        </div>
                        <div class="menu" @click="handleEleHistory">
                                <div class="menu-icon">
                                        <img :src="require('@src/assets/images/menu-icon1.png')" alt="">
                                </div>
                                <div class="menu-label">开票历史</div>
                        </div>
                        <div class="menu">
                                <div class="menu-icon" @click="handleEle">
                                        <img :src="require('@src/assets/images/menu-icon4.png')" alt="">
                                </div>
                                <div class="menu-label">申请开票</div>
                        </div>
                </div>
        </div>
</template>

<script>
import utils from "@src/common/utils.js";
import { electronicQuery, payOrderQuery } from "@src/apis";

export default {
        data() {
                return {};
        },
        mounted() {
                this.openId = utils.getOpenId();
        },
        methods: {
                //开票历史
                handleEleHistory() {
                        this.electronicQuery().then(flag => {
                                if (flag) this.$router.push({ path: "/customer/eicHistory" });
                        })
                },
                //开票配置
                handleInvoiceBtn() {
                        this.electronicQuery().then(flag => {
                                if (flag) this.$router.push({ path: "/customer/eicGoods" });
                        })
                },
                //创建电票订单
                handleEle() {
                        this.electronicQuery().then(flag => {
                                if (flag) this.$router.push({ path: "/customer/eicCreateQrcode" });
                        })
                },
                //是否开通电子发票服务
                electronicQuery() {
                        return electronicQuery()({ openId: this.openId }).then(data => {
                                if (data.resultCode == "0") {
                                        sessionStorage.setItem("failData", JSON.stringify(data.data));
                                        switch (data.data.type) {
                                                case "open"://已开通
                                                        return true;
                                                        break;
                                                case "unopen"://未开通
                                                        this.$router.push({ path: "/customer/eicCompletionInfo" });
                                                        break;
                                                case "checking"://审核中
                                                        this.$router.push({ path: "/customer/eicInTransitWait" });
                                                        break;
                                                case "reject": case "close"://被拒绝 或 被关闭
                                                        this.$router.push({ path: "/customer/eicInTransitFail" });
                                                        break;
                                        }
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                }
        }
};
</script>


<style lang="less" scoped>
@import url(../../../assets/less/base.less);

.added-container {
        // min-height: 480px;
        .transformPage();
        .menu-box {
                display: flex;
                flex-wrap: wrap;
                margin-top: 25 / @rem;
                padding: 0.5%;
                .menu {
                        // flex: 1;
                        width: 32.33%;
                        height: 250 / @rem;
                        float: left;
                        text-align: center;
                        background: #fff;
                        margin-bottom: 2px;
                        margin: 0.5% 0.5%;
                        .menu-icon {
                                margin-top: 69 / @rem;
                                img {
                                        height: 85 / @rem;
                                }
                        }
                        .menu-label {
                                line-height: 80 / @rem;
                                font-size: 32 / @rem;
                        }
                }
        }
}
</style>
