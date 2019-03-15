<template>
          <div class="switch-component" @click="click" :class='{"active":checked}'>
                    <div class="btn"></div>
          </div>
</template>

<style lang="less">
@import url(../../assets/less/base.less);
.switch-component {
  width: 100%;
  height: 60/@rem;
  border-radius: 30/@rem;
  background: #ccc;
  position: relative;
  padding: 1px 0;
  .btn {
    width: 60/@rem;
    height: 60/@rem;
    background: #fff;
    border-radius: 50%;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    -webkit-transition: left 0.2s linear;
    transition: left 0.2s linear;
  }
}

.active {
  background: #4cd964;
  .btn {
    left: calc(~"100% - "60/@rem);
  }
}
</style>

<script>
export default {
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    click: {
      type: Function,
      default: function () { }
    }
  },
  data() {
    return {
      active: this.checked,
      handleClick: this.click
        ? this.click
        : function () {
          this.active = !this.active;
        }
    };
  },
  methods: {}
};
</script>