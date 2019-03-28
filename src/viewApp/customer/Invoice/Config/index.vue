<template>
        <div class="invoice-goods-config-container">
                <tab-router-link :flexd="true">
                        <router-link :to="{ path: '/customer/eicGoods'}" replace>
                                <i class="icon icon-bill-goods"></i>商品
                        </router-link>
                        <router-link :to="{ path: '/customer/eicConfig'}" replace>
                                <i class="icon icon-bill-config"></i>配置
                        </router-link>
                </tab-router-link>
                <input-wrapper>
                        <mt-field label="开票地区" placeholder="请选择开票地区（必填）" @click.native="$refs.picker.open" v-readonly-ios :readonly="true" :value="invoiceLocation.name">
                                <i class="icon-arrow"></i>
                        </mt-field>
                        <mt-field label="设备类型" placeholder="请选择设备类型（必填）" @click.native="deviceTypeVisible = true" v-readonly-ios :readonly="true" :value="deviceType">
                                <i class="icon-arrow"></i>
                        </mt-field>
                        <mt-field label="征税方式" placeholder="请选择征税方式（必填）" @click.native="taxTypeVisible = true" v-readonly-ios :readonly="true" :value="taxType">
                                <i class="icon-arrow"></i>
                        </mt-field>
                        <mt-field label="税盘编号" placeholder="请输入税盘编号（必填）" v-model="deviceNo"></mt-field>
                        <mt-field label="开票人" placeholder="请输入开票人（必填）" v-model="invoiceMan"></mt-field>
                        <mt-field label="收款人" placeholder="请输入收款人（必填）" v-model="receiveMan"></mt-field>
                        <mt-field label="复核人" placeholder="请输入复合人" v-model="checkMan"></mt-field>
                </input-wrapper>
                <div class="btn">
                        <mt-button size="large" type="danger" :disabled="false" @click="submitBtn">保存</mt-button>
                </div>
                <mt-actionsheet :actions="deviceTypeActions" v-model="deviceTypeVisible" cancelText="取消" :closeOnClickModal="true"></mt-actionsheet>
                <mt-actionsheet :actions="taxTypeActions" v-model="taxTypeVisible" cancelText="取消" :closeOnClickModal="true"></mt-actionsheet>
                <picker v-model="invoiceLocation" ref="picker" :slotsActions="actions" @confirm="confirm"></picker>
        </div>
</template>

<script>
import utils from "@src/common/utils.js";
import { electronicAddInvoiceConfig, electronicQueryConfig } from "@src/apis";
import Picker from "@src/componentsApp/Picker";
import actions from "@src/data/billCity.json";
import TabRouterLink from "@src/componentsApp/TabRouterLink";

export default {
        components: { Picker, TabRouterLink },
        data() {
                return {
                        pageShow: false,
                        deviceType: "",
                        deviceTypeState: "",
                        deviceTypeVisible: false,
                        deviceTypeActions: [
                                {
                                        name: "税控盘",
                                        val: "BW_PAN",
                                        method: a => {
                                                this.deviceType = a.name;
                                        }
                                },
                                {
                                        name: "金税盘",
                                        val: "HX_PAN",
                                        method: a => {
                                                this.deviceType = a.name;
                                        }
                                }
                        ],
                        taxType: "",
                        taxTypeVisible: false,
                        taxTypeActions: [
                                {
                                        name: "普通征税",
                                        val: "0",
                                        method: a => {
                                                this.taxType = a.name;
                                        }
                                },
                                // {
                                //     name: "减按征税",
                                //     val: "1",
                                //     method: a => {
                                //         this.taxType = a.name;
                                //     }
                                // },
                                {
                                        name: "差额征税",
                                        val: "2",
                                        method: a => {
                                                this.taxType = a.name;
                                        }
                                }
                        ],
                        actions: actions,
                        invoiceLocation: {},
                        deviceNo: "",
                        deviceNoState: "",
                        invoiceMan: "",
                        invoiceManState: "",
                        receiveMan: "",
                        receiveManState: "",
                        checkMan: ""
                };
        },
        created() {
                this.openId = utils.getOpenId();
                this.getConfig();
        },
        methods: {
                //找到要提交的设备类型数据
                findDeviceType(deviceType) {
                        let obj = {};
                        this.deviceTypeActions.forEach(item => {
                                if (item.name == deviceType || item.val == deviceType) {
                                        obj = item;
                                }
                        });
                        return obj;
                },

                // 查找税收方式
                findTaxType(taxType) {
                        let obj = {};
                        this.taxTypeActions.forEach(item => {
                                if (item.name == taxType || item.val == taxType) {
                                        obj = item;
                                }
                        });
                        return obj;
                },
                submitBtn() {
                        if (!this.invoiceLocation.name) {
                                this.Toast("请选择开票地区！");
                                return;
                        }
                        if (this.deviceType == "") {
                                this.Toast("请选择设备类型！");
                                return;
                        }
                        if (this.deviceNo == "") {
                                this.Toast("税盘编号不能为空！");
                                return;
                        }
                        if (this.invoiceMan == "") {
                                this.Toast("开票人不能为空！");
                                return;
                        }
                        if (this.receiveMan == "") {
                                this.Toast("收款人不能为空！");
                                return;
                        }

                        let sendData = {
                                openId: this.openId, //	string	是	微信openId
                                invoiceLocation: this.invoiceLocation.name,
                                deviceType: this.findDeviceType(this.deviceType).val, //	string	是	设备类型
                                taxType: this.findTaxType(this.taxType).val,
                                deviceNo: this.deviceNo, //	string	是	设备编号
                                receiveMan: this.receiveMan, //	string	否	收款人
                                invoiceMan: this.invoiceMan, //	string	否	开票人
                                checkMan: this.checkMan //	string	否	复核人
                        };
                        electronicAddInvoiceConfig()(sendData).then(data => {
                                if (data.resultCode == "0") {
                                        this.Toast(data.resultMsg);
                                        //保存成功后储存用户填写的配置信息
                                        // localStorage.setItem("config", JSON.stringify(sendData));
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                getConfig() {
                        //获取商户电票配置信息
                        electronicQueryConfig()({
                                openId: this.openId
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.pageShow = true;
                                        if (utils.isType(data.data, "Object")) {
                                                this.invoiceLocation = this.actions.find(item => item.name == data.data.invoiceLocation) || {};
                                                this.deviceType = this.findDeviceType(data.data.deviceType).name;
                                                this.taxType = this.findTaxType(data.data.taxType).name;
                                                this.deviceNo = data.data.deviceNo;
                                                this.receiveMan = data.data.receiveMan;
                                                this.invoiceMan = data.data.invoiceMan;
                                                this.checkMan = data.data.checkMan;
                                        }
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                confirm(res) {
                        this.invoiceLocation = res;
                }
        }
};
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);

.invoice-goods-config-container {
        margin-top: 120 / @rem;
        .icon {
                vertical-align: middle;
                margin-right: 20 / @rem;
                font-size: 45 / @rem;
        }
        .btn {
                // width: 630/@rem;
                margin: 100 / @rem 50 / @rem;
        }
}
</style>
