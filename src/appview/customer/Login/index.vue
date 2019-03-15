<template>
        <div class="login">
                <div class="login-logo">
                        <img :src='require("@src/assets/images/logo.png")' alt="">
                </div>
                <div class="login-form">
                        <div class="form-control border-bottom-1px">
                                <input ref="phone" @input="isPhoneReg($event)" v-wx-blur type="tel" maxlength="11" placeholder="您输入注册后的手机号">
                        </div>
                        <div class="form-control border-bottom-1px">
                                <input ref="code" @input="isCodeReg($event)" v-wx-blur type="tel" maxlength="6" value="" placeholder="请输入验证码">
                                <TimerBtn ref="TimerBtn" :text="'发送验证码'" :time="60" :cb="sendCode"></TimerBtn>
                        </div>
                </div>
                <div class="btns">
                        <Buttonr :className="'btn'" :type="'confirm-btn'" :disabled="isPhone || isCode" :click="submitGetCustomerList">登录</Buttonr>
                        <Buttonr :type="'register-btn'" :click="register">立即注册</Buttonr>
                </div>
                <!--<mt-button type="danger">danger</mt-button>-->
        </div>
</template>

<script>
import validator from "@src/common/validator.js";
import utils from "@src/common/utils.js";
import TimerBtn from "@src/components/TimerBtn";
import Buttonr from "@src/components/Button";
import {
        getVerificationCode,
        getCustomerList,
        getCustomerQrcodeList,
        login
} from "@src/apis";

export default {
        data() {
                return {
                        isPhone: true,
                        isCode: true
                };
        },
        props: {},
        created() {
                let openId = utils.getOpenId();
                this.openId = openId;
        },
        mounted() { },
        components: {
                TimerBtn,
                Buttonr
        },
        methods: {
                register() {
                        this.$router.push({ path: "/customer/register" });
                        //       window.location.href = "https://weidian.com/item.html?itemID=2257806570";
                },
                isPhoneReg(e) {
                        let value = e.target.value.trim();
                        this.isPhone = value ? !validator.phoneNumber.reg.test(value) : true;
                },
                isCodeReg(e) {
                        let value = e.target.value.trim();
                        this.isCode = value ? !validator.verificationCode.reg.test(value) : true;
                },
                sendCode() {
                        if (this.isPhone) {
                                $(this.$refs.phone).focus();
                                return;
                        }
                        let phone = this.$refs.phone.value.trim();
                        getVerificationCode(phone)({ type: "login" }).then(data => {
                                this.$refs.TimerBtn.disabled = true;
                                this.$refs.TimerBtn.timer();
                                if (data.resultCode == "0") {
                                        this.Toast("验证码发送成功！");
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                getSelectList(dataList, key) {
                        let showList = [];
                        for (let i = 0; i < dataList.length; i++) {
                                let entName = dataList[i][key];
                                showList.push({ entName: entName });
                        }
                        return showList;
                },
                submitGetCustomerList() {
                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                        getCustomerList(this.$refs.phone.value.trim())({
                                verificationCode: this.$refs.code.value.trim()
                        })
                                .then(data => {
                                        return new Promise((resolve, reject) => {
                                                if (data.resultCode == "0") {
                                                        let { token, customerList } = data.data;
                                                        let custoemrNo;
                                                        this.token = token;
                                                        //如果只有一个商户信息跳过选择
                                                        if (customerList.length == 1) {
                                                                custoemrNo = customerList[0].customerNo;
                                                                resolve(custoemrNo);
                                                        } else if (customerList.length > 1) {
                                                                $.dialog.select({
                                                                        title: "请选择商户",
                                                                        content: this.getSelectList(customerList, "entName"),
                                                                        changeEnd: function () {
                                                                                custoemrNo = customerList[$(this).index()].customerNo;
                                                                                resolve(custoemrNo);
                                                                        }
                                                                });
                                                        } else {
                                                                this.Toast("请先注册");
                                                        }
                                                } else {
                                                        this.Toast(data.resultMsg);
                                                }
                                        });
                                })
                                .then(custoemrNo => {
                                        return new Promise((resolve, reject) => {
                                                getCustomerQrcodeList(custoemrNo)({
                                                        token: this.token
                                                }).then(data => {
                                                        if (data.resultCode == "0") {
                                                                let qrcodeList = data.data;
                                                                let randomCode;
                                                                if (qrcodeList.length == 1) {
                                                                        randomCode = qrcodeList[0].randomCode;
                                                                        resolve(randomCode);
                                                                } else if (qrcodeList.length > 1) {
                                                                        $.dialog.select({
                                                                                title: "请选择二维码",
                                                                                content: this.getSelectList(qrcodeList, "seriaNumber"),
                                                                                changeEnd: function () {
                                                                                        randomCode = qrcodeList[$(this).index()].randomCode;
                                                                                        resolve(randomCode);
                                                                                }
                                                                        });
                                                                } else {
                                                                        this.Toast("未查到序列号");
                                                                }
                                                        } else {
                                                                this.Toast(data.resultMsg);
                                                        }
                                                });
                                        });
                                })
                                .then(randomCode => {
                                        login(randomCode)({
                                                openId: this.openId,
                                                token: this.token
                                        }).then(data => {
                                                if (data.resultCode == "0") {
                                                        utils.storage.saveStorage("token", this.token);
                                                        let redirect = decodeURIComponent(
                                                                this.$route.query.redirect || "/"
                                                        );
                                                        this.$router.replace({ path: redirect });
                                                } else {
                                                        this.Toast(data.resultMsg);
                                                }
                                        });
                                });
                }
        }
};
</script>

<style lang="less">
@import url(../../../assets/less/base.less);
.login {
        .transformPage();
        padding: 120 / @rem 60 / @rem;
        .login-logo {
                text-align: center;
                img {
                        height: 230 / @rem;
                }
        }
        .login-form {
                margin-top: 87 / @rem;
                .form-control {
                        height: 100 / @rem;
                        display: flex;
                        font-size: 32 / @rem;
                        input {
                                width: 100%;
                                height: 100%;
                                padding: 0 20 / @rem;
                                flex: 1;
                        }
                }
        }

        .btns {
                margin-top: 54 / @rem;
                .btn {
                        margin-bottom: 30 / @rem;
                }
        }
}
</style>
