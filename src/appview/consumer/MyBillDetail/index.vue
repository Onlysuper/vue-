<template>
        <div class="mybill-detail-container" v-if="pageShow">
                <div class="invoice_frame" @click="WeixinJSBridge">
                        <img id="invoice_image" v-show="invoiceUrl" :src="invoiceUrl" />
                </div>
                <div class="btn">
                        <mt-button size="large" type="danger" :disabled="false" @click="sendEmail">点击将发票发送到邮箱</mt-button>
                </div>
                <br>
                <Swiper class="ad ad-fixed" :list="adList" :aspect-ratio="300/750" :loop="true" :auto="true" :show-dots="adList.length > 1" :show-desc-mask="false" dots-position="center" @on-click-list-item="adClickItem"></Swiper>
        </div>
</template>

<script>
import { Swiper } from "@src/components/Swiper";
import {
        getInvoiceDetail,
        getInvoiceImageUrl,
        invoiceUrlPath,
        sendEmail,
        getAdList
} from "@src/apis/consumer";
import utils from "@src/common/utils.js";
export default {
        components: { Swiper },
        data() {
                return {
                        pageShow: true,
                        invoiceUrl: "",
                        invoicePdf: "",
                        orderNo: this.$route.query["orderNo"],
                        encryptCode: this.$route.query["encrypt_code"],
                        adList: [],
                        openId: utils.getOpenId()
                };
        },
        created() {
                this.getInvoiceImageUrl();
                this.getAdList();
                this._czcEvent("发票详情受访次数", "href:" + window.location.href);
        },
        methods: {
                getInvoiceDetail() {
                        getInvoiceDetail(this.openId)({
                                orderNo: this.orderNo,
                                encryptCode: this.encryptCode
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.pageShow = true;
                                        this.invoicePdf = data.data.pdfPath;
                                } else {
                                        this.Toast(data.resultMsg + "");
                                }
                        });
                },
                // 获取电子发票图片
                getInvoiceImageUrl() {
                        getInvoiceImageUrl(this.openId)({
                                orderNo: this.orderNo,
                                encryptCode: this.encryptCode
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.pageShow = true;
                                        this.invoiceUrl = data.data;
                                } else {
                                        this.Toast(data.resultMsg + "");
                                        this.invoiceUrl = "";
                                }
                        });
                },
                sendEmail() {
                        this.MessageBox.prompt("", "", {
                                title: "",
                                message: "请输入邮箱",
                                showInput: true,
                                // inputValue: "",
                                showCancelButton: true
                        }).then(({ value }) => {
                                if (!value) {
                                        this.Toast("请输入邮箱！");
                                        return;
                                }
                                sendEmail(this.openId)({
                                        orderNo: this.orderNo,
                                        encryptCode: this.encryptCode,
                                        mailAddr: value
                                }).then(data => {
                                        if (data.resultCode == "0") {
                                                this.Toast(data.resultMsg);
                                        } else {
                                                this.Toast(data.resultMsg);
                                        }
                                });
                        });
                },
                WeixinJSBridge() {
                        WeixinJSBridge.invoke("imagePreview", {
                                // "current": this.invoiceUrl,
                                urls: [this.invoiceUrl]
                        });
                },
                getAdList() {
                        getAdList()({ position: "ELECARDAD" }).then(res => {
                                if (res.resultCode == 0) {
                                        this.adList = res.data.map(item => {
                                                item.img = item.imgUrl;
                                                return item;
                                        })
                                }
                        })
                },
                adClickItem(item) {
                        this._czcEvent("发票详情点击广告", "link:" + item.url);
                        window.location.href = item.url;
                }
        }
};
</script>

<style lang="less" scoped>
@import url(../../../assets/less/base.less);
.mybill-detail-container {
        .transformPage();
        padding: 20 / @rem;
        .invoice_frame {
                margin-top: 20 / @rem;
                height: 450 / @rem;
                img {
                        width: 100%;
                        height: 100%;
                }
        }
        .eic_ad {
                margin-top: 20 / @rem;
                img {
                        width: 100%;
                }
        }
        .btn {
                margin-top: 20 / @rem;
        }
        .download-pdf {
                a {
                        color: #fff;
                        display: inline-block;
                        width: 100%;
                        line-height: 42px;
                        font-size: 18px;
                        background-color: #ef4f4f;
                        border-radius: 4px;
                        text-align: center;
                }
        }
}
</style>
