<template>
        <div class="invoice-addgood-container">
                <input-wrapper class="input-group">
                        <mt-field label="企业名称:" placeholder="请输入企业名称（必填）" v-model="enterpriseName"></mt-field>
                        <mt-field label="企业税号:" placeholder="请输入企业税号" v-model="taxNo"></mt-field>
                        <mt-field label="注册地址:" placeholder="请输入注册地址" v-model="enterpriseAddress"></mt-field>
                        <mt-field label="公司电话:" placeholder="请输入公司电话" v-model="enterprisePhone"></mt-field>
                        <mt-field label="开户银行:" placeholder="请输入开户银行" v-model="bankAddress"></mt-field>
                        <mt-field label="银行账号:" placeholder="请输入银行账号" v-model="bankAccount" type="tel"></mt-field>
                </input-wrapper>
                <div class="btn">
                        <mt-button size="large" type="danger" @click="submit">保存名片</mt-button>
                </div>
        </div>
</template>

<script>
import { addEntCard, editEntCard } from "@src/apis/consumer";
import utils from "@src/common/utils.js";

export default {
        data() {
                return {
                        enterpriseName: "",
                        taxNo: "",
                        enterpriseAddress: "",
                        enterprisePhone: "",
                        bankAddress: "",
                        bankAccount: "",
                };
        },
        created() {
                this.openId = utils.getOpenId();
                if (this.$route.query["submitType"]) {
                        utils.setDocumentTitle("修改名片");
                        //回显信息
                        this.routerQueryCard();
                }
        },
        methods: {
                submit() {
                        let sendData = {
                                openId: this.openId,
                                enterpriseName: this.enterpriseName,
                                taxNo: this.taxNo,
                                enterpriseAddress: this.enterpriseAddress,
                                enterprisePhone: this.enterprisePhone,
                                bankAddress: this.bankAddress,
                                bankAccount: this.bankAccount,
                                sourceFrom: "LPT"
                        };

                        if (!sendData.enterpriseName) {
                                this.Toast("请输入企业名称！");
                                return;
                        }


                        if (this.$route.query["submitType"] == "UPDATE") {
                                //调用修改接口
                                sendData["cardId"] = this.$route.query["cardId"];
                                editEntCard()(sendData).then(data => {
                                        if (data.resultCode == "0") {
                                                let instance = this.Toast({
                                                        message: "修改成功",
                                                        iconClass: "mintui mintui-success"
                                                });
                                                setTimeout(() => {
                                                        instance.close();
                                                        this.$router.replace({ path: "/consumer/mycard" });
                                                }, 1000);
                                        } else {
                                                this.Toast(data.message);
                                        }
                                });
                        } else {
                                //调用添加接口
                                addEntCard()(sendData).then(data => {
                                        if (data.resultCode == "0") {
                                                let instance = this.Toast({
                                                        message: "添加成功",
                                                        iconClass: "mintui mintui-success"
                                                });
                                                setTimeout(() => {
                                                        instance.close();
                                                        this.$router.replace({ path: "/consumer/mycard" });
                                                }, 1000);
                                        } else {
                                                this.Toast(data.message);
                                        }
                                });
                        }
                },
                routerQueryCard() {
                        this.enterpriseName = this.$route.query["enterpriseName"];
                        this.taxNo = this.$route.query["taxNo"];
                        this.enterpriseAddress = this.$route.query["enterpriseAddress"];
                        this.enterprisePhone = this.$route.query["enterprisePhone"];
                        this.bankAddress = this.$route.query["bankAddress"];
                        this.bankAccount = this.$route.query["bankAccount"];
                }
        }
};
</script>


<style lang="less" scoped>
@import url(../../../assets/less/base.less);

.invoice-addgood-container {
        .transformPage();
        .input-group {
                margin-top: 25 / @rem;
        }

        .btn {
                width: 95%;
                margin: 50 / @rem auto;
                button {
                        margin-top: 50 / @rem;
                }
        }
}
</style>
