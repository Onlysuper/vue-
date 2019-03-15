<template>
        <div class="not-goods">
                <div>
                        <img :src="require('@src/assets/images/pay_unopen.png')" alt="">
                        暂无查到商品信息，您可能还没有添加商品~
                </div>
                <br>
                <router-link to="/customer/eicGoodsAdd"><i class="add icon-add"></i></router-link>
        </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.not-goods {
        background-color: #f2f2f2;
        text-align: center;
        font-size: 14px;
        .add {
                font-size: 40px;
                color: red;
        }

        img {
                width: 50%;
                display: block;
                margin: 50px auto 20px;
        }
}
</style>
