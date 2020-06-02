<template>
    <div id="register">
        <van-popup
            :close-on-click-overlay="false"
            v-model="show"
            round
            position="bottom"
            :style="{ height: '55%', padding: '20px', 'box-sizing': 'border-box' }"
        >
            <div class="title">
                <van-icon name="arrow-left" size="20" @click="close" />
                <span>绑定手机号完成注册</span>
            </div>
            <div>
                <div class="login_contorl">
                    <div class="login_contorl_phone input_border login_contorl_box">
                        <div class="text">
                            <span class="texts">+</span>
                            <span>86</span>
                        </div>
                        <van-field
                            placeholder-style="color: blue;"
                            type="number"
                            v-model="params.mobile"
                            placeholder="请输入手机号"
                            autosize
                            maxlength="11"
                            :border="false"
                            class="ignore"
                        />
                    </div>
                    <div class="login_contorl_code input_border login_contorl_box">
                        <van-field
                            type="number"
                            v-model="params.code"
                            placeholder="短信验证码"
                            maxlength="6"
                            class="ignore"
                            :border="false"
                        />
                        <div
                            class="sendCode"
                            @click="sendCodes"
                            :class="[{ btnDis: btnDis }]"
                        >{{ btnText }}</div>
                    </div>
                </div>
                <div class="sendBind" @click="sendBind">完成</div>
            </div>
        </van-popup>
    </div>
</template>


<script>
import { Popup, Icon, Field } from "vant";

export default {
    components: { "van-popup": Popup, vanIcon: Icon, vanField: Field },
    data() {
        return {
            show: false,
            params: {
                code: "",
                mobile: ""
            },
            btnText: "获取验证码",
            btnDis: false,
            submitBtnDis: false,
            is_free: "",
            is_collage: false
        };
    },
    methods: {
        sendBindVerify(params) {
            var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            var regCode = /^[0-9]{6}$/;
            if (!reg.test(params.mobile)) {
                this.$toast("手机号格式错误");
                return;
            } else if (!regCode.test(params.code)) {
                this.$toast("验证码错误");
                return;
            } else {
                return true;
            }
        },
        verify(params) {
            var reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
            if (!params.code) {
                if (!reg.test(params.mobile)) {
                    this.$toast("手机号格式错误");
                } else {
                    return true;
                }
            }
        },
        sendCodes() {
            //发送验证码
            if (this.btnDis) {
                return;
            }
            if (this.verify(this.params)) {
                this.$api.sendCode({ phone: this.params.mobile }).then(res => {
                    if (res.code == 200) {
                        this.$toast("发送成功");
                        this.countDown();
                    } else {
                        this.$toast(res.msg);
                    }
                });
            }
        },
        countDown() {
            // 验证码倒计时
            let t = null;
            let timer = 60;
            this.btnDis = true;
            clearInterval(t);
            this.btnText = `倒计时${timer}s`;
            t = setInterval(() => {
                if (timer <= 1) {
                    clearInterval(t);
                    this.btnText = "重新发送";
                    this.btnDis = false;
                    return;
                }
                timer--;
                this.btnText = `倒计时${timer}s`;
            }, 1000);
        },
        close() {
            this.show = false;
        },
        isshow(is_free,is_collage) {
            this.show = true;
            this.is_free = is_free;
            this.is_collage=is_collage;
        },
        sendBind() {
            if (this.sendBindVerify(this.params)) {
                this.$api.wxH5bindPhone(this.params).then(res => {
                    console.log(res);
                    if (res.code !== 200) {
                        this.$toast(res.msg);
                        return;
                    } else {
                        let course_id = this.$GetQueryString("course_id") || "";

                        if (this.is_free) {
                            this.$emit('emitFree');
                            return;
                        } else {
                            if(this.is_collage){
                                this.$emit('collage');
                                return;
                            }else{
                                this.$router.push({
                                    path: "/h5/pay",
                                    query: { course_id }
                                });
                            }
                            
                        }
                    }
                });
            } else {
                // this.$toast("请检查参数");
            }
        }
    },
    created() {}
};
</script>


<style lang="less">
#register {
    .l {
        margin-top: 5px;
    }
    .title {
        display: flex;
        align-items: center;
        height: 40px;
        font-size: 34px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);

        span {
            margin-left: 20px;
            margin-top: 8px;
        }
    }
    .login_contorl {
        padding-top: 40px;
        input {
            height: 60px;
            font-size: 32px;
            border: none;
            outline: none;
        }
        .input_border {
            border-bottom: 1px solid rgba(232, 232, 232, 1);
        }
        .login_contorl_box {
            box-sizing: border-box;
            padding-top: 40px;
            padding-bottom: 40px;
            input {
                flex: 1;
                height: 40px;
            }
        }
        .login_contorl_phone {
            display: flex;
            align-items: center;
            .text {
                position: relative;
                display: flex;
                align-items: top;
                font-size: 32px;
                font-family: Source Han Sans CN;
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
                margin: 0 20px 0 9px;
                border-right: 1px solid rgba(205, 206, 210, 1);
                padding-right: 20px;
                .texts {
                    margin-top: -2px;
                    margin-right: 5px;
                }
            }
        }

        .login_contorl_code {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-left: 10px;
            padding-right: 10px;

            .sendCode {
                box-sizing: border-box;
                min-width: 190px;
                text-align: center;
                padding: 0 10px;
                font-size: 32px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(0, 215, 137, 1);
            }
            .btnDis {
                font-weight: 400;
                color: rgba(205, 206, 210, 1);
            }
        }
    }
    .sendBind {
        width: 376px;
        height: 80px;
        background: linear-gradient(
            -37deg,
            rgba(42, 193, 124, 1),
            rgba(42, 193, 145, 1)
        );
        box-shadow: 0px 10px 30px 0px rgba(51, 226, 148, 0.5);
        border-radius: 12px;
        margin: 0 auto;
        margin-top: 50px;
        font-size: 36px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 80px;
        text-align: center;
    }
}
</style>