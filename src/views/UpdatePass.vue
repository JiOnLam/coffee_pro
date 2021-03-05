<template>
  <div class="updatePass">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <div class="old_pass_box">
      <div class="old_pass">旧密码:</div>
      <div class="old_text">
        <input type="text" placeholder="请输入旧密码" v-model="oldPass" />
      </div>
    </div>
    <div class="new_pass_box">
      <div class="new_pass">新密码:</div>
      <div class="new_text">
        <input
          :type="isClose ? 'text' : 'password'"
          placeholder="请设置新密码"
          v-model="newPass"
        />
        <div class="eye">
          <van-icon :name="isClose ? 'eye-o' : 'closed-eye'" @click="toggle" />
        </div>
      </div>
    </div>
    <div class="btn" @click="commit(oldPass, newPass)">确认修改</div>
  </div>
</template>

<script>
export default {
  name: "UpdatePass",
  data() {
    return {
      oldPass: "",
      newPass: "",
      isClose: false,
    };
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    commit(oldPass, newPass) {
      let tokenString = this.$cookies.get("tokenString");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      if (oldPass == newPass) {
        return this.$toast({
          message: "新密码不能与旧密码一样",
          forbidClick: true,
          duration: 2000,
        });
      }
      let reg = /^[A-Za-z]\w{5,15}$/;
      if (!reg.test(newPass)) {
        return this.$toast({
          message: "密码支持字母数字_组合且首字母必须为字母",
          forbidClick: true,
          duration: 2000,
        });
      }
      this.axios({
        method: "POST",
        url: this.baseUrl + "/updatePassword",
        data: {
          appkey: this.appkey,
          tokenString,
          password: newPass,
          oldPassword: oldPass,
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

          if (res.data.code === "E001") {
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
    toggle() {
      this.isClose = !this.isClose;
    },
  },
};
</script>

<style lang="less" scoped>
.updatePass {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f7f7f7;
  /deep/ .van-nav-bar .van-icon {
    color: #000;
  }

  /deep/ .van-nav-bar__text {
    color: #000;
  }
  .old_pass_box {
    .old_pass {
      padding: 10px;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    .old_text {
      height: 40px;
      input {
        width: 100%;
        height: 100%;
        padding-left: 10px;
        box-sizing: border-box;
      }
    }
  }
  .new_pass_box {
    .new_pass {
      padding: 10px;
      font-size: 16px;
      font-weight: bold;
      text-align: left;
      margin-bottom: 1px;
    }
    .new_text {
      height: 40px;
      display: flex;
      border: 1px solid #000;
      background-color: #fff;
      box-sizing: border-box;
      align-items: center;
      input {
        flex: 1;
        height: 100%;
        box-sizing: border-box;
        border: none;
        padding-left: 10px;
      }
      .eye {
        width: 30px;
        font-size: 16px;
      }
    }
  }
  .btn {
    font-size: 16px;
    background-color: #588f7e;
    color: white;
    padding: 10px;
    margin: 40px 0;
  }
}
</style>