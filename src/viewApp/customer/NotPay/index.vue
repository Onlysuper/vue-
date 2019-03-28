<template>
        <nodata v-model="noData">
                <span slot='tip'>您暂未开通收款业务</span>
                <p slot='footerTip'>
                        请联系服务商开通,如无法联系到服务商<br />
                        请拨打<a href="tel:400-110-2662">400-110-2662</a> 查询
                </p>
        </nodata>
</template>

<script>

import Nodata from "@src/componentsApp/Nodata";
export default {
        components: {
                Nodata
        },
        data() {
                return {
                        noData: true
                }
        }
}
</script>

<style>
</style>
