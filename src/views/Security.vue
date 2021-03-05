<template>
  <div class="security">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <div class="security_bg"></div>
    <div class="security_box">
      <div class="update_pass" @click="updatePass">
        <div class="pass_text">修改密码</div>
        <div class="pass_icon"><van-icon name="arrow" /></div>
      </div>
      <div class="destroy_account" @click="destroy">
        <div class="destroy_text">注销账号</div>
        <div class="destroy_icon"><van-icon name="arrow" /></div>
      </div>
    </div>
    <div class="btn" @click="out">退出登录</div>
  </div>
</template>

<script>
export default {
  name: "Security",
  data() {
    return {};
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    updatePass() {
      this.$router.push({ name: "UpdatePass" });
    },
    destroy() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确认注销账号,一旦注销无法恢复！",
        })
        .then(() => {
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
            url: this.baseUrl + "/destroyAccount",
            data: {
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

              if (res.data.code === "G001") {
                this.$router.push({ name: "Login" });
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
        })
        .catch(() => {});
    },
    out() {
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
        url: this.baseUrl + "/logout",
        data: {
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

          if (res.data.code === "F001") {
            this.$router.push({ name: "Login" });
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

<style lang="less" scoped>
.security {
  /deep/ .van-nav-bar .van-icon {
    color: #000;
  }

  /deep/ .van-nav-bar__text {
    color: #000;
  }
  .security_bg {
    height: 160px;
    background-color: #588f7e;
  }

  .security_box {
    margin: 0 20px;
    position: relative;
    padding-top: 20px;
    top: -20px;
    border-radius: 10px;
    background-color: #fff;
    .update_pass {
      height: 48px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      .pass_text {
        flex: 1;
        text-align: left;
        font-size: 16px;
        padding-left: 10px;
      }
      .pass_icon {
        flex: 1;
        text-align: right;
        font-size: 16px;
        padding-right: 10px;
      }
    }
    .destroy_account {
      height: 48px;
      border-bottom: 1px solid #ddd;
      display: flex;
      align-items: center;
      .destroy_text {
        flex: 1;
        text-align: left;
        font-size: 16px;
        padding-left: 10px;
      }
      .destroy_icon {
        flex: 1;
        text-align: right;
        font-size: 16px;
        padding-right: 10px;
      }
    }
  }

  .btn {
    margin: 0 20px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #588f7e;
    border-radius: 6px;
    font-size: 16px;
  }
}
</style>