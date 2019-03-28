<template>
        <div class="upload-view">
                <div class="upload-view-btn" @click="handleClick">
                        <img v-if="base64" :src="base64" alt="">
                        <i v-if="!base64" class="icon-camera icon"></i>
                </div>
                <span>{{label}}</span>
                <upload v-model="showUpload" @upresult="upresult" :label="desc" :upType="upType"></upload>
        </div>
</template>
 

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.upload-view {
        // width: calc(33.3333% - 10*$rem)
        width: 100%;
        height: 250 / @rem;
        text-align: center;
        padding: 10 / @rem 5 / @rem;
        box-sizing: border-box;
        .upload-view-btn {
                height: 150 / @rem;
                border: 1px dotted #ccc;
                text-align: center;
                line-height: 170 / @rem;
                img {
                        display: block;
                        width: 100%;
                        height: 100%;
                        border: none;
                }
                .icon {
                        font-size: 60 / @rem;
                        color: #ccc;
                }
        }
        span {
                display: inline-block;
                font-size: 30 / @rem;
                margin: 10 / @rem;
        }
}
</style>

<script>
import { Toast, Indicator } from "mint-ui";
import Upload from "./index";
export default {
        components: {
                Upload
        },
        props: {
                label: {
                        type: String,
                        default: ""
                },
                dataKey: {
                        type: String,
                        default: ""
                },
                upType: {
                        type: String,
                        default: ""
                },
                desc: {
                        type: String,
                        default: "拍摄的照片尽量充满相框，无反光，无水印，清晰可见"
                },
                disabled: {
                        type: Boolean,
                        default: false
                },
                api: {
                        type: Function,
                        default: () => { }
                }
        },

        data() {
                return {
                        showUpload: false,
                        base64: ""
                };
        },
        methods: {
                handleClick() {
                        if (this.disabled) {
                        } else {
                                this.showUpload = true;
                        }
                },
                upresult(base64) {
                        Indicator.open({
                                text: "正在上传...",
                                spinnerType: "fading-circle"
                        });
                        this.api()({
                                businessType: "customer",
                                imgType: this.upType,
                                imgString: base64
                        }).then(data => {
                                Indicator.close();
                                if (data.resultCode === "0") {
                                        this.$emit("result", this.dataKey, data.data);
                                        this.setImg(base64);
                                } else {
                                        Toast(data.resultMsg);
                                }
                        });
                },
                setImg(base64) {
                        this.base64 = base64;
                }
        }
};
</script>
