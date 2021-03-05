import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    shopbagCount:0,
    //是否加载购物袋
    isLoadShopbagCount:false
  },
  mutations: {
    changeShopbagCount(state,data){
      //state:vuex状态
      //data:载荷
      state.shopbagCount = data;
    },
    changeIsLoadShopbagCount(state,data){
      state.isLoadShopbagCount = data;
    }
  },
  actions: {
  },
  modules: {
  }
})
