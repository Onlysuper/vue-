
import utils from "@src/common/utils";
import CONSTS from "@src/const/index.json";
let mypFilters = new Object();
mypFilters.install = function (Vue, options) {

        Vue.filter('numToChinese', function (value) {
                return utils.numToChinese(value);
        })

        Vue.filter('toFixed', function (value) {
                return utils.toFixed(value);
        })

        Vue.filter('accMul', function (value, param) {
                return utils.accMul(value, param);
        })

        /**
         * 千分位格式化金额 带小数点补两位0
         * noAccMul 如果金额不是分单位 则值：true即可
         */
        Vue.filter('moneyFormatCN', function (value, noAccMul) {
                if (!value) return "0.00";
                // value += "";
                // value = value.replace(/\./g, "");
                // if (!noAccMul) {
                //     //分到元
                //     value = utils.accMul(value, 0.01);
                // }
                var num = "";
                if (noAccMul) {
                        // 格式化金额保留两位小数 10 =>> 10.00  12.12 =>> 12.12
                        num = utils.toFixed(value);
                } else {
                        // 分到元 1000 =>> 10.00
                        num = utils.accMul(value, 0.01);
                }

                num += "";
                var reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;//千分符的正则
                num = num.replace(reg, '$1,');//千分位格式化
                if (num.indexOf('.') === -1) {
                        return `${num}.00`;
                }
                num = num.split(".")[1] ? (num.split(".")[1].length == 1 ? num + "0" : num) : num;
                return `${num}`;
        })

        Vue.filter('dateFormatCN', function (dateTimeStr, type) {
                if (!dateTimeStr) return "";
                let dt = dateTimeStr.split(" ");
                let d = dt[0].split("-");
                let yyyyMMdd = `${d[0]}年${d[1]}月${d[2]}日`;
                let mmddhhmm = "";
                let hhmm = "";
                let hhmmss = "";
                if (dt.length > 1) {
                        let tm = dt[1];
                        let t = dt[1].split(":");
                        hhmm = `${t[0]}:${t[1]}`;
                        hhmmss = `${t[0]}:${t[1]}:${t[2]}`;
                        mmddhhmm = `${parseInt(d[1])}月${parseInt(d[2])}日 ` + hhmm;
                }
                switch (type) {
                        case "hhmm":
                                return hhmm;
                        case "hhmmss":
                                return hhmmss;
                        case "mmddhhmm":
                                return mmddhhmm;
                        default:
                                return `${yyyyMMdd} ${hhmm}`;
                }
        });

        Vue.filter('myDataFilter', function (dataTimeStr, type) {
                if (!dataTimeStr || !type) return "";
                dataTimeStr = dataTimeStr.split(" ")[0];
                let date = new Date(dataTimeStr);

                let m = padLeftZero(date.getMonth() + 1 + "");
                let d = padLeftZero(date.getDate() + "");
                let day = date.getDay();

                switch (type) {
                        case "week":
                                return ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][day];
                                break;
                        case "month-day":
                                return `${m}-${d}`;
                                break;
                }

                function padLeftZero(str) {
                        return ('00' + str).substr(str.length);
                }
        })

        //解析后台的常量数据
        Vue.filter('analy', function (value, type) {
                return CONSTS[type][value] || value;
        })
}
export default mypFilters;