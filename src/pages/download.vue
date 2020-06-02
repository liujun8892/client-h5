<!--  -->
<template>
    <div id="map">
        <img class="background" src="../assets/images/download/background.png" />
        <div class="box">
            <div class="boxs">
                <div class="left">
                    <img class="logo" src="../assets/images/download/logo.png" />
                    <div class="title">
                        <div class="top">轻听树下</div>
                        <div class="bottom">成为更好的家长</div>
                    </div>
                </div>
                <div class="Download_now" id="downloadTop" @click="downloadTop()">立即下载</div>
            </div>
        </div>
        <div class="sgd" id="Otherbrowsersopen" :class="{xs:sfxs===true}">
            <img class="Jump_background" src="../assets/images/download/Jump_background.png" />
            <div class="titles">
                <div class="titless">点击页面右上角…</div>
                <div class="titless">选择 “通过浏览器打开”</div>
                <div class="titless">我们将会为您自动打开下载页</div>
            </div>
            <img class="Browser_jump" src="../assets/images/download/Browser_jump.png" />
        </div>
    </div>
</template>
<script src="https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js"></script>
<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import schemes from '@/common/utils/schemes.js';

let u = navigator.userAgent,
    app = navigator.appVersion,
    isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1,
    isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    androidUrl = "http://d.alphaqr.com/bgan",
    iosUrl = "https://itunes.apple.com/cn/app/id1503106436";
export default {
    components: {}, //import引入的组件需要注入到对象中才能使用
    data() {
        return {
            sfxs: false
        }; //这里存放数据
    },
    //监听属性 类似于data概念
    computed: {},
    watch: {}, //监控data中的数据变化
    methods: {
        is_weixin() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                return true;
            } else {
                return false;
            }
        },
        downloadTop() {
            // if (this.is_weixin()) {
            //     this.sfxs = true;
            //     return;
            // }
            // console.log(isIOS, isAndroid);
            // if (isIOS) {
            //     console.log(window.location.href, iosUrl);
            //     window.location.href = iosUrl;
            // } else {
            //     window.location.href = androidUrl;
            // }
            var schemesObj = {
              pkgname: 'com.listeningtrees.webapp',
              appleId: '1503106436',
              app_qq: 'https://a.app.qq.com/o/simple.jsp?pkgname=',
              appleUrl: ' https://itunes.apple.com/cn/app/id'
            }
            var isschemes = new schemes('listeningtrees://', schemesObj)
            isschemes.init()
        }
    }, //方法集合
    created() {}, //生命周期 - 创建完成（可以访问当前this实例）
    mounted() {}, //生命周期 - 挂载完成（可以访问DOM元素）
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {} //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style lang="less" >
* {
    margin: 0;
    padding: 0;
    border: 0;
}
#map {
    position: absolute;
    width: 100%;
    height: 100%;
    .background {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
    }
    .box {
        width: 750px;
        .boxs {
            width: 670px;
            padding: 0 40px;
            height: 118px;
            position: fixed;
            display: flex;
            justify-content: space-between;
            align-items: center;
            top: 0;
            background: rgba(0, 0, 0, 0.25);
            z-index: 2;
            .left {
                height: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                .logo {
                    width: 90px;
                    height: 90px;
                }
                .title {
                    width: 300px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                    .top {
                        margin-top: 26px;
                        font-size: 30px;
                        font-family: PingFang SC;
                        font-weight: bold;
                        color: rgba(255, 255, 255, 1);
                    }
                    .bottom {
                        margin-bottom: 26px;
                        font-size: 24px;
                        font-family: PingFang SC;
                        font-weight: bold;
                        color: rgba(255, 255, 255, 1);
                    }
                }
            }
            .Download_now {
                width: 186px;
                height: 72px;
                text-align: center;
                line-height: 72px;
                background: linear-gradient(
                    -37deg,
                    rgba(42, 193, 124, 1),
                    rgba(42, 193, 145, 1)
                );
                box-shadow: 0 10px 30px 0 rgba(51, 226, 148, 0.5);
                border-radius: 36px;
                font-size: 30px;
                font-family: PingFang SC;
                font-weight: bold;
                color: rgba(255, 255, 255, 1);
            }
        }
    }
    .sgd {
        width: 100%;
        height: 100%;
        background-color: #ffffff;
        position: absolute;
        z-index: 1024;
        display: none;
        .Jump_background {
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 1;
        }
        .titles {
            z-index: 2;
            height: 150px;
            top: 174px;
            left: 42px;
            position: fixed;
            display: flex;
            justify-content: space-between;
            flex-direction: column;
            .titless {
                font-size: 36px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
            }
        }
        .Browser_jump {
            z-index: 3;
            top: 30px;
            right: 48px;
            width: 156px;
            height: 146px;
            position: fixed;
        }
    }
    .xs {
        display: block;
    }
}
</style>