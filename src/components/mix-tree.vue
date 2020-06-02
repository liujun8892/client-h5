<template>
    <div class="contents">
        <div class="mix-tree-list">
            <div>
                <div
                    v-for="(item, index) in treeList"
                    :key="index"
                    class="mix-tree-item"
                    :style="[
            {
             
              zIndex: item.rank * -1 + 2
            }
          ]"
                    :class="{
            borders: treeParams.border ===  true && item.level === 2 ||item.show && item.level === 1 ||true && item.level === 3 ,
            show: item.show,
            last: item.lastRank,
            showchild: item.showChild,
            background_color1: item.judge_level === 1,
            background_color2:(item.level === 2 ||
              item.judge_level === 2 ||
              (item.is_dir === 1 && item.level === 1)) && item.parentId.length <=0,
            background_color3: item.judge_level === 3,
            padding1: item.show && item.level === 1,
            padding2: item.show && item.level === 2,
            padding3: item.show && item.level === 3,
            is_play: item.is_play
          }"
                    @click="treeItemTap(item, index)"
                >
                    <div class="item_name">{{ item.name }}</div>
                    <div class="numbers" v-if="item.numbers">共{{ item.numbers }}讲</div>
                    <div
                        class="status"
                        v-if="item.status || item.status === 0"
                        :class="{status2:item.show && item.level === 1||item.level === 2||item.level === 3}"
                    >
                        <div
                            v-if="item.status === 0"
                            class="lock"
                            :class="{x:item.show && item.level === 1||item.level === 2||item.level === 3}"
                        ></div>
                        <div
                            v-if="item.status === 1"
                            class="audition"
                            :class="{x:item.show && item.level === 1||item.level === 2||item.level === 3}"
                        >试听</div>
                        <div
                            v-if="item.status === 2"
                            class="play"
                            :class="{x:item.show && item.level === 1||item.level === 2||item.level === 3}"
                        ></div>
                        <div
                            v-if="item.status === 3"
                            class="over"
                            :class="{x:item.show && item.level === 1||item.level === 2||item.level === 3}"
                        ></div>
                    </div>
                    <div
                        class="iconfont tree_test"
                        :class="{ animations: item.showChild }"
                        v-if="ifAnimationsShow(item)"
                    >
                        <van-icon name="arrow-down" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Icon } from "vant";

export default {
    components: {
        vanIcon: Icon
    },
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        },
        params: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            treeList: [],
            treeParams: {
                defaulttext: "试听",
                defaultIcon: "/static/study/lock.png",
                currentIcon: "/static/mix-tree/currentIcon.png",
                lastIcon: "",
                border: false
            },
            animation: false,
            textIndex: 0,
            oneIndex: 1
        };
    },
    watch: {
        list: {
            handler: function(list) {
                this.treeParams = Object.assign(this.treeParams, this.params);
                // console.log(this.treeParams, this.params);
                this.renderTreeList(list);
            },
            deep: true //对象内部的属性监听，也叫深度监听
        }
    },
    methods: {
        ifAnimationsShow(item) {
            // let temp =
            return (
                !item.course_id && item.judge_level == 2 && item.status !== 0
            );
        },
        //扁平化树结构
        // 0锁住 1试听 2播放 3已听完
        async renderTreeList(list = [], rank = 0, parentId = []) {
            await list.forEach(item => {
                // console.log(item,index, item[0]);
                this.treeList.push({
                    course_id: item.course_id,
                    id: item.id,
                    name: item.name,
                    parentId, // 父级id数组
                    rank, // 层级
                    showChild: rank < 1, //子级是否显示
                    show: rank === 0 || rank <= 1, // 自身是否显示
                    numbers: item.numbers,
                    status: item.status,
                    level: item.level,
                    is_play: item.is_play,
                    judge_level: item.judge_level,
                    is_dir: item.is_dir
                });
                if (Array.isArray(item.list) && item.list.length > 0) {
                    let parents = [...parentId];
                    parents.push(item.id);
                    this.renderTreeList(item.list, rank + 1, parents);
                } else {
                    this.treeList[this.treeList.length - 1].lastRank = true;
                }
            });
            // console.log(this.treeList);
            this.treeList.map(v => {
                let id = this.treeList[0].id;

                if (v.is_play) {
                    if (v.parentId.length >= 1) {
                        let pId = v.parentId[0];
                        if (v.id == pId || v.parentId.includes(pId)) {
                            v.show = true;
                            v.showChild = true;
                        }
                    }
                } else {
                    if (v.id == id || v.parentId.includes(id)) {
                        v.show = true;
                        v.showChild = true;
                    }
                }
            });
        },
        // 点击
        treeItemTap(item, index) {
            console.log(item, 162);
            let list = this.treeList;
            let id = item.id;
            if (item.judge_level == 1) {
                return;
            }
            if (item.lastRank === true) {
                //点击最后一级时触发事件
                this.$emit("treeItemClick", item);
                return;
            }
            item.showChild = !item.showChild;
            if (item.judge_level == 2) {
                this.textIndex = index;
                this.animation = !this.animation;
            }
            list.forEach(childItem => {
                // console.log(item.showChild)
                if (item.showChild === false) {
                    //隐藏所有子级
                    if (
                        !childItem.parentId.includes(id) ||
                        (childItem.id === id && childItem.level !== 3) ||
                        (childItem.level === 2 && childItem.lastRank !== true)
                    ) {
                        //当前子节点跟点击的id相同则不进入下面隐藏
                        return;
                    }
                    if (childItem.lastRank !== true) {
                        childItem.showChild = false;
                    }
                    childItem.show = false;
                } else {
                    if (
                        childItem.parentId[childItem.parentId.length - 1] === id
                    ) {
                        childItem.show = true;
                    }
                }
            });
        },
        back() {
            console.log(23);
        }
    }
};
</script>

<style >
.borders {
    /* padding: 46px 0 32px !important; */
    /* margin: 0 32px !important; */
    border-left: 32px solid transparent !important;
    border-right: 32px solid transparent !important;

    /* margin-left: 32px;
margin-right: 32px; */

    border-bottom: 2px solid rgba(245, 245, 245, 1) !important ;
    /* border-bottom: 2px solid black !important ; */
}
.x {
    margin-right: 0 !important;
}
.mix-tree-list {
    display: flex;
    /* width: ; */

    flex-direction: column;
}
.tree_test {
    /* position: absolute; */
    /* right: 52px;
    right: 0px; */
    /* z-index: 0; */

    width: 70px !important ;
    display: flex !important;
    align-content: center !important;
    justify-content: center !important;
    position: absolute;
    right: 0;
    z-index: 0;
}
/* .animation{
	transform: rotate(181deg);
} */
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

.numbers {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(153, 153, 153, 1);
    margin-left: 30px;
}
.is_play {
    color: #00d789 !important;
}
.status {
    position: absolute;
    right: 0;
    z-index: 0;
}
.status .lock {
    display: block;
    width: 32px;
    height: 36px;
    background-image: url(../assets/images/study/lock.png);
    background-size: 100% 100%;
    margin-right: 48px;
}
.status .audition {
    display: block;
    width: 66px;
    height: 34px;
    /* padding:0 10px; */
    border: 2px solid rgba(0, 215, 137, 1);
    border-radius: 36px;
    background-size: 100% 100%;
    margin-right: 28px;
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(0, 215, 137, 1);
    line-height: 36px;
    text-align: center;
}
.status .play {
    display: block;
    width: 32px;
    height: 32px;
    background-image: url(../assets/images/study/isPlay.png);
    background-size: 100% 100%;
    margin-right: 48px;
}
.status .over {
    display: block;
    width: 32px;
    height: 32px;
    background-image: url(../assets/images/study/over.png);
    background-size: 100% 100%;
    margin-right: 48px;
}

.status2 {
    width: 70px !important ;
    display: flex !important;
    align-content: center !important;
    justify-content: center !important;
    position: absolute;
    right: 0;
    z-index: 0;
}

.mix-tree-item {
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #333;
    height: 0;
    opacity: 0;
    transition: 0.2s;
    position: relative;
}
.item_name {
    max-width: 578px !important;
}
.mix-tree-item.show {
    min-height: 80px;
    opacity: 1;
    line-height: 56px;
}

.mix-tree-icon {
    width: 26px;
    height: 26px;
    margin-right: 8px;
    opacity: 0.9;
}

.mix-tree-item.showchild:before {
    transform: rotate(90deg);
}
.mix-tree-item.last:before {
    opacity: 0;
}
.background_color1 {
    background: #f5f5f5;
    font-size: 30px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: rgba(0, 0, 0, 1);
}

.background_color3 {
    background: #fafafc;
    font-size: 28px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
}
.background_color2 {
    background: #ffffff;
    font-size: 32px;
    font-family: Source Han Sans CN;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
}
.padding1 {
    padding: 46px 32px 32px 32px;
        padding: 46px 0 32px ;

}
.padding2 {
    padding: 46px 32px 32px 32px;
    padding: 46px 0 32px ;

    /* margin: 0 48px 0 32px; */
    /* padding-left:0 ;
   padding-right:0 ; */
    border-bottom: 2px solid black;
    /* border-left:32px solid transparent ;
border-right:52px solid transparent ; */
}

.padding3 {
    /* padding: 34px 54px 24px 32px; */
    padding: 34px 0 24px ;
}
</style>
