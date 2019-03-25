

export default {
        md5Data:"ZzJ2A2r_H1D9LJ589DY",
        // //公众号服务
        // oaIp: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? location.protocol + "//to.yeepiao.com/" : location.protocol + "//o.yeepiao.com/",
        //快速开票
        testIp: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? location.protocol + "//ti.yeepiao.com/" : location.protocol + "//i.yeepiao.com/",
        //开票码验签的Key
        signKey: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? "1234QWER" : "",
        
        //展示商户服务
        // http://easy-mock.liuup.com/mock/5c98365fd360c27a130ae4bc/sendMsgCode

        // oaIp: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? location.protocol + "//to.yeepiao.com/" : location.protocol + "//o.yeepiao.com/",
        oaIp: process.env.NODE_ENV == "development" || process.env.NODE_ENV == "productionTest" ? location.protocol + "//easy-mock.liuup.com/mock/5c98365fd360c27a130ae4bc/" : location.protocol + "//o.yeepiao.com/",
}
