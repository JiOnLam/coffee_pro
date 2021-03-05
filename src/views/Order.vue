<template>
  <div class="order">
    <van-nav-bar
      title="我的订单"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <Bg>
      <van-tabs
        v-model="activeTabIndex"
        swipeable
        color="#4aa668"
        title-active-color="#4aa668"
        title-inactive-color="#666"
        @change="changeOrderStatus"
      >
        <van-tab v-for="(item, index) in tabs" :key="index" :title="item.title">
          <div class="tab_content">
            <div v-if="orderData.length > 0">
              <div class="tab_box" v-for="(v1, i1) in orderData" :key="i1">
                <PayBox :proInfo="v1.proInfo">
                  <template #pay_title>
                    <div class="pay_title_box">
                      <div class="pay_t">{{ v1.oid }}</div>
                      <div class="pay_s" v-if="v1.status === 2">
                        <div class="pay_text">已完成</div>
                        <div class="pay_icon" @click="removeOrder(v1.oid, i1)">
                          <van-icon name="delete-o" />
                        </div>
                      </div>
                      <div class="pay_s" v-if="v1.status === 1">
                        <div
                          class="pay_text"
                          style="color: red"
                          @click="confirmOrder(v1, i1)"
                        >
                          确认收货
                        </div>
                      </div>
                    </div>
                  </template>

                  <template #order_item>
                    <OrderItem
                      v-for="(v2, i2) in v1.data"
                      :key="i2"
                      :product="v2"
                    ></OrderItem>
                  </template>
                </PayBox>
              </div>
            </div>
            <div v-else>
              <van-empty description="无该状态的订单信息" />
            </div>
          </div>
        </van-tab>
      </van-tabs>
    </Bg>
  </div>
</template>

<script>
import Bg from "../components/Bg";
import PayBox from "../components/PayBox";
import OrderItem from "../components/OrderItem";
import "../assets/less/order.less";

export default {
  name: "Order",
  data() {
    return {
      activeTabIndex: 0,
      tabs: [
        {
          title: "全部",
          status: 0,
        },
        {
          title: "进行中",
          status: 1,
        },
        {
          title: "已完成",
          status: 1,
        },
      ],
      //订单数据
      orderData: [],
    };
  },
  components: {
    Bg,
    PayBox,
    OrderItem,
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    //获取订单数据
    getOrderData(status) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "GET",
        url: this.baseUrl + "/findOrder",
        params: {
          appkey: this.appkey,
          tokenString,
          status,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 70000) {
            //按照订单编号分类

            let products = [];

            let oids = [];

            res.data.result.forEach((v) => {
              v.small_img = v.smallImg;
              if (oids.indexOf(v.oid) === -1) {
                let o = {
                  oid: v.oid,
                  proInfo: {
                    date: v.updatedAt,
                    count: 0,
                    total: 0,
                  },
                  status: v.status,
                  data: [],
                };

                oids.push(v.oid);
                products.push(o);
              }
            });

            products.forEach((v) => {
              res.data.result.forEach((item) => {
                if (v.oid === item.oid) {
                  v.data.push(item);
                  v.proInfo.count += item.count;
                  v.proInfo.total += item.count * item.price;
                }
              });
            });

            this.orderData = products;
            // console.log(oids);
            // console.log(products);
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

    //切换订单状态
    changeOrderStatus(name, title) {
      this.getOrderData(name);
    },

    //确认订单
    confirmOrder(item, index) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "POST",
        url: this.baseUrl + "/receive",
        data: {
          appkey: this.appkey,
          tokenString,
          oid: item.oid,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 80000) {
            item.status = 2;
            if (this.activeTabIndex === 1) {
              //移除已完成的订单
              this.orderData.splice(index, 1);
            }
          }
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //删除订单
    removeOrder(oid, index) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "POST",
        url: this.baseUrl + "/removeOrder",
        data: {
          appkey: this.appkey,
          tokenString,
          oid,
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

          if (res.data.code === 90000) {
            this.orderData.splice(index,1)
          }
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
  },

  created() {
    this.getOrderData(0);
  },
};
</script>