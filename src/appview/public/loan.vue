<template>
</template>

<script>
import utils from "@src/common/utils";
let pcUrl = "https://f.orangebank.com.cn/nscf/index_sbc_prd.html?inputChId=yipiaobjfh&custMaId=wangshuang833&thirdAppNo=";
let h5Url = "https://f.orangebank.com.cn/nscf/H5/index.html#/A01_infor1?inputChId=yipiaobjfh&custMaId=wangshuang833&thirdAppNo=";

export default {
        data() {
                return {
                        customerNo: this.$route.query["customerNo"] || "",
                }
        },
        created() {
                if (utils.isPc()) {
                        this._czcEvent("发票贷", "PC")
                } else {
                        this._czcEvent("发票贷", "APP")
                }
        },
        mounted() {

                if (utils.isPc()) {
                        window.location.href = pcUrl + `${this.customerNo}T${Date.now()}`;
                } else {
                        window.location.href = h5Url + `${this.customerNo}T${Date.now()}`;
                }
        }
}
</script>

<style>
</style>
