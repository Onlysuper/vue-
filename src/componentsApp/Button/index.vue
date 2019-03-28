
<template>
        <button class="button" :class="[type,{'disabled-cls':disabled,'button-active-class':buttonActiveClass},className]" :disabled="disabled" @click="click" @touchstart="!disabled && (buttonActiveClass = true)" @touchend="!disabled && (buttonActiveClass = false)">
                <slot></slot>
        </button>
</template>

<script>
export default {
        /**
                 *按钮组件
                 * type : 按钮的类型 指定预定义的按钮
                 * disabled : 指定是否禁用状态
                 * click : 指定点击后的回调
                 * className : 自定义的class
                */
        props: {
                type: {
                        type: String,
                        default: "default"
                },
                disabled: {
                        type: Boolean,
                        default: false
                },
                click: {
                        type: Function,
                        default: function () {
                                console.info("请传入回调函数");
                        }
                },
                className: {
                        type: String,
                        default: ""
                }
        },
        data() {
                return {
                        buttonActiveClass: false
                };
        }
};
</script>

<style lang="less">
@import url(../../assets/less/base.less);
//基础样式
.button {
        width: 100%;
        line-height: 90 / @rem;
        border-radius: 50 / @rem;
        font-size: 36 / @rem;
        text-align: center;
        border: 1px solid transparent;
}

//禁用样式
.disabled-cls {
        opacity: 0.5;
}

.button-active-class {
        opacity: 0.8;
}

//默认
.default {
        border-color: #ccc;
}

//确定按钮
.confirm-btn {
        background: rgba(230, 0, 18, 1);
        color: #fff;
}

//注册按钮
.register-btn {
        border-color: rgba(230, 0, 18, 1);
        color: rgba(230, 0, 18, 1);
}

.info-btn {
        background: #ff6363;
        color: #fff;
        line-height: 80 / @rem;
}
</style>
