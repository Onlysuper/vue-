

export default {
        isLogin: function () {
                return this.storage.getStorage("isLogin") == "100" ? true : false;
        },
        isType: function (obj, type) {
                return Object.prototype.toString.call(obj) == "[object " + type + "]";
        },
        getOpenId: function () {
                return this.storage.getStorage("openid");
        },
        randomString: function (len) {
                len = len || 32;
                var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
                var maxPos = $chars.length;
                var pwd = '';
                for (var i = 0; i < len; i++) {
                        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
                }
                return pwd;
        },
        randomDateNow: function (frontLen) {
                frontLen = frontLen || 0;
                return Math.random().toString().substr(3, frontLen) + Date.now();
        },
        setDocumentTitle: function (title) {
                document.title = title;
                var ua = navigator.userAgent;
                if (/\bMicroMessenger\/([\d\.]+)/.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
                        var i = document.createElement('iframe'); 
                        //i.src = '/favicon.ico';
                        i.style.display = 'none';
                        i.onload = function () {
                                setTimeout(function () {
                                        i.remove();
                                }, 9);
                        };
                        document.body.appendChild(i);
                }
        },
        storage: {
                getStorage: function (key) {
                        if(key=='token'||key=='telePhone'|| key=='merCode'){
                                return localStorage.getItem(key)||this.getCookie(key);
                        }else{
                                return localStorage.getItem(key);
                        }
                },
                saveStorage: function (key, value) {
                        localStorage.setItem(key, value);
                        if(key=='token'||key=='telePhone'|| key=='merCode' || key=='openid'){
                                this.saveCookie(key, value,365);
                        }
                },
                removeStorage: function (key) {
                        localStorage.removeItem(key);
                        if(key=='token'|| key=='telePhone'|| key=='merCode' || key=='openid'){
                                this.removeCookie(key);
                        }
                },
                // cookie
                saveCookie(c_name,value,expiredays){
                        var exdate=new Date()
                        exdate.setDate(exdate.getDate()+expiredays)
                        document.cookie=c_name+ "=" +escape(value)+
                        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
                },
                getCookie(c_name){
                        if (document.cookie.length>0){
                                let c_start=document.cookie.indexOf(c_name + "=")
                                if (c_start!=-1){ 
                                        c_start=c_start + c_name.length+1 
                                        let c_end=document.cookie.indexOf(";",c_start)
                                        if (c_end==-1) c_end=document.cookie.length
                                        return unescape(document.cookie.substring(c_start,c_end))
                                } 
                        }
                        return ""
                },
                removeCookie(c_name){
                  this.saveCookie(c_name, "", -1);  
                }
        },
        /**
       * 时间格式化，示例：formatDate(date, 'yyyy-MM-dd hh:mm');
       * @param {时间} date 
       * @param {格式化} fmt 
       */
        formatDate(date, fmt) {
                if(date instanceof Date){
                        if (/(y+)/.test(fmt)) {
                                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
                        }
                        let o = {
                                'M+': date.getMonth() + 1,
                                'd+': date.getDate(),
                                'h+': date.getHours(),
                                'm+': date.getMinutes(),
                                's+': date.getSeconds()
                        };
                        for (let k in o) {
                                if (new RegExp(`(${k})`).test(fmt)) {
                                        let str = o[k] + '';
                                        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
                                }
                        }
                        return fmt;
                }else{
                        return date
                }
        },
        padLeftZero(str) {
                return ('00' + str).substr(str.length);
        },
        queryJsonVal: function (json, code) {
                return json.find(item => item.code == code) || {};
        },
        isWeiXin: function () {
                var ua = window.navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        return true;
                } else {
                        return false;
                }
        }(),
        accMul: function (arg1, arg2) {
                arg1 = arg1 || 0;
                var m = 0,
                        s1 = arg1.toString(),
                        s2 = arg2.toString();
                try {
                        m += s1.split(".")[1].length
                } catch (e) { }
                try {
                        m += s2.split(".")[1].length
                } catch (e) { }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
        },
        isPc: function () {
                var sUserAgent = navigator.userAgent.toLowerCase();
                var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
                var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
                var bIsMidp = sUserAgent.match(/midp/i) == "midp";
                var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
                var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
                var bIsAndroid = sUserAgent.match(/android/i) == "android";
                var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
                var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
                if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
                        return false;
                } else {
                        return true;
                }
        },
        constToArr: function (constObj) {
                if (constObj instanceof Object) {
                        var arr = [];
                        for (var key in constObj) {
                                var obj = {
                                        name: constObj[key].name||constObj[key],
                                        color: constObj[key].color,
                                        code: key,
                                };
                                arr.push(obj);
                        }
                        return arr;
                }
                return [];
        },
        replaceSort(val){
                if(val!=undefined){
                        return val.replace(/sort-/g,'');
                }else{
                        return "";
                }
        },
        valToColor:function(json,type,data,issort){
                let value = data;
                if(issort=='issort'){
                        // 要求属性是sort-开头的 如果没有需要加上
                        if(!(/sort-/g.test(value))){
                                value=`${'sort-'+value}`
                        }
                }else{
                        //要求属性不能是sort-开头的 如果有需要去掉
                        if(/sort-/g.test(value)){
                                value=value.replace('sort-','');
                        }
                }
                if(json[type][value]&&json[type][value]['color']){
                        return json[type][value].color;
                }else{
                        return "";
                }
        },
        numToChinese: function (section) {
                let chnNumChar = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
                let chnUnitSection = ["", "万", "亿", "万亿", "亿亿"];
                let chnUnitChar = ["", "十", "百", "千"];
                let strIns = '', chnStr = '';
                let unitPos = 0;
                let zero = true;
                while (section > 0) {
                        let v = section % 10;
                        if (v === 0) {
                                if (!zero) {
                                        zero = true;
                                        chnStr = chnNumChar[v] + chnStr;
                                }
                        } else {
                                zero = false;
                                strIns = chnNumChar[v];
                                strIns += chnUnitChar[unitPos];
                                chnStr = strIns + chnStr;
                        }
                        unitPos++;
                        section = Math.floor(section / 10);
                }
                return chnStr;
        },
        changeTwoDecimal_f: function (x) {
                var f_x = parseFloat(x);
                if (isNaN(f_x)) {
                        // alert('function:changeTwoDecimal->parameter error');
                        return false;
                }
                var f_x = Math.round(x * 100) / 100;
                var s_x = f_x.toString();
                var pos_decimal = s_x.indexOf('.');
                if (pos_decimal < 0) {
                        pos_decimal = s_x.length;
                        s_x += '.';
                }
                while (s_x.length <= pos_decimal + 2) {
                        s_x += '0';
                }
                return s_x;
        },
        toFixed: function (s) {
                let a = this.accMul(s, 100);
                var _a = s * 100;
                // console.log("直接乘以 * 100", _a)
                // console.log("accMul * 100", a)
                let b = Math.round(a);
                var _b = Math.round(_a);

                // console.log("直接乘以-round", _b)
                // console.log("accMul-round", b)
                let c = this.accMul(b, 0.01);
                // console.log("accMul * 0.01", c)

                return c.toFixed(2)
                // (Math.round((cart.billAmount) * 100) / 100).toFixed(2)
        },
        /**
         * 获取微信版本号
         */
        getWxVersion() {
                var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
                if (wechatInfo && wechatInfo instanceof Array && wechatInfo.length > 1) {
                        let wxVersion = wechatInfo[1];
                        return wxVersion;
                }
        },
        //微信版本号对比
        isVersion(v1, v2) {
                if (typeof v1 !== "string" || typeof v2 !== "string") return false;
                var vs = [v1, v2].map(function (v) {
                        return v
                                .split(".")
                                .map(function (n) {
                                        return ("00000" + n).slice(-5);
                                })
                                .join("");
                });
                return vs[0] > vs[1];
        },
        historyReplaceState(query, type = "replace") {
                if (query instanceof Array) return;
                if (query instanceof Object) {
                        let page_url = location.href;
                        let queryStr = "?";

                        for (const key in query) {
                                const element = query[key];
                                if (element) queryStr += `${key}=${element}&`;
                        }
                        queryStr = queryStr.substring(0, queryStr.length - 1)
                        page_url = page_url.split('?')[0];
                        page_url = page_url + queryStr;
                        if (type == "replace") history.replaceState(query, '', page_url);
                        else history.pushState(query, '', page_url);
                }
        }
}



