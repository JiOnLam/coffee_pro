<template>
    <div class="order_item">
          <div class="pro_img">
              <img class="auto_img" :src="product.small_img||product.smallImg">
          </div>
          <div class="pro_info">
              <div class="pro_top">
                  <div class="pro_name">
                      <div class="p_name">{{product.name}}</div>
                      <div class="p_rule">{{product.rule}}</div>
                  </div>
                  <div class="p_enname">{{product.enname}}</div>
              </div>
              <div class="pro_bottom">
                  <div class="p_price">&yen;{{product.price}}</div>
                  <div class="p_count">x{{product.count}}</div>
              </div>
          </div>
    </div>
</template>

<script>
import '../assets/less/orderItem.less'
    export default {
        name:"OrderItem",
        props:{
            product:{
                type:Object,
                //当props属性为引用类型数据,默认值必须使用default函数返回
                default(){
                    return {}
                }
            }
        }
    }
</script>
