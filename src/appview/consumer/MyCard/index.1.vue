<template>
        <div class="myCard-container">
                <div class="myCard">
                        <!-- no cards -->
                        <div class="noCard" v-show="noCardShow">
                                <span>您还没有名片，赶紧添加吧！</span>
                        </div>
                        <!-- Slider main container -->
                        <div class="swiper-container" v-show="pageShow">
                                <!-- Additional required wrapper -->
                                <div class="swiper-wrapper">
                                        <!-- Slides -->
                                        <div class="swiper-slide" v-for="(card,index) in cards" :key="index">
                                                <div class="slide_header">
                                                        <table class="entTable">
                                                                <tr>
                                                                        <td class="left">企业名称：</td>
                                                                        <td class="right">{{card.enterpriseName}}</td>
                                                                </tr>
                                                                <tr>
                                                                        <td class="left">企业税号：</td>
                                                                        <td class="right">{{card.taxNo}}</td>
                                                                </tr>
                                                        </table>
                                                </div>
                                                <div class="slide_tool">
                                                        <div class="btn btn_edit" @click="editCardBtn(card)">
                                                                <span>编辑</span>
                                                        </div>
                                                        <div class="btn btn_delete" @click="delCard(card.cardId)">
                                                                <span>删除</span>
                                                        </div>
                                                        <div class="btn btn_shareit" @click="shareCard">
                                                                <span>分享</span>
                                                        </div>
                                                </div>
                                                <div class="slide_qr_code">
                                                        <img :src="`${qrcodeIp}?cardId=${card.cardId}`">
                                                </div>
                                                <table class="slide_info_table">
                                                        <tr>
                                                                <th class="th_address">注册地址：</th>
                                                                <td>{{card.enterpriseAddress}}</td>
                                                        </tr>
                                                        <tr>
                                                                <th class="th_telephone">公司电话：</th>
                                                                <td>
                                                                        <a :href="'tel:'+card.enterprisePhone">{{card.enterprisePhone}}</a>
                                                                </td>
                                                        </tr>
                                                        <tr>
                                                                <th class="th_bank">开户银行：</th>
                                                                <td>{{card.bankAddress}}</td>
                                                        </tr>
                                                        <tr>
                                                                <th class="th_account">银行帐号：</th>
                                                                <td>{{card.bankAccount}} </td>
                                                        </tr>
                                                </table>
                                                <div class="semi_circle">
                                                        <div class="semi_half_circle"></div>
                                                        <div class="semi_rect"></div>
                                                </div>
                                                <div class="semi_circle_right">
                                                        <div class="semi_half_circle"></div>
                                                        <div class="semi_rect"></div>
                                                </div>

                                        </div>
                                </div>
                                <!-- If we need pagination -->
                                <div class="swiper-pagination"></div>
                        </div>
                        <div class="btn_add" @click="addCardBtn" v-show="noCardShow || pageShow">
                                <img :src="require('@src/assets/images/card_add.png')" alt="">
                        </div>
                </div>
                <share-tip v-model="shareShow"></share-tip>
        </div>
</template>

<script>
import Swiper from "../../../../static/swiper-3.4.2.min";
import utils from "@src/common/utils.js";
import { MessageBox } from "mint-ui";
import ShareTip from "@src/components/ShareTip";
import { queryEntCardList, qrcode, removeEntCard, myCardShareLink, getCardShareLink } from "@src/apis/consumer";
import { getWxSign, setWxShare } from "@src/apis/getSign";

export default {
        components: {
                "share-tip": ShareTip
        },
        data() {
                return {
                        pageShow: false,
                        noCardShow: false,
                        shareShow: false,
                        qrcodeIp: qrcode,
                        cards: []
                };
        },
        mounted() {
                console.log("挂载好了");
                this.openId = utils.getOpenId();
                //判断是否是分享打开的
                this.queryEntCardList();
        },
        methods: {
                queryEntCardList() {
                        //接口修改调整后
                        queryEntCardList()({ openId: this.openId }).then(data => {
                                if (data.resultCode == "0") {
                                        let cards = data.data;
                                        if (utils.isType(cards, "Array")) {
                                                this.cards = cards.reverse();
                                                if (this.cards.length == 0) {
                                                        this.noCardShow = true;
                                                        return;
                                                }
                                                this.pageShow = true;
                                                this.shareToast(this.$route.query["share"]);
                                                this.getWxSign();
                                                this.$nextTick(() => {
                                                        this._initSwiper();
                                                });
                                        } else {
                                                this.noCardShow = true;
                                        }
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                shareToast(share) {
                        if (share === "success") {
                                this.Toast({ message: "收藏名片成功", iconClass: "mintui mintui-success" });
                        } else if (share === "fail") {
                                this.Toast({ message: "该名片已存在", position: "top" });
                        }
                },
                getWxSign() {
                        getWxSign("wx_consumer")(
                                { url: window.location.href.split("#")[0] },
                                () => {
                                        console.log("注入成功");
                                        this._initShare(this.cards[0].cardId);
                                }
                        );
                },
                editCardBtn(card) {
                        card["submitType"] = "UPDATE";
                        this.$router.push({ path: "./addCard", query: card });
                },
                delCard(cardId) {
                        MessageBox.confirm("确认删除？").then(action => {
                                removeEntCard()({
                                        cardId: cardId,
                                        openId: this.openId
                                }).then(data => {
                                        if (data.resultCode == "0") {
                                                this.cards = this.cards.filter(item => {
                                                        return item.cardId != cardId;
                                                });
                                                if (this.cards.length == 0) {
                                                        this.noCardShow = true;
                                                        return;
                                                }
                                                this.$nextTick(() => {
                                                        this.mySwiper.update();
                                                        this.mySwiper.onResize();
                                                });
                                                this.Toast("删除成功！");
                                        } else {
                                                this.Toast(data.resultMsg);
                                        }
                                });
                        });
                },
                shareCard() {
                        this.shareShow = true;
                },
                addCardBtn() {
                        this.$router.push({ path: "./addCard" });
                },
                _initSwiper() {
                        console.log("初始化swiper");
                        this.mySwiper = new Swiper(".swiper-container", {
                                // effect: 'coverflow',
                                grabCursor: true,
                                centeredSlides: true,
                                slidesPerView: "auto",
                                // loop: true,
                                coverflow: {
                                        rotate: 0,
                                        stretch: 20,
                                        depth: 0,
                                        modifier: 1,
                                        slideShadows: false
                                },
                                onSlideChangeEnd: () => {
                                        this._initShare(this.cards[this.mySwiper.activeIndex].cardId);
                                }
                        });
                },
                _initShare(_cardId) {
                        console.log(`${myCardShareLink}?cardId=${_cardId}&openId=${this.openId}`)
                        setWxShare({
                                title: "我的企业名片",
                                desc: "点击收藏我的企业名片",
                                // link: myCardShareLink + "?id=" + _cardId,
                                link: `${myCardShareLink}?cardId=${_cardId}&openId=${this.openId}`,
                                imgUrl: "https://o.yeepiao.com/static/img/logo.png",
                                success: function () {
                                        // 用户确认分享后执行的回调函数
                                        this.Toast("分享成功");
                                },
                                cancel: function () {
                                        // 用户取消分享后执行的回调函数
                                        this.Toast("分享已取消");
                                }
                        });
                }
        }
};
</script>


<style lang="less">
@images: "../../../assets/images/";

.myCard-container {
        overflow-x: hidden;
        overflow-y: auto;
        height: calc(100%);

        .myCard {
                width: 100%;
                margin: 0;
        }

        .noCard {
                width: 100%;
                height: 10rem;
                background: url("@{images}no_cards.png") no-repeat center center;
                background-size: 145px 180px;
                position: relative;
                margin-bottom: 30px;
                span {
                        width: 100%;
                        text-align: center;
                        display: block;
                        font-size: 14px;
                        position: absolute;
                        bottom: 0;
                }
        }

        .swiper-container {
                width: 100%;
                padding: 0.5rem 0 0.5rem 0;
                overflow: inherit;
        }

        .swiper-slide {
                width: 90% !important;
                background: #fff;
                box-shadow: 0 0 10px #ccc;
                border-radius: 5px;
                margin: 0 1.5%;
        }

        .slide_header {
                border-radius: 5px;
                display: -webkit-box;
                display: -webkit-flex;
                display: flex;
                -webkit-box-align: center;
                -webkit-align-items: center;
                align-items: center;
                -webkit-box-pack: center;
                width: 100%;
                background: #f5f5f5;
                height: 2rem;
                margin: 0;
                .imgGoufang {
                        margin-left: 0.5rem;
                        height: 40px;
                }
                .entMiddle {
                        width: 100%;
                        display: flex;
                        padding-left: 0.5rem;
                        padding-right: 0.5rem;
                        .lblEntNameInfo {
                                height: 100%;
                        }
                        .lblEntName {
                                color: #333;
                                font-size: 14px;
                        }
                        .lblTaxNo {
                                font-size: 14px;
                                color: #666;
                                display: inline-block;
                                width: 100%;
                                height: 20px;
                        }
                }
                .entTable {
                        width: 100%;
                        td {
                                height: 20px;
                                line-height: 20px;
                        }
                        .left {
                                font-size: 13px;
                                color: #333;
                                text-align: right;
                                width: 80px;
                        }
                        .right {
                                padding-left: 10px;
                                font-size: 13px;
                                color: #666;
                                text-align: left;
                        }
                }
        }

        .slide_tool {
                width: 100%;
                height: 2rem;
                overflow: hidden;
                border-bottom: 1px #ccc dotted;
                .btn {
                        width: 33%;
                        height: 1.6rem;
                        float: left;
                        margin-top: 0.2rem;
                        position: relative;
                        span {
                                position: absolute;
                                display: block;
                                width: 100%;
                                text-align: center;
                                top: 1rem;
                                font-size: 13px;
                        }
                }
                .btn_edit {
                        border-right: 1px solid #ccc;
                        background: center 0.35rem
                                url("@{images}xiugai_gray.png") no-repeat;
                        background-size: 16px 17.5px;
                }
                .btn_delete {
                        border-right: 1px solid #ccc;
                        background: center 0.35rem
                                url("@{images}delete_gray.png") no-repeat;
                        background-size: 16px 17.5px;
                }
                .btn_shareit {
                        background: center 0.35rem
                                url("@{images}share_gray.png") no-repeat;
                        background-size: 16px 17.5px;
                }
        }

        .slide_qr_code {
                width: 5rem;
                height: 5rem;
                margin: 0.5rem auto 0 auto;
                img {
                        width: 100%;
                }
        }

        .slide_info_table {
                font-size: 12px;
                width: 90%;
                margin: 5% auto;
                border-collapse: collapse;
                text-align: left;
                tr {
                        height: 20px;
                }
                th {
                        padding-left: 20px;
                        height: 24px;
                        line-height: 24px;
                        width: 60px;
                        color: #333;
                }
                .th_address {
                        background: url("@{images}location.png") no-repeat left
                                center;
                        background-size: 16px 16px;
                }
                .th_telephone {
                        background: url("@{images}phone.png") no-repeat left
                                center;
                        background-size: 16px 16px;
                }
                .th_bank {
                        background: url("@{images}bank.png") no-repeat left
                                center;
                        background-size: 16px 16px;
                }
                .th_account {
                        background: url("@{images}card.png") no-repeat left
                                center;
                        background-size: 16px 16px;
                }
                td {
                        color: #333;
                }
        }

        .swiper-pagination {
                display: none;
        }

        .semi_circle,
        .semi_circle_right {
                position: absolute;
                top: 3.75rem;
                height: 16px;
                width: 32px;
                .semi_rect {
                        position: absolute;
                        width: 8px;
                        height: 16px;
                        background: #f2f2f2;
                        left: 0;
                        top: 0;
                }
                .semi_half_circle {
                        width: 16px;
                        height: 16px;
                        left: 8px;
                        top: 0;
                        background: #f2f2f2;
                        border-radius: 50%;
                        box-shadow: 0 0 5px #ccc inset;
                }
        }

        .semi_circle {
                left: -8px;
        }

        .semi_circle_right {
                right: -8px;
                transform: rotate(180deg);
                -webkit-transform: rotate(180deg);
        }

        .btn_add {
                width: 50px;
                margin: 0 auto 0.5rem auto;
                img {
                        width: 100%;
                }
        }
}

.swiper-container {
        margin-left: auto;
        margin-right: auto;
        position: relative;
        overflow: hidden;
        z-index: 1;
}

.swiper-container-no-flexbox .swiper-slide {
        float: left;
}

.swiper-container-vertical > .swiper-wrapper {
        -webkit-box-orient: vertical;
        -moz-box-orient: vertical;
        -ms-flex-direction: column;
        -webkit-flex-direction: column;
        flex-direction: column;
}

.swiper-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 1;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-transition-property: -webkit-transform;
        -moz-transition-property: -moz-transform;
        -o-transition-property: -o-transform;
        -ms-transition-property: -ms-transform;
        transition-property: transform;
        -webkit-box-sizing: content-box;
        -moz-box-sizing: content-box;
        box-sizing: content-box;
}

.swiper-container-android .swiper-slide,
.swiper-wrapper {
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        -o-transform: translate(0, 0);
        -ms-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
}

.swiper-container-multirow > .swiper-wrapper {
        -webkit-box-lines: multiple;
        -moz-box-lines: multiple;
        -ms-flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
        flex-wrap: wrap;
}

.swiper-container-free-mode > .swiper-wrapper {
        -webkit-transition-timing-function: ease-out;
        -moz-transition-timing-function: ease-out;
        -ms-transition-timing-function: ease-out;
        -o-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
        margin: 0 auto;
}

.swiper-slide {
        -webkit-flex-shrink: 0;
        -ms-flex: 0 0 auto;
        flex-shrink: 0;
        width: 100%;
        height: 100%;
        position: relative;
}

.swiper-container-autoheight,
.swiper-container-autoheight .swiper-slide {
        height: auto;
}

.swiper-container-autoheight .swiper-wrapper {
        -webkit-box-align: start;
        -ms-flex-align: start;
        -webkit-align-items: flex-start;
        align-items: flex-start;
        -webkit-transition-property: -webkit-transform, height;
        -moz-transition-property: -moz-transform;
        -o-transition-property: -o-transform;
        -ms-transition-property: -ms-transform;
        transition-property: transform, height;
}

.swiper-container .swiper-notification {
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
        opacity: 0;
        z-index: -1000;
}

.swiper-wp8-horizontal {
        -ms-touch-action: pan-y;
        touch-action: pan-y;
}

.swiper-wp8-vertical {
        -ms-touch-action: pan-x;
        touch-action: pan-x;
}

.swiper-button-next,
.swiper-button-prev {
        position: absolute;
        top: 50%;
        width: 27px;
        height: 44px;
        margin-top: -22px;
        z-index: 10;
        cursor: pointer;
        -moz-background-size: 27px 44px;
        -webkit-background-size: 27px 44px;
        background-size: 27px 44px;
        background-position: center;
        background-repeat: no-repeat;
}

.swiper-button-next.swiper-button-disabled,
.swiper-button-prev.swiper-button-disabled {
        opacity: 0.35;
        cursor: auto;
        pointer-events: none;
}

.swiper-button-prev,
.swiper-container-rtl .swiper-button-next {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E");
        left: 10px;
        right: auto;
}

.swiper-button-prev.swiper-button-black,
.swiper-container-rtl .swiper-button-next.swiper-button-black {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E");
}

.swiper-button-prev.swiper-button-white,
.swiper-container-rtl .swiper-button-next.swiper-button-white {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}

.swiper-button-next,
.swiper-container-rtl .swiper-button-prev {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E");
        right: 10px;
        left: auto;
}

.swiper-button-next.swiper-button-black,
.swiper-container-rtl .swiper-button-prev.swiper-button-black {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E");
}

.swiper-button-next.swiper-button-white,
.swiper-container-rtl .swiper-button-prev.swiper-button-white {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
}

.swiper-pagination {
        position: absolute;
        text-align: center;
        -webkit-transition: 0.3s;
        -moz-transition: 0.3s;
        -o-transition: 0.3s;
        transition: 0.3s;
        -webkit-transform: translate3d(0, 0, 0);
        -ms-transform: translate3d(0, 0, 0);
        -o-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
        z-index: 10;
}

.swiper-pagination.swiper-pagination-hidden {
        opacity: 0;
}

.swiper-container-horizontal > .swiper-pagination-bullets,
.swiper-pagination-custom,
.swiper-pagination-fraction {
        bottom: 10px;
        left: 0;
        width: 100%;
}

.swiper-pagination-bullet {
        width: 8px;
        height: 8px;
        display: inline-block;
        border-radius: 100%;
        background: #000;
        opacity: 0.2;
}

button.swiper-pagination-bullet {
        border: none;
        margin: 0;
        padding: 0;
        box-shadow: none;
        -moz-appearance: none;
        -ms-appearance: none;
        -webkit-appearance: none;
        appearance: none;
}

.swiper-pagination-clickable .swiper-pagination-bullet {
        cursor: pointer;
}

.swiper-pagination-white .swiper-pagination-bullet {
        background: #fff;
}

.swiper-pagination-bullet-active {
        opacity: 1;
        background: #007aff;
}

.swiper-pagination-white .swiper-pagination-bullet-active {
        background: #fff;
}

.swiper-pagination-black .swiper-pagination-bullet-active {
        background: #000;
}

.swiper-container-vertical > .swiper-pagination-bullets {
        right: 10px;
        top: 50%;
        -webkit-transform: translate3d(0, -50%, 0);
        -moz-transform: translate3d(0, -50%, 0);
        -o-transform: translate(0, -50%);
        -ms-transform: translate3d(0, -50%, 0);
        transform: translate3d(0, -50%, 0);
}

.swiper-container-vertical
        > .swiper-pagination-bullets
        .swiper-pagination-bullet {
        margin: 5px 0;
        display: block;
}

.swiper-container-horizontal
        > .swiper-pagination-bullets
        .swiper-pagination-bullet {
        margin: 0 5px;
}

.swiper-pagination-progress {
        background: rgba(0, 0, 0, 0.25);
        position: absolute;
}

.swiper-pagination-progress .swiper-pagination-progressbar {
        background: #007aff;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        -webkit-transform: scale(0);
        -ms-transform: scale(0);
        -o-transform: scale(0);
        transform: scale(0);
        -webkit-transform-origin: left top;
        -moz-transform-origin: left top;
        -ms-transform-origin: left top;
        -o-transform-origin: left top;
        transform-origin: left top;
}

.swiper-container-rtl
        .swiper-pagination-progress
        .swiper-pagination-progressbar {
        -webkit-transform-origin: right top;
        -moz-transform-origin: right top;
        -ms-transform-origin: right top;
        -o-transform-origin: right top;
        transform-origin: right top;
}

.swiper-container-horizontal > .swiper-pagination-progress {
        width: 100%;
        height: 4px;
        left: 0;
        top: 0;
}

.swiper-container-vertical > .swiper-pagination-progress {
        width: 4px;
        height: 100%;
        left: 0;
        top: 0;
}

.swiper-pagination-progress.swiper-pagination-white {
        background: rgba(255, 255, 255, 0.5);
}

.swiper-pagination-progress.swiper-pagination-white
        .swiper-pagination-progressbar {
        background: #fff;
}

.swiper-pagination-progress.swiper-pagination-black
        .swiper-pagination-progressbar {
        background: #000;
}

.swiper-container-3d {
        -webkit-perspective: 1200px;
        -moz-perspective: 1200px;
        -o-perspective: 1200px;
        perspective: 1200px;
}

.swiper-container-3d .swiper-cube-shadow,
.swiper-container-3d .swiper-slide,
.swiper-container-3d .swiper-slide-shadow-bottom,
.swiper-container-3d .swiper-slide-shadow-left,
.swiper-container-3d .swiper-slide-shadow-right,
.swiper-container-3d .swiper-slide-shadow-top,
.swiper-container-3d .swiper-wrapper {
        -webkit-transform-style: preserve-3d;
        -moz-transform-style: preserve-3d;
        -ms-transform-style: preserve-3d;
        transform-style: preserve-3d;
}

.swiper-container-3d .swiper-slide-shadow-bottom,
.swiper-container-3d .swiper-slide-shadow-left,
.swiper-container-3d .swiper-slide-shadow-right,
.swiper-container-3d .swiper-slide-shadow-top {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
}

.swiper-container-3d .swiper-slide-shadow-left {
        background-image: -webkit-gradient(
                linear,
                left top,
                right top,
                from(rgba(0, 0, 0, 0.5)),
                to(rgba(0, 0, 0, 0))
        );
        background-image: -webkit-linear-gradient(
                right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -moz-linear-gradient(
                right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -o-linear-gradient(
                right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: linear-gradient(
                to left,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
}

.swiper-container-3d .swiper-slide-shadow-right {
        background-image: -webkit-gradient(
                linear,
                right top,
                left top,
                from(rgba(0, 0, 0, 0.5)),
                to(rgba(0, 0, 0, 0))
        );
        background-image: -webkit-linear-gradient(
                left,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -moz-linear-gradient(
                left,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -o-linear-gradient(
                left,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: linear-gradient(
                to right,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
}

.swiper-container-3d .swiper-slide-shadow-top {
        background-image: -webkit-gradient(
                linear,
                left top,
                left bottom,
                from(rgba(0, 0, 0, 0.5)),
                to(rgba(0, 0, 0, 0))
        );
        background-image: -webkit-linear-gradient(
                bottom,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -moz-linear-gradient(
                bottom,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -o-linear-gradient(
                bottom,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: linear-gradient(
                to top,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
}

.swiper-container-3d .swiper-slide-shadow-bottom {
        background-image: -webkit-gradient(
                linear,
                left bottom,
                left top,
                from(rgba(0, 0, 0, 0.5)),
                to(rgba(0, 0, 0, 0))
        );
        background-image: -webkit-linear-gradient(
                top,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -moz-linear-gradient(
                top,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: -o-linear-gradient(
                top,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
        background-image: linear-gradient(
                to bottom,
                rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0)
        );
}

.swiper-container-coverflow .swiper-wrapper,
.swiper-container-flip .swiper-wrapper {
        -ms-perspective: 1200px;
}

.swiper-container-cube,
.swiper-container-flip {
        overflow: visible;
}

.swiper-container-cube .swiper-slide,
.swiper-container-flip .swiper-slide {
        pointer-events: none;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;
        z-index: 1;
}

.swiper-container-cube .swiper-slide .swiper-slide,
.swiper-container-flip .swiper-slide .swiper-slide {
        pointer-events: none;
}

.swiper-container-cube .swiper-slide-active,
.swiper-container-cube .swiper-slide-active .swiper-slide-active,
.swiper-container-flip .swiper-slide-active,
.swiper-container-flip .swiper-slide-active .swiper-slide-active {
        pointer-events: auto;
}

.swiper-container-cube .swiper-slide-shadow-bottom,
.swiper-container-cube .swiper-slide-shadow-left,
.swiper-container-cube .swiper-slide-shadow-right,
.swiper-container-cube .swiper-slide-shadow-top,
.swiper-container-flip .swiper-slide-shadow-bottom,
.swiper-container-flip .swiper-slide-shadow-left,
.swiper-container-flip .swiper-slide-shadow-right,
.swiper-container-flip .swiper-slide-shadow-top {
        z-index: 0;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        -ms-backface-visibility: hidden;
        backface-visibility: hidden;
}

.swiper-container-cube .swiper-slide {
        visibility: hidden;
        -webkit-transform-origin: 0 0;
        -moz-transform-origin: 0 0;
        -ms-transform-origin: 0 0;
        transform-origin: 0 0;
        width: 100%;
        height: 100%;
}

.swiper-container-cube.swiper-container-rtl .swiper-slide {
        -webkit-transform-origin: 100% 0;
        -moz-transform-origin: 100% 0;
        -ms-transform-origin: 100% 0;
        transform-origin: 100% 0;
}

.swiper-container-cube .swiper-slide-active,
.swiper-container-cube .swiper-slide-next,
.swiper-container-cube .swiper-slide-next + .swiper-slide,
.swiper-container-cube .swiper-slide-prev {
        pointer-events: auto;
        visibility: visible;
}

.swiper-container-cube .swiper-cube-shadow {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.6;
        -webkit-filter: blur(50px);
        filter: blur(50px);
        z-index: 0;
}

.swiper-container-fade.swiper-container-free-mode .swiper-slide {
        -webkit-transition-timing-function: ease-out;
        -moz-transition-timing-function: ease-out;
        -ms-transition-timing-function: ease-out;
        -o-transition-timing-function: ease-out;
        transition-timing-function: ease-out;
}

.swiper-container-fade .swiper-slide {
        pointer-events: none;
        -webkit-transition-property: opacity;
        -moz-transition-property: opacity;
        -o-transition-property: opacity;
        transition-property: opacity;
}

.swiper-container-fade .swiper-slide .swiper-slide {
        pointer-events: none;
}

.swiper-container-fade .swiper-slide-active,
.swiper-container-fade .swiper-slide-active .swiper-slide-active {
        pointer-events: auto;
}

.swiper-zoom-container {
        width: 100%;
        height: 100%;
        display: -webkit-box;
        display: -moz-box;
        display: -ms-flexbox;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -moz-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
        -webkit-box-align: center;
        -moz-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        align-items: center;
        text-align: center;
}

.swiper-zoom-container > canvas,
.swiper-zoom-container > img,
.swiper-zoom-container > svg {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
}

.swiper-scrollbar {
        border-radius: 10px;
        position: relative;
        -ms-touch-action: none;
        background: rgba(0, 0, 0, 0.1);
}

.swiper-container-horizontal > .swiper-scrollbar {
        position: absolute;
        left: 1%;
        bottom: 3px;
        z-index: 50;
        height: 5px;
        width: 98%;
}

.swiper-container-vertical > .swiper-scrollbar {
        position: absolute;
        right: 3px;
        top: 1%;
        z-index: 50;
        width: 5px;
        height: 98%;
}

.swiper-scrollbar-drag {
        height: 100%;
        width: 100%;
        position: relative;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        left: 0;
        top: 0;
}

.swiper-scrollbar-cursor-drag {
        cursor: move;
}

.swiper-lazy-preloader {
        width: 42px;
        height: 42px;
        position: absolute;
        left: 50%;
        top: 50%;
        margin-left: -21px;
        margin-top: -21px;
        z-index: 10;
        -webkit-transform-origin: 50%;
        -moz-transform-origin: 50%;
        transform-origin: 50%;
        -webkit-animation: swiper-preloader-spin 1s steps(12, end) infinite;
        -moz-animation: swiper-preloader-spin 1s steps(12, end) infinite;
        animation: swiper-preloader-spin 1s steps(12, end) infinite;
}

.swiper-lazy-preloader:after {
        display: block;
        content: "";
        width: 100%;
        height: 100%;
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
        background-position: 50%;
        -webkit-background-size: 100%;
        background-size: 100%;
        background-repeat: no-repeat;
}

.swiper-lazy-preloader-white:after {
        background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E");
}

@-webkit-keyframes swiper-preloader-spin {
        100% {
                -webkit-transform: rotate(360deg);
        }
}

@keyframes swiper-preloader-spin {
        100% {
                transform: rotate(360deg);
        }
}
</style>