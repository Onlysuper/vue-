
import http from "./http";
import base from "./base"; 


// 登录获取验证码
const getVerificationCode = () => { return (params) => { return http.postJSON(base.oaIp, "/ChnpayPubAcct/realMerPubNum/sendMsgCode.html", params) } }
// 商户登录
const login = () => { return (params) => { return http.postJSON(base.oaIp, "/ChnpayPubAcct/realMerPubNum/userLogin.html", params) } }
// 获取当前手机号下的商户列表
const getCustomerList = () => { return (params) => { return http.postJSON(base.oaIp, "/ChnpayPubAcct/realMerPubNum/queryMerList.html", params) } }
// 获取商户信息
const getCustomerInfo = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayPubAcct/realMerPubNum/queryMerDetailInfo.html", params) } }
//退出登录
const logout = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayPubAcct/realMerPubNum/userLoginOut.html", params) } }
// 分页查询交易记录列表
const payOrderQueryList = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayPubAcct/realMerPubNum/queryMerTranList.html", params) } }

// 查询今日交易统计
const payOrderTodayTotal = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayPubAcct/realMerPubNum/queryMerTodayTran.html", params) } }
// 查询商户结算记录
const settleQuery = () => { return (params) => { return http.postJSON(base.oaIp, `/ChnpayPubAcct/realMerPubNum/queryMerSettList.html`, params, false) } }




export {
        getVerificationCode,
        getCustomerList,
        login,
        getCustomerInfo,
        logout,
        payOrderTodayTotal,
        payOrderQueryList,
        settleQuery
};

