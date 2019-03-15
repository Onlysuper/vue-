<template>
        <div class="usercore-container" v-show="pageShow">
                <div class="user-info">
                        <div class="info-item">
                                <i class="icon"></i>
                                <div class="info-title">企业名称</div>
                                <div class="info-cont">{{entName}}</div>
                        </div>
                        <div class="info-item">
                                <i class="icon"></i>
                                <div class="info-title">企业税号</div>
                                <div class="info-cont">{{taxNo}}</div>
                                <!--<span class="arrow"></span>-->
                        </div>
                        <div class="info-item">
                                <i class="icon"></i>
                                <div class="info-title">手机号</div>
                                <div class="info-cont">{{telephone}}</div>
                        </div>
                        <div class="info-item">
                                <i class="icon"></i>
                                <div class="info-title">联系人</div>
                                <div class="info-cont">{{linkMan}}</div>
                        </div>
                        <div class="info-item">
                                <i class="icon"></i>
                                <div class="info-title">序列号</div>
                                <div class="info-cont">{{seriaNumber}}</div>
                        </div>
                </div>
                <div class="info-item ent-name" v-show="entNameShow">
                        <i class="icon"></i>
                        <div class="info-title">经营名称</div>
                        <div class="info-cont" @click="changeName">{{businessName}}</div>
                        <span class="arrow"></span>
                </div>
                <div class="info-item pay-select" v-show="switchrShow">
                        <span>电子发票</span>
                        <div class="switch">
                                <mt-switch v-model="switchr" @change="handleSwitchr"></mt-switch>
                        </div>
                </div>
                <div class="info-item exit-login-btn" @click="exit">退出登录</div>
        </div>
</template>


<script>
import { MessageBox } from "mint-ui";
import utils from "@src/common/utils.js";
import TimerBtn from "@src/appcomponents/TimerBtn";
import Buttonr from "@src/appcomponents/Button";
import { getCustomerInfo, logout, changeCustomerName } from "@src/apis";
export default {
        components: {},
        data() {
                return {
                        pageShow: false,
                        switchr: false,
                        switchrShow: false, //是否显示支付完成后开票
                        entNameShow: true, //是否显示经验名称项
                        entName: "",
                        seriaNumber: "",
                        businessName: "",
                        telephone: "",
                        taxNo: "",
                        randomCode: "",
                        linkMan: ""
                };
        },
        props: {
                listbox_config: {
                        type: Object
                }
        },
        created() {
                let openId = utils.getOpenId();
                this.getUserInfo(openId);
                this.openId = openId;
                this.token = utils.storage.getStorage("token");
        },
        mounted() {
                // $(".usercore-container").setHeightToWindow();
        },
        methods: {
                getUserInfo(openId) {
                        getCustomerInfo(openId)({
                                token: utils.storage.getStorage("token")
                        }).then(data => {
                                if (data.resultCode == "0") {
                                        //登录成功
                                        this.pageShow = true;
                                        let userInfo = data.data;
                                        this.entName = userInfo.entName;
                                        this.seriaNumber = userInfo.seriaNumber;
                                        this.businessName = userInfo.businessName;
                                        this.telephone = userInfo.telephone;
                                        this.taxNo = userInfo.taxNo;
                                        this.randomCode = userInfo.randomCode;
                                        this.linkMan = userInfo.linkMan;
                                } else if (data.resultCode == "01") {
                                        //用户未登录，请重新登录
                                        this.Toast(data.resultMsg);
                                        this.$router.replace({
                                                path: "/customer/login",
                                                query: {
                                                        redirect: this.$route.path
                                                }
                                        });
                                } else {
                                        //其他
                                        this.Toast(data.resultMsg);
                                }
                        });
                },
                changeName() {
                        MessageBox.prompt("", "", {
                                title: "",
                                message: "更改经营名称",
                                showInput: true,
                                inputValue: this.businessName,
                                showCancelButton: true
                        }).then(({ value }) => {
                                if (!value) {
                                        MessageBox.alert("经营名称不能为空", "提示");
                                        return;
                                }
                                changeCustomerName()({
                                        token: this.token,
                                        openId: this.openId,
                                        bussinessName: value
                                }).then(data => {
                                        if (data.resultCode == "0") {
                                                this.businessName = value;
                                                this.Toast({
                                                        message: "变更成功",
                                                        duration: 1000,
                                                        iconClass: "mintui mintui-success"
                                                });
                                        } else {
                                                this.Toast(data.resultMsg);
                                        }
                                });
                        });
                },
                handleSwitchr() {
                        if (this.switchr === true) {
                                MessageBox({
                                        title: "温馨提示",
                                        message: "是否在支付完成后开票？",
                                        confirmButtonText: "是",
                                        showCancelButton: true,
                                        cancelButtonText: "否"
                                }).then(action => {
                                        action == "confirm" && (this.switchr = true);
                                        action == "cancel" && (this.switchr = false);
                                });
                        }
                },
                exit() {
                        MessageBox.confirm("确定退出登录？").then(action => {
                                logout(this.openId)({}).then(data => {
                                        if (data.resultCode == "0") {
                                                localStorage.removeItem("token");
                                                location.reload();
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
.usercore-container {
        .transformPage();
        .user-info {
                background: #fff;
                padding: 0 30 / @rem;
                margin-top: 24 / @rem;
        }
        .info-item {
                height: 100 / @rem;
                border-bottom: 1px solid #dedede;
                display: flex;
                line-height: 100 / @rem;
                font-size: 30 / @rem;
                color: #333;
                align-items: center;
                &:after {
                        content: "";
                        display: inline-block;
                        width: 0;
                        height: 0;
                        overflow: hidden;
                        vertical-align: middle;
                }
                .icon {
                        display: inline-block;
                        width: 40 / @rem;
                        height: 40 / @rem;
                        background-image: url("../../../assets/images/usercore-icon.png");
                        background-repeat: no-repeat;
                        background-size: 40 / @rem 240 / @rem;
                        vertical-align: middle;
                        margin-right: 20 / @rem;
                        overflow: hidden;
                }
                .info-title {
                        min-width: 129 / @rem;
                        height: 100%;
                        position: relative;
                        margin-right: 50 / @rem;
                        &:before {
                                content: ":";
                                position: absolute;
                                right: -20 / @rem;
                        }
                        .text-align-justify();
                }
                .info-cont {
                        flex: 1;
                        span {
                                float: left;
                        }
                        .text-ellipsis();
                        height: 100%;
                }
                .arrow {
                        display: inline-block;
                        width: 20 / @rem;
                        height: 20 / @rem;
                        border-top: 1px solid #ccc;
                        border-left: 1px solid #ccc;
                        .transform(rotate(135deg));
                        vertical-align: middle;
                        margin-right: 10 / @rem; // background: red;
                }
        }
        .info-item:nth-child(1) .icon {
                background-position: 0 -0 / @rem;
        }
        .info-item:nth-child(2) .icon {
                background-position: 0 -40 / @rem;
        }
        .info-item:nth-child(3) .icon {
                background-position: 0 -80 / @rem;
        }
        .info-item:nth-child(4) .icon {
                background-position: 0 -120 / @rem;
        }
        .info-item:nth-child(5) {
                .icon {
                        background-position: 0 -160 / @rem;
                }
                border-bottom: none;
        }
        .ent-name {
                background: #fff;
                padding: 0 30 / @rem;
                margin-top: 24 / @rem;
                border-top: 1px solid #dedede;
                .icon {
                        background-position: 0 -200 / @rem !important;
                }
        }
        .pay-select {
                // height: 100/@rem;
                display: block;
                background: #fff; // line-height: 100/@rem;
                // font-size: 30/@rem;
                // color: #333;
                padding: 0 30 / @rem;
                margin-top: 24 / @rem;
                border-top: 1px solid #dedede; // border-bottom: 1px solid #dedede;
                .switch {
                        float: right;
                        margin-top: 18 / @rem;
                        .mint-switch-input:checked + .mint-switch-core {
                                background: #4cd964;
                                border-color: #4cd964;
                        }
                }
        }
        .exit-login-btn {
                // line-height: 100/@rem;
                background: #fff;
                margin-top: 24 / @rem;
                text-align: center;
                display: block; // font-size: 30/@rem;
                border-top: 1px solid #dedede; // border-bottom: 1px solid #dedede;
        }
}
</style>
