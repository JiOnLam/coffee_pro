<template>
  <div class="updateName">
    <van-nav-bar
      title="修改昵称"
      left-text="返回"
      right-text="保存"
      left-arrow
      @click-left="back"
      @click-right="commit(nick)"
    >
    </van-nav-bar>
    <div class="input">
      <input type="text" v-model="nick" placeholder="请输入修改昵称" />
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateName",
  data() {
    return {
      nick: "",
      nickName: "",
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    commit(value) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      if (value == this.nickName) {
        return this.$router.go(-1);
      }

      let reg = /^[A-Za-z0-9]{4,15}$/;
      if (!reg.test(value)) {
        return this.$toast({
          message: "仅支持数字英文字母组合,长度为4-15位",
          forbidClick: true,
          duration: 2000,
        });
      }

      this.axios({
        method: "POST",
        url: this.baseUrl + "/updateNickName",
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: value,
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

          if (res.data.code === "C001") {
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

          if (res.data.code === "B001") {
            this.nick = res.data.result[0].nickName;
            this.nickName = res.data.result[0].nickName;
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
.updateName {
  /deep/ .van-nav-bar .van-icon {
    color: #000;
  }

  /deep/ .van-nav-bar__text {
    color: #000;
  }
  .input {
    height: 40px;
    border-bottom: 1px solid gainsboro;
    padding-left: 10px;
    input {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: none;
      font-size: 16px;
    }
  }
}
</style>