<template>
        <div class="date-banner">
                <div class="fixed-main border-bottom-1px">
                        <div class="le">
                                <div class="date">{{date}}</div>
                                <div class="total" v-if="total">{{total}}</div>
                        </div>
                        <!-- <div class="ri" @click="$emit('confirm')">筛选</div> -->
                </div>
        </div>
</template>

<script>
export default {
        props: {
                date: {
                        type: String,
                        default: ""
                },
                total: {
                        type: String,
                        default: ""
                }
        },

}
</script>

<style lang="less" scoped>
@import "../../assets/less/base.less";
.date-banner {
        height: 130 / @rem;
        position: relative;
        .fixed-main {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 130 / @rem;
                padding: 20 / @rem;
                box-sizing: border-box;
                font-size: 32 / @rem;
                background-color: #f2f2f2;
                // border-top: 1px solid #ccc;
                // border-bottom: 1px solid #ccc;
                z-index: 1;
                display: flex;
        }
        .le {
                flex: 1;
                align-items: center;
                display: flex;
        }
        .ri {
                // height: 100/@rem;
                // width: 120/@rem;
                // border: 1px solid #ccc;
                vertical-align: middle;
        }
        // display: flex;
        .date {
                flex: 1;
        }
        .total {
                font-size: 30 / @rem;
                color: #8e8e8e;
        }
}
.scroll-no-fixed {
        .ri {
                display: none;
        }
}
.scroll-fixed .fixed-main {
        position: fixed;
        left: 0;
        top: 40px;
        width: 100%;
        z-index: 1;
        .ri {
                display: block;
        }
}
</style>
