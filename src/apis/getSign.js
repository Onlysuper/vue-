import http from "./http";
import base from "./base";

/**
 * 微信JS-SDK获取签名
 * @param {商户 || 消费者} type 
 * @param { url：window.url } params
 */
const getWxSign = type => {

        return (params, cb) => {
                http.get(base.oaIp, "/wx/signature/" + type, params, false).then(data => {
                        if (data.resultCode == "0") {
                                jWeixin.config({
                                        debug: false,
                                        beta: true,
                                        appId: data.data.appId,
                                        timestamp: data.data.timestamp,
                                        nonceStr: data.data.nonceStr,
                                        signature: data.data.signature,
                                        jsApiList: ['checkJsApi', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems', 'showMenuItems', 'hideAllNonBaseMenuItem', 'showAllNonBaseMenuItem', 'translateVoice', 'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'onVoicePlayEnd', 'pauseVoice', 'stopVoice', 'uploadVoice', 'downloadVoice', 'chooseImage', 'previewImage', 'uploadImage', 'downloadImage', 'getNetworkType', 'openLocation', 'getLocation', 'hideOptionMenu', 'showOptionMenu', 'closeWindow', 'scanQRCode', 'chooseWXPay', 'openProductSpecificView', 'addCard', 'chooseCard', 'openCard']
                                });
                                jWeixin.ready(function () {
                                        console.log("jssdk注入成功");
                                        cb && cb();
                                });
                                jWeixin.error(function (res) {
                                        res && console.error("jssdk注入失败", res);
                                });
                        } else {
                                alert(data.resultMsg)
                        }
                })
        }
}


const setWxShare = obj => {
        if (jWeixin !== null) {
                //设置朋友圈
                jWeixin.onMenuShareTimeline({
                        title: obj.title,
                        link: obj.link,
                        imgUrl: obj.imgUrl,
                        success: obj.success,
                        cancel: obj.cancel
                });
                //设置分享到好友
                jWeixin.onMenuShareAppMessage({
                        title: obj.title,
                        desc: obj.desc,
                        link: obj.link,
                        imgUrl: obj.imgUrl,
                        type: "link", // 分享类型,music、video或link，不填默认为link
                        dataUrl: "", // 如果type是music或video，则要提供数据链接，默认为空
                        success: obj.success,
                        cancel: obj.cancel
                });
        }
}


export {
        getWxSign,
        setWxShare,
}