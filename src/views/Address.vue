<template>
  <div class="address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      @click-left="back"
    ></van-nav-bar>
    <Bg>
      <van-address-edit
        :area-list="areaList"
        show-postal
        :show-delete="!!aid"
        show-set-default
        show-search-result
        :address-info="originAddressInfo"
        detail-maxlength="30"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="save"
        @delete="removeAddress"
      />
    </Bg>
  </div>
</template>

<script>
import "../assets/less/address.less";
import Bg from "../components/Bg";
import areaList from "../assets/js/area";

export default {
  name: "Address",
  data() {
    return {
      areaList,
      aid: "",
      //编辑地址初始值
      originAddressInfo: {},
    };
  },
  components: {
    Bg,
  },
  created() {
    this.aid = this.$route.params.aid;

    if (this.aid) {
      this.getAddressDataByAid();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    add(value) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      let data = { ...value, tokenString, appkey: this.appkey };
      //等价于
      //Object.assign({tokenString, appkey: this.appkey},value);

      data.isDefault = Number(data.isDefault);

      delete data.country;
      // console.log(data);

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/addAddress",
        data,
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 9000) {
            this.$router.push({ name: "AddressList" });
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

    edit(value) {
      console.log(value);

      // delete address.country;

      let isEdit = false;

      for (let key in this.originAddressInfo) {
        if (this.originAddressInfo[key] !== value[key]) {
          //只要有一个数据不相同，则表明用户已经修改过地址
          isEdit = true;
          break;
        }
      }

      if (isEdit) {
        let tokenString = this.$cookies.get("tokenString");

        if (!tokenString) {
          return this.$router.push({ name: "Login" });
        }

        let address = {};
        address.aid = this.aid;
        address.name = value.name;
        address.tel = value.tel;
        address.province = value.province;
        address.city = value.city;
        address.county = value.county;
        address.addressDetail = value.addressDetail;
        address.areaCode = value.areaCode;
        address.postalCode = value.postalCode;
        address.isDefault = Number(value.isDefault);
        console.log(address);

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: this.baseUrl + "/editAddress",
          data: {
            appkey: this.appkey,
            tokenString,
            ...address,
          },
        })
          .then((res) => {
            console.log(res);
            this.$toast.clear();

            if (res.data.code == 700) {
              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 3000,
              });
              return this.$router.push({ name: "Login" });
            }

            if (res.data.code === 30000) {
              this.$router.push({ name: "AddressList" });
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
      } else {
        this.$router.push({ name: "AddressList" });
      }
    },

    save(value) {
      if (this.aid) {
        this.edit(value);
      } else {
        this.add(value);
      }
    },

    removeAddress(value) {
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
        url: this.baseUrl + "/deleteAddress",
        data: {
          tokenString,
          appkey: this.appkey,
          aid: value.aid,
        },
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 10000) {
            this.$router.push({ name: "AddressList" });
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

    getAddressDataByAid() {
      //查询地址数据
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
        url: this.baseUrl + "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 40000) {
            let data = res.data.result[0];
            data.isDefault = !!data.isDefault;
            // res.data.result.forEach(v=>{
            //   v.isDefault = Boolean(v.isDefault);

            // })
            this.originAddressInfo = data;
          }
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
  },
};
</script>
