<template>
  <div class="home">
    <van-button type="warning" @click="warning">警告按钮</van-button>
    <div>
      <button @click="goPay">pay</button>
      <button @click="toCourseDescription">CourseDescription</button>
    </div>
    <Audios></Audios>
  </div>
</template>

<script>
// @ is an alias to /src

import { Button } from "vant";
import { Dialog } from "vant";
import {GetQueryString} from '@/common/utils/mixin.js'
import Audios from '../components/Audio'
export default {
  name: "Home",
  components: {
    vanButton: Button,
    'Audios':Audios
  },
  // components: {
  //   HelloWorld
  // }
  data() {
    return {
      is_bindphone: 0, // 0未绑定手机
    };
  },
  methods: {
    warning() {
      console.log(232332);
      Dialog.alert({
        width: "72vw",
        message: "\n 弹窗内容 \n \n",
        className:'DialogNmae'
      }).then((res) => {
        this.$api.getAgreement({type:1}).then(res=>{
          console.log(res)
        })
        console.log(res)
      });
    },

    authorize() {
       this.$api.getCourse({page:1,pageSize:20,course_id:5}).then(res=>{
          console.log(res)
        })
    },

    goPay(){
      this.$router.push('./Pay')
    },
    toCourseDescription(){
        this.$router.push('./CourseDescription')
    }
  },
  created(){
    console.log(GetQueryString('code'),56)
    console.log(this.$store.state.UserInfo.code)
    if(this.$store.state.UserInfo.code && this.$store.state.UserInfo.token){
      this.$api.wxH5register({code:this.$store.state.UserInfo.code}).then(res=>{
        console.log(res)
        if(res.code == 200){
          this.$store.dispatch('saveToken',res.data.token);
          this.is_bindphone = res.data.is_bindphone;
          this.authorize()
        }
      })
    }
  }
};
</script>
<style lang="less" >
.isbox {
  width: 200px;
  height: 200px;
  background: red;
}
.bbox{
  height: 1200px;
  background: red;
}
</style>
