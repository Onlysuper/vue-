<template>
        <div class="add-eic-page">
                <not-goods v-if="notGoods"></not-goods>
                <div class="carts" v-if="cartsVisible">
                        <view-radius class="good" v-for="(cart,index) in carts" :key="index">
                                <input-wrapper>
                                        <!-- 大标题 -->
                                        <mt-cell class="row">
                                                <i class="icon-bill-goods" slot="icon" @click="openGoodsList(cart,index)"></i>
                                                <i slot="title" @click="openGoodsList(cart,index)">{{cart.goodsName}}</i>
                                                <i class="delete icon-delete" v-if="carts.length > 1" @click="removeCart(index)"></i>
                                        </mt-cell>

                                        <!-- 商品信息 -->
                                        <mt-cell title="商品名称" is-link @click.native="openGoodsList(cart,index)">{{cart.goodsName}}</mt-cell>
                                        <div class="good-info">
                                                <div class="good-info-item line_center">
                                                        <span class="title">税率:{{cart.taxRate | accMul(100)}}%</span>
                                                </div>
                                                <div class="good-info-item line_center">
                                                        <span class="title">规格:{{cart.model}}</span>
                                                </div>
                                                <div class="good-info-item flex2">
                                                        <span class="title" v-if="cart.unitPriceStatus">单价:{{cart.unitPrice | toFixed}}元</span>
                                                        <span class="title" v-else>单价:无</span>
                                                </div>
                                        </div>

                                        <!-- 当没有配置单价的商品时 移除此项 -->
                                        <mt-cell title="商品数量" class="range-cell" v-if="cart.unitPriceStatus">
                                                <NumberInputSpinner class="vue-inline-number" :min="1" :max="10000" :step="1" inputClass="your-css-class" buttonClass="your-other-css-class" :integerOnly="true" v-model="cart.rangeValue" />
                                        </mt-cell>

                                        <!-- 手输含税总额 -->
                                        <mt-field v-else type="number" label="含税总额" v-model="cart.billAmount" placeholder="请填写金额" :attr="{maxLength:50}"></mt-field>

                                        <!-- 计算含税总额 -->
                                        <div class="good-row border-bottom-1px" v-if="cart.unitPriceStatus">
                                                <span class="title">含税总额</span>
                                                <span>{{cart.billAmount = countBillAmount(cart.rangeValue,cart.unitPrice)}}元</span>
                                        </div>

                                        <!-- <mt-cell title="征税方式" is-link @click.native="taxTypeVisible=true">{{taxTypeActions[taxType]}}</mt-cell> -->
                                        <mt-cell title="征税方式" is-link @click.native="taxTypeVisible=true">{{findTaxTypeText(taxType)}}</mt-cell>

                                        <!-- 如果征税方式为差额征税 和 有单价的商品不可开票 -->
                                        <mt-field type="number" v-if="!cart.unitPriceStatus && taxType==2" label="扣除金额" v-model="cart.taxDeductions" placeholder="请填写金额" :attr="{maxLength:50}"></mt-field>

                                        <!-- 算出税额 -->
                                        <div class="good-row border-bottom-1px">
                                                <span class="title">税额</span>
                                                <span>{{cart.taxmoney = countTaxAmount(cart.billAmount-cart.taxDeductions,cart.taxRate)}}元</span>
                                        </div>
                                </input-wrapper>
                        </view-radius>

                        <!-- <a href="javascript:;" class="add-goos-btn" @click="addCart"><i class="icon-add"></i> 继续添加商品</a> -->
                        <br>
                        <mt-button type="danger" size="large" @click="createLink" :disabled="carts[0].unitPriceStatus && taxType==2">
                                <span v-if="carts[0].unitPriceStatus && taxType==2">差额征税仅支持无单价的商品</span>
                                <span v-else>生成开票码</span>
                        </mt-button>
                        <picker v-model="pickerModle" ref="Picker" :slotsActions="goodsData" @confirm="pickerConfirm"></picker>
                        <mt-actionsheet :actions="taxTypeActions" v-model="taxTypeVisible" cancelText="取消" :closeOnClickModal="true"></mt-actionsheet>
                </div>
        </div>
</template>

<script>

import { electronicQueryGoodsList, createEicOrder, electronicQueryConfig } from "@src/apis";
import Picker from "@src/componentsApp/Picker";
import NotGoods from "@src/componentsApp/NotGoods";
import utils from "@src/common/utils";
import NumberInputSpinner from 'vue-number-input-spinner';
export default {
        components: { NotGoods, Picker, NumberInputSpinner },
        data() {
                return {
                        submitDisabled: false,
                        notGoods: false,
                        cartsVisible: false,
                        goodsList: [],
                        pickerModle: {},
                        goodsData: [],
                        carts: [],
                        orderNo: utils.randomDateNow(5),//时间戳前面+5位随机数
                        taxType: "",
                        taxTypeVisible: false,
                        taxTypeActions: [
                                {
                                        name: "普通征税",
                                        val: "0",
                                        method: a => {
                                                this.taxType = a.val;
                                        }
                                },
                                {
                                        name: "差额征税",
                                        val: "2",
                                        method: a => {
                                                this.taxType = a.val;
                                        }
                                }
                        ],
                }
        },
        mounted() {
                this.getConfig();
        },
        methods: {
                findTaxTypeText(value) {
                        let taxItem = this.taxTypeActions.find(item => item.val == value);
                        if (taxItem instanceof Object) {
                                return taxItem.name;
                        }
                },
                //获取商户电票配置信息,得到征税方式
                getConfig() {
                        electronicQueryConfig()({ openId: utils.getOpenId() }).then(data => {
                                if (data.resultCode == "0") {
                                        if (utils.isType(data.data, "Object")) {
                                                this.taxType = data.data.taxType;
                                                this.electronicQueryGoodsList();
                                        }
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },

                //获取商品南仁东
                electronicQueryGoodsList() {
                        electronicQueryGoodsList()({ openId: utils.getOpenId() }).then(data => {
                                if (data.resultCode == "0") {
                                        this.goodsList = data.data;
                                        if (this.goodsList.length == 0) {
                                                this.notGoods = true;
                                        } else {
                                                this.cartsVisible = true;
                                                this.findDefaultGoods(this.goodsList);
                                                this.initPicker(this.goodsList);
                                        }
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        })
                },

                //初始化Picker
                initPicker(goodsList) {
                        if (!(goodsList instanceof Array)) return;
                        this.goodsData = goodsList.map(item => {
                                item.code = item.goodsNo;
                                item.name = item.goodsName;
                                return item;
                        })
                },

                // 添加默认购物车 如果没有默认的商品 则选择第一项作为默认
                findDefaultGoods(goodsList) {
                        if (!(goodsList instanceof Array)) return;
                        let item = goodsList.find(item => item.defaultType == "TRUE") || goodsList[0];
                        this.setCarts(item);
                },

                //设置购物车商品
                setCarts(item, _index) {
                        let cart = {
                                goodsName: item.goodsName || "无",
                                goodsNo: item.goodsNo,
                                taxRate: item.taxRate || 0,
                                model: item.model || "无",
                                unitPrice: item.unitPrice || 0,
                                unitPriceStatus: item.unitPrice ? true : false,
                                rangeValue: 1,//商品数量
                                type: item.defaultType == "TRUE" ? "2" : "1",//是否是默认商品
                                billAmount: "",//税前总额
                                taxDeductions: "",//扣除金额
                                taxmoney: 0,//税额
                        };
                        if (_index === undefined) {
                                this.carts.push(cart);
                        } else {
                                this.carts = this.carts.map((item, index) => {
                                        if (index === _index) return cart;
                                        else return item;
                                })
                        }
                },

                //继续添加购物车 如果购物车大于5件禁止添加
                addCart() {
                        if (this.carts.length > 5) {
                                this.Toast("满了，不能在添加啦~");
                                return;
                        }
                        this.findDefaultGoods(this.goodsList);
                },

                //删除cart
                removeCart(index) {
                        if (this.carts.length == 1) {
                                this.Toast("请至少选择一个商品~");
                                return;
                        }
                        this.carts.splice(index, 1);
                },

                //创建商品订单列表
                createGoodsJson(_carts) {
                        let invoiceGoods = [];
                        let billAmount = 0;

                        //循环购物车创建商品订单列表
                        for (let i = 0; i < _carts.length; i++) {
                                let invoiceGood = {}, _cart = _carts[i];
                                //计算商品总额
                                billAmount += Number(_cart.billAmount);
                                invoiceGood["goodsNo"] = _cart.goodsNo;

                                // 差额征税增加两个字段，普通征税不需要
                                if (this.taxType == 2) {
                                        invoiceGood["taxAmountOriginal"] = _cart.billAmount + "";
                                        invoiceGood["taxDeductions"] = _cart.taxDeductions + "";
                                }
                                // invoiceGood["goodsNum"] = "";
                                // invoiceGood["taxAmount"] = "";

                                if (_cart.unitPriceStatus)
                                        //有单价的传数量
                                        invoiceGood["goodsNum"] = _cart.rangeValue + "";
                                else
                                        //没单价的传商品金额(单位分：)
                                        // invoiceGood["taxAmount"] = utils.accMul(_cart.billAmount, 100);
                                        invoiceGood["taxAmount"] = _cart.billAmount + "";

                                invoiceGoods.push(invoiceGood);
                        }

                        //总额转分
                        // billAmount = utils.accMul(billAmount, 100);

                        return { invoiceGoods, billAmount };
                },

                //创建order订单json
                createOrderJson(_carts) {
                        //无单价商品传商品总金额详细: { "orderNo":"1508733185974", "token":"41d8d24bd97366a413af0e41231e8a38", "billAmount":550, "invoiceGoods":[{"goodsNo":"700101","taxAmount":150},{"goodsNo":"700201","taxAmount":400}] } 
                        //有单价商品数据格式: {"orderNo":"1508733598961","accessKey":"41d8d24bd97366a413af0e41231e8a38","billAmount":550,"invoiceGoods":[{"goodsNo":"700101","goodsNum":10},{"goodsNo":"700201","goodsNum":20}]}
                        let { invoiceGoods, billAmount } = this.createGoodsJson(_carts);

                        let order = {};
                        /*
                        * 1.创建基础订单信息
                        */

                        //订单号，由接入方生成并传入，要求订单号长度范围：10-50个字符
                        order["orderNo"] = this.orderNo;
                        order["type"] = "1";
                        order["taxType"] = this.taxType;
                        // order["token"] = localStorage.getItem("token") || "";
                        order["billAmount"] = utils.toFixed(billAmount);
                        order["openId"] = utils.getOpenId();
                        order["invoiceGoods"] = invoiceGoods;
                        order["ticketType"] = "BLUE_TICKET";
                        order["billRecordNo"] = "";
                        order["token"] = utils.storage.getStorage("token");

                        return order;


                        /*
                        * 2.创建商品订单列表
                        */

                },

                //生成链接 转 二维码
                createLink() {
                        console.log(this.carts);
                        if (this.carts.length == 0) {
                                this.Toast("请先添加商品~");
                                return;
                        }
                        let _carts = JSON.parse(JSON.stringify(this.carts));

                        // let json = {}
                        // json["pluginType"] = "";//插件版本
                        // json["sign"] = "";//生成的签名

                        // json["order"] = this.createOrderJson(_carts);

                        let data = this.createOrderJson(_carts);
                        //数据校验

                        if (data.billAmount <= 0) {
                                this.MessageBox.alert("请输入含税总额！");
                                return;
                        }
                        createEicOrder()(data).then(data => {
                                if (data.resultCode == "0") {
                                        if (data.data instanceof Object && data.data.orderNo) {
                                                this.$router.push({
                                                        path: "/customer/eicQrcode",
                                                        query: {
                                                                orderNo: data.data.orderNo,
                                                        }
                                                });
                                        } else {
                                                this.Toast("数据接口异常！");
                                        }
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        })
                },

                //打开商品列表
                openGoodsList(cart, index) {
                        this.pickerModle = this.goodsData.find(item => item.goodsNo == cart.goodsNo);
                        this.$nextTick(() => {
                                this.$refs.Picker.open()
                        })
                        this._index = index;
                },

                //切换商品
                pickerConfirm(item) {
                        this.setCarts(item, this._index);
                },

                //计算含税总额 单价 数量
                countBillAmount(rangeValue, unitPrice) {
                        let amount = utils.toFixed(Number(rangeValue) * Number(unitPrice));
                        return amount;
                },

                //计算税额 总额 税率
                countTaxAmount(amount, rate) {
                        /* 计算方式一 */
                        let b = Number(amount) / (1 + Number(rate));
                        let a = Number(amount) - b;

                        /* 计算方式二 */
                        // let a = Number(amount) * Number(rate) / (1 + Number(rate));

                        return utils.toFixed(a);
                }

        }
}
</script>


<style lang="less">
// .range-cell {
//   .mint-cell-value {
//     flex: 2.5;
//     position: relative;
//   }
// }

.vue-inline-number {
        display: flex;

        .your-css-class {
                text-align: center;
        }

        .your-other-css-class {
                padding: 0px 10px;
                background: #f15454;
                color: #fff;
                border-radius: 3px;
                font-size: 22px;
        }
}
</style>


<style lang="less" scoped>
@import url(../../../../assets/less/base.less);

@keyframes an {
        0% {
                opacity: 0;
                transform: translateY(10px);
        }
        100% {
                opacity: 1;
                transform: translateY(0px);
        }
}
.add-eic-page {
        padding: 30 / @rem;
}

.add-goos-btn {
        float: right;
        text-decoration: none;
        color: #717171;
        padding: 20 / @rem;
        font-size: 30 / @rem;
}

.good {
        // width: 90%;
        animation: an 0.3s linear both;
        margin: 0 auto 10px;
        background-color: #f5f5f5;
        box-shadow: 0 0px 10px #c5c5c5;
        font-size: 30 / @rem;

        .row {
                background-color: #f15454;
                color: #fff;
        }

        .range {
                width: 100%;
        }

        .range-num {
                margin-right: 5px;
        }

        i {
                color: #fff;
                font-size: 40 / @rem;
                vertical-align: middle;
        }

        .good-info {
                display: flex;
        }

        .good-info-item {
                flex: 1;
                text-align: center;
                .good-row();
                padding: 0;
        }

        .flex2 {
                // flex: 1.6;
        }

        .good-row {
                min-height: 85 / @rem;
                padding: 0 20 / @rem;
                display: flex;
                align-items: center;
                line-height: 1;
                color: #717171;

                .title {
                        flex: 1;
                }
        }
}
</style>

