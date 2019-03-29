<template>
  <div class="login">
    <div class="login-logo">
      <img :src="require('@src/assets/images/logo.png')" alt>
    </div>
    <div class="company-title">
      中付支付商户系统
    </div>
    <div class="login-form">
      <div class="form-control border-bottom-1px">
        <input
          ref="phone"
          @input="isPhoneReg($event)"
          v-wx-blur
          type="tel"
          maxlength="11"
          placeholder="您输入注册后的手机号"
        >
      </div>
      <div class="form-control border-bottom-1px">
        <input
          v-model="valiCode"
          ref="code"
          @input="isCodeReg($event)"
          v-wx-blur
          type="tel"
          maxlength="6"
          value
          placeholder="请输入验证码"
        >
        <TimerBtn ref="TimerBtn" :text="'发送验证码'" :time="60" :cb="sendCode"></TimerBtn>
      </div>
    </div>
    <div class="btns">
      <Buttonr
        :className="'btn'"
        :type="'confirm-btn'"
        :disabled="isPhone || isCode"
        :click="submitGetCustomerList"
      >登录</Buttonr>
      <!-- <Buttonr :type="'register-btn'" :click="register">立即注册</Buttonr> -->
    </div>
    <!--<mt-button type="danger">danger</mt-button>-->
  </div>
</template>

<script>
import validator from "@src/common/validator.js";
import base from "@src/apis/base.js";
import {md5Encrypt} from "@src/common/secret.js";
import utils from "@src/common/utils.js";
import TimerBtn from "@src/componentsApp/TimerBtn";
import Buttonr from "@src/componentsApp/Button";
import {
  getVerificationCode,
  getCustomerList,
  getCustomerQrcodeList,
  login
} from "@src/apis";

export default {
  data() {
    return {
      isPhone: true,
      isCode: true,
      valiCode:"", // 验证码
    };
  },
  props: {},
  created() {
    let openId = utils.getOpenId();
    this.openId = openId;
  },
  mounted() {},
  components: {
    TimerBtn,
    Buttonr
  },
  methods: {
    register() {
      this.$router.push({ path: "/customer/register" });
      //       window.location.href = "https://weidian.com/item.html?itemID=2257806570";
    },
    isPhoneReg(e) {
      let value = e.target.value.trim();
      this.isPhone = value ? !validator.phoneNumber.reg.test(value) : true;
    },
    isCodeReg(e) {
      let value = e.target.value.trim();
      this.isCode = value ? !validator.verificationCode.reg.test(value) : true;
    },

    // 发送短信验证码
    sendCode() {
      if (this.isPhone) {
        this.Toast("请输入正确手机号码!");
        $(this.$refs.phone).focus();
        return;
      }
      let phone = this.$refs.phone.value.trim();
      getVerificationCode()({ 
        telePhone: phone,
        md5Data:md5Encrypt(`${phone+base.md5Data}`),
      }).then(res => {
        this.$refs.TimerBtn.disabled = true;
        this.$refs.TimerBtn.timer();
        if (res.code == "001") {
          this.Toast("验证码发送成功！");
        } else {
          this.Toast(res.message);
        }
      });
    },
    getSelectList(dataList, key) {
      let showList = [];
      for (let i = 0; i < dataList.length; i++) {
        let merName = dataList[i].merName;
        showList.push({ entName: merName });
      }
      return showList;
    },
    // 登录
    submitGetCustomerList() {
      document.body.scrollTop = document.documentElement.scrollTop = 0;
      let token;
      let phone = this.$refs.phone.value.trim(); // 电话号码
      let msgValiCode=this.valiCode;   // 验证码
      let allData = `${phone+msgValiCode+base.md5Data}`; // 需要加密的数据;
      let md5Data = md5Encrypt(allData,base.md5Data); // 加密内容
      login()({
        telePhone: phone,
        msgValiCode: msgValiCode,
        md5Data: md5Data
      }).then(res => {
        return new Promise((resolve, reject) => {
          if (res.code == "001") {
            token = res.result.token;
            // 获取商户列表
            getCustomerList()({
              token: token,
              telePhone: phone,
              md5Data: md5Encrypt(phone+token+base.md5Data)
            }).then(res => {
              if (res.code == "001") {
                let { merList } = res.result.data; // 商户列表
                let custoemrNo; // 希望登录的商户
                if (merList.length == 1) {
                  custoemrNo = merList[0].merCode;
                  resolve(custoemrNo);
                } else if (merList.length > 1) {
                  $.dialog.select({
                    title: "请选择商户",
                    content: this.getSelectList(merList, "entName"),
                    changeEnd: function() {
                      custoemrNo = merList[$(this).index()].merCode;
                      resolve(custoemrNo);
                    }
                  });
                } else {
                  this.Toast("请先注册");
                }
              } else {
                this.Toast(data.message);
              }
            });
          } else {
            this.Toast(res.message);
          }
        }).then(custoemrNo => {
          if (custoemrNo) {
            utils.storage.saveStorage("token", token);
            utils.storage.saveStorage("telePhone", phone);
            utils.storage.saveStorage("merCode", custoemrNo);
            let redirect = decodeURIComponent(
              this.$route.query.redirect || "/"
            );
            this.$router.replace({ path: redirect });
          }
        });
      });
    }
  }
};
</script>

<style lang="less">
@import url(../../../assets/less/base.less);
.login {
  .transformPage();
  padding: 120 / @rem 60 / @rem;
  .login-logo {
    text-align: center;
    img {
      height: 180 / @rem;
    }
  }
  .login-form {
    margin-top: 87 / @rem;
    .form-control {
      height: 100 / @rem;
      display: flex;
      font-size: 32 / @rem;
      input {
        width: 100%;
        height: 100%;
        padding: 0 20 / @rem;
         font-size: 36 / @rem;
        flex: 1;
      }
    }
  }

  .btns {
    margin-top: 54 / @rem;
    .btn {
      margin-bottom: 30 / @rem;
    }
  }
  .company-title{
    text-align: center;
    font-size: 52 / @rem;
    margin-top: 30 / @rem;
    color:#333;
  }
}
</style>
