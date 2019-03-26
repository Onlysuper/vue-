const CryptoJS = require('crypto-js');  //引用AES源码js
//解密方法
function Decrypt(word, key) {
    let decryptResult = CryptoJS.AES.decrypt(word, CryptoJS.enc.Utf8.parse(key), {    //  AES解密
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decryptResult.toString(CryptoJS.enc.Utf8);
    return decryptedStr;
}

//加密方法
function Encrypt(word, key) {//word json格式，key字符串
    let content = word;
    var encryptResult = CryptoJS.AES.encrypt(JSON.stringify(content), CryptoJS.enc.Utf8.parse(key), {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encryptResult.toString();
}
// MD5加密
function md5Encrypt(word) {
    let md5Str =  CryptoJS.MD5(word).toString().toUpperCase();
    return md5Str;
}


export {
    Decrypt,
    Encrypt,
    md5Encrypt,

}
