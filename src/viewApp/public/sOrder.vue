<template>
        <div class="loan">
                <img class="banner" :src="require('@src/assets/images/lakala.png')" alt="">
                <div class="padding">
                        <view-radius>
                                <input-wrapper>
                                        <mt-field label="联系人" v-model="enterpriseName" placeholder="请输入联系人" :attr="{maxLength:50}"></mt-field>
                                        <mt-field label="联系电话" v-model="phoneNo" placeholder="请输入联系电话" :attr="{maxLength:11}"></mt-field>
                                        <mt-field label="邮寄地区" v-model="content.resultAddr" @click.native="cityVisible = true" placeholder="请选择地区" :readonly="true" v-readonly-ios>
                                                <i class="icon-arrow"></i>
                                        </mt-field>
                                        <mt-field label="详细地址" v-model="addr" placeholder="请输详细地址" :attr="{maxLength:100}"></mt-field>
                                </input-wrapper>
                        </view-radius>
                        <p class="tip">使用说明：信用卡刷卡10000元，秒到9940元。</p>
                        <mt-button class="submit" size="large" type="danger" :disabled="submitBtn" @click="submit">点击购买</mt-button>
                </div>
                <city-picher ref="CityPicher" v-model="cityVisible" :resultCallback="resultCallback"></city-picher>
                <div class="loan-success page" v-if="false">
                        <p>感谢您的信任！</p>
                        <p>我们将在1-3天与您联系</p>
                </div>
        </div>
</template>

<script>
import CityPicher from "@src/componentsApp/CityPicher";
import { submitLoan } from "@src/apis";

export default {
        components: { CityPicher },
        data() {
                return {
                        submitBtn: false,
                        customerNo: this.$route.query["customerNo"],
                        enterpriseName: "",
                        phoneNo: "",
                        content: {},
                        cityVisible: false,
                        addr: "",
                }
        },
        methods: {

                //地区选择回调函数
                resultCallback(obj) {
                        this.content = obj;
                },
                submit() {

                        if (!this.enterpriseName.length > 0) {
                                this.Toast("请填写联系人！");
                                return;
                        }
                        if (!/^1[3|4|5|8|7|9][0-9]\d{8}$/.test(this.phoneNo)) {
                                this.Toast("手机号不正确！");
                                return;
                        }

                        if (!this.content.resultAddr) {
                                this.Toast("请选择地区！");
                                return;
                        }

                        if (!this.addr) {
                                this.Toast("邮寄地址不能为空！");
                                return;
                        }

                        submitLoan()({
                                customerNo: this.customerNo,
                                enterpriseName: this.enterpriseName,
                                phoneNo: this.phoneNo,
                                content: this.content.resultAddr + "-" + this.addr
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        this.MessageBox.alert("稍后将有业务人员与您联系，感谢您的支持！", "申请成功！");
                                        this.submitBtn = true;
                                        this.enterpriseName = "";
                                        this.phoneNo = "";
                                        this.content = {};
                                        this.addr = "";
                                } else {
                                        this.Toast(data.message);
                                }
                        })

                }
        }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.loan {
        // padding-bottom: 40/@rem;
        box-sizing: border-box;
        // background: url(../../assets/images/download_bg.png) no-repeat;
        background-size: cover;

        .banner {
                // width: 750/@rem;
                min-height: 940 / @rem;
                width: 100%;
        }

        .padding {
                padding: 30 / @rem;
                background-color: #488fd0;

                .tip {
                        color: #fff;
                        font-size: 30 / @rem;
                        margin-top: 30 / @rem;
                }
        }

        .submit {
                // width: 90%;
                margin: 60 / @rem auto;
        }

        .footer {
                text-align: center;
                font-size: 32 / @rem;
                color: #6c757d;
        }

        .loan-success {
                background: #f2f2f2;
                text-align: center;
                padding-top: 200px;
                font-size: 16px;
                p {
                        line-height: 32px;
                }
        }
}
</style>
