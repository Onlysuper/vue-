<template>
        <div class="invoice-addgood-container">
                <input-wrapper>
                        <mt-field label="商品编号" v-if="submitType == 'UPDATE'" placeholder="请输入商品编号" v-model="goodsNo" :disabled="true"></mt-field>
                        <mt-field label="商品名称" @click.native="$refs.search.open" placeholder="输入关键字查询商品" v-model="goodName" v-readonly-ios :readonly="true"></mt-field>
                        <mt-field label="标准名称" placeholder="请输入标准名称" v-model="goodsType" :disabled="false"></mt-field>
                        <mt-field label="统一编码" placeholder="请输入统一编码" v-model="unionNo" :disabled="false"></mt-field>
                        <mt-field label="税率" placeholder="请选择税率（必填）" v-model="taxVal.name" @click.native="$refs.taxPicker.open" v-readonly-ios :readonly="true">
                                <div class="icon-arrow"></div>
                        </mt-field>
                        <mt-field label="规格" placeholder="请输入规格（选填）" v-model="model"></mt-field>
                        <mt-field label="单位" placeholder="请输入单位（选填）" v-model="unit"></mt-field>
                        <mt-field label="含税单价" placeholder="请输入含税单价（选填）" type="tel" v-model="unitPrice"></mt-field>
                        <mt-field label="免税类型" placeholder="请选择免税类型（必填）" v-model="taxTypeVal.name" @click.native="$refs.taxTypePicker.open" v-readonly-ios :readonly="true">
                                <div class="icon-arrow"></div>
                        </mt-field>
                        <mt-field label="优惠政策" placeholder="请选择优惠政策（必填）" v-model="discVal.name" @click.native="$refs.discPicker.open" v-readonly-ios :readonly="true">
                                <div class="icon-arrow"></div>
                        </mt-field>
                </input-wrapper>
                <div class="btn">
                        <mt-button size="large" type="danger" :disabled="false" @click="submitBtn">保存</mt-button>
                </div>
                <!--商品编码-->
                <search-modle ref="search" v-model="goodName" @change="callbackGoods"></search-modle>
                <!--税率-->
                <picker v-model="taxVal" ref="taxPicker" :slotsActions="taxJson" @confirm="taxConfirm"></picker>
                <!--免税类型-->
                <picker v-model="taxTypeVal" ref="taxTypePicker" :slotsActions="taxTypeJson" @confirm="taxTypeConfirm"></picker>
                <!--优惠政策-->
                <picker v-model="discVal" ref="discPicker" :slotsActions="discJson" @confirm="discConfirm"></picker>
        </div>
</template>

<script>
import utils from "@src/common/utils.js";
import { electronicAddGoods } from "@src/apis";
import Picker from "@src/componentsApp/Picker";
import SearchModle from "@src/componentsApp/SearchModle";
import taxJson from "@src/data/tax.json";
import taxTypeJson from "@src/data/enjoy.json";
import discountJson from "@src/data/discount.json";

export default {
        components: {
                Picker,
                SearchModle
        },
        data() {
                return {
                        //商品名称
                        goodsNo: "",
                        goodName: "",
                        unionNo: "",
                        goodsType: "",
                        //规格
                        model: "",
                        //单位
                        unit: "",
                        //含税单价
                        unitPrice: "",

                        taxVal: {},
                        taxJson: taxJson,

                        taxTypeVal: taxTypeJson[0],
                        taxTypeJson: taxTypeJson,

                        discVal: discountJson[0],
                        discJson: discountJson
                };
        },
        created() {
                //存起提交openId
                this.openId = utils.getOpenId();
                this.goodsNo = this.$route.query["goodsNo"];
                this.submitType = this.$route.query["submitType"] || "ADD";
                if (this.submitType == "UPDATE") this.echoForm(this.$route.query);
        },
        methods: {
                echoForm(data) {
                        this.goodsNo = data["goodsNo"];
                        this.goodName = data["goodsName"];
                        this.unionNo = data["unionNo"];
                        this.goodsType = data["goodsType"];
                        this.model = data["model"];
                        this.unit = data["unit"];
                        this.unitPrice = data["unitPrice"];
                        this.taxVal = this.utils.queryJsonVal(taxJson, data["taxRate"]);
                        this.taxTypeVal = this.utils.queryJsonVal(taxTypeJson, data["enjoyDiscount"]);
                        this.discVal = this.utils.queryJsonVal(discountJson, data["discountType"]);
                },
                callbackGoods(item) {
                        this.goodsType = item.name;
                        this.unionNo = item.code;
                        this.taxVal = this.utils.queryJsonVal(taxJson, item.rate);
                },
                taxConfirm(result) {
                        this.taxVal = result;
                },
                taxTypeConfirm(result) {
                        this.taxTypeVal = result;
                },
                discConfirm(result) {
                        this.discVal = result;
                },
                //保存
                submitBtn() {
                        //基础数据
                        let sendData = {
                                type: this.submitType,
                                openId: this.openId,
                                model: this.model, //规格型号
                                unit: this.unit, //单位
                                unitPrice: this.unitPrice, //含税单价
                                taxRate: this.taxVal.code, //税率
                                discountType: this.discVal.code, //是否享受优惠
                                enjoyDiscount: this.taxTypeVal.code, //折扣类型
                                goodsName: this.goodName, //商品名称
                                unionNo: this.unionNo, //统一商品编码
                                goodsType: this.goodsType
                        };

                        if (this.submitType == "UPDATE") {
                                sendData["goodsNo"] = this.goodsNo;
                        }

                        if (sendData.unitPrice && sendData.unitPrice <= 0) {
                                this.MessageBox.alert("金额必须大于0");
                                return;
                        }
                        //请求接口保存数据
                        electronicAddGoods()(sendData).then(data => {
                                if (data.resultCode == "0") {
                                        let instance = this.Toast({
                                                message: this.submitType == "UPDATE" ? "修改成功" : "添加成功",
                                                iconClass: "mintui mintui-success"
                                        });
                                        setTimeout(() => {
                                                instance.close();
                                                this.$router.back();
                                        }, 1000);
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
        }
};
</script>


<style lang="less" scoped>
@import url(../../../../assets/less/base.less);

.invoice-addgood-container {
        .transformPage();

        .btn {
                // width: 630/@rem;
                margin: 60 / @rem 50 / @rem;
                button {
                        margin-top: 50 / @rem;
                }
        }
}
</style>
