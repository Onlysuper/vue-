<template>
        <div class="input-wrapper" :class="className">
                <slot></slot>
        </div>
</template>

<style lang="less">
@import "../../assets/less/base.less";
.input-wrapper {
        //定义input图片样式
        .mintui-field-success {
                font-size: 40 / @rem;
                &::before {
                        color: red;
                }
        }

        //强制给input添加下边框
        .mint-cell {
                min-height: 100 / @rem;
                background-image: linear-gradient(
                        0deg,
                        #d9d9d9,
                        #d9d9d9 50%,
                        transparent 50%
                );
                background-size: 100% 1px;
                background-repeat: no-repeat;
                background-position: bottom;
                .mint-cell-swipe-button {
                        line-height: 100 / @rem;
                }
        }
        // 去掉最后一个input下边框
        & > .mint-field:last-child {
                // background-image: none;
        }
        .mint-cell-wrapper {
                font-size: 32 / @rem;
                background-image: none;
                .mint-cell-title {
                        .mint-cell-label {
                                font-size: 32 / @rem;
                        }
                        width: 220 / @rem;
                        // margin-right: 30*$rem; // text-align: justify; // text-align-last: justify; // -moz-text-align-last: justify; // position: relative; // &:after { // content: ""; // display: block; // width: 100%; // height: 0;
                        // overflow: hidden;
                        // }
                }
                input {
                        color: #666;
                        opacity: 1;
                }
        }
}
</style>

<script>
export default {
        name: "InputWrapper",
        props: {
                className: {
                        type: String,
                        default: ""
                }
        }
};
</script>