<!--  -->
<template>
    <div id="AudioDetails">
        <!-- <van-nav-bar
      class="van-nav ignore"
      left-arrow
      @click-left="$router.go(-1)"
      :border="false"
        />-->
        <div class="Title">{{ Details.audio_name }}</div>
        <div class="Teacher">主讲老师：{{ Details.teacher_name }}</div>
        <div class="Audio_bj">
            <div class="teacher_avatar">
                <img :src="$iconURL + Details.teacher_avatar" alt />
            </div>
            <div class="center">
                <div class="Current_duration">{{ Current_duration }}</div>
                <!-- 当前时长 -->
                <div class="Slider">
                    <van-slider
                        v-model="audioTime"
                        inactive-color="#fff"
                        active-color="#6EB880"
                        @change="onChange"
                        bar-height="2px"
                    />
                </div>
                <div class="Total_duration">{{ Total_duration }}</div>
                <!-- 总时长 -->
            </div>
            <div class="button" @click="button">
                <div class="play" v-if="zt == true">
                    <!-- <img src alt srcset /> -->
                    <img src="../assets/images/study/play.png" />
                </div>

                <!-- 播放 -->
                <div class="suspend" v-if="zt == false">
                    <img src="../assets/images/study/pause.png" />
                    <!-- <img  src alt srcset /> -->
                </div>

                <!-- 暂停 -->
            </div>
        </div>

        <div class="desc ignore" v-html="Details.desc"></div>
        <audio id="bgmusic" :src="currentSrc" autoplay preload class="styaudio"></audio>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import { Slider } from "vant";

import wx from "weixin-js-sdk";

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

export default {
    components: { vanSlider: Slider }, //import引入的组件需要注入到对象中才能使用
    data() {
        return {
            Details: "",
            Current_duration: "00:00",
            Total_duration: "00:00",
            zt: true,
            audio: null,
            tiemr: null,
            currentIndex: 0,
            currentSrc: "",
            activeClass: "active",
            audioTime: 0,
            audioAllDuration: "00:00",
            audioCurrentTime: "00:00"
        }; //这里存放数据
    },
    //监听属性 类似于data概念
    computed: {},
    watch: {}, //监控data中的数据变化
    methods: {
        // 缓冲下载中
        progress() {
            let that = this;
            console.log(2323);
            let audio = this.audio;
            // 自定义加载图标
            that.$toast.loading({
                forbidClick: true,
                loadingType: "spinner"
            });

            audio.addEventListener("loadstart", function(res) {
                // 开始加载
                console.log("start", res);
            });
            audio.addEventListener("durationchange", function(res) {
                // 已获得播放时长
                console.log("durationchange", res);
            });
            audio.addEventListener("loadeddata", function(res) {
                // 已获得播放头文件
                console.log("loadeddata", res);
            });
            audio.addEventListener("canplay", function(res) {
                // 可以播放
                console.log("canplay", res);
            });
            // audio.addEventListener("timeupdate", function(res) {
            //   // 播放中
            //   console.log("timeupdate", res);
            // });
            audio.addEventListener("canplaythrough", function(res) {
                // 可以不发生缓冲下载从头播放到结束，一般来说是加载完成过一次的判断
                console.log("canplaythrough", res);
                
            });
            audio.addEventListener("progress", function(res) {
                console.log(res);
            });
        },
        getAudioDetail(parmas) {
            //获取课程详情
            this.$api.getAudioDetail(parmas).then(res => {
                if (res.code == 200) {
                    this.Details = res.data;
                    this.currentSrc = this.$iconURL + res.data.audio_file;
                    console.log(this.currentSrc, 1000);
                    this.autoPlayAudio1();
                }
            });
        },
        button() {
            this.zt = !this.zt;

            if (this.zt == true) {
                console.log("播放");
                this.audio.pause();
            } else {
                console.log("暂停");

                this.audio.play();
                this.getAudioTime();
                this.watchMusicTime();
            }
        },
        //获取播放时间
        getAudioTime() {
            let audioPlayer = this.audio;
            console.log(
                "播放总时间--" + realFormatSecond(audioPlayer.duration)
            );
            console.log(
                "已播放秒数--" + realFormatSecond(audioPlayer.currentTime)
            );
            //展示用
            this.audioAllTime = realFormatSecond(audioPlayer.duration);
            this.audioAllDuration = audioPlayer.duration;
            this.audioCurrentTime = realFormatSecond(audioPlayer.currentTime);
            //计算当前进度百分比
            let audioTime =
                (
                    (audioPlayer.currentTime * 100) /
                    audioPlayer.duration
                ).toFixed(3) || 0;
            this.audioTime = Number(audioTime);
            console.log("百分比--" + this.audioTime);
        },
        //滑动进度条
        // onChange(value) {
        //   // 设置播放时间
        //   console.log(value)
        //   let audioPlayer = this.audio;
        //   this.audioCurrentTime = realFormatSecond(
        //     (this.audioAllDuration * value) / 100
        //   );
        //   audioPlayer.currentTime = parseInt((this.audioAllDuration * value) / 100);
        // },

        //滑动进度条
        onChange(value) {
            // 设置播放时间
            let audioPlayer = this.audio;
            this.audioCurrentTime = realFormatSecond(
                (this.audioTime * value) / 100
            );
            let currentTime = parseInt((audioPlayer.duration * value) / 100);
            audioPlayer.currentTime = currentTime;
        },

        createdAudio(mp3) {
            this.audio = new Audio();
            this.audio.src = mp3;

            console.log(this.audio);
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
                    console.log(timeDisplay);
                    if(timeDisplay == 1){
                        _this.$toast.clear();
                    }

                    _this.Current_duration = realFormatSecond(timeDisplay);
                    let audioTime =
                        ((timeDisplay * 100) / musicDom.duration).toFixed(3) ||
                        0;
                    _this.audioTime = Number(audioTime);

                    _this.Total_duration = realFormatSecond(musicDom.duration);
                },
                false
            );
        },
        autoPlayAudio1() {
            //     console.log(wx)
            let _that = this;
            wx.config({
                // 配置信息, 即使不正确也能使用 wx.ready
                debug: false,
                appId: "",
                timestamp: 1,
                nonceStr: "",
                signature: "",
                jsApiList: []
            });

            wx.ready(function() {
                _that.audio = document.getElementById("bgmusic");
                if (_that.audio) {
                    _that.audio.play();
                }
                _that.watchMusicTime();
                _that.zt = false;
                _that.progress();
            });
        }
    }, //方法集合
    created() {
        let parmas = { audio_id: this.$GetQueryString("audio_id") };
        this.getAudioDetail(parmas);
        // this.createdAudio(this.currentSrc);
    }, //生命周期 - 创建完成（可以访问当前this实例）
    mounted() {}, //生命周期 - 挂载完成（可以访问DOM元素）
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {
        this.$toast.clear();
    }, //生命周期 - 销毁完成
    activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="less" >
#AudioDetails {
    width: 100%;
    .van-slider__button {
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.3);
        border-radius: 50%;
    }

    .styaudio {
        position: absolute;
        top: -999px;
        left: -999px;
    }
    .Title {
        flex: 1;
        margin: 188px 72px 0;
        text-align: center;
        font-size: 46px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        line-height: 60px;
    }
    .Teacher {
        flex: 1;
        margin: 48px 34px;
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
    }
    .Audio_bj {
        width: 684px;
        height: 156px;
        margin: 0 auto;
        background-image: url(../assets/images/study/bgc.png);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: 0px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
        .teacher_avatar {
            width: 102px;
            height: 102px;
            margin-left: 35px;
            background: rgba(165, 166, 171, 1);
            border-radius: 4px;
            box-shadow: 0px 0px 18px 2px rgba(102, 102, 102, 0.35);
            border-radius: 4px;
            img {
                width: 100%;
                height: 100%;
            }
        }
        .center {
            flex: 1;
            height: 100%;
            margin: 0 44px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            .Slider {
                flex: 1;
                margin: 0 20px;
            }
        }
        .button {
            width: 60px;
            height: 60px;
            margin-right: 28px;
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
    .desc {
        margin: 89px 42px 80px 32px;
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #444444;
        line-height: 58px;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
        height: auto;
        flex: 1;
    }
    .van-nav {
        position: fixed;
        top: 0;
        height: 60px;
        .van-nav-bar__left {
            i {
                font-size: 60px;
            }
        }
    }
}
</style>