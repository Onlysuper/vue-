<!--
 * 发送验证码按钮组件
 * 
 * 指定时间参数 time:2
 * 指定文字参数 text : "发送验证码"
 * 指定点击事件的回调函数
-->

<template>
          <button class="timer-btn" :class="{'timer-btn-active':timerBtnActiveClass}" @click="handleClick" @touchstart="timerBtnActiveClass = true" @touchend="timerBtnActiveClass = false" :disabled="disabled">
                    {{s}}
          </button>
</template>

<script>
export default {
  data() {
    return {
      disabled: false, //默认不disabled
      timerBtnActiveClass: false,
      s: this.text
    };
  },
  props: {
    cb: {
      type: Function,
      default: function() {
        console.info("请传入回调函数");
      }
    },
    time: {
      type: Number,
      default: 6,
      required: true
    },
    text: {
      type: String,
      default: "发送验证码"
    },
    textEnd: {
      type: String,
      default: "重新发送"
    }
  },
  methods: {
    handleClick() {
      this.cb();
    },
    //启动倒计时
    timer() {
      var num = this.time;
      var t = null;
      this.s = num + "秒";
      t = setInterval(() => {
        if (num == 0) {
          this.disabled = false;
          this.s = this.textEnd;
          clearInterval(t);
          return;
        }
        num--;
        this.s = num + "秒";
      }, 1000);
    }
  }
};
</script>

<style lang="less">
@import url(../../assets/less/base.less);
.timer-btn {
  width: 200/@rem;
  height: 60/@rem;
  line-height: 60/@rem;
  text-align: center;
  border: 1px solid #b0b0b0;
  border-radius: 60/@rem;
  margin-top: 20/@rem;
  color: #6f6f6f;
}

.timer-btn-active {
  background: #e3e3e3;
  opacity: 0.8;
}
</style>
