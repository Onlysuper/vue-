
import http from "./http";
import base from "./base";


// 登录获取验证码
const getVerificationCode = () => { return (params) => { return http.postJSON(base.oaIp, "/ChnpayAgent/realMerPubNum/sendMsgCode.do", params) } }
// 商户登录
const login = () => { return (params) => { return http.postJSON(base.oaIp, "/ChnpayAgent/realMerPubNum/userLogin.do", params) } }
// 获取当前手机号下的商户列表
const getCustomerList = () => { return (params) => { return http.postJSON(base.oaIp, "/ChnpayAgent/realMerPubNum/queryMerList.do", params) } }
// 获取商户信息
const getCustomerInfo = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayAgent/realMerPubNum/queryMerDetailInfo.do", params) } }
//退出登录
const logout = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayAgent/realMerPubNum/userLoginOut.do", params) } }
// 分页查询交易记录列表
const payOrderQueryList = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayAgent/realMerPubNum/queryMerTranList.do", params) } }

// 查询今日交易统计
const payOrderTodayTotal = () => { return params => { return http.postJSON(base.oaIp, "/ChnpayAgent/realMerPubNum/queryMerTodayTran.do", params) } }
// 查询商户结算记录
const settleQuery = () => { return (params) => { return http.postJSON(base.oaIp, `/ChnpayAgent/realMerPubNum/queryMerSettList.do`, params, false) } }




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

