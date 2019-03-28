import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import payOrder from "./modules/payOrder";


const store = new Vuex.Store({
        state: {
                winH: 0,
                scrollTop: {

                }
        },
	/**
	 * 类似于计算属性 可以使用mapGetters辅助函数将每个getter映射到局部计算属性computed中
	 *
	 */
        getters: {
                // doneTodos: (state, getters) => {
                //         return state.todos.filter(todo => todo.done)
                // }
        },
	/**
	 * 类似于事件集合 可以使用mapMutations辅助函数将组件中的methods映射为store.commit调用
	 * 有必须同步执行的限制
	 * 可以直接改变状态
	 */
        mutations: {
                ["SAVE_SCROLLTOP"](state, page) {
                        state.scrollTop[page.name] = page.scrollTopVal;
                },
        },
	/**
	 * actions和mutations不同在于：
	 * 1.action提交的是mutation，而不是直接改变状态。
	 * 2.action可以包含任意异步操作
	 */
        actions: {

        },
	/**
	 * 由于使用单一状态树，应用的所有状态会集合到一个比较大的对象，当应用变得非常复杂时，store对象就有可能变得相当臃肿。
	 * 为了解决以上问题，Vuex允许我们将store分割成模块，每个模块拥有自己的state、mutation、action、getter、甚至是嵌套子模块--从上至下进行同样方式的分割。
	 */
        modules: {
                payOrder
        }
})
console.warn("Vuex严格模式：" + store.strict)
export default store;