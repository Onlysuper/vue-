<template>
        <search-page v-model="searchVisible" :config="searchConfig" @result="searchPanelResult" title="订单"></search-page>
</template>

<script>
import SearchPage from "@src/componentsApp/SearchPage";
import { mapState } from "vuex";
export default {
        components: { SearchPage },
        data() {
                return {
                        searchVisible: true,
                        searchConfig: []
                };
        },
        computed: {
                ...mapState({
                        searchQuery: state => state.payOrder.searchQuery
                })
        },
        mounted() {
                this.$nextTick(() => {
                        // this.searchConfig.push({
                        //         title: "交易类型",
                        //         type: "myp-radio-list",
                        //         defaultValue: this.searchQuery.payType || "ALL",
                        //         cb: value => {
                        //                 if (value == "ALL") value = "";
                        //                 this.$store.commit("PAY_ORDER_SET_SEARCH", {
                        //                         payType: value
                        //                 });
                        //         }
                        // });
                        // this.searchConfig.push({
                        //         title: "交易起始时间",
                        //         type: "myp-date",
                        //         defaultValue: this.searchQuery.startTime,
                        //         cb: value => {
                        //                 this.$store.commit("PAY_ORDER_SET_SEARCH", {
                        //                         startTime: value
                        //                 });
                        //         }
                        // });
                        // this.searchConfig.push({
                        //         title: "交易结束时间",
                        //         type: "myp-date",
                        //         defaultValue: this.searchQuery.endTime,
                        //         cb: value => {
                        //                 this.$store.commit("PAY_ORDER_SET_SEARCH", {
                        //                         endTime: value
                        //                 });
                        //         }
                        // });
                });
        },
        methods: {
                searchPanelResult() {
                        this.$store.commit("PAY_ORDER_IS_SEARCH", true);
                        this.$router.back();
                }
        }
};
</script>

<style>
</style>
