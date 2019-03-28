<template>
        <div class="help">
                <img :src="require('@src/assets/images/help.png')" alt="">
                <a href="javascript:;" @click="shop" class="btn">我知道了</a>
        </div>
</template>


<script>
export default {
        methods: {
                shop() {
                        // 关闭微信浏览器窗口方法
                        WeixinJSBridge.invoke('closeWindow');
                }
        }
}
</script>
<style lang="less" scoped>
@import url(../../../assets/less/base.less);

.help {
        position: relative;
        img {
                width: 100%;
        }
        .btn {
                .absoluteCenter();
                width: 600 / @rem;
                line-height: 90 / @rem;
                top: auto;
                bottom: 80 / @rem;
                display: block;
                background: #e70010;
                border-radius: 15 / @rem;
                color: #fff;
                font-size: 30 / @rem;
                text-align: center;
        }
}
</style>
