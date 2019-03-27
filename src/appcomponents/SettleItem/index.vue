<template>
  <div class="eic-item border-bottom-1px _av">
    <slot name="top"></slot>
    <div class="icon">
      <slot name="icon"></slot>
    </div>
    <div class="content">
      <div class="header">
        <p class="title">{{entName}}</p>
        <p class="amount" :class="{'amount-success':statusClass == 'SUCCESS'}">{{amount}}元</p>
      </div>
      <div class="footer">
        <p class="time mar-l">{{time}}</p>
        <p class="status red" v-if="statusClass != 'SUCCESS'" :class="{success:statusClass == 'SUCCESS'}">{{status}}</p>
      </div>
    </div>
  </div> 
</template>

<script>
export default {
  props: {
    entName: {
      type: String,
      default: ""
    },
    time: {
      type: String,
      default: ""
    },
    status: {
      type: String,
      default: ""
    },
    amount: {
      type: [String, Number],
      default: ""
    },
    statusClass: {
      type: [String, Number],
      default: ""
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../assets/less/base.less";
.eic-item {
  box-sizing: border-box;
  background-color: #fff;
  box-sizing: border-box;
  padding: 0/@rem 0/@rem;
  display: flex;
  width: 100%;
  align-items: center;

  .icon {
    i {
      font-size: 80/@rem;
      margin-left: 30/@rem;
    }
  }

  .content {
    padding: 10/@rem 0;
    flex: 1;
  }

  .header,
  .footer {
    padding: 10/@rem 30/@rem;
    box-sizing: border-box;
    display: flex;
    font-size: 32/@rem;
    position: relative;
  }

  .title {
    flex: 1;
  }

  .mar-l {
    margin-right: 160/@rem;
  }

  .status {
    background: #48af12;
    color: #fff;
    border-radius: 10/@rem;
    padding: 2/@rem 8/@rem;
    position: absolute;
    right: 30/@rem;
    font-size: 26/@rem;
  }

  .red {
    background: #ff5b5b;
  }

  .success {
    background: #48af12;
  }

  .footer {
    font-size: 30/@rem;
    // margin-top: 40/@rem;
  }

  .time {
    flex: 1;
    color: #8e8e8e;
  }

  .amount {
    text-align: right;
    color: #ff5b5b;
    font-weight: 600;
  }

  .amount-success {
    color: #04c511;
  }
}
</style>
