<template>
  <div class="like">
    <van-nav-bar
      title="收藏夹"
      left-text="返回"
      left-arrow
      @click-left="back"
    ></van-nav-bar>
    <van-search
      v-model="value"
      shape="round"
      background="#4aa668"
      placeholder="请输入搜索商品全称"
      @input="search"
    />
    <div class="likeList" v-if="likeList.length > 0">
      <van-card
        v-for="(item, index) in likeList"
        :key="index"
        :price="item.price"
        :desc="item.enname"
        :title="item.name"
        :thumb="item.smallImg"
        @click="toDetails(item.pid)"
      />
    </div>
    <van-empty description="没有收藏任何商品~" v-if="likeList.length <= 0" />
    <div class="same">—— 以下为相似商品 ——</div>
    <div class="same_box">
      <ul>
        <router-link
          :to="`/details/${item.pid}`"
          tag="li"
          v-for="item in sameList"
          :key="item.id"
        >
          <img :src="item.smallImg" width="100%" />
          <p class="ch_name">{{ item.name }}</p>
          <p class="en_name">{{ item.enname }}</p>
          <p class="price">￥{{ item.price }}</p>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script>
import "../assets/less/like.less";
export default {
  name: "Like",
  data() {
    return {
      likeLists: [],
      likeList: [],
      value: "",
      sameList: [],
      nameList: [],
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "Mine" });
    },

    getLike() {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "GET",
        url: this.baseUrl + "/findAllLike",
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

          if (res.data.code === 2000) {
            this.likeList = res.data.result;
            this.likeLists = res.data.result;
            res.data.result.forEach((v) => {
              this.nameList.push(v.name.split(""));
            });
            // console.log(this.likeLists);
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

    //获取相似商品
    getSameList() {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.axios({
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
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

          if (res.data.code === 500) {
            this.sameList = res.data.result;
            //  console.log(this.sameList)
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

    toDetails(pid) {
      this.$router.push(`/details/${pid}`);
    },

    search(value) {
      this.likeList = [];
      if(value==''){
        return this.likeList = this.likeLists;
      }
      for(let key in this.likeLists){
        if(value==this.likeLists[key].name){
          this.likeList.push(this.likeLists[key]);
        }
      }
        
    },
  },
  created() {
    this.getLike();
    this.getSameList();
  },
};
</script>
