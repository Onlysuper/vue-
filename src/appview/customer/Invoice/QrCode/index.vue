<template>
        <div ref="qrcode" class="qrcode page">
                <div>
                        <img class="logo" :src="require('@src/assets/images/logo.png')" alt="">
                        <div class="title">扫一扫开票</div>
                        <img class="qr-code" :src="src" alt="开票码创建失败">
                        <p class="mar-t">长按二维码可保存到本地~</p>
                        <p class="mar-t">小提示：此二维码一但使用就会作废，请勿泄漏！</p>
                        <mt-button v-if="!isShare" class="btn" type="danger" size="large" @click="ShareTipShow = true">分享</mt-button>
                </div>
                <share-tip v-model="ShareTipShow"></share-tip>
        </div>
</template>

<script>
import QRCode from 'qrcode';
import ShareTip from "@src/appcomponents/ShareTip";
import { getWxSign, setWxShare } from "@src/apis/getSign";
import base from "@src/apis/base";

export default {
        components: { ShareTip },
        data() {
                return {
                        ShareTipShow: false,
                        src: "",
                        isShare: this.$route.query["isShare"]
                }
        },
        mounted() {
                let url = `${base.testIp}/i?orderNo=${this.$route.query["orderNo"] || ""}`;
                this.createQrcode(url);
                this.getWxSign();
        },
        methods: {
                getWxSign() {
                        getWxSign("wx_customer")({ url: window.location.href.split("#")[0] }, () => {
                                console.log("注入成功");
                                this._initShare();
                        });
                },
                createQrcode(url) {
                        if (url)
                                QRCode.toDataURL(url, { width: 250, }).then(qrcode => {
                                        this.src = qrcode;
                                })
                },
                _initShare() {
                        setWxShare({
                                title: "扫一扫开票",
                                desc: "送你一张电子发票开票码，请立即使用！",
                                link: location.href + "&isShare=true",
                                imgUrl: "https://o.yeepiao.com/static/img/logo.png",
                                success: function () {
                                        this.Toast("分享成功");
                                },
                                cancel: function () {
                                        this.Toast("分享已取消");
                                }
                        });
                }
        }
}
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);
.qrcode {
        display: flex;
        justify-content: center;
        // align-content: center;
        flex-direction: column;
        text-align: center;
        font-size: 34 / @rem;
        // width: 50%;

        .logo {
                width: 200 / @rem;
        }

        .title {
                font-size: 60 / @rem;
                font-weight: 800;
                color: #ff7400;
                margin: 30px 0 10px 0;
        }

        .qr-code {
                display: inline-block;
                width: 400 / @rem;
                height: 400 / @rem;
                box-shadow: 0 0 13px #aaa;
        }

        .mar-t {
                margin: 20 / @rem 0;
                font-size: 12px;
        }

        .btn {
                width: 80%;
                margin: 30px auto;
        }
}
</style>
