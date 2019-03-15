<template>
  <div class="view-radius">
    <slot></slot>
  </div>
</template>

<style lang="less">
.view-radius {
  width: 100%;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
  box-shadow: 0px 0px 2px 0px #ccc;
}
</style>
<script>
export default {
  name: "ViewRadius"
};
</script>
