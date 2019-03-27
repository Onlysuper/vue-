<template>
        <scroller style="top: 0px" ref="loadmore" :snapping="false" :snap-height="50" :animationDuration="150" :on-refresh="loadTop" :on-infinite="loadBottom" refresh-layer-color="#4b8bf4" loading-layer-color="#ec4949">
                <!-- custom refresh spinner, use default `spinner` & viewBox 0,0,64,64 class -->
                <svg class="spinner" style="stroke: #4b8bf4;" slot="refresh-spinner" viewBox="0 0 64 64">
                        <g stroke-width="7" stroke-linecap="round">
                                <line x1="10" x2="10" y1="27.3836" y2="36.4931">
                                        <animate attributeName="y1" dur="750ms" values="16;18;28;18;16;16" repeatCount="indefinite"></animate>
                                        <animate attributeName="y2" dur="750ms" values="48;46;36;44;48;48" repeatCount="indefinite"></animate>
                                        <animate attributeName="stroke-opacity" dur="750ms" values="1;.4;.5;.8;1;1" repeatCount="indefinite"></animate>
                                </line>
                                <line x1="24" x2="24" y1="18.6164" y2="45.3836">
                                        <animate attributeName="y1" dur="750ms" values="16;16;18;28;18;16" repeatCount="indefinite"></animate>
                                        <animate attributeName="y2" dur="750ms" values="48;48;46;36;44;48" repeatCount="indefinite"></animate>
                                        <animate attributeName="stroke-opacity" dur="750ms" values="1;1;.4;.5;.8;1" repeatCount="indefinite"></animate>
                                </line>
                                <line x1="38" x2="38" y1="16.1233" y2="47.8767">
                                        <animate attributeName="y1" dur="750ms" values="18;16;16;18;28;18" repeatCount="indefinite"></animate>
                                        <animate attributeName="y2" dur="750ms" values="44;48;48;46;36;44" repeatCount="indefinite"></animate>
                                        <animate attributeName="stroke-opacity" dur="750ms" values=".8;1;1;.4;.5;.8" repeatCount="indefinite"></animate>
                                </line>
                                <line x1="52" x2="52" y1="16" y2="48">
                                        <animate attributeName="y1" dur="750ms" values="28;18;16;16;18;28" repeatCount="indefinite"></animate>
                                        <animate attributeName="y2" dur="750ms" values="36;44;48;48;46;36" repeatCount="indefinite"></animate>
                                        <animate attributeName="stroke-opacity" dur="750ms" values=".5;.8;1;1;.4;.5" repeatCount="indefinite"></animate>
                                </line>
                        </g>
                </svg>

                <slot></slot>

                <!-- custom infinite spinner -->
                <svg class="spinner" style="fill: #ec4949;" slot="infinite-spinner" viewBox="0 0 64 64">
                        <g>
                                <circle cx="16" cy="32" stroke-width="0" r="3">
                                        <animate attributeName="fill-opacity" dur="750ms" values=".5;.6;.8;1;.8;.6;.5;.5" repeatCount="indefinite"></animate>
                                        <animate attributeName="r" dur="750ms" values="3;3;4;5;6;5;4;3" repeatCount="indefinite"></animate>
                                </circle>
                                <circle cx="32" cy="32" stroke-width="0" r="3.09351">
                                        <animate attributeName="fill-opacity" dur="750ms" values=".5;.5;.6;.8;1;.8;.6;.5" repeatCount="indefinite"></animate>
                                        <animate attributeName="r" dur="750ms" values="4;3;3;4;5;6;5;4" repeatCount="indefinite"></animate>
                                </circle>
                                <circle cx="48" cy="32" stroke-width="0" r="4.09351">
                                        <animate attributeName="fill-opacity" dur="750ms" values=".6;.5;.5;.6;.8;1;.8;.6" repeatCount="indefinite"></animate>
                                        <animate attributeName="r" dur="750ms" values="5;4;3;3;4;5;6;5" repeatCount="indefinite"></animate>
                                </circle>
                        </g>
                </svg>
        </scroller>
</template>
  
<script>
import { Toast } from "mint-ui";
import utils from "@src/common/utils.js";
import Vue from 'vue'
import VueScroller from 'vue-scroller'
Vue.use(VueScroller)

export default {
        name: "myp-loadmore-api",

        props: {
                api: {
                        type: Function,
                        default: () => { }
                },
                handeleResault: {
                        type: Function,
                        default: (res) => {
                                return res.result.data;
                        }
                },
                
                //loadQuery默认值
                defaultLoadQuery: {
                        type: Object,
                        default() {
                                return {
                                        pageSize: 20,//查询条数
                                        currentPage: 0// 当前页数
                                };
                        }
                },
                // searchQuery: {
                //   type: Object,
                //   default() {
                //     return {};
                //   }
                // }
        },
        watch: {
                list(list) {
                        console.log(list);
                        this.$emit("watchDataList", list, this.count, this.loadQuery.currentPage);
                }
        },
        data() {
                return {
                        list: [],
                        count: 0,
                        //指定loadQuery条件
                        loadQuery: {},

                        allLoaded: false,
                        openId: utils.getOpenId()
                };
        },
        mounted() {
                this.$refs.loadmore.finishInfinite(true);
        },

        methods: {
                loadData(query) {
                        if(query.startTime){
                                query.startTime=query.startTime.replace(/\/|\-/gi,"")
                        }
                        if(query.endTime){
                                query.endTime=query.endTime.replace(/\/|\-/gi,"")
                        }
                        console.log(query);
                        return this.api()(query).then(res => {
                                if (res.code === "001") {
                                        let data =this.handeleResault(res);
                                        this.count = data.totalRows;
                                        return data.resultList || [];
                                } else {
                                        Toast(res.message);
                                        return [];
                                }
                        });
                },
                //首次加载和搜索加载操作
                load(searchQuery) {
                        this.allLoaded = false;
                        this.searchQuery = searchQuery || {};
                        this.loadQuery = { ...this.defaultLoadQuery, ...this.searchQuery };
                        this.list = [];
                        this.$refs.loadmore.finishInfinite(false);
                        // this.loadQuery.currentPage++;
                        // this.loadData(this.loadQuery).then(list => {
                        //   this.list = list;
                        //   this.isAllLoaded(list);
                        // });
                },
                //下拉刷新操作
                loadTop(done) {
                        this.allLoaded = false;
                        this.loadQuery = { ...this.defaultLoadQuery, ...this.searchQuery };

                        this.loadQuery.currentPage = 1;
                        this.$emit("currentPageChange",this.loadQuery.currentPage)
                        this.loadData(this.loadQuery).then(list => {
                                setTimeout(() => {
                                        this.list = list;
                                        done();
                                        // this.$refs.loadmore.finishInfinite(false);
                                        this.isAllLoaded(list);
                                        this.$emit("refresh");
                                }, 500);
                        });
                },
                //上拉加载操作
                loadBottom(done) {
                        if (this.allLoaded) {
                                done(true)
                                return;
                        };
                         this.loadQuery.currentPage++;
                         this.$emit("currentPageChange",this.loadQuery.currentPage)
                        this.loadData(this.loadQuery).then(list => {
                                setTimeout(() => {
                                        this.list = this.list.concat(list);
                                        done();
                                        this.isAllLoaded(list);
                                }, 500);
                        });
                },
                isAllLoaded(data) {
                        if (data.length < this.loadQuery.pageSize) {
                                this.$refs.loadmore.finishInfinite(true);
                                this.allLoaded = true;
                        }

                }
        }
};
</script>

<style lang="less">
</style>