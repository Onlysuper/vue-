<template>
        <div class="v-mask" v-if="visable" @click="visable = false" @touchmove.prevent></div>
</template>

<script>
export default {
        name: "v-mask",
        data() {
                return {
                        visable: false
                };
        },
        props: {
                value: {
                        type: Boolean,
                        default: false
                }
        },
        watch: {
                value(val) {
                        this.visable = val;
                },
                visable(val) {
                        if (val) {
                                // console.log("打开mask");

                        } else {
                                // console.log("关闭mask");
                        }
                        this.$emit("input", val);
                }
        },
        mounted() {
                this.visable = this.value;
        }
};
</script>

<style lang="less" scoped>
.v-mask {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
}
</style>
