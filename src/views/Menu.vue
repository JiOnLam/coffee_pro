<template>
  <div class="menu">
    <div class="top_bg">
      <div class="top_bgImg">
        <img class="auto_img" src="../assets/images/topBg.png" alt="" />
      </div>
    </div>
    <div class="content_box">
      <div class="content_title">
        <div class="tit_box"></div>
        <div class="menu_box">
          <van-icon name="shop-o" class="menu_icon" />菜单
        </div>
      </div>
    </div>
    <div class="menu_content">
      <div class="m_c_left">
        <van-sidebar v-model="activeKey">
          <van-sidebar-item
            v-for="(item, index) in typeList"
            :key="index"
            :title="item.typeDesc"
            @click="sel(item.type)"
          />
        </van-sidebar>
      </div>
      <div class="m_c_right">
        <div class="typeName">{{ typeName }}</div>
        <MenuItem :menuLists="menuLists" />
        
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
import MenuItem from "../components/MenuItem";
export default {
  name: "Menu",
  data() {
    return {
      activeKey: 0,
      typeList: [],
      typeName: "",
      menuLists: [],
    };
  },

  methods: {
    getType() {

      this.axios({
        method: "GET",
        url: this.baseUrl + "/type",
        params: {
          appkey: this.appkey,
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

          if (res.data.code === 400) {
            this.typeList = res.data.result;
            this.sel(res.data.result[0].type, res.data.result[0].typeDesc);
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

    sel(type) {
      

      this.axios({
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "type",
          value: type,
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

          if (res.data.code === 500) {
            this.menuLists = res.data.result;
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
    this.getType();
  },

  components: {
    MenuItem,
  },
};
</script>

