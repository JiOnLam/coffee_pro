<template>
  <div class="menu_item">
    <ul>
      <router-link :to="`/details/${item.pid}`" tag="li" v-for="(item, index) in menuLists" :key="index">
        <div class="img_box">
          <img class="auto_img" :src="item.smallImg" alt="" />
        </div>
        <div class="info_box">
          <div class="name_box">
            <p class="name">{{ item.name }}</p>
            <p class="enname">{{ item.enname }}</p>
          </div>
          <div class="price">
            <div class="money">￥{{ item.price }}</div>
            <div class="icon_box">去购买<van-icon name="arrow" /></div>
          </div>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
import '../assets/less/menuItem.less';
export default {
  name: "MenuItem",
  props: {
    menuLists: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {};
  },
};
</script>
