<template>
        <div class="myp-select-container" @touchmove.prevent v-if="visible">
                <!-- 主体 -->
                <mt-popup v-model="visible" position="bottom" class="myp-picker" :modal="false">
                        <mt-picker :slots="slots" valueKey="name" @change="change" :visibleItemCount="7" :itemHeight="36" :showToolbar="true">
                                <span class="mint-datetime-action mint-datetime-cancel" @click="close">取消</span>
                                <span class="mint-datetime-action mint-datetime-confirm" @click="okBtn">确定</span>
                        </mt-picker>
                </mt-popup>
                <!-- 遮罩层 -->
                <div class="myp-picker-mask" ref="selectPicherMask" @touchmove.prevent @click="close"></div>
        </div>

</template>


<script>
/**
 * picker 依赖mint-ui
 * @module picker
 * @desc 单元格
 * @param {string|Object} [model] - 要绑定的数据
 * @param {string} [slotsActions] - 列表项数组
 *
 * @example
 * <picker v-model="{ name: "1", code: "1" }" ref="Picker" :slotsActions="[{ name: "1", code: "1" },{ name: "2", code: "2" }]"></picker>
 * 打开 this.$refs.Picker.open()
 */
export default {
        props: {
                value: {
                        type: Object,
                        default: () => {
                                return {};
                        }
                },
                slotsActions: {
                        type: Array,
                        default: () => {
                                return [{ name: "", code: "" }];
                        }
                }
        },
        data() {
                return {
                        visible: false,
                        result: {},
                        slots: [
                                {
                                        flex: 1,
                                        defaultIndex: 0,
                                        //当值为对象数组时 [{ name: 1, age: 2 }] 需要在valueKey属性指定key用来显示
                                        values: this.slotsActions, // 把省的集合赋给第一个
                                        className: "slot1",
                                        textAlign: "center"
                                }
                        ]
                };
        },
        methods: {
                open() {
                        this.visible = true;
                        this.setDefaultIndex(this.value);
                },
                close() {
                        this.visible = false;
                },
                setDefaultIndex(result) {
                        this.slotsActions.forEach((element, index) => {
                                if (element.name == result.name && element.code == result.code) {
                                        this.slots[0].defaultIndex = index;
                                }
                        });
                },
                change(picker, values) {
                        this.result = values[0];
                },
                okBtn() {
                        this.close();
                        this.$emit("confirm", this.result);
                }
        }
};
</script>


<style lang="less">
@import "../../assets/less/base.less";
.myp-select-container {
        .picker-toolbar {
                border-bottom: solid 1px #eaeaea;
        }
}
</style>

<style lang="less" scoped>
@import "../../assets/less/base.less";
.myp-select-container {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        .myp-picker-mask {
                position: fixed;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
        }
        .myp-picker {
                width: 100%;
                height: 300px;
                background: rgba(255, 255, 255, 1);
        }
}
</style>

