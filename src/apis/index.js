
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



// 获取当前手机号下的商户列表
// const getCustomerList = phone => { return (data) => { return http.post(base.oaIp, "/wxCustomer/customerList/" + phone, data) } }

// 获取当前商户下的二维码列表
const getCustomerQrcodeList = queryPath => { return (data) => { return http.post(base.oaIp, "/wxCustomer/qrcodeList/" + queryPath, data) } }

// 微信商户登录接口
// const login = queryPath => { return (data) => { return http.post(base.oaIp, "/wxCustomer/login/" + queryPath, data) } }

// 获取商户信息
// const getCustomerInfo = openId => { return params => { return http.get(base.oaIp, "/wxCustomer/info/" + openId, params) } }

// 变更商户经营名称
const changeCustomerName = () => { return params => { return http.post(base.oaIp, "/wxCustomer/bussinessName/save/", params) } }

// 微信商户退出接口
// const logout = openId => { return data => { return http.post(base.oaIp, "/wxCustomer/logout/" + openId, data) } }

// 微信商户注册接口
const registCustomer = () => { return data => { return http.postJSON(base.oaIp, "/wxCustomer/customer/register", data) } }

// 商户注册图片上传
const upload = () => { return data => { return http.postJSON(base.oaIp, "/wxCustomer/customer/upload", data) } }

// 微信商户扫一扫提交扫描结果
const msgLF = () => { return params => { return http.get(base.testIp, "/v2/wxMsg/msgLF/", params) } }

// 查询商户是否开通电子发票业务
const electronicQuery = () => { return params => { return http.post(base.oaIp, "/electronic/query/", params) } }

// 回显商户信息
const queryCustomer = () => { return params => { return http.post(base.oaIp, "/electronic/queryCustomerElectronic", params) } }

// 完善信息并开通电子发票产品
const electronicComplete = () => { return params => { return http.post(base.oaIp, "/electronic/complete/", params) } }

// 添加商户商品
const electronicAddGoods = () => { return params => { return http.post(base.oaIp, "/electronic/saveCustomerGoods/", params) } }

// 新增商户开票信息配置
const electronicAddInvoiceConfig = () => { return params => { return http.post(base.oaIp, "/electronic/saveInvoiceConfig/", params) } }

// 查询当前商户全部商品
const electronicQueryGoodsList = () => { return params => { return http.post(base.oaIp, "/electronic/queryGoodsList/", params, false) } }

// 设置默认商品
const electronicConfigDefault = () => { return params => { return http.post(base.oaIp, "/electronic/configDefault/", params) } }

// 查询商户配置用来回显
const electronicQueryConfig = () => { return params => { return http.post(base.oaIp, "/electronic/queryInvoiceConfig/", params, false) } }

// 查询商户是否开通支付业务
const payOrderQuery = openId => { return params => { return http.post(base.oaIp, "/wxCustomer/product/status/" + openId, params, false) } }

// 查询今日交易统计
// const payOrderTodayTotal = openId => { return params => { return http.post(base.oaIp, "/wxCustomer/payOrder/total/nowday/" + openId, params, false) } }

// 分页查询交易记录列表
// const payOrderQueryList = openId => { return params => { return http.post(base.oaIp, "/wxCustomer/payOrder/page/" + openId, params, false) } }

// 分页统计查询
const payOrderSum = openId => { return params => { return http.post(base.oaIp, "/wxCustomer/payOrder/sum/" + openId, params, false) } }


// 支行查询
const getBankList = () => { return (params) => { return http.get(base.oaIp, "/brankbank/list", params) } }

// 商品智能编码查询
const queryGoodsCode = () => { return (params) => { return http.get(base.oaIp, "/smartcode/query/goods", params) } }

// 贷款申请
const submitLoan = () => { return (params) => { return http.get(base.oaIp, "/invoice/loan/apply", params) } }

// 电票查询记录
const queryEicList = (openId) => { return (params) => { return http.get(base.oaIp, `/myInvoice/elecBillRecord/${openId}`, params, false) } }

// 电票查询记录详情
const queryEicListDetail = (openId) => { return (params) => { return http.get(base.oaIp, `/myInvoice/elecBillRecord/detail/${openId}`, params, false) } }

// 获取收款签名
const getPaySigninfo = () => { return (params) => { return http.get(base.testIp, `/pay/sign/info`, params) } }

// 提交收款订单
const submitPayOrder = () => { return (params) => { return http.post(base.testIp, `/pay/micropay`, params, false) } }

// 查询商户结算记录
const settleQuery = () => { return (params) => { return http.post(base.oaIp, `/wxCustomer/customerSettle/page`, params, false) } }

// 创建电票订单
const createEicOrder = () => { return (params) => { return http.postJSON(base.oaIp, `/electronic/order`, params) } }


export {
        getVerificationCode,
        getCustomerList,
        getCustomerQrcodeList,
        login,
        getCustomerInfo,
        changeCustomerName,
        logout,
        registCustomer,
        upload,
        msgLF,
        electronicQuery,
        queryCustomer,
        electronicComplete,
        electronicAddGoods,
        electronicAddInvoiceConfig,
        electronicQueryGoodsList,
        electronicConfigDefault,
        electronicQueryConfig,
        payOrderQuery,
        payOrderTodayTotal,
        payOrderQueryList,
        payOrderSum,
        getBankList,
        queryGoodsCode,
        submitLoan,
        queryEicList,
        queryEicListDetail,
        getPaySigninfo,
        submitPayOrder,
        settleQuery,
        createEicOrder
};

