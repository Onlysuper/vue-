<template>
        <div class="change-panel">
                <div class="public panel-header border-1px">
                        <i></i>
                        <span>{{title}}</span>
                </div>
                <div class="public panel-body">
                        <slot></slot>
                </div>
        </div>
</template>

<script>
export default {
        props: {
                title: {
                        type: String,
                        default: "标题"
                }
        }
};
</script>

<style lang="less">
@import url(../../assets/less/base.less);
.change-panel {
        .public {
                padding: 15 / @rem 20 / @rem;
                box-sizing: border-box;
        }
        .panel-header {
                font-size: 35 / @rem;
                position: relative;
                box-sizing: border-box;
                display: flex;
                i {
                        background: red;
                        width: 3px;
                        margin-right: 10 / @rem;
                }
                span {
                        flex: 1;
                }
        }
        .panel-body {
                font-size: 32 / @rem;
                .panel-body-row {
                        line-height: 60 / @rem;
                        display: flex;
                        span:nth-child(1) {
                                // width: 300/@rem;
                        }
                        span:nth-child(2) {
                                text-align: right;
                                flex: 1;
                        }
                }
        }
}
</style>
