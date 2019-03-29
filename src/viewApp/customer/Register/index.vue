<template>
        <div class="register-page">
                <!-- <div class="login-logo">
                        <img :src='require("@src/assets/images/logo.png")' alt="">
                </div> -->
                <div class="bg"></div>
                <div v-show="setup == '1'">
                        <div class="login-form">
                                <div class="form-control border-bottom-1px">
                                        <input v-model="params.entName" v-wx-blur type="text" placeholder="请输入企业名称" maxlength="50">
                                </div>
                                <div class="form-control border-bottom-1px">
                                        <input v-model="params.taxNo" v-wx-blur type="text" placeholder="请输入企业税号" maxlength="20">
                                </div>
                                <div class="form-control border-bottom-1px">
                                        <input v-model="params.bussinessAddress" v-wx-blur type="text" placeholder="请输入联系地址" maxlength="100">
                                </div>
                                <div class="form-control border-bottom-1px">
                                        <input v-model="params.name" type="text" v-wx-blur placeholder="请输入联系人姓名" maxlength="50">
                                </div>
                                <div class="form-control border-bottom-1px">
                                        <input v-model="params.bussinessPhone" v-wx-blur type="text" placeholder="请输入座机电话" maxlength="20">
                                </div>
                        </div>
                        <br />
                        <div class="uploads">
                                <upload-view class="item" :api="uploadApi" :upType="'BUSSINESS_LICENSE'" :dataKey="'fastBussinessId'" @result="resultMediaId" ref="fastBussinessId" :label="'营业执照'"></upload-view>
                                <upload-view class="item" :api="uploadApi" :upType="'PLACE_IMG'" :dataKey="'fastHeaderId'" @result="resultMediaId" ref="fastHeaderId" :label="'门头照'"></upload-view>
                                <upload-view class="item" :api="uploadApi" :upType="'CASH_SPACE_IMG'" :dataKey="'fastCashId'" @result="resultMediaId" ref="fastCashId" :label="'收银台照'" desc="收银台上有清晰水牌，且有收银员在岗"></upload-view>
                        </div>
                        <div class="confirm">
                                <Buttonr :type="'confirm-btn'" :click="next">下一步</Buttonr>
                        </div>
                </div>

                <!-- 下一步 -->
                <div v-show="setup == '2'">
                        <div class="login-form">
                                <div class="form-control border-bottom-1px">
                                        <input ref="phone" v-model="params.phone" v-wx-blur type="tel" maxlength="11" placeholder="请输入手机号">
                                </div>
                                <div class="form-control border-bottom-1px">
                                        <input v-model="params.verificationCode" v-wx-blur type="tel" maxlength="6" placeholder="请输入验证码">
                                        <TimerBtn ref="TimerBtn" :time="60" :cb="sendCode" :text="'发送验证码'"></TimerBtn>
                                </div>
                        </div>
                        <div class="confirm">
                                <Buttonr :type="'confirm-btn'" :click="confirm">注册</Buttonr>
                        </div>
                </div>
        </div>
</template>

<script>
import validator from "@src/common/validator.js";
import utils from "@src/common/utils.js";
import TimerBtn from "@src/componentsApp/TimerBtn";
import Buttonr from "@src/componentsApp/Button";
import { getVerificationCode, registCustomer, upload } from "@src/apis";
import UploadView from "@src/componentsApp/Upload/UploadView";

export default {
        data() {
                return {
                        params: {},
                        uploadApi: upload,
                        imgs: {},
                        openId: utils.getOpenId(),
                        setup: "1",
                };
        },
        components: {
                TimerBtn,
                Buttonr,
                UploadView
        },

        methods: {
                next() {

                        if (!this.params.entName) {
                                this.Toast("请输入企业名称");
                                return;
                        }

                        if (!validator.taxCode.reg.test(this.params.taxNo)) {
                                this.Toast("请输入正确的企业税号");
                                return;
                        }

                        if (!this.params.bussinessAddress) {
                                this.Toast("请输入联系地址");
                                return;
                        }

                        if (!this.params.name) {
                                this.Toast("请输入联系人姓名");
                                return;
                        }

                        if (!this.params.bussinessPhone) {
                                this.Toast("请输入座机电话");
                                return;
                        }

                        if (!this.imgs["fastBussinessId"]) {
                                this.Toast("请上传营业执照片！");
                                return;
                        }

                        if (!this.imgs["fastHeaderId"]) {
                                this.Toast("请上传门头照片！");
                                return;
                        }

                        if (!this.imgs["fastCashId"]) {
                                this.Toast("请上传收银台照片！");
                                return;
                        }

                        this.setup = "2";
                        utils.historyReplaceState({ s: "1" }, "push");
                        window.onpopstate = () => {
                                this.setup = "1";
                        }
                },
                sendCode() {
                        if (!validator.phoneNumber.reg.test(this.params.phone)) {
                                this.Toast("请输入正确的手机号");
                                $(this.$refs.phone).focus();
                                return;
                        }
                        getVerificationCode(this.params.phone)({
                                type: "regist"
                        }).then(data => {
                                this.$refs.TimerBtn.disabled = true;
                                this.$refs.TimerBtn.timer();
                                if (data.resultCode == "0") {
                                        this.Toast("验证码发送成功！");
                                } else {
                                        this.Toast(data.message);
                                }
                        });
                },
                //图片上传结果
                resultMediaId(dataKey, mediaId) {
                        this.imgs[dataKey] = mediaId;
                        console.log(dataKey, mediaId);
                },
                confirm() {

                        if (!validator.phoneNumber.reg.test(this.params.phone)) {
                                this.Toast("请输入正确的手机号");
                                return;
                        }

                        if (!validator.verificationCode.reg.test(this.params.verificationCode)) {
                                this.Toast("请输入6位数的验证码");
                                return;
                        }
                        // 税号转大写
                        this.params.taxNo = this.params.taxNo.toUpperCase();
                        registCustomer()({
                                ...this.params,
                                ...this.imgs,
                                openId: this.openId
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        utils.storage.saveStorage("token", data.data.token);
                                        document.body.scrollTop = document.documentElement.scrollTop = 0;
                                        //禁用提交按钮
                                        this.isPhone = true;
                                        this.$router.push("/customer/registerSuccess");

                                } else {
                                        this.Toast(data.message);
                                }
                        });
                }
        }
};
</script>

<style lang="less">
@import url(../../../assets/less/base.less);

.register-page {
        .transformPage();
        padding: 0 / @rem 50 / @rem;
        .bg {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                z-index: -10;
                background: #fff;
        }
        .login-logo {
                text-align: center;
                img {
                        height: 230 / @rem;
                }
        }
        .login-form {
                margin-top: 50 / @rem;
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
                        .btn {
                                width: 200 / @rem;
                                height: 60 / @rem;
                                line-height: 60 / @rem;
                                text-align: center;
                                border: 1px solid #b0b0b0;
                                border-radius: 60 / @rem;
                                margin-top: 20 / @rem;
                                color: #6f6f6f;
                        }
                }
                .isPhoneClass {
                        border: 1px solid #ff971e;
                }
        }

        .uploads {
                padding: 20 / @rem;
                box-sizing: border-box;
                display: flex;
                flex-wrap: wrap;
                .item {
                        // float: left;
                        width: 33%;
                        // flex: 1;
                }
        }
        .confirm {
                margin: 57 / @rem 0;
        }
}
</style>
