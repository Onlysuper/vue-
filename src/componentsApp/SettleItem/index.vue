<template>
  <div class="eic-item border-bottom-1px _av">
    <slot name="top"></slot>
    <!-- <div class="icon-box"> -->
      <slot name="icon"></slot>
      <slot name="iconname"></slot>
    <!-- </div> -->
    <div class="content">
      <div class="header">
        <p class="title">{{entName}}</p>
        <p class="amount" :class="{'amount-success':statusClass == 'SUCCESS'}">
          <span class="num">
            {{amount}}元
          </span>
        </p>
      </div>
      <div class="footer">
        <p class="time mar-l">{{time}}</p>
        <template v-for="(item,index) in status">
         <p :key="index" v-if="item.name==''?false:true" :class="'status'" :style="styleHandle(item)">{{item.name}}</p>
        </template>
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
      type: Array,
      default: [{
        name:"",
        color:""
      }]
    },
    // statuscolor: {
    //   type: String,
    //   default: ""
    // },
    amount: {
      type: [String, Number],
      default: ""
    },
    statusClass: {
      type: [String, Number],
      default: ""
    }
  },
  methods:{
    styleHandle(item){
      if(item.border){
        return {
          border:`1px solid ${item.color}`,
          color:item.color
        }
      }else{
          return {
            background:item.color,
            color:'#fff'
          }
      }
      
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
  .icon-box{
    // font-size: 80/@rem;
    font-size:42px;
    margin-left: 30/@rem;
    img{
        width: 80/@rem !important;
    }
  }
  
  .content {
    padding: 30/@rem 0;
    flex: 1;
    word-break: break-all;
  }

  .header,
  .footer {
    padding: 0 30/@rem;
    box-sizing: border-box;
    display: flex;
    font-size: 32/@rem;
    position: relative;
  }
  .footer{
    margin-top: 10 / @rem;
  }

  .title {
    flex: 1;
    color:@m-color1;
    font-size: 34 / @rem
  }

  .mar-l {
    // margin-right: 160/@rem;
  }

  .status {
    color: #fff;
    border-radius: 10/@rem;
    padding: 0/@rem 8/@rem;
    right: 30/@rem;
    font-size: 26/@rem;
    margin-left: 10/@rem;
    height: 36/@rem;
    line-height: 36/@rem;
  }
    .status-border {
    color: #fff;
    border-radius: 10/@rem;
    padding: 2/@rem 8/@rem;
    right: 30/@rem;
    font-size: 26/@rem;
    margin-left: 10/@rem;
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
    color: @m-color3;
  }

  .amount {
    text-align: right;
    padding-left: 20 / @rem;
    .num{
      font-size: 36 / @rem
    }
  }

  .amount-success {
    color: #04c511;
  }
}
</style>
