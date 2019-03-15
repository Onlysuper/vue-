<template>
  <div class="cityPicher-container" @touchmove.prevent v-show="visible">
    <!-- 主体 -->
    <mt-popup v-model="visible" position="bottom" class="city-picher" :modal="false">
      <mt-picker :slots="addressSlots" @change="onAddressChange" :visible-item-count="7" :itemHeight="36" :showToolbar="true">
        <span class="mint-datetime-action mint-datetime-cancel" @click="visible = false">取消</span>
        <span class="mint-datetime-action mint-datetime-confirm" @click="cityPicherContainer">确定</span>
      </mt-picker>
    </mt-popup>
    <!-- 遮罩层 -->
    <div class="city-picher-mask" @touchmove.prevent @click="visible = false"></div>
  </div>
</template>

<style lang="less">
.cityPicher-container {
  .picker-toolbar {
    border-bottom: solid 1px #eaeaea;
  }
}
</style>

<style lang="less">
@import "../../assets/less/base.less";
.cityPicher-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  .city-picher-mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .city-picher {
    width: 100%;
    height: 300px;
    background: rgba(255, 255, 255, 1);
  }
}
</style>

<script>
import json from "./org.json";

export default {
  name: "CityPicher",
  props: {
    resultCallback: {
      type: Function,
      default: function() {
        console.info("请传入回调函数");
      }
    },
    slot1DefaultIndex: {
      type: Number,
      default: 5
    },
    slot2DefaultIndex: {
      type: Number,
      default: 5
    },
    slot3DefaultIndex: {
      type: Number,
      default: 5
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      result: {},
      addressSlots: [
        {
          flex: 1,
          defaultIndex: 0,
          values: Object.keys(json), // 把省的集合赋给第一个
          className: "slot1",
          textAlign: "center"
        },
        {
          flex: 1,
          defaultIndex: 0,
          values: Object.keys(json["北京市"]),
          className: "slot2",
          textAlign: "center"
        },
        {
          flex: 1,
          defaultIndex: 0,
          values: Object.keys(json["北京市"]["市辖区"]),
          className: "slot3",
          textAlign: "center"
        }
      ],
      popupVisible: false,
      sheng: "",
      shi: "",
      xian: ""
    };
  },
  watch: {
    value(val) {
      this.visible = val;
    },
    visible(val) {
      this.$emit("input", val);
    }
  },
  created() {},
  mounted() {
    if (this.value) {
      this.visible = true;
    }
  },
  methods: {
    cityPicherContainer() {
      this.visible = false;
      //最终区县代码
      this.resultCallback({
        resultAddr: `${this.sheng}-${this.shi}-${this.xian}`,
        resultCode: json[this.sheng][this.shi][this.xian]
      });
    },
    onAddressChange(picker, values) {
      this.sheng = values[0];
      this.shi = values[1];
      this.xian = values[2];
      console.log(values);
      if (this.sheng) {
        picker.setSlotValues(1, Object.keys(json[this.sheng]));
        if (this.shi) {
          json[this.sheng][this.shi] &&
            picker.setSlotValues(2, Object.keys(json[this.sheng][this.shi]));
          if (this.xian) {
          }
        }
      }
    },
    defaultStatus(indexArr) {
      this.addressSlots[0].defaultIndex = indexArr[0];
      this.addressSlots[1].defaultIndex = indexArr[1];
      this.addressSlots[2].defaultIndex = indexArr[2];
    },
    findCity(key) {
      if (!key) return this.result;
      for (var [shengIndex, sheng] of Object.keys(json).entries()) {
        //这里需要知道索引
        for (var [shiIndex, shi] of Object.keys(json[sheng]).entries()) {
          //这里需要知道索引
          for (var [xianIndex, xian] of Object.keys(
            json[sheng][shi]
          ).entries()) {
            //这里需要知道索引
            if (json[sheng][shi][xian] == key) {
              this.result.resultAddr = `${sheng}-${shi}-${xian}`;
              this.result.resultCode = key;
              //拿到上面的索引后设置城市联动默认选中状态
              this.defaultStatus([shengIndex, shiIndex, xianIndex]);
              return this.result;
            }
          }
        }
      }
      return this.result;
    }
  }
};
</script>
