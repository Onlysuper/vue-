<template>
  <full-page-popup v-model="popupVisible" position="bottom" class="bank-page" title="选择银行">
    <mt-index-list :show-indicator="true" :height="wrapperHeight">
      <mt-index-section v-for="item in alphabet" :index="item.initial" :key="item.initial">
        <div v-for="(cell,index) in item.cells" :key="index" @click="emitEvent(cell)">
          <mt-cell :title="cell.value"></mt-cell>
        </div>
      </mt-index-section>
    </mt-index-list>
  </full-page-popup>
</template>
<style lang="less" scoped>
.bank-page {
  width: 100%;
  height: 100%;
  .mint-indexlist {
    height: 100%;
  }
  .mint-indexlist-content {
    -webkit-overflow-scrolling: touch;
  }
}
</style>
<script>
import FullPagePopup from "../FullPagePopup";
import bankJson from "./bank.json";

export default {
  components: {
    FullPagePopup
  },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      popupVisible: false,
      wrapperHeight: document.documentElement.clientHeight - 45,
      alphabet: []
    };
  },
  watch: {
    value(val) {
      this.popupVisible = val;
    },
    popupVisible(val) {
      this.$emit("input", val);
      if (val) {
        setTimeout(() => {
          this.alphabet = bankJson;
        }, 300);
      } else {
        this.alphabet = [];
      }
    }
  },
  created() {},
  mounted() {
    this.popupVisible = this.value;
  },
  methods: {
    emitEvent(cellVal) {
      this.popupVisible = false;
      this.$emit("bankresult", cellVal);
    }
  }
};
</script>