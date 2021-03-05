<template>
  <div style="background-color: #ffffff">
    <div class="nav_box">
      <div class="logo_box">
        <img src="../assets/images/logo.png" alt="" /><span>COFFEE</span>
      </div>
    </div>
    <div class="content">
      <div class="welcome">
        <div class="title_ch">欢迎回来！</div>
        <div class="title_en">Please login to your accounts</div>
      </div>
      <div class="form_box">
        <van-field
          type="tel"
          v-model="userLoginInfo.phone"
          label="手机号"
          placeholder="请输入手机号"
        />
        <van-field
          :type="isShow ? 'password' : 'text'"
          v-model="userLoginInfo.password"
          label="密码"
          placeholder="请输入密码"
          :right-icon="isShow ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleType($event)"
        />
      </div>
      <div class="forget" @click="forget">忘记密码?</div>
      <div class="btn_box">
        <van-button
          type="primary"
          size="large"
          round
          style="margin-bottom: 10px"
          @click="login"
          >登&nbsp;&nbsp;&nbsp;&nbsp;录</van-button
        >
        <van-button type="default" size="large" round @click="registerbtn"
          >注&nbsp;&nbsp;&nbsp;&nbsp;册</van-button
        >
      </div>
    </div>
    <van-popup v-model="isOpen" round position="bottom" closeable>
      <div class="form_box1">
        <van-field
          type="tel"
          label="昵称"
          v-model="userRegisterInfo.nickName"
          placeholder="请设置昵称"
        />
        <van-field
          type="tel"
          label="手机号"
          v-model="userRegisterInfo.phone"
          placeholder="请输入手机号"
        />
        <van-field
          :type="isShow ? 'password' : 'text'"
          label="密码"
          placeholder="请设置密码"
          v-model="userRegisterInfo.password"
          :right-icon="isShow ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleType($event)"
        />
        <div class="btn_box1">
          <van-button type="primary" size="large" round @click="verification"
            >注&nbsp;&nbsp;&nbsp;&nbsp;册</van-button
          >
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { utils } from "../assets/js/Utils";
import {mapMutations} from "vuex";
export default {
  name:"Login",
  data() {
    return {
      isOpen: false,
      isShow: true,
      userLoginInfo: {
        phone: "",
        password: "",
      },
      userRegisterInfo: {
        phone: "",
        password: "",
        nickName: "",
      },
    };
  },
  created(){
      this.changeShopbagCount(0);
      this.changeIsLoadShopbagCount(false);
  },
  methods: {
    ...mapMutations(['changeShopbagCount','changeIsLoadShopbagCount']),
    login() {
      let obj = {
        phone: {
          value: this.userLoginInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号码格式不正确",
        },
        password: {
          value: this.userLoginInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字母必须为字母",
        },
      };
      if (!utils.validForm(obj)) {
        return;
      }

      this.$toast.loading({
        message: "登录中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/login",
        data: {
          appkey: this.appkey,
          password: this.userLoginInfo.password,
          phone: this.userLoginInfo.phone,
        },
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();
          if (res.data.code === 200) {
            console.log("1")
            //登录成功
            //存储token,用于下次访问有关于用户信息界面的登录标识
            this.$cookies.set("tokenString", res.data.token, "1d");

            //跳转到其他界面
            this.$router.push({name:"Home"})
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2500,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
    forget(){
         this.$router.push({name:'ForgetPass'})
    },
    verification() {
      let obj = {
        nickName: {
          value: this.userRegisterInfo.nickName,
          reg: /^[u4e00-u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
        phone: {
          value: this.userRegisterInfo.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号码格式不正确",
        },
        password: {
          value: this.userRegisterInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字母必须为字母",
        },
      };
      if (!utils.validForm(obj)) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        method: "POST",
        url: this.baseUrl + "/register",
        data: {
          appkey: this.appkey,
          nickname: this.userRegisterInfo.nickName,
          password: this.userRegisterInfo.password,
          phone: this.userRegisterInfo.phone,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();
          if (res.data.code == 100) {
            this.isOpen = false;
            //清除用户注册信息
            for (let key in this.userRegisterInfo) {
              this.userRegisterInfo[key] = "";
            }
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
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
    toggleType(event) {
      if (this.isShow) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    registerbtn() {
      this.isOpen = true;
    },
  },
};
</script>
<style lang="less" scoped>
div {
  .nav_box {
    width: 100vw;
    background-color: #ffffff;
    .logo_box {
      text-align: left;
      padding: 10px 15px;
      width: 40vw;
      img {
        width: 32px;
      }
      span {
        width: 32px;
        line-height: 32px;
        vertical-align: bottom;
        padding-left: 10px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .form_box1 {
    margin-top: 50px;
  }
  .btn_box1 {
    padding: 10px;
  }
  .content {
    width: 100vw;
    position: fixed;
    top: 42px;
    bottom: 60px;
    left: 0;
    right: 0;

    .forget {
      text-align: right;
      padding-right: 25px;
      color: gray;
    }
    .btn_box {
      padding: 25px;
    }
    .form_box {
      margin-top: 40px;
      padding: 10px;
    }
    .welcome {
      width: 100vw;
      padding-top: 100px;
      padding-left: 15px;
      padding-right: 15px;
      .title_ch {
        font-size: 24px;
        font-weight: bold;
        text-align: left;
        color: #696d86;
      }
      .title_en {
        font-size: 14px;
        text-align: left;
        margin-top: 16px;
        color: #9c8f90;
      }
    }
  }
}
</style>