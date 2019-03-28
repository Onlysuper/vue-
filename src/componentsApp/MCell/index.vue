<template>
<div>
  <div :class="['myp-tr','border-1px',{'islink':islink}]">
    <div class="label-box">{{title}}:</div>
    <div class="content">
      <slot></slot>
    </div>
    <i v-if="islink" class="icon-arrow"></i>
  </div>
</div>

</template>

<script>
export default {
  name: "MCell",
  props: {
    title: {
      type: String,
      default: ""
    },
    islink: {
      type: false,
      default: ""
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.myp-tr {
  background: #fff;
  user-select: auto;
  border-bottom: 1px solid #eee;
  display: flex;
    height: 88 / @rem;
    line-height: 88 / @rem;
   font-size: 32 / @rem;
  // 可点击的样式
  .label-box {
    font-size: 34 / @rem;
    color:@m-color2;
    text-align: center;
    text-align: justify;
    text-justify: distribute-all-lines;
    text-align-last: justify;
    flex: 0 1;
   
    white-space: nowrap;
    display: flex;
    justify-content: flex-start;
     padding: 0 / @rem 30 / @rem;
  }
  .content {
     color: @m-color1;
    flex: 1;
    padding: 0 / @rem 30 / @rem;
    padding-left: 0;
    font-size: 14px;
    padding-left: 10px;
    white-space: normal;
    word-break: break-all;
    width: 100%;
    text-align: right;
   
  }
  // &:last-of-type {
  //   // > td {
  //     padding-bottom: 100 / @rem;
  //   // }
  // }
  // &:first-of-type {
  //   // > td {
  //     padding-top:100 / @rem;
  //   // }
  // }
}
</style>
