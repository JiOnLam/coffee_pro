<template>
  <div class="details">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <img :src="detailData.large_img" width="100%" alt="" />
    <div class="content">
      <div class="title_box">
        <div class="title_box_l">
          <p class="chname">{{ detailData.name }}</p>
          <p class="enname">{{ detailData.enname }}</p>
        </div>
        <div class="title_box_r">￥{{ detailData.price }}</div>
      </div>
      <div class="interest">
        <div class="wendu" v-for="(v, k1) in detailData.rulesData" :key="k1">
          <div class="title">{{ v.title }}</div>
          <ul class="con">
            <li
              v-for="(i, k2) in v.rule"
              :key="k2"
              @click="sel(v, k2)"
              :class="{ active: v.currentIndex === k2 }"
            >
              {{ i.title }}
            </li>
          </ul>
        </div>
      </div>
      <div class="num">
        <van-stepper
          v-model="num"
          theme="round"
          button-size="22"
          disable-input
        />
      </div>
      <div class="describe">
        <h3>商品描述</h3>
        <van-cell-group>
          <van-cell
            :value="`${k + 1}、${item}`"
            v-for="(item, k) in detailData.desc"
            :key="k"
          />
        </van-cell-group>
      </div>
    </div>
    <van-goods-action>
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        color="#e7e7e7"
        :badge="shopbagCount > 0 ? shopbagCount : ''"
        @click="goShopbag"
      />
      <van-goods-action-icon
        icon="star"
        :text="likeStates ? '已收藏' : '收藏'"
        :color="likeStates ? '#588f7e' : '#e7e7e7'"
        @click="likeAndnotlike"
      />
      <van-goods-action-button
        color="#588F7E"
        type="warning"
        text="加入购物车"
        @click="addShopbag"
      />
      <van-goods-action-button
        color="#4AA668"
        type="danger"
        text="立即购买"
        @click="buyNow"
      />
    </van-goods-action>
  </div>
</template>
<script>
import "../assets/less/Details.less";
import { mapMutations, mapState } from "vuex";
export default {
  data() {
    return {
      num: 0,
      detailData: {},
      show: true,
      Id: "",
      //收藏状态
      likeStates: false,
      count: 1,
    };
  },
  created() {
    this.Id = this.$route.params.pid;
    this.getLikeProduct();
    this.getDetailData();
    this.getShopbagCount();
  },
  computed: {
    ...mapState(["shopbagCount", "isLoadShopbagCount"]),
  },
  methods: {
    ...mapMutations(["changeShopbagCount", "changeIsLoadShopbagCount"]),

    back() {
      this.$router.go(-1);
    },

    sel(i, index) {
      if (i.currentIndex == index) {
        return;
      }
      i.currentIndex = index;
    },

    likeAndnotlike() {
      if (this.likeStates) {
        this.notlike();
      } else {
        this.like();
      }
    },

    like() {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/like",
        data: {
          appkey: this.appkey,
          pid: this.Id,
          tokenString,
        },
      })
        .then((res) => {
          //   console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 800) {
            this.likeStates = true;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    getLikeProduct() {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return;
      }

      this.axios({
        method: "GET",
        url: this.baseUrl + "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.Id,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 1000) {
            if (res.data.result.length > 0) {
              this.likeStates = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    notlike() {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          pid: this.Id,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 900) {
            if (res.data.result === 1) {
              this.likeStates = false;
            }
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    getDetailData() {
      // this.$toast.loading({
      //   message: "加载中...",
      //   forbidClick: true,
      //   duration: 0,
      // });
      this.axios({
        method: "GET",
        url: this.baseUrl + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.Id,
        },
      }).then((res) => {
        if (res.data.code === 600) {
          let data = res.data.result[0];
          let rules = ["cream", "tem", "sugar", "milk"];
          data.desc = data.desc.split(/\n/);
          data.rulesData = [];
          rules.forEach((v) => {
            let rulesText = data[v].split("/");
            //如果不存在规格，则不添加到数组里面
            if (!data[v]) {
              return;
            }

            let currentRule = {
              title: data[v + "_desc"],
              currentIndex: 0,
              rule: [],
            };

            rulesText.forEach((item) => {
              let o = {
                title: item,
              };
              currentRule.rule.push(o);
            });

            data.rulesData.push(currentRule);
          });
          this.detailData = data;
        }
      });
    },

    addShopbag(isBuy) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let rules = [];
      this.detailData.rulesData.forEach((v) => {
        rules.push(v.rule[v.currentIndex].title);
      });
      this.axios({
        method: "POST",
        url: this.baseUrl + "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: this.Id,
          tokenString,
          count: this.count,
          rule: rules.join("/"),
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 3000) {
            if (res.data.status === 1) {
              this.changeShopbagCount(this.shopbagCount + 1);
              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 3000,
              });
            }
            
            if (!isBuy) {
              this.$router.push({ name: "Pay", query: { sids: res.data.sid } });
            }
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    goShopbag() {
      this.$router.push({ name: "Shopbag" });
    },

    getShopbagCount(isBuy) {
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

    //立即购买
    buyNow() {
      this.addShopbag(false);
    },
  },
};
</script>
