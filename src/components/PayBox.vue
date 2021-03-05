<template>
  <div class="pay_boxing">
    <div>
      <slot name="pay_title">
        <div class="pay_title">订单信息</div>
      </slot>
    </div>
    <div class="pay_middle">
      <slot name="order_item"></slot>
    </div>
    <div class="pay_foot">
      <div class="pay_line">
        <div class="pay_left"></div>
        <div class="pay_right"></div>
      </div>
      <div class="foot_info">
        <div class="date" v-if="proInfo.date">{{proInfo.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
        <div class="foot_bottom">
          <div class="foot_count">共计 {{ proInfo.count }} 件</div>
          <div class="foot_total">合计 &yen;{{proInfo.total}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/paybox.less";

export default {
  name: "PayBoxe",
  props: {
    proInfo: {
      type: Object,
      default(){
          return {
              count:0,
              total:0,
              //是否显示日期
              date:''
          }
      },
    },
    
    
  },
};
</script>
