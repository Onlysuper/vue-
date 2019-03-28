<template>
        <div class="inTransit-container">
                <div class="inTransit-body">
                        <div class="cont">
                                <img :src="require('@src/assets/images/InTransit-icon.png')" alt="">
                                <div>开通中...</div>
                                <p>预计1-2个工作日<br />审核完成将以短信形式告知审核结果</p>
                        </div>
                </div>
                <div class="inTransit-footer">
                        <p>请前去所在税局购买电票税盘</p>
                        <p>如有疑问请联系：
                                <a href="tel:400-110-2662">400-110-2662</a>
                        </p>
                </div>
        </div>
</template>

<script>
export default {
        data() {
                return {};
        },
        mounted() {
                // $(".inTransit-container").setHeightToWindow();
        }
};
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);

.inTransit-container {
        .transformPage();
        text-align: center;
        overflow: hidden; // display: flex;
        .inTransit-body {
                font-size: 32 / @rem;
                margin-top: 160 / @rem;
                .cont {
                        img {
                                width: 311 / @rem;
                                height: 296 / @rem;
                        }
                        div {
                                font-size: 36 / @rem;
                                color: #dc0007;
                                margin-top: 50 / @rem;
                        }
                        p {
                                margin-top: 20 / @rem;
                                font-weight: 600;
                        }
                }
        }
        .inTransit-footer {
                margin-top: 280 / @rem;
                p {
                        font-size: 30 / @rem;
                        color: #666666;
                        margin-bottom: 45 / @rem;
                }
        }
}
</style>
