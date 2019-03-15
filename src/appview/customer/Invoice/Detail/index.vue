<template>
        <div class="detail" v-show="pageShow">
                <message class="border-bottom-1px" :title="detail.status | analy('eicStatus')" :description="detail.status === 'BILLING_FAIL'?`原因：${detail.respMsg || '无'}`:''">
                        <i slot="icon" class="status-icon" :class="icons[detail.status] || 'icon-miaojie_wait'"></i>
                </message>
                <change-panel title="订单信息" class="border-bottom-1px">
                        <panel-body-row title="开票流水号" :desc="detail.billRecordNo"></panel-body-row>
                        <panel-body-row title="创建时间" :desc="detail.createTime"></panel-body-row>
                        <panel-body-row title="备注：" :desc="detail.remark"></panel-body-row>
                </change-panel>
                <change-panel title="销方信息" class="border-bottom-1px">
                        <panel-body-row title="企业名称" :desc="detail.bussinessName"></panel-body-row>
                </change-panel>
                <change-panel title="购方信息" class="border-bottom-1px" v-if="detail.enterpriseName">
                        <panel-body-row title="名称" v-if="detail.enterpriseName" :desc="detail.enterpriseName"></panel-body-row>
                        <panel-body-row title="税号" v-if="detail.billType == '1' && detail.taxNo" :desc="detail.taxNo"></panel-body-row>
                        <panel-body-row title="手机号码" v-if="detail.phoneNo" :desc="detail.phoneNo"></panel-body-row>
                        <panel-body-row title="邮箱" v-if="detail.mail" :desc="detail.mail"></panel-body-row>
                        <panel-body-row title="单位地址" v-if="detail.enterpriseAddress" :desc="detail.enterpriseAddress"></panel-body-row>
                        <panel-body-row title="公司电话" v-if="detail.companyPhone" :desc="detail.companyPhone"></panel-body-row>
                        <panel-body-row title="开户银行" v-if="detail.bankName" :desc="detail.bankName"></panel-body-row>
                        <panel-body-row title="银行帐号" v-if="detail.bankAccountNo" :desc="detail.bankAccountNo"></panel-body-row>
                </change-panel>
                <change-panel title="发票信息" class="border-bottom-1px" v-if="detail.status == 'BILLING_SUCCESS' || detail.status == 'AT_RED'">
                        <panel-body-row title="发票代码" v-if="detail.invoiceCode" :desc="detail.invoiceCode"></panel-body-row>
                        <panel-body-row title="发票号码" v-if="detail.invoiceNo" :desc="detail.invoiceNo"></panel-body-row>
                        <panel-body-row title="发票金额" :desc="detail.billAmount | moneyFormatCN(true)"></panel-body-row>
                        <panel-body-row title="合计税额" :desc="detail.totalTax | moneyFormatCN(true)"></panel-body-row>
                        <panel-body-row title="开票时间" :desc="detail.lastUpdateTime"></panel-body-row>
                </change-panel>

                <br>
                <mt-button size="large" @click="showImg(detail.imgUrl)" v-if="detail.status == 'BILLING_SUCCESS' || detail.status == 'AT_RED'">
                        预览发票
                </mt-button>
                <br>
                <mt-button type="primary" size="large" :disabled="btnDis" @click="hongchong" v-if="detail.channelNo == 'GAODENG' && detail.status == 'BILLING_SUCCESS'  && detail.ticketType == 'BLUE_TICKET'">
                        发票红冲
                </mt-button>
        </div>
</template>

<script>
import { queryEicListDetail, createEicOrder } from "@src/apis";
import utils from "@src/common/utils";
import ChangePanel from "@src/components/ChangePanel";
import PanelBodyRow from "@src/components/PanelBodyRow";
import Message from "@src/components/Message";
import CONST from "@src/const";
export default {
        components: { ChangePanel, PanelBodyRow, Message },
        data() {
                return {
                        detail: {},
                        orderNo: "",
                        billRecordNo: this.$route.params["billRecordNo"],
                        pageShow: false,
                        btnDis: false,
                        billTypes: CONST.billTypes,
                        icons: {
                                //开票成功icon
                                BILLING_SUCCESS: "icon-success_black",
                                AT_RED: "icon-success_black",
                                //开票失败icon
                                BILLING_FAIL: "icon-pop-failure",
                        }
                }
        },
        created() {
                this.openId = utils.getOpenId();
                if (this.openId) {
                        queryEicListDetail(this.openId)({ billRecordNo: this.billRecordNo }).then(data => {
                                if (data.resultCode == "0") {
                                        this.detail = data.data || {};
                                        this.pageShow = true;
                                } else {
                                        this.Toast(data.resultMsg);
                                }
                        })
                }
        },
        methods: {
                showImg(url) {
                        if (!url) {
                                this.Toast("暂时无法查看~");
                                return;
                        }
                        WeixinJSBridge.invoke("imagePreview", {
                                // "current": this.invoiceUrl,
                                urls: [url]
                        });
                },
                hongchong() {
                        this.MessageBox.confirm("确定将此发票进行红冲吗？").then(action => {
                                createEicOrder()({
                                        orderNo: utils.randomDateNow(5),
                                        openId: utils.getOpenId(),
                                        ticketType: "RED_TICKET",
                                        billRecordNo: this.detail.billRecordNo,
                                        token: utils.storage.getStorage("token")
                                }).then(data => {
                                        if (data.resultCode == "0") {
                                                this.btnDis = true;
                                                this.Toast("提交成功");
                                        } else {
                                                this.Toast(data.resultMsg);
                                        }
                                })
                        });
                }
        }
}
</script>

<style lang="less" scoped>
.detail {
        color: #333333;
        background: #fff;
        padding: 10px;
        li {
                padding: 5px 0;
                display: flex;
                span:nth-child(1) {
                        width: 80px;
                }
                span:nth-child(2) {
                        flex: 1;
                        text-align: right;
                }
        }

        .icon-success_black {
                color: #09bb07;
        }

        .icon-pop-failure {
                color: red;
        }

        .icon-miaojie_wait {
                color: #999999;
        }
}
</style>
