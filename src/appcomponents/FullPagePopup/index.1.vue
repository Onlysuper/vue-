<template>
        <mt-popup v-model="visible" :position="position" class="full-page-popup" :modal="false">
                <full-page>

                        <template slot="header">
                                <slot name="header">
                                        <mt-header slot="header" :title="title" class="re-mint-header">
                                                <mt-button slot="left" :disabled="false" type="danger" @click="visible=false">返回</mt-button>
                                        </mt-header>
                                </slot>
                        </template>

                        <template slot="header">
                                <slot name="fixed"></slot>
                        </template>

                        <slot></slot>

                        <template slot="tabar">
                                <slot name="tabar"></slot>
                        </template>

                </full-page>
        </mt-popup>
</template>

<style lang="less" scoped>
.full-page-popup {
        width: 100%;
        height: 100%;
        background: #f2f2f2;
}
</style>

<script>
import PubSub from "pubsub-js";
export default {
        name: "full-page-popup",
        props: {
                title: {
                        type: String,
                        default: "标题"
                },
                value: {
                        type: Boolean,
                        default: false
                },
                position: {
                        type: String,
                        default: "right"
                }
        },
        data() {
                return {
                        visible: true
                };
        },
        watch: {
                value(val) {
                        this.visible = val;
                },
                visible(val) {
                        window.isPopup = val; //给window植入一个标识，供返回键关闭popup
                        this.$emit("input", val);
                }
        },
        created() {
                this.visible = this.value;
                //这里监听返回键 在window.isPopup为true的时候触发
                PubSub.subscribe("backbutton", () => {
                        this.visible = false;
                });
        }
};
</script>