<template>
  <div class="pay-order-container page">
    <div class="pay-order-open">
      <div class="top-back-box">
        <div class="row-box-one">
          <div class="item">
            <div class="item-label">今日{{payType | analyFilter(CONST,'payType')}}收入(元)</div>
            <div class="item-content">{{totalAmount | moneyFormatCN}}</div>
          </div>
          <div class="item">
            <div class="item-label">交易共(笔)</div>
            <div class="item-content">{{totalAllCount}}</div>
          </div>
        </div>
        <div class="row-box-two">
          <div class="item">
            <div class="item-label">微信(笔)</div>
            <div class="item-content">{{totalWechatCount}}</div>
          </div>
          <div class="item">
            <div class="item-label">支付宝(笔)</div>
            <div class="item-content">{{totalAlipayCount}}</div>
          </div>
          <div class="item">
            <div class="item-label">刷卡(笔)</div>
            <div class="item-content">{{totalSkCount}}</div>
          </div>
          <div class="item">
            <div class="item-label">银联二维码(笔)</div>
            <div class="item-content">{{ylCount}}</div>
          </div>
        </div>
      </div>

      <div class="navbar-box">
        <div class="navbar-item _av">
          <select class="navbar-select" v-model="payType" @change="selectChange">
            <option
              v-for="(item,index) in payTypes"
              :key="index"
              v-bind:value="item.code"
            >{{item.name}}</option>
          </select>
        </div>
        <div class="line-split">
        </div>
        <div class="navbar-item navbar-line _av" @click="toHistory">历史记录</div>
      </div>
    </div>
  </div>
</template>

<script>
import PayItem from "@src/componentsApp/PayItem";
import utils from "@src/common/utils.js";
import base from "@src/apis/base.js";
import { md5Encrypt } from "@src/common/secret.js";
import Loadmore from "@src/componentsApp/Loadmore";
import CONST from "@src/viewApp/customer/PayOrder/state.json";
import { Toast } from "mint-ui";
import {
  payOrderQuery,
  payOrderTodayTotal,
  payOrderQueryList
} from "@src/apis";
export default {
  components: {
    PayItem,
    Loadmore
  },
  data() {
    return {
      CONST: CONST,
      scroll: 0,
      openId: utils.getOpenId(),
      payType: "",
      payTypes: {
      
        ...[{
          name: "全部",
          code: "",
          color: "",
        },...utils.constToArr(CONST.payType)]
      },
      totalCount: 0,
      totalAmount: 0,
      totalAllCount: 0,
      totalWechatCount: 0,
      totalAlipayCount: 0,
      totalSkCount: 0,
      ylCount: 0,
      api: payOrderQueryList,
      list: []
    };
  },
  mounted() {
    this.init();
  },
  computed: {},
  methods: {
    scrollChanged() {
      this.scroll = this.$refs.scrollWarpper.scrollTop;
    },
    selectChange(e) {
      this.init();
    },
    refresh() {
      this.payTotal();
    },
    init() {
      this.scroll = 0;
      this.payTotal();
    },
    payTotal() {
      let phone = utils.storage.getStorage("telePhone");
      let token = utils.storage.getStorage("token");
      let merCode = utils.storage.getStorage("merCode");
      let startTime = utils.formatDate(new Date(), "yyyy-MM-dd");
      let endTime = utils.formatDate(new Date(), "yyyy-MM-dd");
      if(startTime){
        startTime=startTime.replace(/\/|\-/gi,"")
      }
      if(endTime){
        endTime=endTime.replace(/\/|\-/gi,"")
      }
      payOrderTodayTotal(this.openId)({
        telePhone: phone,
        token: token,
        merCode: merCode,
        startTime: startTime,
        endTime: endTime,
        payType: utils.replaceSort(this.payType),
        md5Data: md5Encrypt(
          `${phone + merCode + startTime + endTime + token + base.md5Data}`
        )
      }).then(res => {
        if (res.code === "001") {
          try {
            let data = res.result.data.merTodayTranAllInfo;
            this.totalAmount = data.totalTranAmtSum; // 今日微信交易金额
            this.totalAllCount = data.totalCount; //  当天总交易条数
            this.totalWechatCount = data.wxCount; //  当天微信交易条数
            this.totalAlipayCount = data.zfbCount; // 当前支付宝交易条数
            this.totalSkCount = data.skCount; // 当前刷卡交易条数
            this.ylCount = data.ylCount; // 当前银联二维码交易条数
          } catch (err) {
            console.log(err);
            // this.Toast('暂无数据');
          }
        } else {
          this.Toast(data.message);
        }
      });
    },
    toDetail(item) {
      this.$router.push({
        path: "/customer/payOrderDetail",
        query: item
      });
    },
    toHistory() {
      this.$router.push({ path: "/customer/payOrderHistory" });
    },
    watchDataList(list) {
      // lists.pop();
      this.list = list;
      /*
       * 根据判断在“全屏模式下”是否否和监听事件的条件，控制header显示隐藏。解决ios滚动时抖动的BUG。
       */
      this.$refs.scrollWarpper.removeEventListener(
        "scroll",
        this.scrollChanged
      );
      this.$nextTick(() => {
        //定时器是解决下拉刷新时，等顶部loadingd元素的归位动画完毕后在注册事件，否则会计算出误。
        setTimeout(() => {
          let items = this.$refs.scrollWarpper.querySelectorAll(".list-item");
          let lastItem = items[items.length - 1];
          let headerHeight = this.$refs.header.getBoundingClientRect().height;
          //判断条件：数组中最后一项元素距离顶部的距离 必须大于 window的高度的时候在监听滚动事件。
          //减去header的高度是要考虑全屏模式下的高度
          if (
            lastItem &&
            lastItem.getBoundingClientRect().top - headerHeight >
              window.innerHeight
          ) {
            this.$refs.scrollWarpper.addEventListener(
              "scroll",
              this.scrollChanged
            );
          }
        }, 500);
      });
    }
  }
};
</script>


<style lang="less" scoped>
@import url(../../../../assets/less/base.less);
.pay-order-container {
  .transformPage();
  @front-color: #000;
  @total-background-color: #3d8fe2;
  @navbar-background-color: #f2f8fd;
  @item-background-color: @front-color;
  .pay-order-open {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #fff;
    .top-back-box {
      color: #fff;
      background: @total-background-color;
      padding-left: 30 / @rem;
      padding-right: 30 / @rem;
      padding-top: 50 / @rem;
      padding-bottom: 30 / @rem;
      font-size: 30 / @rem;
      .item-label {
        color: #aacbe8;
        // padding-bottom: 10 / @rem;
      }
      .row-box-one {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .item {
          display: flex;
          flex-direction: column;
          &:first-of-type {
            text-align: left;
          }
          &:last-of-type {
            text-align: right;
          }
          .item-content {
            font-size: 52 / @rem;
            font-weight: 600;
          }
        }
      }
      .row-box-two {
        margin-top: 30 / @rem;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        text-align: center;
        .item {
          &:first-of-type {
            text-align: left;
          }
          &:last-of-type {
            text-align: right;
          }
          .item-content {
            // font-weight: bold;
            font-size: 36 / @rem;
          }
        }
      }
    }
    .navbar-box {
      border-bottom: 1px solid #eee;
      background: @navbar-background-color;
      // padding: 20/@rem 0 20/@rem 0;
      color: @front-color;
      font-size: 28 / @rem;
      display: flex;
      position: relative;
      select {
        margin-top: -15 / @rem;
        border: 0;
        width: 240 / @rem;
        text-align: center;
        /*很关键：将默认的select选择框样式清除*/
        appearance: none;
        /*在选择框的最右侧中间显示小箭头图片*/
        background: url("../../../../assets/images/arrow.png") no-repeat scroll
          right center transparent;
        background-size: 12px 7px;
        /*为下拉小箭头留出一点位置，避免被文字覆盖*/
        padding: 5px 5px 5px 14px;
        color: @front-color;
        option {
          background: @navbar-background-color;
        }
      }
      .navbar-item {
        flex:1;
        height: 90 / @rem;
        line-height: 90 / @rem;
        float: left;
        text-align: center;
      }
      .line-split{
        position: absolute;
        transform-origin: 0 0;
        transform: scale(0.5,1);
        background:#ccc;
        top: 0;
        bottom: 0;
        width: 1px;
        left: 50%;
      }
      .navbar-line {
        box-sizing: border-box;
        
      }
    }
  }
}
</style>
