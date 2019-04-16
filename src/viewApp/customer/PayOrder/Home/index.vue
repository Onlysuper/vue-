<template>
  <div class="pay-order-container page">
    <div class="pay-order-open">
      <div class="top-back-box">
        <div class="row-box-one">
          <div class="item">
            <div class="item-label">今日{{searchQuery.tranType | analyFilter(CONST,'payType','issort')}}收入(元)</div>
            <div class="item-content">{{totalAmount | moneyFormatCN(true)}}</div>
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
          <select class="navbar-select" v-model="searchQuery.tranType" @change="selectChange">
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
       <div class="today-pay-order-list" ref="scrollWarpper">
          <loadmore :api="api" @watchDataList="watchDataList" :handeleResault="handeleResault" :currentPageFn="currentPageFn"  ref="MypLoadmoreApi" @refresh="refresh">
                  <div class="list-item" v-for="(item,index) in list" :key="index">
                          <settle-item  
                          :status="[
                                  {
                                  name:(utils.valToName(CONST,'revFlag',`${item.revFlag}`,'issort')=='成功'?'':utils.valToName(CONST,'revFlag',`${item.revFlag}`,'issort')),
                                  color:utils.valToColor(CONST,'revFlag',`${item.revFlag}`,'issort'),
                                  border:true
                                  }
                          ]"
                          @click.native="toDetail(item)" 
                          :entName="item.merName"
                          :time="item.tranDateTime | dateTimeFilter"
                          :amount="item.tranAmt | moneyFormatCN(true)"
                          >
                          <span slot="icon"  :class="'icon '+iconHandle(item.tranType)"></span>
                          </settle-item>
                  </div>
          </loadmore>
      </div>
    </div>
  </div>
</template>

<script>
import SettleItem from "@src/componentsApp/SettleItem";
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
    SettleItem,
    Loadmore
  },
  data() {
    return {
      CONST: CONST,
      scroll: 0,
      openid: utils.getOpenId(),
      payTypes: {
        ...utils.constToArr(CONST.payType)
      },
      totalCount: 0,
      totalAmount: 0,
      totalAllCount: 0,
      totalWechatCount: 0,
      totalAlipayCount: 0,
      totalSkCount: 0,
      ylCount: 0,
      api: payOrderQueryList,
      list: [],
      token:utils.storage.getStorage("token"),
      merCode:utils.storage.getStorage("merCode"),
      phone:utils.storage.getStorage("telePhone"),
      searchQuery: {
              openid:"",
              startTime: "",
              endTime:"",
              tranType:"sort-all",
              token:"",
              merCode:"",
              telePhone: "",
              md5Data: "",
              currentPage:0,
              pageSize:20
      },
        // 处理loadMore返回的数据，返回列表
        handeleResault:(res)=>{
                return res.result.data.merTranList
        },
        // 搜索条件处理
        currentPageFn:(currentPage,loadQuery)=>{
              let startTime = loadQuery.startTime.replace(/\/|\-/g,"");
              let endTime = loadQuery.endTime.replace(/\/|\-/g,"");
              let sendData = [loadQuery.telePhone,loadQuery.merCode,startTime,endTime,loadQuery.currentPage,loadQuery.pageSize,this.token+base.md5Data];
              let md5Data = md5Encrypt(sendData.join(''));
              loadQuery['startTime']=startTime;
              loadQuery['endTime']=endTime;
              loadQuery['tranType']= utils.replaceSort(loadQuery.tranType);
              loadQuery['openid']=this.openid;
              loadQuery['md5Data']=md5Data;
              return loadQuery
        },
    };
  },
  created(){
    this.setSearchQuery();
  },
  mounted() {
    this.init();
  },
  computed: {},
  methods: {
     iconHandle(item){
              if(item=='00'){
                      // 刷卡
                      return "icon-shuaka";
              }else if(item=='01'||item=='03'||item=='15'){
                      // 微信
                      return "icon-wechat";
              }else if(item=='04'||item=='16'){
                      // 支付宝
                        return "icon-alipay";
              }else if(item=='06'||item=='17'){
                      //银联二维码
                      return "icon--1";
              }else if(item=='07'){
                      // qq
                      return "icon-qq";
              }else if(item=='05'||item=='12'||item=='08'||item=='09'){
                      // 无卡快捷
                      return "icon-untitled";
              }
      },
    // 设置搜索参数
    setSearchQuery(){
      let startTime = utils.formatDate(new Date(), "yyyy-MM-dd");
      let endTime = utils.formatDate(new Date(), "yyyy-MM-dd");
      this.$set(this.searchQuery,"token",this.token)
      this.$set(this.searchQuery,"merCode",this.merCode)
      this.$set(this.searchQuery,"telePhone",this.phone)
      this.$set(this.searchQuery,"startTime",startTime)
      this.$set(this.searchQuery,"endTime",endTime)
      this.setQueryMd5Data();
    },
     setQueryMd5Data(){
            let startTime = this.searchQuery.startTime.replace(/\/|\-/g,"");
            let endTime = this.searchQuery.endTime.replace(/\/|\-/g,"");
            let sendData=[this.phone,this.merCode,startTime,endTime,this.searchQuery.currentPage,this.searchQuery.pageSize,this.token+base.md5Data];
            sendData =sendData.join('');
            let md5data = md5Encrypt(sendData);
            this.$set(this.searchQuery,"md5Data",md5data)
    },
    scrollChanged() {
      this.scroll = this.$refs.scrollWarpper.scrollTop;
    },
    selectChange(e) {
      
      this.setSearchQuery();
      this.init();
    },
    refresh() {
      // console.log('更新今天的数据');
      this.payTotal();
    },
    init() {
       this.$refs.MypLoadmoreApi.load({
                ...this.searchQuery
        });
        
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
        openid:this.openid,
        telePhone: phone,
        token: token,
        merCode: merCode,
        startTime: startTime,
        endTime: endTime,
        payType: utils.replaceSort(this.searchQuery.tranType),
        md5Data: md5Encrypt(
          `${phone + merCode + startTime + endTime + token + base.md5Data}`
        )
      }).then(res => {
        if (res.code === "001") {
          try {
            let data = res.result.data.merTodayTranAllInfo;
            if(data){
              let tranType=this.searchQuery.tranType; // 交易类型类型
              this.totalAmount="";
              if(tranType=='sort-all'){
                // 全部
                this.totalAmount = data.totalTranAmtSum; // 今日微信交易金额
              }else if(tranType=='sort-1'){
                // 微信
                this.totalAmount = data.wxTranAmtSum;
              }else if(tranType=='sort-2'){
                // 支付宝
                this.totalAmount = data.zfbTranAmtSum;
              }else if(tranType=='sort-0'){
                // 刷卡
                  this.totalAmount = data.skTranAmtSum;
              }else if(tranType=='sort-3'){
                // 银联二维码
                this.totalAmount = data.ylTranAmtSum;
              }
              this.totalAllCount = data.totalCount; //  当天总交易条数
              this.totalWechatCount = data.wxCount; //  当天微信交易条数
              this.totalAlipayCount = data.zfbCount; // 当前支付宝交易条数
              this.totalSkCount = data.skCount; // 当前刷卡交易条数
              this.ylCount = data.ylCount; // 当前银联二维码交易条数
            }
          } catch (err) {
            this.Toast('今日暂无交易');
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
      // this.$refs.scrollWarpper.removeEventListener("scroll", this.scrollChanged);
      // this.$nextTick(() => {
      //         //定时器是解决下拉刷新时，等顶部loadingd元素的归位动画完毕后在注册事件，否则会计算出误。
      //         setTimeout(() => {
      //                 let items = this.$refs.scrollWarpper.querySelectorAll(".list-item");
      //                 let lastItem = items[items.length - 1];
      //                 let headerHeight = this.$refs.header.getBoundingClientRect().height;
      //                 //判断条件：数组中最后一项元素距离顶部的距离 必须大于 window的高度的时候在监听滚动事件。
      //                 //减去header的高度是要考虑全屏模式下的高度
      //                 if (lastItem && lastItem.getBoundingClientRect().top - headerHeight > window.innerHeight) {
      //                         this.$refs.scrollWarpper.addEventListener("scroll", this.scrollChanged);
      //                 }
      //         }, 500)
      // })
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
  .today-pay-order-list {
          position: relative;
          background: #fff;
          flex: 1;
          overflow-x: hidden;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          .list-item:last-child {
                  border: 0px;
          }
  }
}
</style>
