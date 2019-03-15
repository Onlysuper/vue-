<template>
        <full-page-popup v-model="popupVisible" position="bottom" class="bank-branch-page" title="选择支行" @confirm="queryBank">
                <div class="pading">
                        <view-radius>
                                <input-wrapper>
                                        <mt-field :value="bank.value" label="开户银行" type="text" state="" :readonly="true" placeholder=""></mt-field>
                                </input-wrapper>
                                <input-wrapper>
                                        <mt-field :value="bankAddr.resultAddr" @click.native="cityVisible = true" label="开户地区" type="text" state="" v-readonly-ios :readonly="true" placeholder="请选择地区">
                                                <i class="icon-arrow"></i>
                                        </mt-field>
                                </input-wrapper>
                                <!-- <input-wrapper>
                                <mt-field v-model="keyVal" label="关键字" type="text" state="" :readonly="false" placeholder=""></mt-field>
                                </input-wrapper> -->
                        </view-radius>
                        <br>
                        <mt-button size="large" type="danger" :disabled="queryBankDisabled" @click="queryBank">查询</mt-button>
                        <city-picher ref="CityPicher" v-model="cityVisible" :resultCallback="resultCallback"></city-picher>
                </div>
        </full-page-popup>
</template>
<style lang="less" scoped>
@import "../../assets/less/base.less";
.bank-branch-page {
        width: 100%;
        height: 100%;
        .pading {
                margin-top: 20 / @rem;
                padding: 0 20 / @rem;
        }
}
</style>
<script>
import CityPicher from "../CityPicher";
import FullPagePopup from "../FullPagePopup";
import InputWrapper from "../InputWrapper";
import ViewRadius from "../ViewRadius";
export default {
        components: {
                CityPicher,
                FullPagePopup,
                InputWrapper,
                ViewRadius
        },
        props: {
                value: {
                        type: Boolean,
                        default: false
                },
                bank: {
                        type: Object,
                        default: {}
                }
        },
        data() {
                return {
                        popupVisible: false,
                        cityVisible: false,
                        bankAddr: {
                                resultAddr: "",
                                resultCode: ""
                        },
                        keyVal: "",
                        query: {}
                };
        },
        computed: {
                queryBankDisabled() {
                        return this.bankAddr.resultCode ? false : true;
                }
        },
        watch: {
                value(val) {
                        this.popupVisible = val;
                },
                popupVisible(val) {
                        this.$emit("input", val);
                }
        },
        mounted() {
                if (this.value) {
                        this.popupVisible = true;
                }
        },
        methods: {
                resultCallback(city) {
                        this.bankAddr = city;
                },
                queryBank() {
                        this.query = {
                                bankCode: this.bank.key, //		是	银行编号
                                orgCode: this.bankAddr.resultCode, //		是	区县编码
                                key: this.keyVal //		是	支行名称(模糊查询)
                        };
                        this.$emit("bankbranchresult", this.query);
                }
        }
};
</script>