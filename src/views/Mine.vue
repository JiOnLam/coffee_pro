<template>
  <div class="mine">
    <div class="my_bg" :style="{ backgroundImage: `url(${userInfo.userBg})` }">
      <van-uploader :after-read="uploadBg" />
    </div>
    <div class="my_box">
      <div class="my_img">
        <img :src="userInfo.userImg" alt="" />
        <div class="up_img">
          <van-uploader :after-read="uploadAvatar" />
        </div>
      </div>
      <div class="my_info">
        <div class="my_name">{{ userInfo.nickName }}</div>
        <div class="my_desc one_text">
          {{ userInfo.desc ? userInfo.desc : "这家伙很懒，什么都没留下" }}
        </div>
      </div>
    </div>
    <div class="my_list">
      <van-cell
        @click="goPage(item.name)"
        v-for="(item, index) in cellData"
        :key="index"
        :title="item.title"
        is-link
      />
    </div>
  </div>
</template>
<script>
import "../assets/less/mine.less";
export default {
  name: "Mine",
  data() {
    return {
      cellData: [
        { title: "个人资料", name: "Person" },
        { title: "我的订单", name: "Order" },
        { title: "我的收藏", name: "Like" },
        { title: "地址管理", name: "AddressList" },
        { title: "账号与安全", name: "Security" },
      ],
      userInfo: [],
    };
  },
  methods: {
    goPage(name) {
      this.$router.push({ name: name });
    },

    //获取用户信息
    getUserInfo() {
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
        url: this.baseUrl + "/findMy",
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

          if (res.data.code === "A001") {
            this.userInfo = res.data.result[0];
            // console.log(this.userInfo);
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

    //上传头像
    uploadAvatar(file) {
      // console.log(file);

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
          imgType:type,
          serverBase64Img:base64
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

          if (res.data.code === "H001") {
            if(res.data.result[0]===1){
               this.userInfo.userImg = res.data.userImg;
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

    //上传背景图
    uploadBg(file){
      console.log(file);

      //限制上传文件类型
      let types = ["png", "gif", "jpg", "jpeg"];

      //截取上传图片的类型
      let type = file.file.type.split("/")[1];
      if (types.indexOf(type) === -1) {
        this.$toast({
          message: `文件格式仅支持${types.json(",")}`,
          forbidClick: true,
          duration: 2000,
        });
      }

      //处理base64
      let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, "");
      
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
        url: this.baseUrl + "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType:type,
          serverBase64Img:base64
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

          if (res.data.code === "H001") {
            if(res.data.result[0]===1){
               this.userInfo.userBg = res.data.userBg;
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
    }
  },
  created() {
    this.getUserInfo();
  },
  components: {},
};
</script>
