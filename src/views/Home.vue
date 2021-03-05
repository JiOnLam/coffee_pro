<template>
  <div class="home">
    <van-swipe @change="onChange" :autoplay="4000">
      <van-swipe-item v-for="(v, k) in bannerData" :key="k"
        ><img :src="v.bannerImg" alt="" width="100%" @click="go(v.pid)"
      /></van-swipe-item>
      <template #indicator>
        <div class="custom-indicator">
          <div
            v-for="(v, k) in bannerData"
            :key="k"
            :class="current == k ? 'active' : 'item'"
          ></div>
        </div>
      </template>
    </van-swipe>
    <div class="content">
      <van-nav-bar>
        <template #left>
          <div class="left_box">
            <span class="wenhou">{{salutation}}</span>
            <span class="username">JiOnLam</span>
          </div>
        </template>
        <template #right>
          <van-search placeholder="请输入商品名称" shape="round" />
        </template>
      </van-nav-bar>
      <div class="fast_box">
        <ul>
          <router-link tag="li" to="/menu" class="fast_box_l">
            <h2>咖快</h2>
            <p>在线点餐</p>
            <img src="../assets/images/caidan01.png" alt="" />
          </router-link>
          <router-link tag="li" to="/shopbag" class="fast_box_r">
            <h2>专星送</h2>
            <p>已点好,去付款</p>
            <img src="../assets/images/waimai01.png" alt="" />
          </router-link>
        </ul>
      </div>
      <div class="hot_box">
        <div class="hot_tit">热门推荐</div>
        <ul>
          <router-link :to="`/details/${item.pid}`" tag="li" v-for="item in hotData" :key="item.id">
            <img
              :src="item.smallImg"
              width="100%"
            />
            <p class="ch_name">{{item.name}}</p>
            <p class="en_name">{{item.enname}}</p>
            <p class="price">￥{{item.price}}</p>
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
import "../assets/less/Home.less";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      current: 0,
      bannerData: [],
      hotData: [],
      
    };
  },
 
  created() {
    this.getBannerData();
    this.getHotData();
  },
  computed:{
      salutation(){
          let data = new Date();
          let hour = data.getHours();
          let str = '';
          if(hour>6&&hour<=12){
            str = '上午好!'
          }else if(hour>12&&hour<=18){
            str = '下午好!'
          }else if(hour>18&&hour<=24){
            str = '晚上好!'
          }else if(hour>0&&hour<=6){
            str = '深夜好!'
          }
          return str;
      }
  },
  methods: {
    go(pid){
       console.log(pid)
       this.$router.push({name:'Details',params:{pid}})
    },
    onChange(index) {
      this.current = index;
    },
    getBannerData() {
      this.axios({
        method: "GET",
        url: this.baseUrl + "/banner",
        params: {
          appkey: this.appkey,
        },
      }).then((res) => {
        this.$toast.clear();
        if (res.data.code == 300) {
          this.bannerData = res.data.result;
        }
      });
    },
    getHotData() {
      this.axios({
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      }).then((res) => {
        this.$toast.clear();
        if (res.data.code == 500) {
          this.hotData = res.data.result;
        }
      });
    },
  },
};
</script>
