<template>
<div id="activityIndex">
  <div class="top_view_img">
    <div class="textHolder" v-if="activity.cover_img" :style="{ backgroundImage: 'url(' + iconURL + activity.cover_img + ')', backgroundPosition: '0px 0px', backgroundRepeat: 'no-repeat' }"></div>
  </div>

  <div class="describe_box">
    <div class="top_text">
      <div class="left">
        <div class="title">{{ activity.title }}</div>
        <div class="desc">{{ activity.desc }}</div>
      </div>
      <div class="right_text">
        <div class="discount_price">￥{{ activity.discount_price }}</div>
        <div class="price">
          价格￥
          <del>{{ activity.price }}</del>
        </div>
      </div>
    </div>
    <div class="stat_time">活动时间：{{ activity.stat_time }}-{{ activity.stop_time }}</div>
    <div class="recommend">
      推荐： <img src="../assets/images/active/fiveStars.png">
    </div>
  </div>

  <div class="actives">
    <img src="../assets/images/active/active_d.png">
  </div>

  <div class="parser" v-html="activity.content">
  </div>

  <div class="explain">
    本活动最终解释权归湖南柚家科技有限公司所有。
  </div>

  <!-- 底部占位盒子 -->
  <div class="box_holder"></div>

  <div class="bottom_box">
    <div class="btn_bottom">
      <div class="btn_apply" @click="goActivitiesPage">
        {{is_buy ? '下载App' : '参与报名'}}
      </div>
    </div>
  </div>

</div>
</template>

<script>
import {
  CellGroup
} from 'vant';
import wechatInterface from '@/common/config/wechatInterface.js';
export default {
  computed: {
    iconURL() {
      return this.$iconURL;
    }
  },
  data() {
    return {
      msg: '12312',
      is_buy: 0,
      courseIntroduce: {
        is_buy: '',
        title: '12312',
        cover: 'images/24208e879e04e7bf4f2411f348f8f9c3.png'
      },
      scrollTop: 0,
      scrollData: {},
      activity: '',
      colors: 0,
      // 活动id
      relation_id: 1,
      invite: '',
      show: false,
    }
  },
  methods: {

    // 获取首页信息
    getActivityIndex() {
      this.$api.getActivityIndex({
        activity_id: 1
      }).then(res => {
        console.log(res);
        switch (res.code) {
          case 200:
            if (res.data.is_buy) {
              this.show = true
            }
            this.is_buy = res.data.is_buy;
            this.activity = res.data.list;
            this.relation_id = res.data.list.id
            break;
          default:
            break;
        }
      });
    },
    // 提示去下载页
    goDownPage() {
      this.$router.replace({
        path: '/h5/download'
      });
    },
    // 去活动详情页面
    goActivitiesPage() {
      console.log('去活动详情页。。。。。');
      if (this.is_buy) {
        this.goDownPage()
      } else {
        this.$router.push({
          path: '/h5/activities?relation_id=' + this.relation_id + '&invite=' + this.invite
        })
      }
    },
    // 关闭弹层
    close() {
      this.show = false
    },
    getShareAddress() {
      let url = location.href.split('#')[0];
      console.log('url', url);
      //encodeURIComponent(url)
      this.$api.getShareAddress({
        type: 12,
        relation_id: 1,
        url: url
      }).then(res => {
        console.log('获取分享信息');
        console.log(res)
        if (res.code == 200) {
          this.doShare(res.data);
        }
      });
    },
    doShare(shareInfo) {
      let data = shareInfo.config;
      wechatInterface(
        data,
        () => {
          console.log('分享成功')
        },
        () => {
          console.log('分享失败')
        },
        true,
        shareInfo
      );
    }
  },

  created() {
    console.log('参数邀请者', this.$route.query);
    this.invite = this.$route.query.invite;
    if (
      this.$store.state.UserInfo.code &&
      this.$store.state.UserInfo.token
    ) {
      this.$api
        .wxH5register({
          code: this.$store.state.UserInfo.code
        })
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.$store.dispatch("saveToken", res.data.token);
            this.is_bindphone = res.data.is_bindphone;
            // 获取首页信息
            this.getActivityIndex();
            // 更新刷新地址
            this.getShareAddress();
          }
        });
    }

  },
};
</script>

<style lang="less">
html {
  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  overflow: -moz-scrollbars-none;
}

//谷歌适用
::-webkit-scrollbar {
  display: none;
}

#activityIndex {
  width: 100%;

  .top_view_img {
    width: 100%;
    height: 425px;
    position: relative;
    z-index: 10;
    overflow: hidden;

    .textHolder {
      width: 100%;
      height: 425px;
      background-size: 100% 100%;
      overflow: hidden;
    }
  }

  .describe_box {
    margin: 24px;
    box-sizing: border-box;
    border-bottom: 2px solid #F0F0F0;
    padding-bottom: 38px;

    .top_text {
      display: flex;
      justify-content: space-between;

      .left {
        font-size: 36px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #121010;

        .desc {
          font-size: 28px;
          font-weight: 400;
        }
      }

      .right_text {
        text-align: center;

        .discount_price {
          font-size: 32px;
          font-family: PingFang SC;
          font-weight: bold;
          color: #fe524c;
        }

        .price {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #6d6d6d;
        }
      }
    }

    .stat_time {
      line-height: 1;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #8c8a8a;
      margin: 20px 0;
    }

    .recommend {
      line-height: 1;
      font-size: 24px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #5B5B5B;

      img {
        width: 138px;
        height: 22px;
      }
    }
  }

  .actives {

    img {
      display: block;
      margin: 0px auto;
      width: 280px;
      height: 32px;
    }

    margin-top: 42px;
  }

  .parser {
    padding: 42px 44px 0px 22px;

    p {
      margin-bottom: 16px;
      // font-size: 14px !important;
      // line-height: 1.8;
      font-family: PingFang SC;
    }

    p:nth-of-type(-n+9) {
      margin-bottom: 30px;
    }
  }

  .bottom_box {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #fff;
  }

  .explain {
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #A0A0A0;
    text-align: center;
  }

  .box_holder {
    height: 200px;
  }

  .btn_bottom {
    .btn_apply {
      margin: 22px auto;
      width: 680px;
      height: 80px;
      background: linear-gradient(90deg, #FF5200 0%, #FF9000 100%);
      border-radius: 40px;
      font-size: 36px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #FFFFFF;
      text-align: center;
      line-height: 80px;
      cursor: pointer;
    }
  }

}
</style>
