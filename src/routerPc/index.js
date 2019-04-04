import Vue from 'vue';
import Router from 'vue-router';
import utils from "@src/common/utils.js";
import { Toast } from 'mint-ui';

Vue.use(Router)

const router = new Router({
        routes: [
                {
                        path: "/",
                        redirect: "/customer/usercore"
                },
                /* 
                        易票商户
                */
                {
                        path: "/customer/login",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Login")), "login"),
                        meta: {
                                pageTitle: "登录",
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/register",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Register")), "register"),
                        meta: {
                                pageTitle: "注册易票",
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/registerSuccess",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/RegisterSuccess")), "registerSuccess"),
                        meta: {
                                pageTitle: "注册成功",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        name: "added",
                        path: "/customer/added",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Added")), "added"),
                        meta: {
                                pageTitle: "电子发票",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/code",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Code")), "code"),
                        meta: {
                                pageTitle: "开票码",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/scan",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Scan")), "scan"),
                        meta: {
                                pageTitle: "扫一扫",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/scanMoney",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/ScanMoney")), "scanMoney"),
                        meta: {
                                pageTitle: "收款",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/usercore",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Usercore")), "usercore"),
                        meta: {
                                pageTitle: "我的信息",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/help",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Help")), "help"),
                        meta: {
                                pageTitle: "使用帮助",
                        }
                },
                {
                        path: "/customer/notPay",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/NotPay")), "notPay"),
                        meta: {
                                pageTitle: "暂未开通支付产品",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/pay/home", // 兼容老地址
                        redirect: "/customer/payOrder",
                },
                {
                        path: "/customer/payOrder", // 新地址
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/PayOrder/Home")), "payOrder"),
                        meta: {
                                pageTitle: "交易记录",
                                requiresAuth: true,
                                isMustOpenid: true,
                                keepAlive: true
                        }
                },
                {
                        path: "/customer/payOrderHistory",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/PayOrder/History")), "payOrder"),
                        meta: {
                                pageTitle: "历史记录",
                                requiresAuth: true,
                                isMustOpenid: true,
                                keepAlive: true
                        }
                },
                {
                        path: "/customer/payOrderDetail",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/PayOrder/Detail")), "payOrder"),
                        meta: {
                                pageTitle: "交易订单明细",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/payOrder/settleQuery",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/PayOrder/SettleQuery")), "settleQuery"),
                        meta: {
                                pageTitle: "结算查询",
                                requiresAuth: true,
                                isMustOpenid: true,
                                keepAlive: true
                        }
                },
                {
                        path: "/customer/payOrder/settleDetail",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/PayOrder/SettleDetail")), "settleQuery"),
                        meta: {
                                pageTitle: "结算明细",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },

                {
                        path: "/customer/eicConfig",
                        component: r => {
                                return require.ensure([], () => { return r(require('@src/viewApp/customer/Invoice/Config')) }, 'invoice-config')
                        },
                        meta: {
                                pageTitle: "电子发票配置",
                                requiresAuth: true,
                                isMustOpenid: true,
                                keepAlive: true,
                        }
                },
                {
                        path: "/customer/eicGoods",
                        component: r => {
                                return require.ensure([], () => { return r(require('@src/viewApp/customer/Invoice/Goods')) }, 'invoice-config')
                        },
                        meta: {
                                pageTitle: "我的商品",
                                requiresAuth: true,
                                isMustOpenid: true,
                                keepAlive: true,
                        }
                },
                {
                        path: "/customer/eicGoodsDetail",
                        component: r => {
                                return require.ensure([], () => { return r(require('@src/viewApp/customer/Invoice/Detail')) }, 'invoice-config')
                        },
                        meta: {
                                pageTitle: "商品详情",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/eicGoodsAdd",
                        component: r => {
                                return require.ensure([], () => { return r(require('@src/viewApp/customer/Invoice/AddGood')) }, 'invoice-config')
                        },
                        meta: {
                                pageTitle: "编辑商品",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/eicCompletionInfo",
                        component: r => {
                                return require.ensure([], () => { return r(require('@src/viewApp/customer/Invoice/CompletionInfo')) }, 'invoice-completionInfo')
                        },
                        meta: {
                                pageTitle: "完善我的信息",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/eicInTransitWait",
                        component: r => {
                                return require.ensure([], () => { return r(require('@src/viewApp/customer/Invoice/InTransit')) }, 'invoice-completionInfo')
                        },
                        meta: {
                                pageTitle: "开通中",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/eicInTransitFail",
                        component: r => {
                                return require.ensure([], () => { return r(require('@src/viewApp/customer/Invoice/Fail')) }, 'invoice-fail')
                        },
                        meta: {
                                pageTitle: "开通失败",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/eicCreateQrcode",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Invoice/CreateEic")), "invoice-code"),
                        meta: {
                                pageTitle: "生成开票码",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/eicQrcode",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Invoice/QrCode")), "invoice-code"),
                        meta: {
                                pageTitle: "开票码"
                        }
                },
                {
                        path: "/customer/eicHistory",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Invoice/History")), "invoice-history"),
                        meta: {
                                pageTitle: "电票记录",
                                keepAlive: true,
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },
                {
                        path: "/customer/eicDetail/:billRecordNo",
                        component: r => require.ensure([], () => r(require("@src/viewApp/customer/Invoice/Detail")), "invoice-history"),
                        meta: {
                                pageTitle: "订单详情",
                                requiresAuth: true,
                                isMustOpenid: true
                        }
                },

                /* 
                        易票互联
                */
                {
                        path: "/consumer/addCard",
                        component: r => require.ensure([], () => r(require("@src/viewApp/consumer/AddCard")), "addCard"),
                        meta: {
                                pageTitle: "新增名片",
                                isMustOpenid: true
                        }
                },
                {
                        path: "/consumer/myCard",
                        component: r => require.ensure([], () => r(require("@src/viewApp/consumer/MyCard")), "myCard"),
                        meta: {
                                pageTitle: "我的名片",
                                isMustOpenid: true
                        }
                },
                {
                        path: "/consumer/myBill",
                        component: r => require.ensure([], () => r(require("@src/viewApp/consumer/MyBill")), "myBill"),
                        meta: {
                                pageTitle: "我的电子发票",
                                isMustOpenid: true,
                                keepAlive: true
                        }
                },
                {
                        path: "/consumer/myBillDetail",
                        component: r => require.ensure([], () => r(require("@src/viewApp/consumer/MyBillDetail")), "myBillDetail"),
                        meta: {
                                pageTitle: "我的发票预览",
                                isMustOpenid: true,
                        }
                },

                /* 
                        公共
                */

                {
                        path: "/loan",
                        component: r => require.ensure([], () => r(require("@src/viewApp/public/loan")), "loan"),
                        meta: {
                                pageTitle: "贷款申请"
                        }
                },
                {
                        path: "/sOrder",
                        component: r => require.ensure([], () => r(require("@src/viewApp/public/sOrder")), "sOrder"),
                        meta: {
                                pageTitle: "订购"
                        }
                },
                {
                        path: "*",
                        component: require("@src/viewApp/404"),
                        meta: {
                                pageTitle: "404"
                        }
                }
        ]
});


function isMobile() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = false;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    }
/**
 * 全局拦截器
 */

router.beforeEach((to, from, next) => {
        if(!isMobile()){
                window.location.href="/app.html#/"
                return
        }
        /**
         * 以下路由必须有openId才可进入，检查字符串参数或本地储存中是否有openId字段
         */
        // if (to.matched.some(record => record.meta.isMustOpenid)) {
        //         let openid = to.query.openid || to.query.openId || utils.getOpenId();
        //         if (openid) {
        //                 utils.storage.saveStorage("openid", openid);
        //         } else {
        //                 Toast("参数缺失"); 
        //                 return;
        //         }
        // }

        /**
         * 这里遍历所有路由包括子路由，检查哪些路由需要 登录 验证。
         * 如果一个路由需要登录之后才能进入，可以直接在相应路由中的meta中配置requiresAuth属性即可。
         */
        if (to.matched.some(record => record.meta.requiresAuth)) {
                //判断用户是否已经登录，优先使用vuex的状态判断
                if (utils.storage.getStorage("token")) {
                        next();
                        //设置页面title,登录成功也要设置
                        to.meta.pageTitle && utils.setDocumentTitle(to.meta.pageTitle);
                } else {
                        // 没有得到token清除掉之前的缓存商户信息，并跳转到登录页
                        utils.storage.removeStorage("token");
                        utils.storage.removeStorage("telePhone")
                        utils.storage.removeStorage("merCode")
                        next({
                                path: "/customer/login",
                                //redirect：此参数代表登录成功要跳转的路由
                                query: Object.assign({}, { redirect: to.path }, to.query)
                        });
                }
        } else {
                next();
                //设置页面title,登录不成功也要设置
                to.meta.pageTitle && utils.setDocumentTitle(to.meta.pageTitle);

        }
})

export default router;
