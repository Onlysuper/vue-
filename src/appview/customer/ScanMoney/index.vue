<template>
        <div>
                <customer-header :entName="entName" :taxNo="taxNo"></customer-header>
                <br>
                <money-input class="input" :value="money" :focus="focus"></money-input>
                <Keyboard v-model="money" :fixed="true" @confirmPay="confirmPay" ref="Keyboard"></Keyboard>
        </div>
</template>

<script>

import CustomerHeader from "@src/components/CustomerHeader";
import Keyboard from "@src/components/Keyboard";
import MoneyInput from "@src/components/Keyboard/MoneyInput";
import utils from "@src/common/utils.js";
import { getCustomerInfo, getPaySigninfo, submitPayOrder } from "@src/apis";
import { getWxSign } from "@src/apis/getSign";
import md5 from "js-md5";

export default {
        components: { CustomerHeader, Keyboard, MoneyInput },
        data() {
                return {
                        entName: "",
                        taxNo: "",
                        money: "",
                        randomCode: "",
                        focus: true,
                };
        },
        created() {
                let openId = utils.getOpenId();
                this.openId = openId;
                this.getInfo(openId);

                //获取注入微信签名config
                getWxSign("wx_customer")({ url: window.location.href.split("#")[0] });
        },
        mounted() {
                this.$refs.Keyboard.open();
        },
        methods: {
                getInfo(openId) {
                        getCustomerInfo(openId)({
                                token: utils.storage.getStorage("token")
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.entName = data.data.entName;
                                        this.taxNo = data.data.taxNo;
                                        this.randomCode = data.data.randomCode;
                                        this.customerNo = data.data.customerNo;
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                confirmPay() {

                        if (!this.money) {
                                this.Toast("未输入收款金额！");
                                return;
                        }

                        if (!this.randomCode) {
                                this.Toast("未获取到授权码信息！");
                                return;
                        }

                        if (!this.customerNo) {
                                this.Toast("未获取到商户编号！");
                                return;
                        }

                        this.token = localStorage.getItem("token") || "";
                        if (!this.token) {
                                this.Toast("登录信息有误！");
                                return;
                        }

                        getPaySigninfo()({ token: "11a790a14b8a351eb75946651de2cc2e" }).then(data => {
                                if (data.resultCode == "0") {
                                        if (data.data instanceof Object) {
                                                this.companyNo = data.data.companyNo;
                                                this.signKey = data.data.signKey;
                                                if (this.companyNo && this.signKey) this.scan()
                                                else this.Toast("签名有误！");
                                        }
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        })
                },
                scan() {
                        if (utils.isWeiXin) {
                                jWeixin.scanQRCode({
                                        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
                                        scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
                                        success: res => {
                                                if (res.errMsg == "scanQRCode:ok") {
                                                        // var resultStr = res.resultStr; // 当needResult 为 1 时，扫码返回的结果

                                                        this.Indicator.open({
                                                                text: "请等待",
                                                                spinnerType: 'fading-circle'
                                                        });

                                                        /*
                                                        * 提交参数
                                                        * amount	string	是	交易金额单位分
                                                        * authCode	string	是	授权码
                                                        * token	string	是	
                                                        * companyNo	string	是	机构编号，调用/sign/info获得
                                                        * customerNo	string	是	商户编号，调用/customer/queryDetail获得
                                                        * qrcodeAuthCode	string	是	开票码，/customer/queryDetail获得
                                                        * service	string	是	trade.microPay
                                                        * signData	string	是	签名
                                                        */

                                                        //注意参数排序
                                                        let params = {}
                                                        params["amount"] = utils.accMul(this.money, 100);
                                                        params["authCode"] = res.resultStr;
                                                        params["companyNo"] = this.companyNo;
                                                        params["customerNo"] = this.customerNo;
                                                        params["qrcodeAuthCode"] = this.randomCode;
                                                        params["service"] = "trade.microPay";
                                                        params["token"] = this.token;

                                                        //请求参数：                                amount=1，authCode=authCode，companyNo=10099999，customerNo=20028207，qrcodeAuthCode=049504ede，service=trade.microPay，token=777,signKey=123。
                                                        //按照自然升序排序，做url拼接后签名串str1应为：amount=1&authCode=authCode&companyNo=10099999&customerNo=20028207&qrcodeAuthCode=049504ede&service=trade.microPay&token=777。
                                                        //在结尾拼接signKey后，签名串str2应为：       amount=1&authCode=authCode&companyNo=10099999&customerNo=20028207&qrcodeAuthCode=049504ede&service=trade.microPay&token=777&key=123。
                                                        //将str2做md5,结果str3为：0b2aa9b63708e7d9af90860c2ec9bf74。 
                                                        //将str3转大写，最终签名数据signData为：0B2AA9B63708E7D9AF90860C2EC9BF74。
                                                        params["signData"] = md5(this.getUrlStr(params)).toUpperCase();

                                                        submitPayOrder()(params).then(data => {
                                                                this.Indicator.close();
                                                                if (data.resultCode == "0") {
                                                                        this.$router.push({ path: "/customer/payOrder" });
                                                                } else {
                                                                        this.Toast(data.resultMsg);
                                                                }
                                                        })

                                                } else {
                                                        this.Toast("扫码失败！请重试...");
                                                }
                                        }
                                });
                        } else {
                                this.MessageBox({
                                        title: "提示",
                                        message: "请在微信中使用"
                                });
                        }
                },
                getUrlStr(params) {
                        let str = "";
                        for (let key in params) str += `${key}=${params[key]}&`
                        str += `key=${this.signKey}`;
                        return str;
                },
        }
}
</script>

<style lang="less" scoped>
@import url("../../../assets/less/base.less");
.input {
        width: 80%;
        margin: 0 auto;
}
</style>
