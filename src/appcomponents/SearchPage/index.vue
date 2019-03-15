<template>
        <full-page class="page">
                <!-- <mt-header slot="header" :title="title+'查询'" class="re-mint-header">
      <mt-button slot="left" :disabled="false" type="danger" @click="$router.back()">返回</mt-button>
      <mt-button slot="right" size="small" type="danger" @click="queryResult">查询</mt-button>
    </mt-header> -->
                <div class="search-component">
                        <view-radius>
                                <input-wrapper>
                                        <component class="border-bottom-1px" ref="configDate" :is="item.type" :config="item" v-for="(item,index) in config" @openPicker="openPicker" :key="index"></component>
                                </input-wrapper>
                        </view-radius>
                        <br>
                        <!-- <mt-button class="okBtn" size="large" :disabled="false" @click="queryResult">查询</mt-button> -->
                        <!-- <br> -->
                </div>
        </full-page>
</template>

<script>
import Vue from "vue";
import utils from "@src/common/utils";
import Picker from "../Picker";
const MypText = Vue.extend({
        name: "myp-text",
        props: {
                config: {
                        type: Object,
                        default: {}
                }
        },
        data() {
                return {
                        value: this.config.defaultValue
                };
        },
        watch: {
                value(val) {
                        this.config.cb && this.config.cb(val);
                }
        },
        template: `<mt-field v-model="value"  class="" :label="config.title" :placeholder="'请输入'+config.title" ref="inputBox"></mt-field>`
});
const MypDate = Vue.extend({
        name: "myp-date",
        props: {
                config: {
                        type: Object,
                        default: {}
                }
        },
        data() {
                return {
                        value: this.config.defaultValue,
                        currentDate: new Date(),
                };
        },
        watch: {
                value(val) {
                        this.config.cb && this.config.cb(val);
                }
        },
        mounted() {
                // this.config.cb(this.config.defaultValue);
        },
        methods: {
                showDate() {
                        if (this.value) {
                                this.currentDate = new Date(this.value);
                        }
                        this.$refs.datePicker.open();
                },
                setDate(date) {
                        this.value = utils.formatDate(date, "yyyy-MM-dd");
                },
        },
        // template: `<mt-field @click.native="showDate(this)" :label="config.title" v-readonly-ios :disableClear="true" :readonly="true" :placeholder="'请输入'+config.title" v-model="value"></mt-field>`,
        template: `<div>
              <mt-cell :title="config.title" is-link @click.native="showDate">
                <span>{{value}}</span>
              </mt-cell>
              <mt-datetime-picker v-model="currentDate" :endDate="new Date()" type="date" @confirm="setDate" ref="datePicker" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日"></mt-datetime-picker>
            </div>`
});
const MypChekList = Vue.extend({
        name: "myp-chek-list",
        props: {
                config: {
                        type: Object,
                        default: {}
                }
        },
        data() {
                return {
                        value: []
                };
        },
        watch: {
                value(val) {
                        this.config.cb && this.config.cb(val);
                }
        },
        template: `<div><mt-cell :title="config.title" class="border-1px"></mt-cell><mt-checklist class="myp-chek-list border-1px" v-model="value" :options="config.options"></mt-checklist></div>`
});
const MypRadioList = Vue.extend({
        name: "myp-radio-list",
        props: {
                config: {
                        type: Object,
                        default: {}
                }
        },
        data() {
                return {
                        value: this.config.defaultValue
                };
        },
        mounted() {
                // this.config.cb(this.config.defaultValue);
        },
        watch: {
                value(val) {
                        this.config.cb && this.config.cb(val);
                }
        },
        template: `<div><mt-cell v-if="config.title" :title="config.title" class="border-1px"></mt-cell><mt-radio class="myp-radio border-1px" v-model="value" :options="config.options"></mt-radio></div>`
});
const MypSelect = Vue.extend({
        components: { Picker },
        name: "myp-select",
        props: {
                config: {
                        type: Object,
                        default: {}
                }
        },
        data() {
                return {
                        value: this.config.values.find(item => item.code == this.config.defaultValue) || {}
                };
        },
        methods: {
                confirm(val) {
                        this.value = val;
                        this.config.cb && this.config.cb(val.code);
                }
        },
        // template: `
        //   <div>
        //     <mt-field @click.native="$refs.Picker.open" v-model="value.name" :label="config.title" v-readonly-ios :disableClear="true" :readonly="true" :placeholder="'请选择'+config.title" ><i class="icon-arrow"></i></mt-field>
        //     <picker v-model="value" ref="Picker" :slotsActions="config.values" @confirm="confirm"></picker>
        //   </div>`
        template: `
    <div>
      <mt-cell :title="config.title" is-link @click.native="$refs.Picker.open">
        <span>{{value.name}}</span>
      </mt-cell>
      <picker v-model="value" ref="Picker" :slotsActions="config.values" @confirm="confirm"></picker>
    </div>`
});

import RadioList from "./RadioList";

export default {
        components: {
                MypText,
                MypDate,
                MypChekList,
                MypRadioList,
                MypSelect,
                "v-radio-list": RadioList
        },
        props: {
                value: {
                        type: Boolean,
                        default: false
                },
                title: {
                        type: String,
                        default: "搜索"
                },
                config: {
                        type: Array,
                        default: []
                }
        },
        data() {
                return {
                        dateVisible: false,
                        pickerVisible: false,
                        keyVal: "",
                        query: {},
                        currentDateObject: null,
                        slots: []
                };
        },
        watch: {
                title(val) {
                        this.title = val;
                },
                dateVisible(val) {
                        console.log("val", val);
                }
        },
        created() { },
        methods: {
                queryResult() {
                        this.$emit("result", this.keyVal);
                },
                openPicker(slots, context) {
                        this.pickerContext = context;
                        this.pickerVisible = true;

                        this.slots = slots;
                },
                pickerValuesChange(picker, values) {
                        console.log(values[0]);
                        this.pickerContext && (this.pickerContext.value = values[0]);
                }
        }
};
</script>

<style lang="less">
@import "../../assets/less/base.less";
.search-component {
        width: 100%;
        min-height: 100%;
        // margin-top: 20*$rem;
        padding: 30 / @rem 20 / @rem;
        box-sizing: border-box;
        background-color: #fff;
        .input-box {
                border: 1px solid #eee;
                .input-wrapper {
                        display: flex;
                        box-sizing: border-box;
                        align-items: center;
                        i {
                                padding-left: 10px;
                        }
                        .mint-field {
                                width: 100%;
                                background: none;
                        }
                }
        }
        .mintui-search {
                color: #ccc;
        }
        //公共
        .item {
                margin-top: 30 / @rem;
        }
        .public-title {
                line-height: 100 / @rem;
        }
        .myp-radio,
        .myp-chek-list {
                display: flex;
                flex-wrap: wrap;
                padding: 1px;
                .mint-cell {
                        background-image: none;
                        background-color: #fcfcfc;
                        width: 33.333%;
                }
                .mint-radiolist-label,
                .mint-checklist-label {
                        padding: 0;
                }
                .mint-radiolist-title,
                .mint-checklist-title {
                        margin: 0;
                }
                .mint-cell-wrapper {
                        padding: 5px;
                }
        }
}
</style>
