<template>
        <div class="invoice-goods-container">
                <tab-router-link :flexd="true">
                        <router-link :to="{ path: '/customer/eicGoods'}" replace>
                                <i class="icon icon-bill-goods"></i>商品
                        </router-link>
                        <router-link :to="{ path: '/customer/eicConfig'}" replace>
                                <i class="icon icon-bill-config"></i>配置
                        </router-link>
                </tab-router-link>
                <!--餐饮-->
                <div class="item" v-show="pageShow">
                        <div class="item-goods" v-for="(item,index) in goods" :key="item.goodsNo">
                                <div class="good">
                                        <div class="panel-header clearfix group">
                                                <div class="left clearfix">
                                                        <span class="title">{{item.goodsType && `*${item.goodsType}*`}}{{item.goodsName}}</span>
                                                </div>
                                                <div class="right">
                                                        <span class="">设为默认</span>
                                                        <mt-switch v-model="item.defaultType" @change="defaultTypeSwitchChange(item.defaultType,item.goodsNo,index)"></mt-switch>
                                                </div>
                                        </div>
                                        <div class="panel-body _av" @click="$router.push({path:'/customer/eicGoodsDetail',query:item})">
                                                <div class="group">
                                                        <p class="sl clearfix">
                                                                <span>价格：{{item.unitPrice | _toFixed}}</span>
                                                                <i class="del" @click.stop="updataGoods(item)">编辑</i>
                                                        </p>
                                                        <p class="sl clearfix">
                                                                <span>税率：{{item.taxRate*100}}%</span>
                                                                <i class="del" @click.stop="delGoods(item.goodsNo,index)">删除</i>
                                                        </p>
                                                </div>
                                        </div>
                                </div>
                        </div>
                </div>
                <div class="btn" @click="addGoodBtn" v-show="pageShow">
                        <mt-button size="large" type="danger" :disabled="false">添加</mt-button>
                </div>
        </div>
</template>


<script>
import utils from "@src/common/utils.js";
import { MessageBox } from "mint-ui";
import TabRouterLink from "@src/appcomponents/TabRouterLink";
import {
        electronicQueryGoodsList,
        electronicConfigDefault,
        electronicAddGoods
} from "@src/apis";

export default {
        components: { TabRouterLink },
        data() {
                return {
                        pageShow: false,
                        value4: [],
                        goods: []
                };
        },
        activated() {
                this.openId = utils.getOpenId();
                this.options4 = ["住宿服务"];
                electronicQueryGoodsList()({ openId: utils.getOpenId() }).then(data => {
                        if (data.resultCode == "0") {
                                this.pageShow = true;
                                let goods = data.data;
                                if (goods.length != 0) {
                                        //转换defaultType数据类型
                                        goods = goods.map(item => {
                                                if (item.defaultType == "TRUE") {
                                                        item.defaultType = true;
                                                } else {
                                                        item.defaultType = false;
                                                }
                                                return item;
                                        });
                                        this.goods = goods;
                                } else {
                                        // this.Toast("您还没有添加过商品~");
                                        this.pageShow = true;
                                }
                        } else {
                                this.Toast(data.resultMsg);
                        }
                });
        },
        filters: {
                _toFixed(t) {
                        if (t) return utils.toFixed(t);
                        else return "无";
                }
        },
        methods: {
                //修改默认switch按钮
                defaultTypeSwitchChange(defaultType, goodsNo, index) {
                        this.goods = this.goods.map(item => {
                                item.defaultType = false;
                                return item;
                        });
                        this.goods[index].defaultType = defaultType;
                        electronicConfigDefault()({
                                openId: this.openId,
                                goodsNo: goodsNo,
                                defaultType: (this.goods[index].defaultType + "").toUpperCase()
                        }).then(data => {
                                this.Toast(data.resultMsg);
                        });
                },
                //修改商品
                updataGoods(item) {
                        item["submitType"] = "UPDATE";
                        this.$router.push({
                                path: "/customer/eicGoodsAdd",
                                query: item
                        });
                },
                //删除商品
                delGoods(goodsNo, index) {
                        MessageBox({
                                title: "温馨提示",
                                message: "确定删除？",
                                confirmButtonText: "确认",
                                showCancelButton: true,
                                cancelButtonText: "取消"
                        }).then(action => {
                                if (action == "confirm") {
                                        electronicAddGoods()({
                                                type: "DELETE",
                                                openId: this.openId,
                                                goodsNo: goodsNo
                                        }).then(data => {
                                                if (data.resultCode == "0") {
                                                        this.Toast(data.resultMsg);
                                                        this.goods = this.goods.filter(item => {
                                                                return item.goodsNo != goodsNo;
                                                        });
                                                } else {
                                                        this.Toast(data.resultMsg);
                                                }
                                        });
                                }
                        });
                },
                addGoodBtn() {
                        this.$router.push({ path: "/customer/eicGoodsAdd" });
                }
        }
};
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);

@w: 30;
.invoice-goods-container {
        margin-top: 120 / @rem;
        overflow: hidden;

        .icon {
                vertical-align: middle;
                margin-right: 20 / @rem;
                font-size: 45 / @rem;
        }
        .item {
                .item-title {
                        font-size: 34 / @rem;
                        line-height: 70 / @rem;
                        padding-left: @w / @rem;
                }
                .item-goods {
                        font-size: 30 / @rem;
                        .group {
                                padding: 0 / @rem @w / @rem;
                        }
                        .good {
                                margin: 10 / @rem 0;
                                background: #fff;
                        }
                        .panel-header {
                                border-bottom: 1px solid #e5e5e5;
                                box-shadow: 0px 1px 5px #e6e6e6;
                                position: relative;
                                // display: flex;
                                // height: 50px;
                                .left {
                                        // flex: 1;
                                        width: 50%;
                                        float: left;
                                        display: table;
                                        height: 40px;
                                        padding-right: 5px;
                                        span {
                                                display: table-cell;
                                                vertical-align: middle;
                                        }
                                        // line-height: 50px;
                                }
                                .right {
                                        // flex: 1;
                                        float: right;
                                        display: flex;
                                        line-height: 40px;
                                }
                                .title {
                                        font-weight: 500;
                                        font-size: 32 / @rem;
                                }

                                .mint-switch-input:checked + .mint-switch-core {
                                        border-color: red;
                                        background-color: red;
                                }
                        }
                        .panel-body {
                                border-bottom: 1px solid #e5e5e5; // padding: 10/@rem 0;
                                p {
                                        // line-height: 60/@rem;
                                        color: #666666;
                                        span {
                                                float: left;
                                                padding: 20 / @rem 0;
                                        }
                                        .del {
                                                float: right;
                                                padding: 20 / @rem;
                                        }
                                }
                        }
                }
        }
        .btn {
                margin: 100 / @rem 60 / @rem;
        }
}
</style>
