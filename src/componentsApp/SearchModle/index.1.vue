<template>
  <div>
    <v-mask v-model="visible"></v-mask>
    <div class="my-search" :class="{show:visible,hide:!visible}">
      <input-wrapper class="input-bg">
        <mt-field ref="mtField" class="input-field title-bold" v-model="entName" type="text" placeholder="商品关键字">
          <button class="input-return _av" @click="close">完成</button>
        </mt-field>
      </input-wrapper>
      <div class="query-list">
        <ul>
          <li class="_av border-bottom" @click="select(item)" v-for="(item,index) in queryList" :key="index">
            {{item.name}}
          </li>
          <li class="no-search" v-show="isNoSearchShow">
            <span>没有更多了</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { queryGoodsCode } from "@src/apis";
export default {
  props: {
    value: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      entName: "",
      visible: false,
      billType: "1",
      isNoSearchShow: false,
      queryList: []
    };
  },
  watch: {
    value(val) {
      this.entName = val;
    },
    entName(val) {
      this.$emit("input", val);
      //点击×自动清空表单中回显的历史数据
      if (!val) {
        this.$emit("initData");
      }

      //处理BUG
      if (val) {
        this.$refs.mtField.$el.querySelector(
          ".mint-field-clear"
        ).style.display =
          "block";
      } else {
        this.$refs.mtField.$el.querySelector(
          ".mint-field-clear"
        ).style.display =
          "none";
      }

      //模糊查询
      let key = val;
      if (!this.visible) return;
      this.entCardQuery(key);
    }
  },
  mounted() {
    this.entName = this.value;
  },
  methods: {
    isMinSerachNum(val) {
      if (val.length < 1) {
        this.queryList = [];
        this.isNoSearchShow = false;
        return true;
      } else {
        return false;
      }
    },
    entCardQuery(key) {
      //查询必须为中文
      let re = /[^\u4e00-\u9fa5,\(\)（）]/;
      if (re.test(key)) return;

      //检测是否小于最小起搜数
      if (this.isMinSerachNum(key)) {
        return;
      }
      queryGoodsCode()({
        name: key,
        tax: 0
      }).then(data => {
        if (data.resultCode == "0") {
          this.queryList = data.data;
        } else {
          this.queryList = [];
          this.Toast(data.message);
        }
        this.isNoSearchShow = true;
      });
    },
    select(item) {
      this.$emit("change", item);
      this.close();
    },
    open() {
      this.visible = true;

      document
        .querySelector(".input-field")
        .querySelector("input")
        .focus();

      //处理BUG
      if (this.entName) {
        //由于input是自动获取焦点，所以不会显示删除input的内容的icon
        this.$refs.mtField.$el.querySelector(
          ".mint-field-clear"
        ).style.display =
          "block";
      }

      this.isMinSerachNum(this.entName);
    },
    close() {
      this.visible = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../assets/less/base.less";
.my-search {
  height: auto;
  overflow: hidden;
  position: fixed;
  left: 0;
  right: 0;
  margin: auto;
  border-radius: 10px;

  // box-shadow: 0 0 5px #bfbfbf;
  width: 95%;
  // height: 90%;

  background-color: rgba(255, 255, 255, 1);
  transition: opacity 0.5s;
}

.input-bg {
  background: #ff5959;
  box-shadow: 0 0 5px #000;
  padding: 20/@rem;
}
.input-field {
  border-radius: 3px;
  .mint-cell-wrapper {
  }
}
.query-list {
  position: relative;
  padding: 50/@rem 30/@rem;
  overflow-x: hidden;
  overflow-y: scroll;
  // -webkit-overflow-scrolling: touch;
  height: 700/@rem;
  li {
    line-height: 100/@rem;
  }
  .border-bottom {
    border-bottom: 1px solid #eee;
  }
}

.show {
  top: 50px;
  // bottom: 0%;
  opacity: 1;
}
.hide {
  top: -100%;
  opacity: 0;
}

.no-search {
  text-align: center;
  // padding: 10px;
}

.input-return {
  // padding: 20*$rem 30*$rem;
  margin-left: 30/@rem;
  // background: #ef4f4f;
  // color: #fff;
  border-radius: 5px;
}
</style>
