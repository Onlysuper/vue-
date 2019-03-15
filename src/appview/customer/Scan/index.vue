<template>
        <div class="scan-panel-container" v-show="pageShow">
                <div class="panel">
                        <customer-header :entName="entName" :taxNo="taxNo"></customer-header>
                        <div class="panel-body">
                                <div class="scan-btn">
                                        <div class="btn" :class="{'scan-btn-hover':scanBtnHover}" @click="handleScanBtnClick" @touchstart="scanBtnHover = true" @touchend="scanBtnHover = false"></div>
                                        <i></i>
                                        <span>点击扫描企业名片</span>
                                </div>
                        </div>
                        <div class="pann-footer">
                                <p>扫描企业名片，同步开票信息</p>
                                <span>企业名片支持：微信、支付宝、国税、银联等所有名片</span>
                        </div>
                </div>
        </div>
</template>

<script>
import { MessageBox } from "mint-ui";
import utils from "@src/common/utils.js";
import { getCustomerInfo, msgLF } from "@src/apis";
import { getWxSign } from "@src/apis/getSign";
import CustomerHeader from "@src/components/CustomerHeader";

export default {
        components: { CustomerHeader },
        data() {
                return {
                        pageShow: false,
                        scanBtnHover: false,
                        entName: "",
                        taxNo: "",
                        ranCode: "",
                        agentNo: ""
                };
        },
        created() {
                let openId = utils.getOpenId();
                this.openId = openId;
                this.getInfo(openId);

                //获取注入微信签名config
                getWxSign("wx_customer")({ url: window.location.href.split("#")[0] });
        },
        mounted() {
                $(".scan-panel-container").setHeightToWindow();
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
                                        this.ranCode = data.data.randomCode;
                                        this.agentNo = data.data.agentNo;
                                } else if (data.resultCode == "01") {
                                        //用户未登录，请重新登录
                                        this.Toast(data.resultMsg);
                                        this.$router.replace({
                                                path: "/customer/login",
                                                query: { redirect: this.$route.path }
                                        });
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                submitResault(resultStr) {
                        msgLF()({
                                data: resultStr, //扫描结果
                                ranCode: this.ranCode, //随机码
                                openId: this.openId,
                                sourceFrom: this.agentNo //来源
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        $.dialog.scanAlert({
                                                success: true,
                                                title: "恭喜你！<br/>信息推送成功",
                                                info: "开票信息已推送至开票系统",
                                                okBtn: {
                                                        text: "ok",
                                                        cb: function () {
                                                                if (typeof WeixinJSBridge != "undefined") {
                                                                        WeixinJSBridge.invoke("closeWindow");
                                                                }
                                                        }
                                                }
                                        });
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                        // $.dialog.scanAlert({
                        //           success: false,
                        //           title: "抱歉！<br/>信息推送出现点问题",
                        //           info: "请检查网络或易票软件是否正常",
                        //           okBtn: { text: "ok", cb: function() { } }
                        // });
                },
                handleScanBtnClick() {
                        if (utils.isWeiXin) {
                                jWeixin.scanQRCode({
                                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                                        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                                        success: res => {
                                                var resultStr = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
                                                this.submitResault(resultStr);
                                        }
                                });
                        } else {
                                MessageBox({
                                        title: "温馨提示",
                                        message: "请在微信中使用"
                                });
                        }
                }
        }
};
</script>

<style lang="less">
@import url(../../../assets/less/base.less);
// body {
//           height: 100%;
// }
.scan-panel-container {
        .transformPage(); // .absolute(0, 0, 100%, 460px);
        // min-height: 480px;
        // height:100%;
        .panel {
                border-radius: 10 / @rem;
                box-shadow: 0px 0px 10px #ccc;
                -webkit-box-shadow: 0px 0px 10px #ccc; // background: #FFF;
                display: flex;
                flex-direction: column;
                height: 100%;

                .panel-body {
                        flex: 1;
                        position: relative;
                        background: #fff;
                        .scan-btn {
                                width: 300 / @rem;
                                height: 300 / @rem;
                                text-align: center;
                                .absoluteCenter();
                                .btn {
                                        width: 300 / @rem;
                                        height: 300 / @rem;
                                        background: url("../../../assets/images/scan_demo.png")
                                                no-repeat;
                                        background-size: 100%;
                                        margin-bottom: 10 / @rem;
                                        .transition(all 0.1s linear);
                                }
                                .scan-btn-hover {
                                        // opacity: 0.8;
                                        .transform(scale(0.95));
                                }
                                i {
                                        display: block;
                                        position: relative;
                                        .transform(translateY(10 / @rem));
                                        &:after {
                                                content: "";
                                                display: inline-block;
                                                text-align: center; // position: absolute;
                                                // left: 50%;
                                                // top: -14/@rem; // border-top: 20/@rem solid red;
                                                border-left: 20 / @rem solid red;
                                                border-top: 20 / @rem solid
                                                        transparent;
                                                .transform(rotate(135deg));
                                        }
                                }
                                span {
                                        color: #e60012;
                                        font-size: 36 / @rem;
                                }
                        }
                }
                .pann-footer {
                        text-align: center;
                        background: #fff;
                        padding: 0 20 / @rem;
                        p {
                                margin-top: 90 / @rem;
                                font-size: 30 / @rem;
                                color: #333333;
                        }
                        span {
                                display: inline-block;
                                margin-bottom: 70 / @rem;
                                margin-top: 25 / @rem;
                                font-size: 24 / @rem;
                                color: #666666;
                        }
                }
        }
}
</style>

