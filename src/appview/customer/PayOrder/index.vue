<template>
        <div class="keep-alive">
                <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
</template>

<style lang="less">
</style>

<script>

import { payOrderQuery } from "@src/apis";
import utils from "@src/common/utils";
import { Toast } from "mint-ui";
export default {

        beforeRouteEnter(to, from, next) {
                //中间件-----检测是否开通支付
                console.info("支付功能权限校验！")
                payOrderQuery(utils.getOpenId())({ token: utils.storage.getStorage("token") }).then(data => {
                        if (data.resultCode == "0") {
                                if (data.data.payStatus == "TRUE") {
                                        next();
                                } else {
                                        next({ name: "NotPay", replace: true });
                                }
                        } else {
                                Toast(data.resultMsg);
                        }
                });
        }
};
</script>