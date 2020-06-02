<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view> 3
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>


<style>
.van-toast {
  line-height: 1;
  padding: 20px;
}
.van-toast__text {
  font-size: 30px;
}
img {
  content: normal !important;
}
img[lazy="loading"]{ 
  transform: scale(0.2);
}
</style>
