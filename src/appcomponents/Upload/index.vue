<template>
        <div class="upload-container" @touchmove.prevent v-if="visible">
                <!-- 主体 -->
                <mt-popup v-model="visible" position="bottom" class="upload-main" :modal="false">
                        <full-page>
                                <!-- <mt-header slot="header" title="拍照示例图">
                                        <mt-button slot="left" :disabled="false" type="danger" @click="visible=false">取消</mt-button>
                                </mt-header> -->
                                <div class="vux-popup-header vux-1px-b">
                                        <div class="vux-popup-header-left" @click="visible=false">
                                                关闭
                                        </div>
                                        <div class="vux-popup-header-title">
                                                拍照示例图
                                        </div>
                                </div>
                                <div class="view-waper">
                                        <div class="view-main">
                                                <img class="view-demo" :src="demoImg[upType]" alt="">
                                                <span class="view-info">{{label}}</span>
                                        </div>
                                </div>
                                <div slot="tabar" class="view-btn">
                                        <input type="file" accept="image/*" @change="inputChange" class="input-file">
                                        <i class="icon-add icon"></i>
                                </div>
                        </full-page>
                </mt-popup>
                <!-- 遮罩层 -->
                <div class="mask1" @touchmove.prevent @click="visible = false"></div>
        </div>
</template>

<script>
import lrz from "lrz";
import { Toast, Indicator } from "mint-ui";
let demoImg = {
        //营业执照
        BUSSINESS_LICENSE: require("./img/FAST_BUSINESS.png"),
        //门头照片
        PLACE_IMG: require("./img/FAST_HEADER.png"),
        //收银台
        CASH_SPACE_IMG: require("./img/FAST_CASH.png"),
};
export default {
        props: {
                value: {
                        type: Boolean,
                        default: false
                },
                label: {
                        type: String,
                        default: "拍摄的照片尽量充满相框，无反光，无水印，清晰可见"
                },
                upType: {
                        type: String,
                        default: ""
                }
        },
        data() {
                return {
                        visible: true,
                        demoImg: demoImg
                };
        },
        watch: {
                value(val) {
                        this.visible = val;
                },
                visible(val) {
                        this.$emit("input", val);
                }
        },
        created() {
                this.visible = this.value;
        },
        methods: {
                //选择图片
                inputChange(event) {
                        event.preventDefault();
                        var target = event.target;
                        var file = target.files[0];
                        if (!/image\/\w+/.test(file.type)) {
                                alert("请选择合法的图片");
                                return false;
                        }
                        this.lrzImg(file, event);
                        // var reader = new FileReader();
                        // reader.readAsDataURL(file);
                        // reader.onload = function () {
                        //      var base64 = this.result;
                        //      console.log(base64);
                        // }
                },
                //压缩图片
                lrzImg(file, event) {
                        Indicator.open({
                                text: "处理中...",
                                spinnerType: "fading-circle"
                        });
                        lrz(file, { width: 1000 })
                                .then(res => {
                                        let base64 = res.base64;
                                        Indicator.close();
                                        this.createImg(base64);
                                        return base64;
                                })
                                .catch(function (err) {
                                        // 处理失败会执行
                                })
                                .always(function () {
                                        // 不管是成功失败，都会执行
                                        event.target.value = null;
                                });
                },
                //显示图片
                createImg(base64) {
                        this.visible = false;
                        this.$emit("upresult", base64);
                }
        }
};
</script>


<style lang="less" scoped>
@import url(../../assets/less/base.less);
.upload-container {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        .mask1 {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
        }
        .upload-main {
                width: 100%;
                height: 70%; // background: red;
                text-align: center;

                .vux-popup-header {
                        //   display: flex;
                        position: relative;
                        height: 44px;
                        line-height: 44px;
                        font-size: 16px;
                        background-color: #ff5959;
                }
                .vux-popup-header-title {
                        //   flex: 1;
                        margin: 0 88px;
                        width: auto;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        text-align: center;
                        color: #fff;
                }
                .vux-popup-header-left {
                        //   flex: 0.1;
                        position: absolute;
                        top: 12px;
                        display: block;
                        font-size: 14px;
                        line-height: 21px;
                        padding-left: 15px;
                        color: #fff;
                }
                .vux-popup-header-right {
                        //   flex: 0.1;
                        position: absolute;
                        top: 12px;
                        right: 0;
                        display: block;
                        font-size: 14px;
                        line-height: 21px;
                        padding-right: 15px;
                        color: #04be02;
                }
                .vux-popup-header.vux-1px-b:after {
                        border-color: #d9d9d9;
                }
                .vux-1px-b {
                        position: relative;
                        &::after {
                                content: " ";
                                position: absolute;
                                left: 0;
                                bottom: 0;
                                right: 0;
                                height: 1px;
                                border-bottom: 1px solid #e3e5e9;
                                color: #e3e5e9;
                                transform-origin: 0 100%;
                                transform: scaleY(0.5);
                        }
                }
        }
        .view-waper {
                height: 100%;
                display: flex;
        }
        .view-main {
                padding: 40 / @rem;
                margin: auto;
        }
        .view-demo {
                width: 80%;
                display: block;
                margin: 50 / @rem auto;
        }
        .view-info {
                display: inline-block;
                margin-top: 50 / @rem;
        }
        .view-btn {
                position: relative;
                width: 100 / @rem;
                height: 100 / @rem;
                margin: 30 / @rem auto;
                display: flex;
                clear: both;
                font-size: 10px;
                border-radius: 50%;
                background: #fff;
                .input-file {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        opacity: 0;
                }
                .icon {
                        margin: auto;
                        font-size: 90 / @rem;
                        color: #ff5959;
                }
        }
}
</style>
