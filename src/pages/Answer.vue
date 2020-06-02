<template>
    <div class="page-answer">
        <div class="card-list">
            <div
                v-for="(item, index) in funQuestions"
                :class="getCardPos(item, index)"
                :key="item.id"
            >
                <transition
                    :name="animate"
                    type="out-in"
                    @before-enter="beforeEnter"
                    @after-leave="afterLeave"
                >
                    <div class="card" v-show="item !== null">
                        <div class="question-wrap">
                            <div class="question fs-18" v-html="`${curIndex + 1}、${item.content}`"></div>
                            <div
                                class="quizTime"
                                v-if="item.type == 0 && item.show_time>0"
                            >答题倒计时：{{ quizTime }}s</div>
                            <div
                                class="quizTime"
                                v-if="item.type == 1 && imgTime"
                            >问题图将在{{ imgTime }}s后消失</div>
                            <div class="quizTime" v-if="item.type == 1 && !imgTime">以下为答题图</div>
                            <div
                                class="img-wrapper flex flex--center flex--middle"
                                v-if="item.question_img && item.type == 1"
                            >
                                <img v-if="imgTime" :src="$iconURL+item.question_img" />
                                <img v-else :src="$iconURL+item.answer_img" />
                            </div>
                            <div
                                class="img-wrapper flex flex--center flex--middle"
                                v-if="item.question_img && item.type == 0"
                            >
                                <img :src="$iconURL+item.question_img" />
                            </div>
                            <div class="options" v-if="item.type == 1">
                                请输入您看到的数字
                                <input
                                    type="number"
                                    placeholder="请按顺序输入您的答案"
                                    v-model="value"
                                    @focus="handlerHeight"
                                    @blur="handlerHeight2"
                                    :readonly="index!=curIndex || imgTime>0"
                                    :autofocus="index==curIndex"
                                />
                            </div>
                            <ul class="options">
                                <v-touch
                                    @tap="selectOption(option)"
                                    v-for="(option, optionIndex) in item.choose"
                                    :data-optionId="option.id"
                                    :key="option.id"
                                    class="fs-16 option flex"
                                >
                                    <div class="option-label">{{ optionLabel[optionIndex] }}</div>
                                    <div class="option-content flex__item">{{ option.content }}</div>
                                    <div class="option-radio flex flex--middle">
                                        <div
                                            :class="[ 'radio',  item.answer == option.id ? 'selected' : '' ]"
                                        ></div>
                                    </div>
                                </v-touch>
                            </ul>
                        </div>
                        <div v-show="curIndex == index" class="action-wrap flex">
                            <v-touch
                                @tap="selectOption(item)"
                                v-show="curIndex >= 0 && hidshow && item.type == 1 && !showSubmit"
                                class="flex__item btn"
                            >下一题</v-touch>
                            <v-touch
                                @tap="submit"
                                v-if="showSubmit && item.type == 1"
                                :class="['flex__item', 'cp-btn', hasSubmit?'disabled':'']"
                            >提交</v-touch>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div class="page-mark" v-show="hidshow">
            <div class="curIndex fs-19">{{ curIndex + 1 }}</div>
            <div class="line"></div>
            <div class="totalIndex fs-16">{{ funQuestions.length }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "page-answer",
    data() {
        return {
            animate: "forward",
            animateLock: false,
            curIndex: 0,
            selectedQuestionIndexStack: [],
            selectedOptionStack: [],
            submitting: false,
            funQuestions: [],
            hidshow: true,
            value: "",
            quizTime: 0,
            imgTime: 0,
            temp: null,
            hasSelected: false,
            hasSubmit: false,
            is_bindphone: 0 // 0未绑定手机
        };
    },
    computed: {
        id() {
            return this.$route.params.id;
        },
        canSubmit() {
            return this.funQuestions[this.curIndex].answer ? 1 : 0;
        },
        showSubmit() {
            return this.funQuestions[this.curIndex].id ==
                this.funQuestions[this.funQuestions.length - 1].id
                ? true
                : false;
        },
        optionLabel() {
            var list = [];
            for (var i = 0; i < 20; i++) {
                list.push(String.fromCharCode(65 + i));
            }
            return list;
        },
        userAwaitTestScaleId() {
            return this.$route.query.userAwaitTestScaleId;
        }
    },
    created() {
        if (
            this.$store.state.UserInfo.code &&
            this.$store.state.UserInfo.token
        ) {
            this.$api
                .wxH5register({ code: this.$store.state.UserInfo.code })
                .then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        this.$store.dispatch("saveToken", res.data.token);
                        this.is_bindphone = res.data.is_bindphone;
                        this.getQues();
                    }
                });
        }
    },
    mounted() {
        // this.handlerHeight();
    },
    methods: {
        beforeEnter(el, done) {
            done();
        },
        afterLeave(el, done) {
            done();
        },
        getCardPos(item, index) {
            // 每个卡片的位置计算方法
            return {
                "card-box": 1,
                prev2: index <= this.curIndex - 2,
                prev: index == this.curIndex - 1,
                active: index == this.curIndex,
                next: index == this.curIndex + 1,
                next2: index >= this.curIndex + 2
            };
        },
        async getQues() {
            this.$api.getMemorySubject({ question_id: 1 }).then(res => {
                this.funQuestions = res.data.questions;
                this.keepTime(this.funQuestions[0].type);
            });
        },
        getQuestionIndexById(questionId) {
            // 由于jump方式答题，是以option的questionid进行跳转的，以question在题目栈里查找题目的index;
            let index;
            for (let i = 0; i < this.funQuestions.length; i++) {
                console.log(this.funQuestions[i].questionId == questionId);
                if (this.funQuestions[i].questionId == questionId) {
                    index = i;
                    i = this.funQuestions.length;
                }
            }
            return index;
        },
        setCurIndex(mode, newIndex) {
            if (this.animateLock) {
                // this.$toast('您点太快了');
                return;
            }
            this.animateLock = true;
            setTimeout(() => {
                this.animateLock = false;
            }, 250);
            if (mode) {
                if (newIndex < this.funQuestions.length) {
                    this.selectedQuestionIndexStack.push(this.curIndex);
                    this.curIndex = newIndex;
                }
            } else {
                // 当是 jump类型的题目，回到上一题的时候，从清空调question内的answer值，其余情况不清空，用户看起来就像是会保存原来的答案
                let lastSelectedOption = this.selectedOptionStack[
                    this.selectedOptionStack.length - 1
                ];
                if (lastSelectedOption.type === "jump") {
                    this.$set(
                        this.funQuestions[this.curIndex],
                        "answer",
                        undefined
                    );
                }
                // 读了上一题的index，才pop掉，不然会一直停留在本地
                this.curIndex = this.selectedQuestionIndexStack[
                    this.selectedQuestionIndexStack.length - 1
                ];
                this.selectedOptionStack.pop();
                this.selectedQuestionIndexStack.pop();
            }
        },
        selectOption(option) {
            if (this.selectedOptionStack.length == this.funQuestions.length) {
                this.$toast("测评已结束！");
                return;
            }
            console.log(option, this.funQuestions[this.curIndex]);
            if (this.animateLock) {
                // this.$toast('您点太快了');
                return;
            }
            const curQuestion = this.funQuestions[this.curIndex];
            this.$set(curQuestion, "answer", option.id);
            // console.log("0选择题，1填空题=========" + curQuestion.type);
            if (curQuestion.type == 1) {
                this.selectedOptionStack.push({
                    subjectId: curQuestion.id,
                    answer: this.value
                });
                this.Nextquestion();
            } else {
                this.hasSelected = true;
                this.selectedOptionStack.push({
                    subjectId: option.subject_id,
                    answer: option.id
                });
                this.Nextquestion();
            }
        },
        submit() {
            // console.log("waiting", this.submitting);
            // if (this.submitting) {
            //     this.$toast("正在提交答案，请等待", 300);
            //     return;
            // }
            // if (!this.canSubmit) {
            //     this.$toast("请完成当前题目");
            // } else {
            //     this.$loading("正在提交答案");
            //     this.submitting = true;
            //     console.log("提交前夕");
            //     // this.$tracker.funSubmit(this.$store.state.answer.funQuestions.title)
            //     this.$tracker.send({
            //         name: "v5100_测评_点击提交-测试答题页",
            //         properties: {
            //             测试名称: this.$store.state.answer.funQuestions.title
            //         }
            //     });
            // }
            if (this.hasSubmit) {
                return;
            }
            this.$toast("正在提交答案...请等待");
            if (
                this.funQuestions[this.curIndex].id ==
                    this.funQuestions[this.funQuestions.length - 1].id &&
                this.value == "" &&
                this.funQuestions[this.curIndex].type == 1
            ) {
                this.$toast("请输入您的答案！");
                return;
            }
            if (
                this.funQuestions[this.curIndex].id ==
                    this.funQuestions[this.funQuestions.length - 1].id &&
                this.value != "" &&
                this.funQuestions[this.curIndex].type == 1
            ) {
                this.selectedOptionStack.push({
                    subjectId: this.funQuestions[this.curIndex].id,
                    answer: this.value
                });
            }
            const answers = this.selectedOptionStack.map(item => {
                return {
                    subject_id: item.subjectId,
                    answer: item.answer
                };
            });
            this.hasSubmit = true;
            // console.log("提交答案：");
            // console.log(answers);
            this.$api
                .getMemoryAnswer({
                    question_id: 1,
                    result: JSON.stringify(answers)
                })
                .then(res => {
                    // console.log(res.data, res.code);
                    if (res.code == 200) {
                        setTimeout(() => {
                            this.$toast("您的测评得分：" + res.data.score);
                        }, 1000);
                    } else {
                        this.hasSubmit = false;
                    }
                });
        },
        keepTime(type) {
            if (type == 1) {
                if (this.funQuestions[this.curIndex].show_time > 0) {
                    this.imgTime = this.funQuestions[this.curIndex].show_time;
                } else {
                    this.imgTime = 10;
                }
                this.temp = setInterval(() => {
                    this.imgTime--;
                    if (this.imgTime == 0) {
                        clearInterval(this.temp);
                    }
                }, 1000);
            } else {
                this.quizTime = this.funQuestions[this.curIndex].show_time;
                if (this.funQuestions[this.curIndex].show_time > 0) {
                    this.temp = setInterval(() => {
                        this.quizTime--;
                        if (this.quizTime == 0) {
                            if (!this.hasSelected) {
                                this.selectedOptionStack.push({
                                    subjectId: this.funQuestions[this.curIndex]
                                        .id,
                                    answer: 0
                                });
                            }
                            this.Nextquestion();
                        }
                    }, 1000);
                }
            }
        },
        handlerHeight() {
            // const docmHeight = document.documentElement.clientHeight; //获取当前屏幕高度
            // window.onresize = () => {
            //     //屏幕高度变化时判断
            //     return (() => {
            //         const showHeight = document.body.clientHeight;
            //         this.hidshow = docmHeight > showHeight ? false : true;
            //     })();
            // };
            window.onresize = () => {
                var div = document.getElementsByClassName("question-wrap")[
                    this.curIndex
                ];
                div.scrollTop = div.scrollHeight;
            };
        },
        handlerHeight2() {
            var div = document.getElementsByClassName("question-wrap")[
                this.curIndex
            ];
            div.scrollTop = 0;
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        },
        Nextquestion() {
            // 当前题目为填空题
            if (
                this.value == "" &&
                this.funQuestions[this.curIndex].type == 1
            ) {
                this.$toast("请输入您的答案！");
                return;
            }
            //下一题
            clearInterval(this.temp);
            this.hasSelected = false;
            this.value = "";
            if (this.curIndex < this.funQuestions.length - 1) {
                this.setCurIndex(1, this.curIndex + 1);
                this.keepTime(this.funQuestions[this.curIndex].type);
            } else {
                //   console.log("已到最后一题");
                this.submit();
            }
        }
    }
};
</script>

<style lang="less">
.page-answer {
    overflow: hidden;
    position: relative;
    height: 100vh;
    font-size: 28px;
    .topbar ~ & {
        margin-top: -88px;
    }
    .quizTime {
        text-align: center;
        color: #ef5c41;
        margin-bottom: 10px;
    }
    .btn {
        border: 1px solid #2ac17c;
        border-radius: 10px;
        width: 500px;
        height: 88px;
        line-height: 88px;
        color: #2ac17c;
        text-align: center;
    }
    .cp-btn {
        background: #2ac17c;
        border: none;
        border-radius: 10px;
        box-sizing: border-box;
        width: 500px;
        height: 88px;
        text-align: center;
        display: block;
        color: #fff;
    }
    .cp-btn.disabled {
        opacity: 0.6;
    }
    .card-list {
        position: absolute;
        width: 750px;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 153px;
        /*height: px2rem(1050);*/
        overflow: hidden;

        .topbar ~ & {
            top: 138px;
        }

        .card-box {
            // 0.8654
            position: absolute;
            top: 0;
            margin: 0 53px;
            box-sizing: border-box;
            width: 644px;
            /*height: px2rem(1003);*/
            bottom: 0;
            transition: all 0.25s;
            box-sizing: border-box;

            &.active {
                transform: translate(0%, 0);
                bottom: 20px;

                .card {
                    bottom: 15px;
                }
            }

            &.prev2 {
                padding: 7% 0;
                transform: translate(-677px, 0);

                .card {
                    box-shadow: none;
                }
            }

            &.prev {
                padding: 7% 0;
                transform: translate(-677px, 0);
            }

            &.next {
                padding: 7% 0;
                transform: translate(677px, 0);
            }

            &.next2 {
                padding: 7% 0;
                transform: translate(677px, 0);

                .card {
                    box-shadow: none;
                }
            }

            .card {
                position: absolute;
                top: 59px;
                left: 0;
                right: 0;
                bottom: 59px;
                /*height: px2rem(868);*/
                box-sizing: border-box;
                background: #ffffff;
                box-shadow: 0 8px 28px 0 rgba(0, 0, 0, 0.21);
                border-radius: 16px;
                padding: 40px 72px 60px 72px;
                color: #333;

                .question-wrap {
                    // position: absolute;
                    // top: 40px;
                    // left: 0;
                    // right: 0;
                    // bottom: 153px;
                    // padding: 0 72px 60px 72px;
                    padding-bottom: 118px;
                    height: 100%;
                    box-sizing: border-box;
                    overflow-y: scroll;
                }

                .question {
                    line-height: 56px;
                    margin-bottom: 28px;
                    text-align: left;
                    word-break: break-all;
                    font-size: 32px;
                }

                .img-wrapper {
                    width: 100%;
                    margin-bottom: 28px;
                    // border: 1px solid #eaeaea;
                    img {
                        max-width: 100%;
                        max-height: 100%;
                    }
                }

                .options {
                    input {
                        display: block;
                        width: 100%;
                        padding: 20px 0;
                        border: none;
                        border-bottom: 1px solid #eaeaea;
                        font-size: 28px;
                    }
                    .option {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-size: 30px;
                        &:last-child {
                            border-bottom: none;
                        }

                        padding: 20px 0;
                        line-height: 56px;
                        border-bottom: 1px solid #eaeaea;

                        &-label {
                            margin-right: 23px;
                        }

                        &-radio {
                            margin-left: 23px;

                            .radio {
                                width: 40px;
                                height: 40px;
                                border: 4px solid #2ac17c;
                                border-radius: 50%;
                                transform: scale(0.5);
                                position: relative;
                                left: 10px;
                                &.selected {
                                    background: #2ac17c;
                                }
                            }
                        }
                    }
                    .option-content {
                        text-align: left;
                        flex: 1;
                    }
                }

                .action-wrap {
                    position: absolute;
                    left: 72px;
                    right: 72px;
                    bottom: 60px;
                    height: 88px;
                    line-height: 88px;
                    /*width: 100%;*/
                    &:after {
                        content: "";
                        position: absolute;
                        width: 100%;
                        height: 42px;
                        top: -98px;
                        background: linear-gradient(
                            top,
                            rgba(255, 255, 255, 0) 0%,
                            rgba(255, 255, 255, 0.5) 20%,
                            rgba(255, 255, 255, 0.8) 100%
                        );
                    }

                    .cp-btn--yellow {
                        color: #fff;
                    }

                    .submit {
                        margin-left: 20px;

                        &.cp-btn--yellow {
                            color: #333;
                        }
                    }
                }
            }
        }
    }

    .page-mark {
        position: absolute;
        bottom: 30px;
        left: 0;
        right: 0;
        text-align: center;

        .line {
            display: inline-block;
            width: 1px;
            height: 70px;
            background: #666;
            transform: rotate(30deg);
        }

        .curIndex {
            position: absolute;
            top: -10px;
            left: 50%;
            color: #333;
            transform: translate(-110%, 0%);
        }

        .totalIndex {
            position: absolute;
            color: #666;
            bottom: 0;
            right: 50%;
            transform: translate(110%, 0);
        }
    }
}
</style>
