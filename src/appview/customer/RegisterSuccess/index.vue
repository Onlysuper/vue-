<template>
        <div class="register-success-container">
                <div class="page-bg"></div>
                <div class="panel">
                        <div class="success-tip">
                                <i class="icon-success_black"></i>
                                <span>恭喜您，注册成功</span>
                        </div>
                        <div class="title">
                                <i></i>
                                <span>我的开票码</span>
                        </div>
                        <div class="panel-body">
                                <div class="qr">
                                        <img class="code" :src="qr" alt="开票码">
                                        <div class="info">
                                                <p>请使用电脑下载易票助手软件后方可使用</p>
                                                <i style="color:red;">下载地址：www.yeepiao.com</i>
                                                <p class="help" @click="$router.push('/customer/help')">如何使用？</p>
                                        </div>
                                </div>

                        </div>
                </div>
        </div>
</template>

<script>
import { getCustomerInfo } from "@src/apis";
import utils from "@src/common/utils.js";

export default {
        data() {
                return {
                        company: "",
                        taxCode: "",
                        qr: "",
                };
        },
        beforeRouteEnter(to, from, next) {
                let openId = utils.getOpenId();
                getCustomerInfo(openId)({ token: utils.storage.getStorage("token") }).then(data => {
                        next(vm => {
                                vm.setData(data);
                        })
                });
        },
        methods: {
                setData(data) {
                        if (data.resultCode == "0") {
                                this.pageShow = true;
                                this.company = data.data.entName;
                                this.taxCode = data.data.taxNo;
                                this.qr = data.data.imgPath;
                        } else {
                                this.Toast(data.resultMsg);
                        }
                }
        }
};
</script>


<style lang="less">
@import url(../../../assets/less/base.less);

.register-success-container {
        .page-bg {
                .absolute(0, 0, 100%, 100%);
                background: #fff;
                z-index: -100;
        }

        .success-tip {
                text-align: center;
                padding: 60 / @rem 0;
                i {
                        font-size: 150 / @rem;
                        color: #05ba1a;
                        display: block;
                }
                span {
                        font-size: 40 / @rem;
                        color: #8d8d8d;
                        margin-top: 10px;
                        display: block;
                }
        }
        .panel {
                // border-radius: 10 / @rem;
                // box-shadow: 0px 0px 10px #ccc;
                // -webkit-box-shadow: 0px 0px 10px #ccc;
                display: flex;
                flex-direction: column;
                // height: 100%;

                .panel-header {
                        // min-height: 210 / @rem;
                        border-bottom: 1px solid #ccc;
                        background: #fff;
                        box-sizing: border-box;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        p {
                                font-size: 30 / @rem;
                                margin: 10 / @rem 40 / @rem;
                        }
                }

                .panel-body {
                        flex: 1;
                        text-align: center;
                        position: relative;
                        display: flex;
                        // align-items: center;
                        justify-content: center;
                        .qr {
                                margin: 50 / @rem 0;
                                img {
                                        display: block;
                                        margin: 0 auto;
                                }
                                .code {
                                        height: 500 / @rem;
                                }
                                span {
                                        color: #666;
                                        font-size: 36 / @rem;
                                }
                                .info {
                                        margin-top: 20 / @rem;
                                }
                                .help {
                                        font-size: 30 / @rem;
                                        line-height: 80 / @rem;
                                        color: #0c0afc;
                                }
                        }
                }
                .title {
                        position: relative;
                        &::after {
                                content: "";
                                display: block;
                                width: 40 / @rem;
                                height: 40 / @rem;
                                border-radius: 50%;
                                background: #f2f2f2;
                                float: left;
                                margin-left: -20 / @rem;
                                box-shadow: -4px 0px 6px -2px #ccc inset;
                        }
                        &::before {
                                content: "";
                                display: block;
                                width: 40 / @rem;
                                height: 40 / @rem;
                                border-radius: 50%;
                                background: #f2f2f2;
                                float: right;
                                margin-right: -20 / @rem;
                                box-shadow: 4px 0px 6px -2px #ccc inset;
                        }
                        i {
                                display: inline-block;
                                width: calc(~"100% - " 40 / @rem);
                                border-bottom: 1px solid #e7e7e7;
                                position: absolute;
                                left: 20 / @rem;
                                top: 20 / @rem;
                        }
                        span {
                                display: inline-block;
                                vertical-align: middle;
                                font-size: 35 / @rem;
                                @width: 100 / @rem;
                                position: absolute;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                                background: #fff;
                                color: #606060;
                        }
                }
                .pann-footer {
                        padding: 40 / @rem 40 / @rem;
                        p {
                                margin: 10 / @rem 0;
                                font-size: 30 / @rem;
                        }
                        i {
                                display: block;
                                margin: 10 / @rem 0;
                                color: #e60012;
                                font-size: 28 / @rem;
                        }
                }
        }
}
</style>
