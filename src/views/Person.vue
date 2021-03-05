<template>
  <div class="person">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <div class="info_box">
      <div class="info_pic">
        <div class="info_img">
          <img class="auto_img" :src="infoData.userImg" alt="" />
          <van-uploader :after-read="uploadUserImg" />
        </div>
      </div>
      <div class="info_id">
        <div class="id">用户id:</div>
        <div class="no">{{ infoData.userId }}</div>
      </div>
      <div class="info_nickName">
        <div class="nick">昵称:</div>
        <div class="name" @click="updateName">
          {{ infoData.nickName ? infoData.nickName : "点击添加昵称" }}
        </div>
      </div>
      <div class="info_account">
        <div class="account">简介:</div>
        <div class="content" @click="updateAccount">
          {{ infoData.desc ? infoData.desc : "这家伙很懒,什么都没有留下" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/person.less";
export default {
  name: "Person",
  data() {
    return {
      infoData: {
        desc: "",
        nickName: "",
        phone: "",
        userId: "",
        userImg: "",
      },
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
            this.infoData = res.data.result[0];
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

    updateName() {
      this.$router.push({ name: "UpdateName" });
    },

    updateAccount() {
      this.$router.push({ name: "UpdateAccount" });
    },
    uploadUserImg(file) {
      //限制上传文件类型
      let types = ["png", "gif", "jpg", "jpeg"];

      //截取上传图片的类型
      let type = file.file.type.split("/")[1];
      // console.log(type);
      if (types.indexOf(type) === -1) {
        this.$toast({
          message: `文件格式仅支持${types.json(",")}`,
          forbidClick: true,
          duration: 2000,
        });
      }

      //处理base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      // console.log(base64);

      //发起上传图片请求
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
        url: this.baseUrl + "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: type,
          serverBase64Img: base64,
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

          if (res.data.code === "H001") {
            if (res.data.result[0] === 1) {
              this.infoData.userImg = res.data.userImg;
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
  },
  created() {
    this.getAccountInfo();
  },
};
</script>
<style lang="less">
.person {
  /deep/ .van-uploader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }
  /deep/ .van-uploader__upload {
    margin: 0;
  }
  /deep/ .van-uploader__upload {
    width: 100px;
    height: 100px;
  }
}
</style>