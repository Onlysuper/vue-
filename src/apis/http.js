import axios from "axios";
import qs from "qs";
import utils from "@src/common/utils.js";
import { Indicator } from 'mint-ui'

//全局请求拦截器
axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
        config.isLoading && Indicator.open();
        return config;
}, function (error) {
        return Promise.reject(error);
})

//全局响应拦截器
axios.interceptors.response.use(function (response) {
        Indicator.close();
        //如果状态吗正常直接返回data中的数据
        if (response && response.status === 200) {
                //如果登录过期了
                if (response.data && response.data.resultCode === "002"||/token校验失败/g.test(response.data.message)) {
                        utils.storage.removeStorage("token");
                        utils.storage.removeStorage("telePhone")
                        utils.storage.removeStorage("merCode")
                        setTimeout(() => { location.reload() }, 2000); 
                        return {
                                resultCode: -103,
                                message: "请重新登录！"
                        };
                }
                return response.data;
        } else {
                return {
                        resultCode: -102,
                        message: "HTTP状态码：" + response.status
                };
        }
}, function (error) {
        Indicator.close();
        //请求超时
        if (error.code == "ECONNABORTED") {
                return Promise.resolve({
                        resultCode: -100,
                        message: "请求超时,请稍候再试！",
                });
        } else {
                return Promise.resolve({
                        resultCode: -100,
                        message: "请求失败，请检查网络！",
                });
        }
})

export default {

        post: function (baseURL, url, data) {
                return axios({
                        method: "post",
                        url: url,
                        baseURL: baseURL,
                        data: qs.stringify(data),
                        timeout: 10000,
                        headers: {
                        "X-requested-With": "XMLHttpRequest",
                        //使用form表单进行数据交互
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                        }
                })
        },
        postJSON: function (baseURL, url, data, isLoading) {
                return axios({
                        method: "post",
                        url: url,
                        baseURL: baseURL,
                        data: data,
                        timeout: 10000,
                        isLoading: isLoading == false ? false : true,
                        headers: {
                                // "X-requested-With": "XMLHttpRequest",
                                //使用form表单进行数据交互
                                // "X-requested-With": "XMLHttpRequest",
                                "Cache-Control": "no-cache",
                                "Content-Type": "application/json;charset=UTF-8"
                        },
                })
        },
        get: function (baseURL, url, params, isLoading) {
                return axios({
                        method: "GET",
                        url: url,
                        baseURL: baseURL,
                        params: params,
                        timeout: 10000,
                        isLoading: isLoading == false ? false : true,
                        // headers: {
                        //           "X-requested-With": "XMLHttpRequest"
                        // }
                })
        },
        delete: function (baseURL, url, params, isLoading) {
                return axios({
                        method: "DELETE",
                        url: url,
                        baseURL: baseURL,
                        params: params,
                        timeout: 10000,
                        isLoading: isLoading == false ? false : true,
                        // headers: {
                        //           "X-requested-With": "XMLHttpRequest"
                        // }
                })
        },
        put: function (baseURL, url, params, isLoading) {
                return axios({
                        method: "PUT",
                        url: url,
                        baseURL: baseURL,
                        params: params,
                        timeout: 10000,
                        isLoading: isLoading == false ? false : true,
                        // headers: {
                        //           "X-requested-With": "XMLHttpRequest"
                        // }
                })
        }
}