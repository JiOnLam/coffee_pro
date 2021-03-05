<template>
  <div class="shopbag">
    <van-nav-bar title="购物袋">
      <template #right>
        <div @click="toggleEditStatus" v-if="shopbagData.length > 0">
          {{ !isEdit ? "编辑" : "完成" }}
        </div>
      </template>
    </van-nav-bar>
    <div v-if="shopbagData.length > 0">
      <div class="img1">
        <img src="../assets/images/888.jpeg" alt="" />
      </div>
      <div class="shopbag_box">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="亲亲的购物袋只有这么多了哦~"
          @load="loadShopbagData"
          offset="100"
        >
          <van-swipe-cell
            class="shopbag_cell"
            :disabled="isEdit"
            v-for="(item, index) in shopbagData"
            :key="item.sid"
            :ref="item.sid"
          >
            <div class="shopbag_item">
              <div class="check">
                <van-checkbox
                  v-model="item.isChecked"
                  icon-size="24px"
                  checked-color="#588f7e"
                  @change="simpleSelect"
                ></van-checkbox>
              </div>
              <div class="pro_info">
                <div class="pro_img">
                  <img class="auto_img" :src="item.small_img" alt="" />
                </div>
                <div class="pro_text">
                  <div class="text_box">
                    <div class="pro_names">
                      <div class="pro_name">{{ item.name }}</div>
                      <div class="pro_rule">{{ item.rule }}</div>
                    </div>
                    <div class="pro_enname">{{ item.enname }}</div>
                  </div>
                  <div class="count_box">
                    <div class="pro_price">￥{{ item.price }}</div>
                    <div class="pro_count">
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="22"
                        disable-input
                        @change="updateShopbagCount(item.sid, item.count)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                class="shopbag_romove_btn"
                square
                type="danger"
                text="删除"
                @click="removeOne([item.sid], index)"
              />
            </template>
          </van-swipe-cell>
        </van-list>
      </div>
      <van-submit-bar
        v-show="!isEdit"
        :price="total"
        button-text="提交订单"
        button-color="#588f7e"
        @submit="commit"
      >
        <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
      </van-submit-bar>
      <van-submit-bar
        v-show="isEdit"
        button-text="删除选择"
        button-color="#588f7e"
        @submit="removeSelect"
      >
        <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
      </van-submit-bar>
    </div>
    <div v-else>
      <van-empty description="亲亲的购物车空空如也噢~"></van-empty>
    </div>
  </div>
</template>
<script>
import "../assets/less/Shopbag.less";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Shopbar",
  data() {
    return {
      isEdit: false,
      checked: false,
      shopbagData: [],
      //是否加载,首次不触发懒加载
      loading: true,
      finished: false,
      shopbagAllData: [],
      //开始截取位置
      start: 0,
      //每次获取8条数据
      count: 7,
      //总金额
      total: 0,
    };
  },
  created() {
    this.getShopbagData();
  },
  computed: {
    ...mapState(["shopbagCount"]),
  },
  methods: {
    ...mapMutations(["changeShopbagCount"]),

    

    toggleEditStatus() {
      this.isEdit = !this.isEdit;
    },

    getShopbagData() {
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
        method: "GET",
        url: this.baseUrl + "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
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

          if (res.data.code === 5000) {
            res.data.result.forEach((v) => {
              v.isChecked = false;
            });
            this.shopbagAllData = res.data.result;
            this.shopbagData = res.data.result.slice(this.start, this.count);
            // console.log(this.shopbagData);
            this.start += this.count;
            //下次触底进心懒加载
            this.loading = false;
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

    loadShopbagData() {
      setTimeout(() => {
        let data = this.shopbagAllData.slice(
          this.start,
          this.start + this.count
        );
        // console.log(data)

        this.shopbagData.push(...data);
        // console.log(this.shopbagData);
        this.start += this.count;

        //取消全选
        if (data.length > 0) {
          this.checked = false;
        }

        //本次截取不足this.count条数据 return
        if (data.length < this.count) {
          // console.log("已经加载完毕数据... ");
          this.finished = true;
          return;
        }
        this.loading = false;
      }, 1000);
    },

    //修改购物袋数量
    updateShopbagCount(sid, count) {
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
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid,
          count,
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

          if (res.data.code === 6000) {
            this.sum();
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

    //全选
    allSelect() {
      //将所有单选状态修改为全选状态
      this.shopbagAllData.forEach((v) => {
        v.isChecked = this.checked;
      });
      this.sum();
    },

    //单选
    simpleSelect() {
      this.sum();
      //只要有一个单选没有勾选，则全选不能被勾选
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isChecked) {
          this.checked = false;
          return;
        }
      }

      this.checked = true;
    },

    //单个删除购物袋数据
    removeOne(sids, index) {
      this.shopbagData.splice(index, 1);

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
        url: this.baseUrl + "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
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

          if (res.data.code === 7000) {
            if (index !== undefined) {
              this.shopbagData.splice(index, 1);
              this.changeShopbagCount(this.shopbagCount - 1);
              this.simpleSelect();
            } else {
              for (let i = 0; i < this.shopbagData.length; i++) {
                if (this.shopbagData[i].isChecked) {
                  this.shopbagData.splice(i, 1);
                  i--;
                }
              }

              this.changeShopbagCount(this.shopbagCount - sids.length);
              this.sum();
            }
            this.$nextTick(() => {
              let cells = document.querySelectorAll(".shopbag_cell");
              console.log(cells);

              if (
                cells.length === 0 &&
                this.shopbagData.length < this.shopbagAllData.length
              ) {
                this.loadShopbagData();
              } else {
                //获取最后一个节点尺寸
                let cellSize = cells[cells.length - 1].getBoundingClientRect();

                //获取最后一个节点距离页面顶部的距离
                let distance = cellSize.top;

                //获取最后一个节点的高度
                let cellHeight = cellSize.height;

                //获取屏幕高度
                let innerHeight = window.innerHeight;

                if (distance + cellHeight - innerHeight <= 50) {
                  //触发懒加载
                  this.loadShopbagData();
                }
              }
            });
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

    //删除选择得到购物袋商品
    removeSelect() {
      //获取勾选的sid
      let sids = [];
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: "未选择删除商品",
          forbidClick: true,
          duration: 3000,
        });
        return;
      }

      this.removeOne(sids);

    },

    //计算商品总金额
    sum() {
      let total = 0;
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          total += v.price * v.count;
        }
      });
      this.total = total * 100;
    },

    //提交订单
    commit() {
      //获取勾选的sid
      let sids = [];
      this.shopbagData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: "未选择购买商品",
          forbidClick: true,
          duration: 3000,
        });
        return;
      }

      this.$router.push({ name: "Pay", query: { sids: sids.join("-") } });
    },
  },
};
</script>