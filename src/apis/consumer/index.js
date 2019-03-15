
import http from "@src/apis/http";
import bases from "@src/apis/base";

/*********临时调用快速开票的地址**********/
let base = Object.assign({}, bases);
base.oaIp = base.testIp;

// 查询企业名片
const queryEntCardList = () => { return params => { return http.get(base.oaIp, "/v2/enterpriseCard/queryList", params) } }

// 添加企业名片
const addEntCard = () => { return params => { return http.post(base.oaIp, "/v2/enterpriseCard/add", params) } }

// 修改企业名片
const editEntCard = () => { return params => { return http.post(base.oaIp, "/v2/enterpriseCard/update", params) } }

// 删除企业名片
const removeEntCard = () => { return params => { return http.post(base.oaIp, "	/v2/enterpriseCard/delete", params) } }


// 获取企业名片二维码Api
const qrcode = base.oaIp + "/v2/enterpriseCard/cardqrcode";

// const myCardShareLink = base.oaIp + "/wx/redirect/wx_consumer?url=" + encodeURI(base.testIp + "/v2/enterpriseCard/share/") //老的
const myCardShareLink = `${base.oaIp}/v2/enterpriseCard/sharecard` //新的


// 获取电子发票列表
const getInvoiceList = openId => { return params => { return http.get(bases.oaIp, "/myInvoice/list/" + openId, params, false) } }

// 电子发票列表页，关联手机号码和openId的关系
const bindingMobile = () => { return params => { return http.post(bases.oaIp, "/myInvoice/relation/", params) } }

// 获取电子发票预览
const getInvoiceDetail = openId => { return params => { return http.get(bases.oaIp, "/myInvoice/detail/" + openId, params) } }

// 获取电子发票图片
const getInvoiceImageUrl = openId => { return params => { return http.get(bases.oaIp, "/myInvoice/imageUrl/" + openId, params) } }

const invoiceUrlPath = bases.oaIp + "/myInvoice/image/" // 外面拼接openId 

// 将电票发票 pdf文件 发送到指定的邮箱
const sendEmail = openId => { return params => { return http.get(bases.oaIp, "/myInvoice/email/" + openId, params) } }

// 获取广告列表
const getAdList = () => { return (params) => { return http.get(bases.testIp, `/advert/query`, params, false) } }

export {
        queryEntCardList,
        addEntCard,
        removeEntCard,
        editEntCard,
        qrcode,
        myCardShareLink,

        getInvoiceList,
        bindingMobile,
        getInvoiceDetail,
        getInvoiceImageUrl,
        invoiceUrlPath,
        sendEmail,
        getAdList
}