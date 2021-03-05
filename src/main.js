import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

axios.interceptors.request.use(config => {
  if (config.method == 'post') {
    let paramsString = '';
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`
    }
    config.data = paramsString.slice(0, -1);
    // console.log(config.data)
  }

  //必须返回config
  return config;
})
Vue.use(VueAxios, axios)
//将px转rem文件
import 'lib-flexible/flexible'

import {
  Uploader,
  Tab,
  Tabs,
  AddressEdit,
  AddressList,
  Empty,
  List,
  SubmitBar,
  Checkbox,
  SwipeCell,
  CheckboxGroup,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Cell,
  CellGroup,
  Button,
  Tabbar,
  TabbarItem,
  Icon,
  Field,
  Popup,
  Swipe,
  SwipeItem,
  Lazyload,
  Toast,
  NavBar,
  Search,
  Card,
  Stepper,
  Sidebar,
  SidebarItem,
  Dialog
} from 'vant';
Vue.use(Dialog);
Vue.use(Cell);
Vue.use(Card);
Vue.use(CellGroup);
Vue.use(Lazyload);
Vue.use(Button);
Vue.use(Empty);
Vue.use(Tabbar);
Vue.use(TabbarItem);
Vue.use(Icon);
Vue.use(Field);
Vue.use(Popup);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Toast);
Vue.use(NavBar);
Vue.use(Search);
Vue.use(Stepper);
Vue.use(GoodsAction);
Vue.use(GoodsActionButton);
Vue.use(GoodsActionIcon);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(SubmitBar);
Vue.use(SwipeCell);
Vue.use(List);
Vue.use(AddressList);
Vue.use(AddressEdit);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Uploader);
Vue.use(Sidebar);
Vue.use(SidebarItem);

Vue.config.productionTip = false

//将请求路径存和appkey放在原型属性里
Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002'
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//定义全局过滤器
Vue.filter('formatDate', (data, format) => {
  //data:需要进行格式化的数据
  //format:格式

  let date = new Date(data);
  let year = date.getFullYear().toString();

  if (/(y+)/.test(format)) {

    //获取匹配组的内容
    let yearContent = RegExp.$1;
    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }
  return format;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
