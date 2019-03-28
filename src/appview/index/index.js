import Vue from 'vue';
import App from './index.vue';
import router from '@src/approuter'; 
import store from "@src/appstore";
import 'mint-ui/lib/style.css'
import "@src/common/rem.js";
import "@src/common/jqPlugin.js";
import "@src/assets/css/reset.css";
import "@src/assets/icomoon/style.css";
import mypDirective from '@src/common/directives';
import mypFilter from '@src/common/filters';
import utils from "@src/common/utils";
Vue.prototype.utils = utils;
Vue.use(mypDirective);
Vue.use(mypFilter);

window.onresize = function () {
        setTimeout(() => {
                onresize();
        }, 300)
};

function onresize() {
        document.body.style.minHeight = (window.innerHeight < 480 ? 480 : window.innerHeight) + "px";
        store.state.winH = window.innerHeight;
}
onresize();

import {
        Switch, Field, Button, Actionsheet, Picker, Cell, Search, Checklist, Loadmore, DatetimePicker, Header, Radio, CellSwipe, Popup,
        IndexList, IndexSection, InfiniteScroll, Spinner, Toast, MessageBox, Indicator, Range, Badge
} from 'mint-ui';
Vue.prototype.Toast = Toast;
Vue.prototype.MessageBox = MessageBox;
Vue.prototype.Indicator = Indicator;
Vue.component(Switch.name, Switch);
Vue.component(Field.name, Field);
Vue.component(Button.name, Button);
Vue.component(Actionsheet.name, Actionsheet);
Vue.component(Picker.name, Picker);
Vue.component(Cell.name, Cell);
Vue.component(Search.name, Search);
Vue.component(Checklist.name, Checklist);
Vue.component(Loadmore.name, Loadmore);
Vue.component(DatetimePicker.name, DatetimePicker);
Vue.component(Header.name, Header);
Vue.component(Radio.name, Radio);
Vue.component(CellSwipe.name, CellSwipe);
Vue.component(Popup.name, Popup);
Vue.component(IndexList.name, IndexList);
Vue.component(IndexSection.name, IndexSection);
Vue.use(InfiniteScroll);
Vue.component(Spinner.name, Spinner);
Vue.component(Range.name, Range);
Vue.component(Badge.name, Badge);

import FullPage from "@src/appcomponents/FullPage";
import FullPagePopup from "@src/appcomponents/FullPagePopup";
import InputWrapper from "@src/appcomponents/InputWrapper";
import ViewRadius from "@src/appcomponents/ViewRadius";
import Mask from "@src/appcomponents/Mask";
import MCell from "@src/appcomponents/MCell";
Vue.component(MCell.name, MCell);
Vue.component(FullPage.name, FullPage);
Vue.component(FullPagePopup.name, FullPagePopup);
Vue.component(InputWrapper.name, InputWrapper);
Vue.component(ViewRadius.name, ViewRadius);
Vue.component(Mask.name, Mask);

//事件统计
Vue.prototype._czcEvent = (action, desc) => {
        desc = desc || "";
        window._czc && window._czc.push(["_trackEvent", "公众号", action, desc]);
}
console.log(App);
Vue.config.productionTip = false;
new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app') 
