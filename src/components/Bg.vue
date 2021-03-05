<template>
  <div class="bg">
    <div class="topbg"></div>
    <div class="addresslist_box">
        <slot></slot>
    </div>
  </div>
</template>

<script>
import "../assets/less/bg.less";
export default {
  name: "Bg",
  data() {
    return {
      
    };
  },
};
</script>
