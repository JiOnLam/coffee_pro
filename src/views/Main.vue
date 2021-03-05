<template>
  <div class="main">
    <router-view></router-view>
    <van-tabbar
      v-model="active"
      active-color="#588F7E"
      inactive-color="#8a8a8a"
      route
    >
      <van-tabbar-item
        v-for="(v, k) in tabbars"
        :key="k"
        :badge="v.badge > 0 ? v.badge : ''"
        :dot="v.dot"
        :to="v.to"
      >
        <span>{{ v.title }}</span>
        <template #icon="props">
          <img :src="props.active ? v.icon.active : v.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "Main",
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    ...mapMutations(["changeShopbagCount", "changeIsLoadShopbagCount"]),
    // changeShopbagCount(data){
    //   this.$store.commit('changeShopbagCount',data)
    // },
    getShopbagCount() {
      // console.log(this.isLoadShopbagCount);
      if (this.isLoadShopbagCount) {
        // console.log("已经加载过购物袋数量");
        return;
      }
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return;
      }

      this.axios({
        method: "GET",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 8000) {
            //提交changeShopbagCount的mutations
            // this.$store.commit('changeShopbagCount',res.data.result);

            this.changeShopbagCount(res.data.result);
            this.changeIsLoadShopbagCount(true);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
  },
  computed: {
    ...mapState(["shopbagCount","isLoadShopbagCount"]),
    tabbars() {
      return [
        {
          title: "首页",
          icon: {
            active: require("../assets/images/11_selected.png"),
            inactive: require("../assets/images/11.png"),
          },
          to: "/home",
        },
        {
          title: "菜单",
          icon: {
            active: require("../assets/images/22_selected.png"),
            inactive: require("../assets/images/22.png"),
          },
          to: "/menu",
        },
        {
          title: "购物袋",
          icon: {
            active: require("../assets/images/33_selected.png"),
            inactive: require("../assets/images/33.png"),
          },
          badge: this.shopbagCount,
          to: "/shopbag",
        },
        {
          title: "我的",
          icon: {
           active: require("../assets/images/44_selected.png"),
            inactive: require("../assets/images/44.png"),
          },
          dot: true,
          to: "/mine",
        },
      ];
    },
  },
  created() {
    // console.log(this.shopbagCount)
    this.getShopbagCount();
  },
};
</script>