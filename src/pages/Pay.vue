<template>
    <!-- all-main 全部内容 -->
    <div class="all-main">
        <!-- <van-nav-bar
      class="van-nav"
      left-arrow
      @click-left="onClickLeft"
      :border="false"
        />-->
        <!-- desc 描述 -->
        <div class="desc">
            <div class="desc-photo">
                <img :src="$iconURL + list.cover" alt />
            </div>
            <div class="desc-subject">
                <div class="desc-subject-title">{{ list.title }}</div>
                <div class="desc-subject-money">
                    <div class="desc-subject-money-author">{{ list.teacher_name }}</div>
                    <div class="desc-subject-money-sumo">
                        <span>¥</span>
                        {{ list.price }}
                    </div>
                </div>
            </div>
        </div>
        <!-- 分隔线 -->
        <div class="separate"></div>
        <!-- pay -->
        <div class="pay">
            <div class="pay-title">支付方式</div>
            <div class="pay-weixin" @click="chooseWeixin">
                <div class="pay-weixin-logo">
                    <div class="img">
                        <img src="../assets/images/weixin.png" alt />
                    </div>
                    <div class="pay-weixin-text">微信支付</div>
                </div>
                <div v-if="choose" class="pay-weixin-choose">
                    <img src="../assets/images/finish.png" alt />
                </div>
            </div>
            <!-- <div class="pay-alipay" @click="chooseAlipay">
        <div class="pay-alipay-logo">
          <img src="../assets/images/alipay.png" alt />
          <div class="pay-alipay-text">支付宝支付</div>
        </div>
        <div v-if="!choose" class="pay-alipay-choose">
          <img src="../assets/images/finish.png" alt />
        </div>
            </div>-->
        </div>
        <!-- explain 说明 -->
        <div class="explain">
            <ul>
                <li>
                    <span></span>您将购买的课程为线上课程内容服务，基于在线内容的特殊性及产品的整体性，购买使用全部或部分内容后不支持退款、转让，望您知悉并理解。
                </li>
                <li>
                    <span></span>购买后可在APP —“学习”中查看和使用。
                </li>
                <li v-if="list.is_collage==1" style="padding-bottom:48px;">
                    <span></span>如果拼单失败，金额将直接退还到微信支付钱包。
                </li>
            </ul>
        </div>
        <!-- 分隔线 -->
        <div class="separate" v-if="list.is_collage==1"></div>

        <!-- 拼团 -->
        <div class="pin" v-if="list.is_collage==1">
            <div class="pinTop">
                <div>{{collage_list.length}}人正在拼团，可直接参与</div>
                <div class="gray" @click="open">
                    查看更多
                    <van-icon name="arrow" />
                </div>
            </div>

            <div class="pinContent">
                <div v-if="collage_list.length<=2">
                    <div class="pinCard" v-for="(item,index) in collage_list" :key="index">
                        <div class="head">
                            <img :src="item.user_info?item.user_info.avatar:''" />
                        </div>
                        <div class="info">
                            <div>{{item.user_info?item.user_info.nick:''}}</div>
                            <div class="row">
                                还差
                                <span class="red">{{item.num}}</span>人成团
                                <div class="time">
                                    剩余
                                    <uni-countdown
                                        :show-day="false"
                                        color="#e4393c"
                                        splitor-color="#e4393c"
                                        :hour="timeFn(item.end_time).h"
                                        :minute="timeFn(item.end_time).m"
                                        :second="timeFn(item.end_time).s"
                                        @timeup="timeup(index)"
                                    ></uni-countdown>
                                </div>
                            </div>
                        </div>
                        <div class="btn" @click.stop="payment(1,item.collage_order_no)">去拼单</div>
                    </div>
                </div>

                <swiper
                    class="swiper"
                    ref="mySwiper"
                    :options="swiperOptions"
                    v-if="collage_list.length>2"
                >
                    <swiper-slide v-for="(item,index) in collage_list" :key="index">
                        <div class="pinCard">
                            <div class="head">
                                <img :src="item.user_info?item.user_info.avatar:''" />
                            </div>
                            <div class="info">
                                <div>{{item.user_info?item.user_info.nick:''}}</div>
                                <div class="row">
                                    还差
                                    <span class="red">{{item.num}}</span>人成团
                                    <div class="time">
                                        剩余
                                        <uni-countdown
                                            :show-day="false"
                                            color="#e4393c"
                                            splitor-color="#e4393c"
                                            :hour="timeFn(item.end_time).h"
                                            :minute="timeFn(item.end_time).m"
                                            :second="timeFn(item.end_time).s"
                                            @timeup="timeup(index)"
                                        ></uni-countdown>
                                    </div>
                                </div>
                            </div>
                            <div class="btn" @click.stop="payment(1,item.collage_order_no)">去拼单</div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>
        </div>

        <!-- buy 购买 -->
        <div class="buy">
            <div class="buy_reality">
                原价
                <span class="buy_reality_money">¥ {{ list.price }}</span>
            </div>
            <div class="buy_btns" v-if="list.is_collage==1">
                <div class="buy_btn" @click.stop="payment(1,'')">
                    <span>¥{{ list.collage_price }}</span><br />拼单购买
                </div>
                <div class="buy_btn red" @click.stop="payment(0,'')">
                    <span>¥{{ list.price }}</span><br />直接购买
                </div>
            </div>
            <div class="greenBtn" v-if="list.is_collage==0" @click.stop="payment(0,'')">确认支付</div>
        </div>

        <!-- 拼单弹窗 -->
        <div v-show="showAll" class="pinMask">
            <div class="pinPopup">
                <div class="top">
                    <span>正在拼单</span>
                    <van-icon name="cross" @click="close" />
                </div>
                <div class="cont">
                    <div class="card" v-for="(item,index) in collage_list" :key="index">
                        <div class="head">
                            <img :src="item.user_info?item.user_info.avatar:''" />
                        </div>
                        <div class="name">{{item.user_info?item.user_info.nick:''}}</div>
                        <div class="info">
                            <div class="line1">
                                还差
                                <span class="red">{{item.num}}</span>人成团
                            </div>
                            <div class="line2">
                                剩余
                                <uni-countdown
                                    :hour="timeFn(item.end_time).h"
                                    :minute="timeFn(item.end_time).m"
                                    :second="timeFn(item.end_time).s"
                                    @timeup="timeup(index)"
                                ></uni-countdown>
                            </div>
                        </div>
                        <div class="btn" @click.stop="payment(1,item.collage_order_no)">去拼单</div>
                    </div>
                    <div class="endTip" v-if="collage_list.length===10">仅显示10个可插队的拼单</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import wechatInterface from "@/common/config/wechatInterface";
import uniCountdown from "@/components/uni-countdown/uni-countdown.vue";
import { Icon } from "vant";
import { Dialog } from "vant";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
var jweixin = require("jweixin-module"); //这是uni-app封装好的微信js-sdk文件
export default {
    data() {
        return {
            choose: true,
            course_id: "",
            list: "",
            collage_list: [],
            showAll: false,
            is_collage: 0, //是否拼团 0否 1拼团
            collage_order_no: "",
            swiperOptions: {
                speed: 500,
                autoplay: {
                    delay: 3000
                },
                direction: "vertical",
                allowTouchMove: false,
                slidesPerView: 2,
                slidesPerGroup: 1,
                observer:true,
                observeParents:true,
                observeSlideChildren:true,
                on:{
                    touchEnd () {
                        this.slideTo(0, 0, false)
                    }
                }
            }
        };
    },
    components: {
        uniCountdown,
        vanIcon: Icon,
        Swiper,
        SwiperSlide
    },
    computed: {
        iconURL() {
            return this.$iconURL;
        }
    },
    methods: {
        open() {
            this.showAll = true;
            this.stopScroll();
        },
        close() {
            this.showAll = false;
            this.canScroll();
        },
        stopScroll() {
            var mo = function(e) {
                e.preventDefault();
            };
            document.body.style.overflow = "hidden";
            document.addEventListener("touchmove", mo, false); //禁止页面滑动
        },
        canScroll() {
            var mo = function(e) {
                e.preventDefault();
            };
            document.body.style.overflow = ""; //出现滚动条
            document.removeEventListener("touchmove", mo, false);
        },
        onClickLeft() {
            this.$router.go(-1); //返回上一层
        },
        chooseWeixin() {
            this.choose = true;
        },
        chooseAlipay() {
            this.choose = false;
        },
        wxConfig(data) {
            let parmas = {
                debug: true, //测试开一下
                appId: data.appId, // 必填，公众号的唯一标识
                timestamp: data.timeStamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.paySign, // 必填，签名
                jsApiList: ["chooseWXPay"] // 必填，需要使用的JS接口列表
            };
            console.log(parmas, 87);
            jweixin.config(parmas);
            this.beforePay();
        },
        beforePay() {
            let self = this;
            console.log("注入支付");
            jweixin.ready(function() {
                jweixin.checkJsApi({
                    jsApiList: ["chooseWXPay"],
                    success: function(res) {
                        console.log("注入支付完成");

                        console.log(res, 97);
                        self.choosePay();
                    }
                });
            });
            jweixin.error(function(res) {
                console.log(res, "error");
            });
        },
        choosePay(data) {
            let parmas = {
                timestamp: data.timeStamp,
                nonceStr: data.nonceStr,
                package: data.package,
                signType: data.signType,
                paySign: data.paySign
            };
            jweixin.chooseWXPay({
                parmas,
                success: function(res) {
                    console.log(res, 117);
                    // self.userRechargeInfo();
                }
            });
        },

        payment(is_collage, collage_order_no) {
            let params = {
                course_id: this.course_id,
                pay_type: 2,
                is_collage: is_collage,
                collage_order_no: collage_order_no
            };
            this.$api.createBuyCourseWap(params).then(res => {
                console.log(res);
                if (res.code == 200) {
                    // this.payOrder(res.data.pay_info);
                    // this.wxConfig(res.data.pay_info);
                    wechatInterface(
                        res.data.pay_info,
                        () => {
                            this.$dalog
                                .confirm({
                                    title: "支付成功",
                                    message: "下载APP即可获得完整体验",
                                    width: "72vw",
                                    className: "DialogNmae",
                                    confirmButtonText: "去下载",
                                    cancelButtonText: "知道了"
                                })
                                .then(() => {
                                    // on confirm
                                    this.$router.push({
                                        path: "/h5/download"
                                    });
                                })
                                .catch(() => {
                                    this.$router.go(-1);
                                    this.$router.push({
                                        path: "/h5/course",
                                        query: {
                                            active: 2,
                                            course_id: this.course_id
                                        }
                                    });
                                    // that.$toast("取消支付");
                                    // on cancel
                                });
                        }, //成功
                        () => {
                            this.$dalog
                                .confirm({
                                    title: "支付失败",
                                    message: "支付遇到问题，请尝试重新支付",
                                    width: "72vw",
                                    className: "DialogNmae",
                                    confirmButtonText: "重新支付"
                                })
                                .then(() => {
                                    // on confirm
                                    this.payment();
                                })
                                .catch(() => {
                                    // that.$toast("取消支付");
                                    // on cancel
                                });

                            console.log("支付失败,请重试");
                        }
                    ); //失败
                } else {
                    Dialog({ message: res.msg });
                }
            });
        },

        payOrder(pay_params) {
            if (typeof WeixinJSBridge === "undefined") {
                if (document.addEventListener) {
                    document.addEventListener(
                        "WeixinJSBridgeReady",
                        this.onBridgeReady,
                        false
                    );
                } else if (document.attachEvent) {
                    document.attachEvent(
                        "WeixinJSBridgeReady",
                        this.onBridgeReady(pay_params)
                    );
                    document.attachEvent(
                        "onWeixinJSBridgeReady",
                        this.onBridgeReady(pay_params)
                    );
                }
            } else {
                this.onBridgeReady(pay_params);
            }
        },
        onBridgeReady(params) {
            var that = this;
            // eslint-disable-next-line no-undef
            WeixinJSBridge.invoke(
                "getBrandWCPayRequest",
                {
                    appId: params.appId, //公众号名称，由商户传入
                    timeStamp: params.timeStamp, //支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                    nonceStr: params.nonceStr, //支付签名随机串，不长于 32 位
                    package: params.package, //统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                    signType: "MD5", //签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                    paySign: params.paySign //支付签名
                },
                function(res) {
                    if (res.err_msg === "get_brand_wcpay_request:ok") {
                        that.$dalog
                            .confirm({
                                title: "支付成功",
                                message: "您已购课，请您前往下载app听课",
                                width: "72vw",
                                className: "DialogNmae",
                                confirmButtonText: "去下载"
                            })
                            .then(() => {
                                // on confirm
                                that.$router.push({ path: "/h5/download" });
                            })
                            .catch(() => {
                                // that.$toast("取消支付");
                                // on cancel
                            });
                    } else if (res.err_msg === "get_brand_wcpay_request:fail") {
                        that.$dalog
                            .confirm({
                                title: "支付失败",
                                message: "支付遇到问题，请尝试重新支付",
                                width: "72vw",
                                className: "DialogNmae",
                                confirmButtonText: "重新支付"
                            })
                            .then(() => {
                                // on confirm
                                that.payment();
                            })
                            .catch(() => {
                                // that.$toast("取消支付");
                                // on cancel
                            });
                    }
                }
            );
        },
        timeFn(dateEnd) {
            dateEnd = new Date(dateEnd * 1000);
            var dateCurrent = new Date(); //获取当前时间
            var dateDiff = dateEnd - dateCurrent.getTime(); //时间差的毫秒数，结束时间减去当前时间
            var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
            var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
            var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
            var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
            var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
            var seconds = Math.round(leave3 / 1000);
            return { h: hours, m: minutes, s: seconds };
        },
        timeup(index) {
            this.collage_list.splice(index, 1);
            // if(this.collage_list.indexOf(item)!=-1){
            //     this.collage_list.splice(item, 1);
            // }
        }
    },
    mounted() {
        
    },
    created() {
        this.course_id = this.$GetQueryString("course_id");
        this.$api.getConfirmOrder({ course_id: this.course_id }).then(res => {
            console.log(res);
            if (res.code == 200) {
                this.list = res.data.list;
                this.collage_list=res.data.collage_list;
                // this.collage_list = [
                //     {
                //         user_info: { avatar: '', nick: '昵称111' },
                //         num: 1,
                //         end_time: Math.ceil((new Date().getTime() + 30000) / 1000)
                //     },
                //     {
                //         user_info: { avatar: '', nick: '昵称222' },
                //         num: 2,
                //         end_time: Math.ceil((new Date().getTime() + 15000) / 1000)
                //     },
                //     {
                //         user_info: { avatar: '', nick: '昵称333' },
                //         num: 3,
                //         end_time: Math.ceil((new Date().getTime() + 6000) / 1000)
                //     }
                // ];
                console.log(this.collage_list);
            }
        });
    }
};
</script>
<style lang="less">
// all-main 全部内容

.all-main {
    height: 100vh;
}
.van-nav {
    height: 60px;
    .van-nav-bar__left {
        i {
            font-size: 60px;
        }
    }
}
// desc 描叙
.desc {
    margin-top: 50px;
    height: 184px;
    padding: 0 35px 54px 32px;
    display: flex;
    .desc-photo {
        flex-shrink: 1;
        flex-grow: 0;
        width: 328px;
        height: 184px;
        border-radius: 12px;
        overflow: hidden;
        background: rgba(52, 52, 52, 1);
        // box-shadow: 0px 1px 8px 0px rgba(227, 226, 226, 0.66);
        box-shadow: 0px 0px 9px 2px #E3E2E2;
        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }
    .desc-subject {
        margin-left: 32px;
        box-sizing: border-box;
        height: 184px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .desc-subject-title {
            padding-top: 10px;
            letter-spacing: 2px;
            font-size: 32px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(0, 0, 0, 1);
            line-height: 40px;
        }
        .desc-subject-money {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            .desc-subject-money-author {
                font-size: 24px;
                font-family: Source Han Sans CN;
                font-weight: bold;
                color: rgba(157, 157, 157, 1);
                height: 30px;
            }
            .desc-subject-money-sumo {
                font-size: 32px;
                font-family: PingFang SC;
                font-weight: bold;
                height: 38px;
                color: rgba(239, 92, 65, 1);
                span {
                    padding-right: 8px;
                }
            }
        }
    }
}
// separate 分隔线
.separate {
    width: 100%;
    height: 20px;
    background: rgba(240, 240, 240, 1);
}
// pay 支付方式
.pay {
    margin: 0 34px 0 32px;
    .pay-title {
        font-size: 32px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: rgba(51, 51, 51, 1);
        padding-top: 60px;
        padding-bottom: 6px;
    }
    .pay-weixin,
    .pay-alipay {
        padding: 46px 0;
        border-bottom: 2px solid rgba(245, 245, 245, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        .pay-weixin-logo {
            display: flex;
            align-items: center;
            .img {
                width: 68px;
                height: 64px;
                margin-right: 16px;
            }
            img {
                width: 100%;
                height: 100%;
            }
            .pay-weixin-text {
                font-size: 28px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(68, 68, 68, 1);
                line-height: 50px;
            }
        }
        .pay-alipay-logo {
            display: flex;
            align-items: center;
            img {
                width: 68px;
                height: 68px;
                margin-right: 16px;
            }
            .pay-alipay-text {
                font-size: 28px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(68, 68, 68, 1);
                line-height: 50px;
            }
        }
        .pay-weixin-choose,
        .pay-alipay-choose {
            width: 34px;
            height: 24px;
            img {
                width: 34px;
                height: 24px;
            }
        }
    }
}
// explain 说明
.explain {
    padding: 0 53px 0 50px;
    li {
        padding-top: 32px;
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(153, 153, 153, 1);
        line-height: 34px;
        position: relative;
        span {
            position: absolute;
            width: 7px;
            height: 7px;
            background: rgba(153, 153, 153, 1);
            border-radius: 50%;
            left: -16px;
            top: 46px;
        }
    }
}
// buy 购买
.buy {
    position: fixed;
    z-index: 10;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    align-items: center;
    justify-content: space-between;
    padding: 14px 32px;
    bottom: 0px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 6px 0px rgba(214, 214, 214, 0.35);
    .buy_reality {
        font-size: 28px;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
        line-height: 80px;
        font-family: PingFang SC;
        .buy_reality_money {
            color: #ef5c41;
            font-size: 38px;
        }
    }
    .greenBtn {
        width: 240px;
        height: 80px;
        background: linear-gradient(
            -37deg,
            rgba(42, 193, 124, 1),
            rgba(42, 193, 145, 1)
        );
        box-shadow: 0px 10px 30px 0px rgba(51, 226, 148, 0.5);
        border-radius: 40px;
        font-size: 30px;
        font-weight: bold;
        color: rgba(255, 255, 255, 1);
        text-align: center;
        line-height: 80px;
    }
    .buy_btns {
        width: 412px;
        background-color: rgba(252, 176, 97, 1);
        border-radius: 40px;
        font-size: 26px;
        color: #fff;
        display: flex;
        align-items: center;
        overflow: hidden;
        height: 80px;
        box-sizing: border-box;
        .buy_btn {
            width: 206px;
            height: 80px;
            box-sizing: border-box;
            text-align: center;
            line-height: 30px;
            padding-top: 10px;
            span {
                font-size: 28px;
            }
        }
        .buy_btn.red {
            background: #ff7f56;
        }
    }
}

.pin {
    padding: 30px 32px 240px;
    .pinTop {
        height: 60px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 24px;
        color: #333333;
        border-bottom: 1px solid #f6f8fb;
        .gray {
            color: #8d8d8d;
            display: flex;
            align-items: center;
        }
    }
    .pinContent {
        height: 264px;
        overflow: hidden;
        .swiper {
            height: 264px;
            overflow: hidden;
        }
        .pinCard {
            padding: 20px 0;
            border-bottom: 1px solid #f6f8fb;
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            align-items: center;
            .head {
                width: 90px;
                height: 90px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 20px;
            }
            .head img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            .info {
                width: 462px;
                padding-right: 30px;
                box-sizing: border-box;
                font-size: 24px;
                line-height: 34px;
                color: rgba(136, 136, 136, 1);
                .row {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    .red,
                    .time {
                        color: #e4393c;
                    }
                    .time {
                        margin-left: 30px;
                        display: flex;
                        flex-direction: row;
                        align-items: center;
                    }
                }
            }
            .btn {
                width: 114px;
                height: 54px;
                border: 1px solid rgba(228, 57, 60, 1);
                font-size: 24px;
                color: rgba(228, 57, 60, 1);
                display: flex;
                align-items: center;
                justify-content: center;
                box-sizing: border-box;
            }
        }
    }
}
.pinMask {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}
.pinPopup {
    width: 678px;
    height: 834px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    box-sizing: border-box;
    overflow: hidden;
    .top {
        height: 90px;
        line-height: 90px;
        text-align: center;
        border-bottom: 1px solid #f0f0f0;
        position: relative;
        font-size: 30px;
        color: #121212;
        box-sizing: border-box;
        .van-icon {
            font-size: 32px;
            line-height: 90px;
            position: absolute;
            top: 0;
            right: 30px;
            font-weight: bold;
            color: #888;
        }
    }
    .cont {
        height: 744px;
        overflow-y: scroll;
        .card {
            margin: 0 30px;
            border-bottom: 1px solid #f0f0f0;
            padding: 20px 0;
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            align-items: center;
            .head {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 20px;
            }
            .head img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
            .name {
                width: 180px;
                font-size: 30px;
                color: #121212;
                padding-right: 10px;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .info {
                width: 214px;
                text-align: right;
                font-size: 24px;
                line-height: 40px;
                color: #888888;
                .line1 {
                    font-size: 26px;
                }
                .red {
                    color: #e4393c;
                }
                .line2 {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-end;
                }
            }
            .btn {
                width: 102px;
                height: 48px;
                line-height: 48px;
                background: rgba(248, 63, 59, 1);
                border-radius: 10px;
                margin-left: 22px;
                font-size: 24px;
                color: #ffffff;
                text-align: center;
            }
        }
        .endTip {
            text-align: center;
            color: #888;
            font-size: 28px;
            line-height: 80px;
        }
    }
}
</style>