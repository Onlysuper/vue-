<template>
    <div class="v-message">
        <div class="icon c-success">
            <slot name="icon"><i :class="icon"></i></slot>
        </div>
        <div class="title">{{title}}</div>
        <div class="desc">{{description}}</div>
    </div>
</template>

<script>
/**
 * props:属性
 * title
 * description
 * icon
 * 
*/
export default {
    props: ["icon", "title", "description"]
}
</script>

<style lang="less" scoped>
@import url(../../assets/less/base.less);
.v-message {
  text-align: center;
  padding: 20 / @rem 0;

  .icon {
    font-size: 200 / @rem;
    color: #09bb07;
  }

  .title {
    font-size: 50 / @rem;
  }

  .desc {
    margin-top: 20 / @rem;
    color: #999999;
  }
}
</style>
