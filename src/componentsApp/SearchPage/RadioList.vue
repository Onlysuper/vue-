<template>
  <div class="v-radio-list">
    <div class="title" v-if="config.title">{{config.title}}</div>
    <div class="list">
      <p></p>
      <div class="radio" :class="{active:(isActive == item.code||'sort-'+isActive == item.code)}" v-for="(item,index) in config.values" :key="index" @click="select(item)">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "v-radio-list",
  props: {
    config: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isActive: this.config.defaultValue
    }
  },
  methods: {
    select(item) {
      this.isActive = item.code;
      this.config.cb && this.config.cb(item.code);
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/base.less";

.v-radio-list {
  font-size: 32/@rem;
  .title {
    padding: 20/@rem;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    padding: 10/@rem
  }

  .list:after {
    content: "\0020";
    display: block;
    height: 0;
    clear: both;
  }

  .radio {
    width: 31.33%;
    align-items: center;
    line-height: 1.2;
    padding: 30/@rem 10/@rem;
    box-sizing: border-box;
    background: @m-color5;
    margin: 1%;
    color: @m-color3;
    border-radius: 2px;
    font-size: 28/@rem;
    text-align: center;
  }

  .active {
    background:#50b2fc;
    color:#fff;
    // background: @main-color2;
    // color:@main-color
  }
}
</style>
