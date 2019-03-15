<template>
        <div class="myp-panel-body-row">
                <span class="title">{{title}}</span>
                <span class="desc">{{desc}}<slot></slot></span>
        </div>
</template>

<script>
export default {
        name: "PanelBodyRow",
        props: {
                title: {
                        type: String,
                        default: "标题"
                },
                desc: {}
        }
};
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.myp-panel-body-row {
        display: flex;
        // font-size: 32 / @rem;
        line-height: 60 / @rem;
        .title {
                // flex: 1;
                width: 200 / @rem;
                // margin: auto;
                font-weight: 500;
        }
        .desc {
                flex: 1;
                // max-width: 450 / @rem;
                // text-align: right;
        }
}
</style>
