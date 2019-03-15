<template>
    <div class="customer-header">
      <img class="xiaofang" :src="require('@src/assets/images/xiaofang.png')" alt="">
      <div class="info">
        <p>{{entName}}</p>
        <p>{{taxNo}}</p>
      </div>
    </div>
</template>

<script>
export default {
  name: "customer-header",
  props: {
    entName: {
      type: String,
      default: ""
    },
    taxNo: {
      type: String,
      default: ""
    }
  }
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.customer-header {
  background: #f2f2f2;
  box-sizing: border-box;
  display: flex;
  margin: 24/@rem 0;
  background: #fff;
  padding: 40/@rem;
  line-height: 50/@rem;
  .xiaofang {
    height: 120/@rem;
    margin-right: 20/@rem;
  }
  .info {
    width: 80%;
    padding: 10/@rem 0;
    p {
      font-size: 30/@rem;
      .text-ellipsis();
      width: 99%;
    }
  }
}
</style>
