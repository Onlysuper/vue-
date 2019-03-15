<template>
          <div class="shareTip" :value="value" @click="close" v-if="visible">
                    <img :src="require('./share_tip.png')" alt="">
          </div>
</template>

<style lang="less">
.shareTip {
          position: fixed;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          z-index: 999;
          img {
                    width: 80%;
                    margin-left: 10%;
                    margin-top: 10px;
          }
}
</style>

<script>
export default {
          props: {
                    value: {
                              type: Boolean,
                              default: false
                    }
          },
          data() {
                    return {
                              visible: false
                    }
          },
          mounted() {
                    //判断默认值为true的时候watch无法监听
                    if (this.value) {
                              this.visible = true;
                    }
          },
          watch: {
                    //监听v-model值的变化而改变visible的值
                    value(val) {
                              this.visible = val;
                    },
                    //通知v-modle
                    visible(val) {
                              this.$emit('input', val);
                    }
          },
          methods: {
                    close() {
                              this.visible = false;
                    }
          }
}
</script>
