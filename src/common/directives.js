
let mypDirective = new Object();
mypDirective.install = function (Vue, options) {

        Vue.directive('to-num', {
                inserted: function (el) {
                        let num = el.innerHTML;
                        let type = false;
                        // num = "2323.01";
                        num = num.split(".");
                        num[1] = num[1] ? (num[1].length < 2 ? num[1] + '0' : num[1]) : "";
                        let n = 0, s = 0, m = 0, speed = 0;
                        let timer = () => {
                                if (n == 100) return;
                                n++;
                                s = parseInt(n * num[0] / 100);
                                m = num[1] ? parseInt(n * num[1] / 100) : "";
                                el.innerHTML = s + (m ? '.' + (m < 10 ? "0" + m : m) : (type ? ".00" : ""));
                                setTimeout(timer, speed)
                        }
                        timer();
                }
        })

        Vue.directive('readonly-ios', {
                // 当绑定元素插入到 DOM 中。
                inserted: function (el, fn, fn1) {
                        // 聚焦元素
                        let input = el.querySelector("input");
                        input.onfocus = function () {
                                this.blur();
                        }
                }
        })

        Vue.directive('wx-blur', {
                inserted: function (el) {

                        // 获取微信版本号
                        function getWxVersion() {
                                var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
                                if (wechatInfo && wechatInfo instanceof Array && wechatInfo.length > 1) {
                                        let wxVersion = wechatInfo[1];
                                        return wxVersion;
                                }
                        }

                        // 微信版本号对比
                        function isVersion(v1, v2) {
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
                        }

                        var isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                        // 解决微信浏览器ios版本 6.7.4版本以上出现的input失去焦点后不回弹的bug
                        if (isiOS && isVersion(getWxVersion(), "6.7.3")) {
                                let $el = el.tagName == "INPUT" ? el : el.querySelector("input");
                                $el.onblur = function () {
                                        setTimeout(function () {
                                                var scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0;
                                                window.scrollTo(0, Math.max(scrollHeight - 1, 0));
                                        }, 100)
                                }
                        }
                }
        })
        // 3. 添加实例方法
        //Vue.prototype.$myMethod = ...
}
export default mypDirective;