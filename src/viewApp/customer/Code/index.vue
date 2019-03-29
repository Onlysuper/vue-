<template>
        <div class="code-panel-container" v-show="pageShow">
                <div class="panel">
                        <customer-header :entName="entName" :taxNo="taxNo"></customer-header>
                        <div class="panel-body">
                                <div class="qr">
                                        <img class="code" v-if="imgPath" :src="imgPath" alt="开票码">
                                        <span>长按可保存开票码</span>
                                </div>
                        </div>
                </div>
        </div>
</template>

<script>
import utils from "@src/common/utils.js";
import { getCustomerInfo } from "@src/apis";
import CustomerHeader from "@src/componentsApp/CustomerHeader";

export default {
        components: { CustomerHeader },
        data() {
                return {
                        pageShow: false,
                        entName: "",
                        taxNo: "",
                        imgPath: ""
                };
        },
        created() {
                let openId = utils.getOpenId();
                this.getInfo(openId);
        },
        mounted() {
                $(".code-panel-container").setHeightToWindow();
        },
        methods: {
                getInfo(openId) {
                        getCustomerInfo(openId)({
                                token: utils.storage.getStorage("token")
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.pageShow = true;
                                        this.entName = data.data.entName;
                                        this.taxNo = data.data.taxNo;
                                        this.imgPath = data.data.imgPath;
                                } else if (data.resultCode == "01") {
                                        //用户未登录，请重新登录
                                        this.Toast(data.message);
                                        this.$router.replace({
                                                path: "/customer/login",
                                                query: { redirect: this.$route.path }
                                        });
                                } else {
                                        this.Toast(data.message);
                                }
                        });
                }
        }
};
</script>

<style lang="less" scoped>
@import url(../../../assets/less/base.less);

.code-panel-container {
        .transformPage();
        .panel {
                border-radius: 10 / @rem;
                box-shadow: 0px 0px 10px #ccc;
                -webkit-box-shadow: 0px 0px 10px #ccc;

                display: flex;
                flex-direction: column;
                height: 100%;

                .panel-body {
                        flex: 1;
                        text-align: center;
                        position: relative;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fff;
                        .qr {
                                height: 550 / @rem;
                                margin-bottom: 50 / @rem;
                                img {
                                        display: block;
                                        margin: 0 auto;
                                }
                                .code {
                                        height: 100%;
                                }
                                span {
                                        color: #666;
                                        font-size: 36 / @rem;
                                }
                        }
                }
        }
}
</style>
