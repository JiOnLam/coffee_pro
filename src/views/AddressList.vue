<template>
  <div class="address_list">
    <van-nav-bar
      title="地址管理"
      left-text="返回"
      left-arrow
      @click-left="back"
    ></van-nav-bar>
    <Bg>
      <van-address-list
        :list="list"
        disabled-text="以下地址超出配送范围"
        default-tag-text="默认"
        :switchable="false"
        @add="add"
        @edit="edit"
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/addresslist.less";
import Bg from "../components/Bg";
export default {
  name: "AddressList",
  data() {
    return {
      list: [],
    };
  },
  components: {
    Bg,
  },
  created() {
    this.getAddressListData();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    add() {
      this.$router.push({ name: "Address" });
    },

    edit({aid}){
      this.$router.push({name:"Address",params:{aid}})
      // console.log(address.aid)
    },

    getAddressListData() {
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
        url: this.baseUrl + "/findAddress",
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

          if (res.data.code === 20000) {
            res.data.result.forEach((v) => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              v.isDefault = Boolean(v.isDefault);
            });
            this.list = res.data.result;
            // console.log(res.data.result);
            // console.log(this.list);
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
  },
};
</script>

