<!-- 好友赠书 -->
<template>
<div id="share_book">
  <div class="share_bg">
    <img src="../assets/images/active/share_bg2.jpg" alt="">
    <div class="replace_text">
      您的好友向您赠送一本书，请查收
    </div>
    <div class="share_btn" @click="getBook">
      <img src="../assets/images/active/share_icon.jpg" alt="">
      <div class="book_text">
        立即领取
      </div>
    </div>
  </div>
</div>
</template>

<script>
import wechatInterface from '@/common/config/wechatInterface.js';
import {
  CellGroup
} from 'vant';

export default {
  components: {},
  data() {
    return {
      informationDetails: {},
      content: '',
      relation_id: 1,
      invite: ''
    };
  },
  computed: {
    iconURL() {
      return this.$iconURL;
    }
  },
  watch: {},
  methods: {
    getBook() {
      this.$router.push(`/h5/activities?invite=${this.invite}&is_buy=1&showType=show&share_book=show&relation_id=${this.relation_id}`)
    },
    toDownload() {
      this.$router.push({
        path: '/h5/download'
      });
    },
    informationDetail() {
      this.$api.informationDetail({
        article_id: this.article_id
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.informationDetails = res.data;
          this.content = res.data.content;
        }
      });
    },
    getShareAddress() {
      let url = location.href.split('#')[0];
      console.log('url', url);
      //encodeURIComponent(url)
      this.$api.getShareAddress({
        type: 3,
        article_id: this.article_id,
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
  created() {},
  mounted() {
    console.log(this.$route.query, '分享图书......');
    console.log('分享图书');
    this.relation_id = this.$route.query.relation_id || 1
    this.invite = this.$route.query.invite || '';
    if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
      this.$api.wxH5register({
        code: this.$store.state.UserInfo.code
      }).then(res => {
        // console.log(res);
        if (res.code == 200) {
          this.$store.dispatch('saveToken', res.data.token);
          // this.informationDetail();
          // this.getShareAddress()
        }
      });
    }
  },
  activated() {}
};
</script>

<style lang="less">
#share_book {
  width: 100%;
  min-height: 100vh;

  .share_bg {
    position: relative;
    width: 100%;
    height: 1334px;
    background-color: pink;
    overflow: hidden;

    .replace_text {
      position: absolute;
      bottom: 15%;
      left: 50%;
      width: 60%;
      text-align: center;
      background-color: #FDF2E8;
      // background-color:pink;
      transform: translateX(-50%);
      font-size: 26px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #7a4801;
    }

    img {
      width: 100%;
      height: 235%;
    }

    .share_btn {
      position: absolute;
      bottom: 8%;
      left: 50%;
      transform: translateX(-50%);
      width: 388px;
      height: 75px;
      border-radius: 75px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 34px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #7A4801;

      img {
        width: 100%;
        height: 100%;
      }

      .book_text {
        position: absolute;
      }
    }
  }
}
</style>
