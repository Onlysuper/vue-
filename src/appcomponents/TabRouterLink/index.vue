<template>
  <div class="tabs" :class="{flexd:flexd}">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ["flexd"]
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.flexd {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
}
.tabs {
  background: #fff;
  border-bottom: 1px solid #bbbbbb;
  font-size: 36/@rem;
  display: flex;
  height: 120/@rem;
  a {
    flex: 1;
    line-height: 120/@rem;
    text-align: center;
    position: relative;
    color: #000;
  }
  .router-link-exact-active {
    color: #ea0007;
    border-bottom: 2px solid #ea0007;
  }
  //中间线
  a:after {
    content: "";
    width: 3px;
    position: absolute;
    right: 0;
    top: 10%;
    height: 80%;
    border-right: 1px solid #bbbbbb; // float: right;
  }
  a:last-child {
    &:after {
      content: none;
    }
  }
}
</style>
