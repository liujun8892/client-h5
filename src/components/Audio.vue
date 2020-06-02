<template>
  <div>
    {{audioCurrentTime}}
    <button @click="pause">暂停</button>
    <button @click="play">播放</button>
     {{audioAllDuration}}
    <van-slider v-model="audioTime" @change="onChange" bar-height="4px" />
  </div>
</template>

<script>
// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second;
  if (secondType === "number" || secondType === "string") {
    second = parseInt(second);

    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;
    // hours + ':' +
    return ("0" + mimute).slice(-2) + ":" + ("0" + second).slice(-2);
  } else {
    return "0:00:00";
  }
}
import { Slider } from "vant";
export default {
  name: "Music",
  components: {
    vanSlider: Slider
  },
  data() {
    return {
      audio: null,
      tiemr: null,
      currentIndex: 0,
      currentSrc: "http://mp3.9ku.com/tuijian/2015/07-13/665764.mp3",
      activeClass: "active",
      audioTime: 0,
      audioAllDuration:'00:00',
      audioCurrentTime:'00:00'

    };
  },
  methods: {
    play() {
      this.audio.play();
      // this.getAudioTime();
      this.watchMusicTime();
    },
    pause() {
      this.audio.pause();
    },
    //获取播放时间
    getAudioTime() {
      let audioPlayer = this.audio;
      console.log("播放总时间--" + realFormatSecond(audioPlayer.duration));
      console.log("已播放秒数--" + realFormatSecond(audioPlayer.currentTime));
      //展示用
      this.audioAllTime = realFormatSecond(audioPlayer.duration);
      this.audioAllDuration = audioPlayer.duration;
      this.audioCurrentTime = realFormatSecond(audioPlayer.currentTime);
      //计算当前进度百分比
      let audioTime =
        ((audioPlayer.currentTime * 100) / audioPlayer.duration).toFixed(3) ||
        0;
      this.audioTime = Number(audioTime);
      console.log("百分比--" + this.audioTime);
    },
    //滑动进度条
    onChange(value) {
      // 设置播放时间
      let audioPlayer = this.audio;
      this.audioCurrentTime = realFormatSecond(
        (this.audioAllDuration * value) / 100
      );
      audioPlayer.currentTime = parseInt((this.audioAllDuration * value) / 100);
    },

    createdAudio(mp3) {
      this.audio = new Audio();
      this.audio.src = mp3;
      // let playPromise;
      // playPromise = this.audio.play();
      // let that = this;
      // let second = 60;
      console.log(this.audio);
      // if (playPromise) {
      //   playPromise
      //     .then(() => {
      //       // 音频加载成功
      //       // 音频的播放需要耗时
      //       // console.log(res,98989)
      //       // that.tiemr = setInterval(() => {
      //       //   second--;
      //       //   if (second <= 0) {
      //       //     that.audio.pause();
      //       //     clearInterval(that.tiemr);
      //       //   }
      //       // }, 1000);
      //     })
      //     .catch(e => {
      //       // 音频加载失败
      //       console.error(e);
      //     });
      // }
    },
    //监听音乐实时播放的时间
    watchMusicTime() {
      let _this = this;
      //监听播放时间
      let musicDom = this.audio; //获取Audio的DOM节点
      //使用事件监听方式捕捉事件
      musicDom.addEventListener(
        "timeupdate",
        function() {
          //监听音频播放的实时时间事件
          let timeDisplay;
          //用秒数来显示当前播放进度
          timeDisplay = Math.floor(musicDom.currentTime); //获取实时时间
          console.log(timeDisplay)
           let audioTime =
              ((timeDisplay * 100) / musicDom.duration).toFixed(3) || 0;
            _this.audioTime = Number(audioTime);

           _this.audioAllDuration = musicDom.duration;
      

          //处理时间
          //分钟
          let minute = timeDisplay / 60;
          let minutes = parseInt(minute);
          if (minutes < 10) {
            minutes = "0" + minutes;
          }
          //秒
          let second = timeDisplay % 60;
          let seconds = Math.round(second);
          if (seconds < 10) {
            seconds = "0" + seconds;
          }
          // _this.$store.state.realMusicTime = minutes + ":" + seconds; //将实时时间存储到vuex中
          console.log(minutes + ":" + seconds);
          
          
        },
        false
      );
    }
  },
  created() {
    this.createdAudio(this.currentSrc);
  }
};
</script>

<style scoped>
button {
  width: 200px;
  height: 60px;
}
</style>

