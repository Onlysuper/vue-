<template>
        <div class="pay-order-unopen" v-if="visible">
                <img :src="require('@src/assets/images/pay_unopen.png')">
                <span class="unopen-title">
                        <slot name="tip">暂无数据~</slot>
                </span>
                <span class="unopen-description">
                        <slot name="footerTip"></slot>
                </span>
        </div>
</template>

<script>
export default {
        props: {
                value: {
                        type: Boolean,
                        default: false
                }
        },
        data() {
                return {
                        visible: false
                }
        },
        mounted() {
                //判断默认值为true的时候watch无法监听
                if (this.value) {
                        this.visible = true;
                }
        },
        watch: {
                //监听v-model值的变化而改变visible的值
                value(val) {
                        this.visible = val;
                },
                //通知v-modle
                visible(val) {
                        this.$emit('input', val);
                }
        }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.pay-order-unopen {
        overflow: hidden;
        width: 100%;
        height: 100%;
        text-align: center;
        img {
                width: 40%;
                margin: 100 / @rem auto 50 / @rem auto;
        }
        .unopen-title {
                float: left;
                width: 100%;
                font-size: 32 / @rem;
        }
        .unopen-description {
                position: absolute;
                bottom: 10 / @rem;
                left: 0;
                width: 100%;
                height: 80px;
                font-size: 14px;
                color: #666;
                a {
                        color: #f76d45;
                }
        }
}
</style>