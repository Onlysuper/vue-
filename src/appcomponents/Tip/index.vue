<template>
  <div class="total-box clear ani" slot="header" v-show="visible">
    <div class="content">{{content}}<slot></slot></div>
    <i v-if="showClose" class="icon-close" @click="close"></i>
  </div>
</template>

<script>
export default {
  props: ["content", "showClose", "fixed"],
  data() {
    return {
      visible: true
    }
  },
  methods: {
    close() {
      this.visible = false;
    }
  }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
@keyframes ani {
  0% {
    transform: scaleY(0);
    opacity: 0;
  }
  100% {
    transform: scaleY(1);
    opacity: 1;
  }
}
.total-box {
  background: #ec4d4d;
  line-height: 60/@rem;
  color: #fff;
  padding: 0 20/@rem;
  display: flex;
  align-items: center;
  animation: ani 0.3s linear both;
  // transform-origin: left top;
  font-size: 28/@rem;
  .content {
    flex: 1;
  }
}
</style>
