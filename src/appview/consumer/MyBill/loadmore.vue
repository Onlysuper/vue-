<template>
        <div class="infinite-scroll" v-infinite-scroll="loadMore" infinite-scroll-disabled="infiniteDisabled" infinite-scroll-immediate-check="true" @infinite-scroll-listen-for-event="event" infinite-scroll-distance="50">
                <slot></slot>

                <!--底部判断是加载图标还是提示全部加载-->
                <div class="more-loading">
                        <mt-spinner v-if="status=='请求中'" class="infinite-loading" type="snake" color="#00ccff" :size="20"></mt-spinner>
                        <span v-if="status=='请求失败'" @click="loadMore">网络异常，点击重试！</span>
                        <span v-if="status=='没有更多'">没有更多了</span>
                </div>
                <nodata v-if="status=='暂无数据'" v-model="nodata"></nodata>
                <nodata v-if="status=='绑定手机号'" v-model="nodata">
                        <div slot="tip">
                                <p slot="tip">暂无相关数据~</p><br />
                                <mt-button slot="tip" type="danger" plain style="border-radius:500px;" size="small" @click="$emit('bindingMobile')">点我绑定手机号</mt-button>
                        </div>
                        <p slot="footerTip">您还没有绑定相关手机号,<br />无法查询电子发票信息</p>
                </nodata>
        </div>
</template>

<script>
import Nodata from '@src/appcomponents/Nodata';
export default {
        components: { Nodata },
        props: {
                api: {
                        type: Function,
                        default: () => { }
                },
                openId: {
                        type: String,
                        default: ""
                },
                query: {
                        type: Object,
                        default() {
                                return {

                                };
                        }
                }
        },
        data() {
                return {
                        status: "", // 加载状态
                        nodata: true,
                        list: [],
                }
        },
        computed: {
                // 返回true禁用下拉加载
                infiniteDisabled() {
                        return this.status == '请求中' || this.status == '没有更多' || this.status == '暂无数据';
                }
        },
        watch: {
                list(list) {
                        this.$emit("watchDataList", list);
                }
        },
        methods: {
                // 调用api加载数据
                loadApiData(query) {
                        this.status = "请求中";
                        return this.api(this.openId)(this.query).then(res => {
                                if (res.resultCode === "0") {
                                        return Promise.resolve(res.data);
                                } else if (res.resultCode == "80") {
                                        //请绑定手机号
                                        this.status = "绑定手机号";
                                        // this.$emit("bindingMobile");
                                        return Promise.reject();
                                } else if (res.resultCode == "81") {
                                        //发票列表信息未找到
                                        this.status = "暂无数据";
                                        return Promise.reject();
                                } else if (res.resultCode == "-100") {
                                        this.status = "请求失败";
                                        this.Toast(res.resultMsg);
                                        return Promise.reject();
                                } else {
                                        this.Toast(res.resultMsg);
                                        return Promise.reject();
                                }
                        });
                },
                loadTop() {
                        this.query.pageNum = 1;
                        this.list = [];
                        this.loadApiData(this.query).then(list => {
                                setTimeout(() => {
                                        this.list = list;
                                        this.checkData(list);
                                        this.$emit("refresh");
                                }, 500);
                        });
                },
                loadMore() {
                        this.loadApiData(this.query).then(list => {
                                setTimeout(() => {
                                        this.list = this.list.concat(list);
                                        this.checkData(list);
                                }, 500);
                        });
                },
                // 设置数据
                checkData(list) {
                        // 是否有更多数据
                        if (this.list.length === 0) {
                                this.status = "暂无数据";
                        } else if (this.query.pageSize > list.length) {
                                this.status = "没有更多";
                        } else {
                                this.status = "请求更多";
                                this.query.pageNum++;
                        }
                },
                event() {
                        console.log("触发了event");
                }
        },
}
</script>

<style lang="less" scoped>
.more-loading {
        height: 50px;
        line-height: 50px;
        text-align: center;

        .infinite-loading {
                float: left;
                margin: 10px 50% 0;
                transform: translateX(-50%);
        }
}
</style>
