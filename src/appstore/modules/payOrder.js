

import utils from "@src/common/utils";
export default {
        state: {
                searchQuery: {

                }, //搜索条件
                isSearch: false,//是否搜索操作，便于刷新
        },
        getters: {
        },
        mutations: {
                //初始化store customerManage
                ["PAY_ORDER_INIT"](state) {
                        state.list = [];
                        state.isSearch = false;
                        state.searchQuery = {
                                payType: "",
                                startTime: utils.formatDate(new Date(), "yyyy-MM-dd"),
                                endTime: utils.formatDate(new Date(), "yyyy-MM-dd")
                        };
                        console.log("初始化store数据")
                },

                //设置搜索条件
                ["PAY_ORDER_SET_SEARCH"](state, searchObj) {
                        state.searchQuery = Object.assign(state.searchQuery, searchObj)
                },

                //是否开始搜索
                ["PAY_ORDER_IS_SEARCH"](state, flag) {
                        state.isSearch = flag;
                }
        },
        actions: {
        }
};
