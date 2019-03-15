
export default {
        //公众号服务
        oaIp: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? location.protocol + "//to.yeepiao.com/" : location.protocol + "//o.yeepiao.com/",
        //快速开票
        testIp: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? location.protocol + "//ti.yeepiao.com/" : location.protocol + "//i.yeepiao.com/",
        //开票码验签的Key
        signKey: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? "1234QWER" : "",
}
