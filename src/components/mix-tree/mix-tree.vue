<!--  -->
<template>
    <div id="mix-tree">
        <div class="ul" v-for="(item,index) in list" :key="index">
            <div
                class="li"
                :class="{
                    chapter:item.level==1,
                    section:item.level==2,
                    Courseware:item.level==3

                }"
                @click="changeStatus(item,index)"
            >
                <!-- {{item.name}} -->
                <div class="item_name">
                    {{ item.name }}
                    <div class="numbers" v-if="item.numbers">共{{ item.numbers }}讲</div>
                </div>

                <div class="status" v-if="item.status || item.status === 0">
                    <div v-if="item.status === 0" class="lock"></div>
                    <!-- <div class="lock"></div> -->
                    <div v-if="item.status === 1" class="audition">试听</div>
                    <div v-if="item.status === 2" class="play"></div>
                    <div v-if="item.status === 3" class="over"></div>
                </div>
                <div
                    class="status"
                    :class="{ animations: item.showChild}"
                    v-if="ifAnimationsShow(item)"
                >
                    <span class="iconfont iconicon_arrow_up"></span>
                </div>

                <!-- <view class="iconfont tree_test" :class="{ animations: item.showChild}" v-if="ifAnimationsShow(item)">&#xe6a3;</view> -->
            </div>
            <tree-menus v-if="status[index]" :list="item.list"></tree-menus>
        </div>
    </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
    name: "treeMenus",
    components: {}, //import引入的组件需要注入到对象中才能使用
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        }
    },

    data() {
        return { status: [], has_branch: [], group_head: [] }; //这里存放数据
    },
    //监听属性 类似于data概念
    computed: {},
    watch: {}, //监控data中的数据变化
    methods: {
        changeStatus(item, index) {
            console.log(index);
            if (this.status[index] == true) {
                //如果展开就折叠起来
                this.$set(this.status, index, false); //this.$set 触发视图更新
            } else {
                //没展开,根据是否有 clist 来判断能不能 展开
                this.$set(this.status, index, this.has_branch[index]);
            }

            if (item.judge_level == 1) {
                console.log("章");
                return;
            }
            if (item.judge_level == 2) {
                console.log("节");

                this.textIndex = index;
                this.animation = !this.animation;
            }
            if (item.judge_level == 3) {
                console.log("课件");
                // console.log(item.name);
                if (
                    item.status === 1 ||
                    item.status === 2 ||
                    item.status === 3
                ) {
                    console.log(item.name);
                }
                this.textIndex = index;
                this.animation = !this.animation;
            }

            if (item.lastRank === true) {
                //
                console.log(item.lastRank);

                // this.$emit("treeItemClick", item);
                return;
            }
            item.showChild = !item.showChild;

            //切换样式
            // if (this.group_head[index] == 'group') {
            // 	this.$set(this.group_head, index, 'group_s');
            // } else if (this.group_head[index] == 'group_s') {
            // 	this.$set(this.group_head, index, 'group');
            // }
        },
        initTree() {
            if (this.list && this.list.length > 0) {
                this.list.forEach((item, index) => {
                    this.status[index] = false; //默认不展开
                    // this.status[0] = true; //默认不展开
                    if ("list" in item) {
                        //判断有没有 list
                        this.has_branch[index] = true;
                        console.log(this.has_branch[index])
                        // this.group_head[index] = "group";
                    } else {
                        // this.group_head[index] = "nulllist";
                        this.has_branch[index] = false;
                    }
                });
            }
        },
        ifAnimationsShow(item) {
            return (
                !item.course_id && item.judge_level == 2 && item.status !== 0
            );
        }
    }, //方法集合
    created() {
        var that = this;
        setTimeout(function() {
            console.log(that.list);
            that.initTree();
        }, 500);
        // console.log(this.list);
        // this.initTree();
    }, //生命周期 - 创建完成（可以访问当前this实例）
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
#mix-tree {
    list-style-type: none;
    /* padding-left: 20px; */
    margin: 0;
    .animations {
        animation: rotates 0.3s ease-in-out 0s forwards;
    }
    @keyframes rotates {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(180deg);
        }
    }

    .ul {
        .li {
            .status {
                width: 70px;
                margin-left: 32px;
                display: flex;
                justify-content: center;
                .iconicon_arrow_up {
                    transform: rotate(180deg);
                    font-size: 36px;
                }

                .iconicon_arrow_up :before {
                    font-size: 48px;
                }
                .audition {
                    width: 68px;
                    height: 36px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid rgba(0, 215, 137, 1);
                    border-radius: 18px;
                    font-size: 20px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: rgba(0, 215, 137, 1);
                    // margin-left: 30px;
                }
                .lock {
                    display: block;
                    width: 32px;
                    height: 36px;
                    background-image: url(../../assets/images/lock.png);
                    background-size: 100% 100%;
                    // margin-right: 8px;
                    // margin-left: 32px;
                }
                .play {
                    display: block;
                    width: 32px;
                    height: 32px;
                    background-image: url(../../assets/images/isPlay.png);
                    background-size: 100% 100%;
                    // margin-right: 8px;
                    // margin-left: 32px;
                }
            }
        }
        /* 章 */
        .chapter {
            flex: 1;
            // height: 107px;
            padding: 46px 32px 34px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 32px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 50px;
            background-color: rgba(245, 245, 245, 1);
            border-bottom: 2px solid rgba(255, 255, 255, 1);

            .item_name {
                flex: 1;
                font-size: 30px;
                font-family: Source Han Sans CN;
                font-weight: 500;
                color: rgba(0, 0, 0, 1);
                line-height: 50px;
                display: flex;
                .numbers {
                    font-size: 26px;
                    font-family: PingFang SC;
                    font-weight: 500;
                    color: rgba(153, 153, 153, 1);
                    // line-height:20px;
                    margin-left: 32px;
                }
            }
        }
        /* 节 */
        .section {
            flex: 1;
            // height: 107px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 32px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 50px;
            background-color: white;
            // margin: 0 32px;
            margin: 0 32px;
            padding: 38px 0;
            border-bottom: 2px solid rgba(245, 245, 245, 1);

            .item_name {
                flex: 1;
                font-size: 32px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 50px;
            }
        }
        /* 课件 */
        .Courseware {
            flex: 1;
            // height: 107px;
            padding: 34px 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 28px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: rgba(51, 51, 51, 1);
            line-height: 50px;
            background-color: rgba(245, 245, 245, 1);
            border-bottom: 2px solid rgba(255, 255, 255, 1);
            .item_name {
                flex: 1;
                font-size: 28px;
                font-family: Source Han Sans CN;
                font-weight: 400;
                color: rgba(51, 51, 51, 1);
                line-height: 44px;
            }
        }
    }
}
</style>

