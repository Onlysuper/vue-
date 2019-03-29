<template>
        <div class="completionInfo-container">
                <view-radius>
                        <input-wrapper>
                                <mt-field label="注册省份" placeholder="请选择注册省份（必选）" v-readonly-ios :readonly="true" :value="resultAddr" :state="orgCodeState" @click.native="cityVisible = true">
                                        <div class="icon-arrow"></div>
                                </mt-field>
                                <mt-field label="注册地址" placeholder="请输入企业的详细地址（必填）" v-model="bussinessAddress" :state="bussinessAddressState"></mt-field>
                                <mt-field label="注册电话" placeholder="请输入企业座机号码（必填）" v-model="bussinessPhone" :state="bussinessPhoneState"></mt-field>
                                <!-- <mt-field label="开户银行" placeholder="请输入开户银行（必填）" v-model="bankCode" :state="bankCodeState"></mt-field> -->
                                <mt-field label="开户银行" placeholder="请选择开户银行（必选）" v-readonly-ios :readonly="true" :value="bank.value" :state="bankCodeState" @click.native="bankVisible = true">
                                        <div class="icon-arrow"></div>
                                </mt-field>
                                <mt-field label="开户支行" placeholder="请选择开户支行（必选）" v-readonly-ios :readonly="true" :value="bankBranch.branchName" :state="orgCodeState" @click.native="openBankBranch">
                                        <div class="icon-arrow"></div>
                                </mt-field>
                                <mt-field label="银行账号" placeholder="请输入银行账号（必填）" type="tel" v-model="bankAccountNo" :state="bankAccountNoState"></mt-field>
                                <mt-field label="注册资金" placeholder="请输入注册资金（必填）" type="number" v-model="registMoney" :state="registMoneyState">万</mt-field>
                                <mt-field label="月开票量" placeholder="请输入月开票量" type="number" v-model="mounthCount"></mt-field>
                        </input-wrapper>
                </view-radius>
                <p class="tip">注意：所填信息需与税盘中销方信息一致</p>
                <mt-button class="btn" size="large" type="danger" :disabled="false" @click="handleBtn">下一步</mt-button>

                <city-picher ref="CityPicher" v-model="cityVisible" :resultCallback="resultCallback"></city-picher>
                <bank-popup v-model="bankVisible" @bankresult="bankResult"></bank-popup>
                <bank-branch-popup v-model="bankBranchVisible" :bank="bank" @bankbranchresult="bankBranchResult"></bank-branch-popup>
                <bank-search-popup v-model="bankSearchVisible" :api="bankSearchApi" :queryKey="bankBranchQuery" @bankrsearchresult="bankRsearchResult"></bank-search-popup>
        </div>
</template>

<script>
import utils from "@src/common/utils.js";
import CityPicher from "@src/componentsApp/CityPicher";
import BankPopup from "@src/componentsApp/BankPopup";
import BankBranchPopup from "@src/componentsApp/BankBranchPopup";
import BankSearchPopup from "@src/componentsApp/BankSearchPopup";
import { queryCustomer, electronicComplete, getBankList } from "@src/apis";

export default {
        components: {
                CityPicher,
                BankPopup,
                BankBranchPopup,
                BankSearchPopup
        },
        data() {
                return {
                        cityVisible: false,
                        bankVisible: false,
                        bankBranchVisible: false,
                        bankSearchVisible: false,
                        bankSearchApi: getBankList,
                        bankBranchQuery: {},
                        bank: {},
                        bankBranch: {},
                        BankState: "success",

                        //城市联动的最终地址
                        resultAddr: "",

                        //城市联动的最终区县代码
                        orgCode: 0,
                        orgCodeState: "",
                        //地址
                        bussinessAddress: "",
                        bussinessAddressState: "",
                        //电话
                        bussinessPhone: "",
                        bussinessPhoneState: "",
                        //银行
                        bankCode: "",
                        bankCodeState: "",
                        //银行账号
                        bankAccountNo: "",
                        bankAccountNoState: "",
                        //注册资金
                        registMoney: "",
                        registMoneyState: "",
                        //月开票量
                        mounthCount: ""
                };
        },
        watch: {
                orgCode() {
                        this.orgCode != 0 && (this.orgCodeState = "");
                },
                bussinessAddress() {
                        this.bussinessAddress != "" && (this.bussinessAddressState = "");
                },
                bussinessPhone() {
                        this.bussinessPhone != "" && (this.bussinessPhoneState = "");
                },
                bankCode() {
                        this.bankCode != "" && (this.bankCodeState = "");
                },
                bankAccountNo(value) {
                        this.bankAccountNo != "" && (this.bankAccountNoState = "");
                },
                registMoney() {
                        this.registMoney != "" && (this.registMoneyState = "");
                }
        },
        created() {
                this.openId = utils.getOpenId();
                this.queryCustomer();
        },
        methods: {
                queryCustomer() {
                        queryCustomer()({
                                openId: this.openId
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        let { customer, customerInvoiceConfig, product } = data.data;
                                        if (customer instanceof Object) {
                                                this.resultCallback(this.$refs.CityPicher.findCity(customer.orgCode));
                                                this.bussinessAddress = customer.bussinessAddress;
                                                this.bussinessPhone = customer.bussinessPhone;
                                                this.registMoney = customer.registMoney;
                                        }
                                        if (customerInvoiceConfig instanceof Object) {
                                                this.bankResult({
                                                        value: customerInvoiceConfig.bankName,
                                                        key: customerInvoiceConfig.bankCode
                                                });
                                                this.bankRsearchResult({
                                                        branchName: customerInvoiceConfig.branchName,
                                                        unionCode: customerInvoiceConfig.unionCode
                                                });
                                                this.bankAccountNo = customerInvoiceConfig.bankAccountNo;
                                        }
                                        if (product instanceof Object) {
                                                this.mounthCount = product.elecBillnum;
                                        }
                                } else {
                                        this.Toast(data.message);
                                }

                        })
                },
                handleBtn() {
                        if (this.orgCode == 0) {
                                // this.orgCodeState = "error";
                                this.Toast("请选择地区！");
                                return;
                        }
                        if (this.bussinessAddress == "") {
                                // this.bussinessAddressState = "error";
                                this.Toast("注册地址不能为空！");
                                return;
                        }
                        if (this.bussinessPhone == "") {
                                // this.bussinessPhoneState = "error";
                                this.Toast("注册电话不能为空！");
                                return;
                        }
                        if (!this.bankBranch.branchName) {
                                // this.bankCodeState = "error";
                                this.Toast("请选择银行！");
                                return;
                        }
                        if (this.bankAccountNo == "") {
                                // this.bankAccountNoState = "error";
                                this.Toast("银行卡号不能为空！");
                                return;
                        }
                        if (this.registMoney == "") {
                                // this.registMoneyState = "error";
                                this.Toast("注册资金不能为空！");
                                return;
                        }
                        //提交开通电子发票信息
                        electronicComplete()({
                                openId: this.openId,
                                bussinessAddress: this.bussinessAddress,
                                orgCode: this.orgCode,
                                bussinessPhone: this.bussinessPhone,
                                mounthCount: this.mounthCount,
                                unionCode: this.bankBranch.unionCode,
                                branchName: this.bankBranch.branchName,
                                bankCode: this.bank.key,
                                bankName: this.bank.value,

                                bankAccountNo: this.bankAccountNo,
                                registMoney: this.registMoney
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.$router.replace({ path: "/customer/eicInTransitWait" });
                                } else {
                                        this.Toast(data.message);
                                }
                        });
                },
                resultCallback(data) {
                        this.resultAddr = data.resultAddr;
                        this.orgCode = data.resultCode;
                },
                //选择银行
                bankResult(bank) {
                        this.bank = bank;
                        this.bankBranch = {};
                        this.bankBranchQuery = {};
                },
                //打开支行
                openBankBranch() {
                        if (!this.bank.value) {
                                this.Toast("请选择银行");
                                return;
                        }
                        this.bankBranchVisible = true;
                },
                //支行查询信息
                bankBranchResult(bankBranch) {
                        this.bankSearchVisible = true;

                        this.bankBranchQuery = {
                                cityId: bankBranch.orgCode,
                                bankCode: bankBranch.bankCode
                        };
                },
                //支行信息
                bankRsearchResult(resultObj) {
                        this.bankSearchVisible = false;
                        this.bankBranchVisible = false;
                        this.bankBranch = resultObj;
                },

        }
};
</script>

<style lang="less" scoped>
@import url(../../../../assets/less/base.less);

.completionInfo-container {
        width: 96%;
        margin: 10px auto;
        .transformPage();

        .tip {
                color: red;
                padding: 20 / @rem;
        }

        .btn {
                margin-top: 50 / @rem;
        }
}
</style>

