<template>
        <div class="full-page">
                <header class="full-header">
                        <slot name="header"></slot>
                </header>
                <main class="full-main" ref="fullMain">
                        <slot></slot>
                </main>
                <footer class="full-tabar">
                        <slot name="tabar"></slot>
                </footer>
        </div>
</template>

<style lang="less">
.full-page {
        width: 100%;
        height: 100%;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .full-header {
        }
        .full-main {
                flex: 1;
                overflow-x: hidden;
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch; //移动端弹性滚动效果，touch为弹性滚动，auto是非弹性滚动
                position: relative;
                //   z-index:1;
        }
        .full-tabar {
                position: relative;
        }
}
</style>

<script>
export default {
        name: "full-page",
        methods: {
                getScrollTop() {
                        return this.$refs.fullMain.scrollTop;
                },
                setScrollTop(scrollTopVal) {
                        this.$refs.fullMain.scrollTop = scrollTopVal;
                }
        }
};
</script>