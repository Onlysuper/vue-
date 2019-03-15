<template>
  <div class="v-radio-list">
    <div class="title" v-if="config.title">{{config.title}}</div>
    <div class="list">
      <div class="radio" :class="{active:isActive == item.code}" v-for="(item,index) in config.values" :key="index" @click="select(item)">{{item.name}}</div>
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
  }

  .list:after {
    content: "\0020";
    display: block;
    height: 0;
    clear: both;
  }

  .radio {
    width: 31.33%;
    // flex: 1;
    // display: inline-block;
    align-items: center;
    // float: left;
    line-height: 1;
    padding: 30/@rem 10/@rem;
    box-sizing: border-box;
    background: #a2a2a2;
    margin: 1%;
    color: #fff;
    border-radius: 2px;
    font-size: 30/@rem;
    text-align: center;
  }

  .active {
    background-color: #26a2ff;
  }
}
</style>
