<template>
        <div class="usercore-container" v-show="pageShow">
                <div class="user-info">
                        <div class="block-container">
                                <div class="block-title">商户基本信息</div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-mer-code"></i>
                                        <div class="info-title">商户编号</div>
                                        <div class="info-cont">{{detailData.merCode}}</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-mer-name"></i>
                                        <div class="info-title">企业名称</div>
                                        <div class="info-cont">{{detailData.merName}}</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-short-name"></i>
                                        <div class="info-title">经营名称</div>
                                        <div class="info-cont">{{detailData.merShortName}}</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-business-license"></i>
                                        <div class="info-title">统一社会<br/>信用代码</div>
                                        <div class="info-cont">{{detailData.businessLicense}}</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-link-man"></i>
                                        <div class="info-title">联系人</div>
                                        <div class="info-cont">{{detailData.merRelMan}}</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-link-phone"></i>
                                        <div class="info-title">联系人电话</div>
                                        <div class="info-cont">{{detailData.merRelTel}}</div>
                                </div>
                        </div>

                        <div class="block-container">
                                <div class="block-title">费率信息</div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-wei-chat"></i>
                                        <div class="info-title">微信费率</div>
                                        <div class="info-cont">{{detailData.qwxCommisionValue}}%</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-ali-pay"></i>
                                        <div class="info-title">支付宝费率</div>
                                        <div class="info-cont">{{detailData.qzfCommisionValue}}%</div>
                                </div>
                                 <div class="info-item">
                                        <i class="icon icon-trande"></i>
                                        <div class="info-title">借记卡费率</div>
                                        <div class="info-cont">{{detailData.merCommisionValue}}%</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-max"></i>
                                        <div class="info-title">借记卡封顶费</div>
                                        <div class="info-cont">{{detailData.amount}}元</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-trande"></i>
                                        <div class="info-title">贷记卡费率</div>
                                        <div class="info-cont">{{detailData.daiCommisionValue}}%</div>
                                </div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-uni-pay"></i>
                                        <div class="info-title">
                                                银联二维码费率<br/>
                                                <span class="light-text">(一千元以下) </span>
                                        </div>
                                        <div class="info-cont">{{detailData.qylCommisionValue}}%</div>
                                </div>
                                 <div class="info-item border-bottom-1px">
                                        <i class="icon icon-uni-pay"></i>
                                        <div class="info-title">
                                                银联二维码费率<br/>
                                                <span class="light-text">(一千元以上) </span>
                                        </div>
                                        <div class="info-cont">{{detailData.qylThousandValue}}%</div>
                                </div>
                        </div>
                         <div class="block-container">
                                <div class="block-title">结算信息</div>
                                <div class="info-item border-bottom-1px">
                                        <i class="icon icon-pay-type"></i>
                                        <div class="info-title">结算类型</div>
                                        <div class="info-cont">{{detailData.merSettType}}</div>
                                </div>
                                <div class="info-item">
                                        <i class="icon icon-pay-number"></i>
                                        <div class="info-title">商户收款账号</div>
                                        <div class="info-cont">{{detailData.merSettAcct | accountNum}}</div>
                                </div>
                         </div>
                </div>
                <div class="info-item exit-login-btn" @click="exit">退出登录</div>
        </div>
</template>


<script>
import { MessageBox } from "mint-ui";
import utils from "@src/common/utils.js";
import base from "@src/apis/base.js";
import {md5Encrypt} from "@src/common/secret.js";
import TimerBtn from "@src/componentsApp/TimerBtn";
import Buttonr from "@src/componentsApp/Button";
import { getCustomerInfo, logout, changeCustomerName } from "@src/apis";
export default {
        components: {},
        data() {
                return {
                        openid:utils.getOpenId(),
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
                        linkMan: "",
                        detailData:{
                                merName:"",
                                merCode:"",
                                merShortName:"",
                                businessLicense:"",
                                merRelMan:"",
                                merRelTel:"",
                                merSettAcct:"",
                                merSettType:"",
                                qwxCommisionValue:"",
                                qzfCommisionValue:""
                        }
                };
        },
        props: {
                listbox_config: {
                        type: Object
                }
        },
        created() {
                let openid = utils.getOpenId();
                this.getUserInfo(openid);
                // this.openid = openid;
                this.token = utils.storage.getStorage("token");
        },
        mounted() {
        },
        methods: {
                getUserInfo(openid) {
                        let token = utils.storage.getStorage("token");
                        let phone = utils.storage.getStorage("telePhone");
                        let merCode = utils.storage.getStorage("merCode");
                        getCustomerInfo()({
                                token: token,
                                telePhone:phone,
                                openid:openid,
                                merCode:merCode,// 商户编号
                                md5Data:md5Encrypt(`${phone+merCode+token+base.md5Data}`)
                        }).then(res => {
                                if(res.code=='001'){
                                       this.pageShow = true;
                                         let data=res.result.data.merDetailInfo;
                                         this.detailData={...data};
                                }else{ 
                                        // token过期 退出登录
                                        this.Toast(res.message);
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
                                                this.Toast(data.message);
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
                                let token = utils.storage.getStorage("token");
                                let phone = utils.storage.getStorage("telePhone");
                                let merCode = utils.storage.getStorage("merCode");
                                logout()({
                                        openid:this.openid,
                                        merCode:merCode,
                                        token:token,
                                        telePhone:phone,
                                        md5Data:md5Encrypt(`${phone+token+merCode+base.md5Data}`)
                                }).then(res => {
                                        if(res.code=='001'){
                                                utils.storage.removeStorage("token");
                                                utils.storage.removeStorage("telePhone")
                                                utils.storage.removeStorage("merCode")
                                                location.reload();
                                        }else{ 
                                                this.Toast(data.message);
                                                this.$router.push({
                                                        path:"/customer/login"
                                                })
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
        }
        .block-container{
                border-bottom: 10px solid @m-color5;
                &:last-of-type{
                        border: 0px;
                }
        }
        .block-title{
              
                font-size:34 / @rem;
                color:@m-color1;
                font-weight: bold;
                 padding: 30/@rem 30 / @rem 10/@rem 30/@rem;
                //    background:@main-color;
                // color:#fff;
                // background:@m-color5;
        }
        .info-item {
                // height: 100 / @rem;
                // border-bottom: 1px solid #dedede;
                display: flex;
                // line-height: 100 / @rem;
                font-size: 32 / @rem;
                align-items: center;
                position: relative;
                color:@m-color1;
                padding: 20/@rem 30 / @rem;
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
                        // background-size: 40 / @rem 240 / @rem;
                        background-size: 40 / @rem 560 / @rem;
                        vertical-align: middle;
                        margin-right: 20 / @rem;
                        overflow: hidden;
                        
                }
                // 经营名称
                .icon-short-name{
                        background-position: 0px -180px;
                }
                // 社会统一信用代码
                .icon-business-license{
                   background-position: 0px -116px;
                }
                // 联系人
                .icon-link-man{
                         background-position: 0px -145px;
                }
               
                // 商户编号
                .icon-mer-code {
                background-position: 0px -45px;
                }
                // 企业名称
                .icon-mer-name {
                  background-position: 0px -100px;
                }
               
                // 结算类型
                .icon-pay-type {
                background-position: 0px -82px;
                }
                  // 结算账号
                .icon-pay-number{
                background-position: 0px -28px;
                }
                //费率
                .icon-trande{
                        background-position: 0px -198px;
                }
              
                // 封顶
                .icon-max{
                        background-position: 0px -218px;
                }
               .icon-link-man{
                  background-position: 0px -148px;
                }
                // 联系人手机号
                .icon-link-phone{
                  background-position: 0px -132px;
                }
                // 微信费率
                .icon-wei-chat {
                background-position: 0px -12px;
                }
                  // 支付宝费率
                .icon-ali-pay {
                 background-position: 0px -64px;
                }
                .icon-uni-pay{
                  background-position: 0px 4px;
                }
                .info-title {
                        // color:@label-font-color;
                        min-width: 129 / @rem;
                        // height: 100%;
                        // position: relative;
                        // margin-right: 50 / @rem;
                        // // color:@m-color1;
                        // &:before {
                        //         content: ":";
                        //         position: absolute;
                        //         right: -20 / @rem;
                        // }
                        // .text-align-justify();
                }
                .info-cont {
                        flex: 1;
                        text-align: right;
                        word-break: break-all;
                        span {
                                float: left;
                        }
                        // .text-ellipsis();
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
        .info-item:last-child {
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
