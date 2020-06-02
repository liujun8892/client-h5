<!--  -->
<template>
    <div id="CourseDescription">
        <div
            class="bj"
            :style="{ backgroundImage: 'url(' + $iconURL + data.cover + ')', backgroundPosition: '0px 0px', backgroundSize:'cover',backgroundRepeat:'no-repeat' }"
        >
            <!-- <img class="textHolder" :src="$iconURL + data.cover" alt /> -->
            <!-- <div class="textHolders"></div> -->
        </div>
        <div class="map">
            <div class="CourseInformation">
                <img class="teacher_avatar" :src="$iconURL + data.teacher_avatar" />
                <div class="CourseInformations">
                    <div class="title">{{data.title}}</div>
                    <div class="titles">{{data.course_desc}}</div>
                    <div class="teacher_name">主讲老师：{{data.teacher_name}}</div>
                </div>
            </div>

            <div class="cutTab" v-if="!data.is_buy">
                {{active}}
                <div :class="['tab', { active: active == 1 }]" @click="cutTab(1)">
                    课程介绍
                    <div class="after" v-show="active == 1"></div>
                </div>
                <div :class="['tab', { active: active == 2 }]" @click="cutTab(2)">
                    课程目录
                    <div class="audition" v-if="data.is_shiting">试听</div>
                    <div class="after" v-show="active == 2"></div>
                </div>
            </div>
            <div class="cutTab_one" v-else>
                <div class="tab">课程学习</div>
            </div>

            <!--海报 -->
            <!-- <img class="course_poster" :src="$iconURL + data.course_poster_old" />-->
            <div class="img_list">
                <img
                    class="imagers"
                    v-lazy="$iconURL + item"
                    v-for="(item, index) in imager_list"
                    :key="index"
                    v-show="active == 1 && ! data.is_buy"
                />
            </div>

            <div
                class="cutTab_contents"
                :class="{ cutTab_bottom: !data.is_buy }"
                v-show="active == 2 || data.is_buy"
            >
                <!-- <mix-tree :list="list" :params="treeParams" @click="treeItemClick" ref="mixTree"></mix-tree> -->
                <mixtree :list="list"></mixtree>
                <div class="cutTab_bottoms">- 下面没有了 -</div>
            </div>

            <div
                class="cutTab_contents"
                :class="{ cutTab_bottom: !data.is_buy }"
                v-show="active == 2 || data.is_buy"
            ></div>
        </div>
        <div class="bottom" v-if="!data.is_buy">
            <div class="price">¥{{data.price}}</div>
            <div class="Buynow">
                <div v-if="data.is_free">立即领取</div>
                <div v-else>立即购买</div>
            </div>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import mixtree from "../components/mix-tree/mix-tree";

export default {
    components: { mixtree }, //import引入的组件需要注入到对象中才能使用
    data() {
        return {
            title: "",
            data: Object,
            is_buy: 0,
            imager_list: [],
            active: 2,
            list: []
        }; //这里存放数据
    },
    //监听属性 类似于data概念
    computed: {},
    watch: {}, //监控data中的数据变化
    beforeCreate() {}, //生命周期 - 创建之前
    created() {}, //生命周期 - 创建完成（可以访问当前this实例）
    beforeMount() {}, //生命周期 - 挂载之前
    mounted() {
        let parmas = { course_id: 5 };
        this.getCourseIntroduce(parmas);
    }, //生命周期 - 挂载完成（可以访问DOM元素）
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
    methods: {
        cutTab(index) {
            //切换tab
            this.active = index;
            // console.log(this.active);
        },

        getCourseIntroduce(parmas) {
            //获取课程详情
            this.$api.getCourseIntroduce(parmas).then(res => {
                console.log(res);
                if (res.code == 200) {
                    console.log(res.data);
                    this.data = res.data;
                    console.log(this.data.course_poster_old);
                    this.imager_list = this.data.course_poster;
                    console.log(this.imager_list);
                    this.list = this.data.list;
                    console.log(this.list);
                }
            });
        }
    } //方法集合
};
</script>
<style lang="scss">
#CourseDescription {
    width: 100%;
    .bj {
        width: 100%;
        height: 300px;
        background-color: wheat;
        position: fixed;
        position: relative;
        &:before {
            // content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: inherit;
            // background-attachment: fixed;
            filter: blur(5px);
        }
        &:after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.65);
        }
        .textHolder {
            width: 100%;
            height: 300px;
            position: absolute;
            right: 0;
            bottom: 0;
            // background: inherit;
            overflow: hidden;
            // transform: scale(1.2);
            z-index: 0;
        }
        .textHolders {
            width: 100%;
            height: 300px;
            position: absolute;
            right: 0;
            bottom: 0;
            // background: inherit;
            overflow: hidden;
            // transform: scale(1.2);
            z-index: 2;
        }
        .textHolders::before {
            // content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: inherit;
            // background-attachment: fixed;
            filter: blur(5px);
        }
        .textHolders::after {
            // content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.65);
        }
    }
    .map {
        width: 100%;
        top: 0;
        position: relative;
        background: rgba(255, 255, 255, 1);
        border-radius: 24px 24px 0px 0px;
        border-top: 1px solid transparent;
        z-index: 1024;
        .CourseInformation {
            flex: 1;
            height: 200px;
            margin-top: -90px;
            position: relative;
            padding: 0 60px 30px;
            border-bottom: 16px solid rgba(249, 249, 249, 1);
            display: flex;
            justify-content: center;
            align-items: flex-start;
            .teacher_avatar {
                width: 200px;
                height: 200px;
                background: rgba(153, 153, 153, 1);
                border-radius: 20px;
            }
            .CourseInformations {
                flex: 1;
                height: 100%;
                margin-left: 30px;
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                flex-direction: column;
                .title {
                    width: 357px;
                    height: 72px;
                    font-size: 32px;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: rgba(255, 255, 255, 1);
                    line-height: 41px;
                }
                .titles {
                    margin-top: 48px;
                    font-size: 26px;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: rgba(153, 153, 153, 1);
                    line-height: 36px;
                }
                .teacher_name {
                    font-size: 26px;
                    font-family: PingFang SC;
                    font-weight: bold;
                    color: rgba(51, 51, 51, 1);
                    line-height: 50px;
                }
            }
        }

        .cutTab {
            width: 100%;
            height: 90px;
            position: relative;
            display: flex;
            .tab {
                width: 50%;
                font-size: 36px;
                font-family: PingFang SC;
                font-weight: bold;
                color: rgba(85, 85, 85, 1);
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;

                position: relative;
                .audition {
                    width: 72px;
                    height: 340px;
                    // text-align: center;
                    background: rgba(236, 94, 51, 1);
                    box-shadow: 0px 2px 8px 0px rgba(243, 133, 99, 0.15);
                    border-radius: 21px 17px 17px 2px;
                    font-size: 22px;
                    line-height: 40px;
                    // display: flex;
                    // justify-content: center;
                    // align-content: center;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    position: absolute;
                    top: 5px;
                    left: 50%;
                    transform: translate(100%, 0);
                }
            }
            .active {
                color: rgba(42, 193, 124, 1);
                position: relative;
            }
            .after {
                // content: "";
                position: absolute;
                width: 52px;
                height: 6px;
                background: rgba(42, 193, 124, 1);
                border-radius: 3px;
                bottom: 10px;
                left: 50%;
                margin-left: -26px;
            }
        }
        .cutTab_one {
            display: flex;
            height: 90px;
            justify-content: center;
            .tab {
                width: 50%;
                font-size: 36px;
                font-family: PingFang SC;
                font-weight: bold;
                color: rgba(85, 85, 85, 1);
                text-align: center;
                position: relative;
            }
        }

        .taps {
            width: 100%;
            margin: 32px 0 42px;
            display: flex;
            position: relative;
            justify-items: center;
            align-items: center;
            .list {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                font-size: 36px;
                line-height: 36px;
                font-family: PingFang SC;
                font-weight: bold;
                color: rgba(42, 193, 124, 1);
                .audition {
                    width: 72px;
                    height: 34px;
                    text-align: center;
                    background: rgba(236, 94, 51, 1);
                    box-shadow: 0px 2px 8px 0px rgba(243, 133, 99, 0.15);
                    border-radius: 21px 17px 17px 2px;
                    font-size: 22px;
                    line-height: 34px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    position: absolute;
                    // right: 20px;
                    // top: -5px;
                    top: 0;
                    right: 0;
                    transform: translate(-50%, -50%);
                }
                .d {
                    width: 52px;
                    height: 6px;
                    margin-top: 16px;
                    background: rgba(42, 193, 124, 1);
                    border-radius: 3px;
                }
            }
        }

        .cutTab_contents {
            margin: 42px 0px;
            .cutTab_bottoms {
                font-size: 22px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(153, 153, 153, 1);
                text-align: center;
                margin-top: 70px;
            }
        }
        .cutTab_bottom {
            margin-bottom: 160px;
        }

        .course_poster {
            width: 686px;
            position: relative;
            left: 50%;
            transform: translateX(-50%);
            margin-bottom: 112px;
        }
        .img_list {
            width: 686px;
            margin-top: 32px;
            padding: 0;
            margin-bottom: 112px;
            position: relative;
            // left: 50%;
            // transform: translateX(-50%);
            margin: 0 auto;
            .imagers {
                width: 100%;
                // height: 1334px;
                margin: 0;
                padding: 0;
                display: block;
            }
        }
    }
    .bottom {
        width: 100%;
        height: 112px;
        position: fixed;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: rgba(247, 247, 247, 1);
        border-radius: 24px 24px 0px 0px;
        .price {
            margin-left: 34px;
            font-size: 40px;
            color: #ef5c41;
        }
        .Buynow {
            width: 240px;
            height: 80px;
            margin-right: 34px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(
                -37deg,
                rgba(42, 193, 124, 1),
                rgba(42, 193, 145, 1)
            );
            box-shadow: 0px 10px 30px 0px rgba(51, 226, 148, 0.5);
            border-radius: 40px;
        }
    }
}
</style>















