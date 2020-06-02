<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/images/logo.png" />
    {{msg}}
    <van-button type="warning" @click="warning">警告按钮asdsd</van-button>
    <van-button type="warning" @click="authorize">authorize</van-button>

    <div class="bbox">

    </div>

  </div>
</template>

<script>
// @ is an alias to /src

import { Button } from "vant";
import { Dialog } from "vant";

export default {
  name: "Home",
  components: {
    vanButton: Button
  },
  // components: {
  //   HelloWorld
  // }
  data() {
    return {
      msg: "2333"
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
       this.$api.getCourse({page:1,pageSize:20}).then(res=>{
          console.log(res)
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
.DialogNmae{
  color: red;
  .van-dialog__message{
  font-size: 30px !important;
  }
}
.bbox{
  height: 1200px;
  background: red;
}
</style>
