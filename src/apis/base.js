function getUrl() {
        switch (process.env.VUE_APP_TITLE) {
            case "development":
                return ""
            case "productionTest":
                return location.protocol + '//' + location.host;
            case "production":
                return location.protocol + '//' + location.host;
        }
    }
export default {
        md5Data:"ZzJ2A2r_H1D9LJ589DY",
        oaIp:"http://easy-mock.liuup.com/mock/5c98365fd360c27a130ae4bc"
        // oaIp: getUrl()
}
