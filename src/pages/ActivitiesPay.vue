<template>
<div id="activitiesPay">
  <!-- 99活动选中的礼包 -->
  <div class="gift">
    <div class="gift_img">
      <img :src="gift_info.icon" />
    </div>
    <div class="gift_info">
      <div class="title">{{gift_info.title}}</div>
      <div class="detail">{{gift_info.name}}</div>
      <div class="price">￥{{gift_info.price}}</div>
    </div>
  </div>

  <!-- 支付 -->
  <div class="pay_way_title">支付方式：</div>
  <div class="pay">
    <div class="pay_item wx_pay">
      <i class="pay_icon"></i>
      <div class="pay_name">微信支付</div>
      <b :class="{'pay_selected':payParams.pay_type === 2}"></b>
    </div>
  </div>

  <!-- 提示 -->
  <div class="notice">
    <div class="notice_1">购买须知：</div>
    <div class="notice_1">1. 您在购买前请确保您所提供的信息是完整且真实有效的；</div>
    <div class="notice_2">2. 您所购买的商品购买后不支持退订，转让，退换，请仔细确认。</div>
  </div>

  <!-- 确认支付栏 -->
  <div class="pay_bar">
    <div class="pay_info">
      应付：
      <span class="price">{{gift_info.price ? gift_info.price +'.00' : 99.00}}</span>
    </div>
    <div class="pay_btn" @click="confirmPay">确认支付</div>
  </div>

  <!-- 分享活动 -->
  <div>
    <van-popup round position="center" v-model="show" closeable @close="hidePopup">
      <div class="share_popup">
        <div class="price">
          ￥20
        </div>
        <div class="title">
          分享好友购买成功，即享20元收益
        </div>
        <div class="desc">
          用知识，表心意，邀请好友一起参与阅读计划吧
        </div>
        <div class="share_btn" @click="goDownPage">
          下载App赢取佣金
        </div>
        <div class="cancle_btn" @click="hidePopup">
          残忍拒绝
        </div>
      </div>
    </van-popup>
  </div>

</div>
</template>

<script>
// 微信接口
import wechatInterface from "@/common/config/wechatInterface";
// 这是uni-app封装好的微信js-sdk文件
// var jweixin = require("jweixin-module");
// 微信公众号接口文档
// var wx = require('weixin-js-sdk');
export default {
  data() {
    return {
      // 活动id
      relation_id: '1',
      // 礼包id
      gift_id: '1',
      // 礼包信息
      gift_info: {

      },
      // 获取支付信息的参数
      payParams: {
        relation_id: 1,
        pay_type: 2,
        gift_id: 1,
        invite: '',
      },
      // 支付信息
      pay_info: {},
      // 防止重复下单
      // isOrder: false,
      // 弹框显示隐藏
      show: false
    }
  },
  methods: {
    // 支付方式改变
    // togglePayWay(payType) {
    //   this.payParams.pay_type = payType
    // },
    // 确认支付
    confirmPay() {
      // if (isOrder) return
      this.isOrder = true
      this.createBuyActivityWap()
      console.log('确认支付');
    },
    // 提示去下载页
    goDownPage() {
      this.$router.push({
        path: '/h5/download'
      });
    },
    //隐藏
    hidePopup() {
      this.$router.push({
        path: '/h5/activityIndex'
      })
    },
    // 获取支付信息
    createBuyActivityWap() {
      let that = this
      console.log('支付参数', this.payParams);
      this.$api.createBuyActivityWap(this.payParams).then(res => {
        // this.isOrder = false
        console.log('支付信息', res);
        if (res.code === 200) {
          this.pay_info = res.data.pay_info
          wechatInterface(
            res.data.pay_info,
            () => {
              // 成功
              this.show = true
            },
            () => {
              // 失败
              this.$dalog
                .confirm({
                  title: '支付失败',
                  message: '支付遇到问题，请尝试重新支付',
                  width: '72vw',
                  className: 'DialogNmae',
                  confirmButtonText: '重新支付'
                })
                .then(() => {
                  // on confirm
                  this.payment();
                })
                .catch(() => {
                  // that.$toast("取消支付");
                  // on cancel
                });

              console.log('支付失败,请重试');
            }
          );
          //失败
          // this.payment(res)
        } else {
          this.$toast('获取支付信息失败' + res.msg)
        }
      })
    },
  },
  created() {
    this.payParams.relation_id = this.$route.query.relation_id || 1
    this.payParams.gift_id = this.$route.query.gift_id || 1
    this.payParams.invite = this.$route.query.invite || ''
    console.log('礼物信息00...', this.$store.state.Activities.gift);
    this.gift_info = JSON.parse(this.$store.state.Activities.gift)
    console.log('礼物信息...', this.gift_info);
    console.log('query....', this.$route.query);
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
            // 获取支付信息
            // this.createBuyActivityWap()
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

// 99活动支付页面
#activitiesPay {
  width: 100%;
  min-height: 100vh;
  background-color: #f7f7f7;

  .share_popup {
    position: relative;
    width: 620px;
    height: 880px;
    background: url(../assets/images/active/share_bg.jpg);
    background-size: 100% 100%;
    border-radius: 26px 26px 26px 26px;

    .price {
      position: absolute;
      font-size: 61px;
      font-family: SourceHanSansCN;
      font-weight: 800;
      color: #FFFFFF;
      left: 240px;
      top: 400px;
      // transform: translateX(-54%);
    }

    .title {
      width: 100%;
      position: absolute;
      top: 569px;
      text-align: center;
      font-size: 32px;
      font-family: Source Han Serif CN;
      font-weight: 500;
      color: #3B3B3B;
    }

    .desc {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 632px;
      font-size: 22px;
      font-family: Source Han Serif CN;
      font-weight: 400;
      color: #B9B9B9;
    }

    .share_btn {
      position: absolute;
      width: 356px;
      height: 90px;
      top: 707px;
      left: 131px;
      background: #FE4858;
      border-radius: 90px;
      font-size: 36px;
      font-family: Source Han Sans CN;
      font-weight: 500;
      color: #FFFEFE;
      text-align: center;
      line-height: 90px;
    }

    .cancle_btn {
      position: absolute;
      width: 100%;
      text-align: center;
      top: 814px;
      font-size: 28px;
      font-family: SourceHanSansCN;
      font-weight: 300;
      color: #B9B9B9;
    }
  }

  // 99活动选中的礼包
  .gift {
    display: flex;
    box-sizing: border-box;
    margin-top: 20px;
    margin-left: 14px;
    margin-bottom: 45px;
    padding: 30px 0 32px 24px;
    width: 714px;
    height: 210px;
    background: #ffffff;
    border-radius: 18px;

    .gift_img {
      width: 148px;
      height: 148px;
      background: #999999;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .gift_info {
      box-sizing: border-box;
      flex: 1;
      padding-left: 25px;
      padding-top: 6px;

      .title {
        margin-bottom: 6px;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
      }

      .detail {
        margin-bottom: 15px;
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #999999;
      }

      .price {
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #ff5555;
      }
    }
  }

  // 支付
  .pay_way_title {
    margin-left: 32px;
    margin-bottom: 22px;
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #292929;
  }

  .pay {
    box-sizing: border-box;
    padding-left: 18px;
    margin-left: 14px;
    width: 715px;
    height: 150px;
    background: #FFFFFF;
    border-radius: 16px;
    display: flex;
    flex-direction: column;

    .pay_item {
      display: flex;
      box-sizing: border-box;
      padding-right: 23px;
      flex: 1;
      align-items: center;
      justify-content: space-between;
      align-items: center;

      .pay_icon {
        display: block;
        margin-right: 19px;
        width: 38px;
        height: 38px;
        background: url(../assets/images/pay/pay_2.png) no-repeat;
        background-size: 100% 100%;
      }

      .pay_icon.ali_pay_icon {
        background-image: url(../assets/images/pay/pay_1.png);
      }

      .pay_name {
        flex: 1;
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #272727;
      }

      .pay_selected {
        display: block;
        width: 32px;
        height: 32px;
        background: url(../assets/images/pay/select.png);
        background-size: 100% 100%;
      }
    }

    .pay_item:nth-of-type(1) {
      border-bottom: 1px solid #F7F7F7;
    }
  }

  // 提示
  .notice {
    margin-top: 17px;
    padding-left: 31px;
    width: 643px;
    font-size: 22px;
    font-family: PingFang SC;
    font-weight: 400;
    color: #bababa;

    .notice_1 {
      margin-bottom: 6px;
    }
  }

  // 确认支付栏
  .pay_bar {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    padding: 0 19px 0 39px;
    position: fixed;
    bottom: 0;
    width: 750px;
    height: 98px;
    background: #ffffff;

    .pay_info {
      font-size: 34px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #282828;

      .price {
        font-size: 30px;
        color: #ff5555;
      }
    }

    .pay_btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 218px;
      height: 76px;
      background: linear-gradient(90deg, rgba(255, 215, 0, 0.99) 0%, #ff8900 100%);
      border-radius: 38px;
      font-size: 28px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #ffffff;
    }
  }
}
</style>
