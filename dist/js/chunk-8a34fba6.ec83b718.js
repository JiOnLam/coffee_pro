(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8a34fba6"],{d3b0:function(s,e,a){"use strict";a.r(e);var t=function(){var s=this,e=s.$createElement,a=s._self._c||e;return a("div",{staticClass:"updatePass"},[a("van-nav-bar",{attrs:{title:"安全中心","left-text":"返回","left-arrow":""},on:{"click-left":s.back}}),a("div",{staticClass:"old_pass_box"},[a("div",{staticClass:"old_pass"},[s._v("旧密码:")]),a("div",{staticClass:"old_text"},[a("input",{directives:[{name:"model",rawName:"v-model",value:s.oldPass,expression:"oldPass"}],attrs:{type:"text",placeholder:"请输入旧密码"},domProps:{value:s.oldPass},on:{input:function(e){e.target.composing||(s.oldPass=e.target.value)}}})])]),a("div",{staticClass:"new_pass_box"},[a("div",{staticClass:"new_pass"},[s._v("新密码:")]),a("div",{staticClass:"new_text"},["checkbox"===(s.isClose?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:s.newPass,expression:"newPass"}],attrs:{placeholder:"请设置新密码",type:"checkbox"},domProps:{checked:Array.isArray(s.newPass)?s._i(s.newPass,null)>-1:s.newPass},on:{change:function(e){var a=s.newPass,t=e.target,o=!!t.checked;if(Array.isArray(a)){var n=null,i=s._i(a,n);t.checked?i<0&&(s.newPass=a.concat([n])):i>-1&&(s.newPass=a.slice(0,i).concat(a.slice(i+1)))}else s.newPass=o}}}):"radio"===(s.isClose?"text":"password")?a("input",{directives:[{name:"model",rawName:"v-model",value:s.newPass,expression:"newPass"}],attrs:{placeholder:"请设置新密码",type:"radio"},domProps:{checked:s._q(s.newPass,null)},on:{change:function(e){s.newPass=null}}}):a("input",{directives:[{name:"model",rawName:"v-model",value:s.newPass,expression:"newPass"}],attrs:{placeholder:"请设置新密码",type:s.isClose?"text":"password"},domProps:{value:s.newPass},on:{input:function(e){e.target.composing||(s.newPass=e.target.value)}}}),a("div",{staticClass:"eye"},[a("van-icon",{attrs:{name:s.isClose?"eye-o":"closed-eye"},on:{click:s.toggle}})],1)])]),a("div",{staticClass:"btn",on:{click:function(e){return s.commit(s.oldPass,s.newPass)}}},[s._v("确认修改")])],1)},o=[],n={name:"UpdatePass",data:function(){return{oldPass:"",newPass:"",isClose:!1}},methods:{back:function(){this.$router.go(-1)},commit:function(s,e){var a=this,t=this.$cookies.get("tokenString");if(!t)return this.$router.push({name:"Login"});if(s==e)return this.$toast({message:"新密码不能与旧密码一样",forbidClick:!0,duration:2e3});var o=/^[A-Za-z]\w{5,15}$/;if(!o.test(e))return this.$toast({message:"密码支持字母数字_组合且首字母必须为字母",forbidClick:!0,duration:2e3});this.axios({method:"POST",url:this.baseUrl+"/updatePassword",data:{appkey:this.appkey,tokenString:t,password:e,oldPassword:s}}).then((function(s){if(a.$toast.clear(),700==s.data.code)return a.$toast({message:s.data.msg,forbidClick:!0,duration:3e3}),a.$router.push({name:"Login"});"E001"===s.data.code?(a.$toast({message:s.data.msg,forbidClick:!0,duration:3e3}),a.$router.go(-1)):a.$toast({message:s.data.msg,forbidClick:!0,duration:3e3})})).catch((function(s){a.$toast.clear(),console.log(s)}))},toggle:function(){this.isClose=!this.isClose}}},i=n,r=(a("ddfa"),a("2877")),l=Object(r["a"])(i,t,o,!1,null,"00c3bd0e",null);e["default"]=l.exports},ddfa:function(s,e,a){"use strict";a("e45b")},e45b:function(s,e,a){}}]);
//# sourceMappingURL=chunk-8a34fba6.ec83b718.js.map