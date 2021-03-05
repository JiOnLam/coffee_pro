<template>
  <div class="update_account">
    <van-nav-bar
      title="修改昵称"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="back"
      @click-right="commit(desc)"
    >
    </van-nav-bar>
    <div class="textarea">
      <textarea
        cols="30"
        rows="10"
        v-model="desc"
        placeholder="请介绍一下自己吧~"
      ></textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateAccount",
  data() {
    return {
      desc: "",
      copyDesc: "",
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    getAccountInfo() {
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
        url: this.baseUrl + "/findAccountInfo",
        params: {
          appkey: this.appkey,
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

          if (res.data.code === "B001") {
            this.desc = res.data.result[0].desc;
            this.copyDesc = res.data.result[0].desc;
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

    commit(value) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      if (value == this.copyDesc) {
        return this.$router.go(-1);
      }

      this.axios({
        method: "POST",
        url: this.baseUrl + "/updateDesc",
        data: {
          appkey: this.appkey,
          tokenString,
          desc: value,
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

          if (res.data.code === "D001") {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            this.$router.go(-1);
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
  created() {
    this.getAccountInfo();
  },
};
</script>

<style lang="less" scoped>
.update_account {
  /deep/ .van-nav-bar .van-icon {
    color: #000;
  }

  /deep/ .van-nav-bar__text {
    color: #000;
  }
  .textarea {
    height: 100px;
    border-bottom: 1px solid gainsboro;
    textarea {
      width: 100%;
      height: 100px;
      box-sizing: border-box;
      border: none;
      padding: 0 10px;
      color: #444;
    }
  }
}
</style>