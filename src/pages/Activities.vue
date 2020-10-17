<template>
<!-- 活动详情页 -->
<div id="activites">

  <!-- 收货地址 -->
  <div class="address">
    <!-- 标题 -->
    <div class="title">
      <div class="icon"></div>
      <div class="shipping_addr">收货地址</div>
    </div>
    <!-- 收货人 -->
    <div class="addr_list">
      <div class="addr_list_key">收货人</div>
      <label class="label_class">
        <div class="addr_list_value" :class="formWrongArr[0] === 1?'wrong':''"><input type="text" @blur="validName" maxlength="12" v-model="real_name" :placeholder="namePlaceholder" :focus="usernameFocus" /></div>
        <div class="icon_box" @click="toUsernameFocus"> <img src="../assets/images/active/edit.png" alt=""> </div>
      </label>
    </div>
    <!-- 手机号码 -->
    <div class="addr_list">
      <div class="addr_list_key">手机号码</div>
      <label class="label_class">
        <div class="addr_list_value" :class="formWrongArr[0] === 1?'wrong':''"><input type="number" @blur="validPhone" maxlength="19" v-model="phone" :placeholder="phonePlaceholder" :focus="phoneFocus" :placeholder-class="formWrongArr[1] === 1?'wrong':''" /></div>
        <div class="icon_box" @click="toPhoneFocus"> <img src="../assets/images/active/edit.png" alt=""> </div>
      </label>
    </div>
    <!-- 收货地址 -->
    <div class="addr_list areaList">
      <div class="addr_list_key">收货地址</div>
      <div class="addr_list_value" @click.capture="toggleVantAreaShow">
        <div class="userDefaultAddr" v-if="province&& addressFlag == 0">
          {{ province }}-{{ city }}-{{ district }}
        </div>
        <div class="userDefaultAddr" :class="formWrongArr[2] === 1?'wrong':''" v-else-if="addressFlag === 1" style="color: #848484;">
          {{pleaseChooseAddr}}
        </div>
        <van-popup v-model="isVantAreaShow" round position="bottom" :style="{ height: '50%' }">
          <van-area title="选择区域" :area-list="areaList" class="areaControl" @confirm="confirmArea" @cancel="cancelArea" ref="area" :value="address_id.area_id" />
        </van-popup>

      </div>
      <div class="icon_box"> <img src="../assets/images/active/rightArrow.png" alt=""> </div>
    </div>
    <!-- 详细收货地址 -->
    <div class="addr_list">
      <div class="addr_list_key">详细地址</div>
      <label class="label_class">
        <div class="addr_list_value" :class="formWrongArr[0] === 1?'wrong':''">
          <input type="text" maxlength="16" @blur="validAddrDetail" v-model="detail" :placeholder="detailAddPlaceholder" :focus="detailFocus" :placeholder-class="formWrongArr[3] === 1?'wrong':''" />
        </div>
        <div class="icon_box" @click="toDetailFocus"><img src="../assets/images/active/edit.png" alt=""> </div>
      </label>
    </div>
  </div>

  <div class="bigImg" v-if="bigImgShow" @click="hideBigImgBox">
    <img :src="bigImgUrl">
  </div>

  <!-- 订单商品列表 -->
  <div class="order_goods_list">
    <!-- 纵向滑动商品列表 -->
    <div class="order_goods_swrap">
      <!-- 商品条目 -->
      <div class="order_goods_item" v-for="(item, index) in giftList" v-bind:key="index">
        <div class="img_container" @click="showBigImgBox(item)">
          <img :src="item.icon" mode="aspectFill" v-if="item.icon" />
        </div>
        <div class="goods_info">
          <div class="title">{{item.title}}</div>
          <div class="description">{{item.name}}</div>
          <div class="price" ref="radio">￥{{item.price}}</div>
        </div>
        <div class="checked_icon" @click="toggleSelected(index)">
          <div v-if="!is_buy  && item.is_default === 0" class="icon_box icon_box_big">
            <img src="../assets/images/active/no_select.png" alt="">
          </div>
          <div v-else-if="!is_buy || item.is_default === 1" class="icon_box icon_box_big">
            <img src="../assets/images/active/select.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <!-- 自定义滚动条 -->
    <div class="scroll_bar" :style="scrollBarTop"></div>

    <!-- 订单其他信息 -->
    <div class="order_other_info">
      <div class="info_name">运费</div>
      <div class="info_value_box">
        <div class="info_value">快递 免邮</div>
        <div class="icon_box"> <img src="../assets/images/active/rightArrow.png" alt=""> </div>
      </div>
    </div>
    <div class="order_other_info">
      <div class="info_name">备注</div>
      <div class="info_value_box">
        <label class="label_class">
          <div class="info_value">
            <!-- <input type="text" v-model='remarks' ref="remarks" class="remarks" placeholder="填写备注" /> -->
            <textarea value="" placeholder="填写备注" maxlength="38" placeholder-style="line-height: 70px;" v-model='remarks' class="remarks" :focus="remarksFocus" />
          </div>
          <div class="icon_box" @click="toDetailFocus"><img src="../assets/images/active/edit.png" alt=""> </div>
        </label>
      </div>
    </div>
    <!-- 底部占位盒子 -->
    <div class="holder_box"></div>
  </div>

  <!-- 订单统计底部控件 -->
  <div class="footer_order_control">
    <div class="price">
      合计
      <span>￥{{(totalPrice + '').length > 1 ? (totalPrice + '.00') : 0}}</span>
    </div>
    <div class="submit_btn" @click="submitOrder">提交订单</div>
  </div>
</template>

<script>
export default {
  computed: {
    totalPrice() {
      let gift = this.giftList.find(item => item.is_default)
      return (gift && gift.price) || 0
    }
  },
  data() {
    return {
      text: '',
      multiIndex: [0, 0, 0],
      multiArray: [
        [''],
        [''],
        ['']
      ],
      mrxs: '请点击选择',
      "addressIds": {
        'province_id': 0,
        'city_id': 0,
        'area_id': 0
      },
      // 用户收货地址选择器标识
      addressFlag: 0,
      // 订单的商品列表选中索引
      goodsSelectedIndex: 1,
      // 商品是否可选
      goodsSelectedEnabled: false,
      // 商品是否已选
      isGoodsClick: false,
      // 订单商品列表 giftSelectStatus 
      orderGoodsList: [{
        id: 1,
        giftSelectStatus: 0
      }, {
        id: 2,
        giftSelectStatus: 1
      }, {
        id: 3,
        giftSelectStatus: 0
      }, {
        id: 4,
        giftSelectStatus: 0
      }, {
        id: 5,
        giftSelectStatus: 0
      }, {
        id: 6,
        giftSelectStatus: 0
      }, {
        id: 7,
        giftSelectStatus: 0
      }],
      // 收货人姓名
      real_name: '莉莉安',
      // 收货人电话号码
      phone: '15180882288',
      length: 0,
      // 省份
      province: '',
      // 城市
      city: '',
      // 区域街道
      district: '',
      // 详细地址
      detail: '富湾国际',
      // 邮编
      post_code: '410014',
      // 是否设为默认地址，默认为0不是，1是
      is_default: 1,
      // 收货地址ID，修改收货地址时，则需要加上此字段
      address_id: '',
      // 订单备注
      remarks: '',
      // 礼物列表
      giftList: [],
      // 用户名输入框获取焦点
      usernameFocus: false,
      // 手机号码获取焦点
      phoneFocus: false,
      // 详细地址获取焦点
      detailFocus: false,
      // 备注获取焦点
      remarksFocus: false,
      // 用户是否已选择过礼包
      giftFlag: false,
      // 提示用户选择收货地址
      pleaseChooseAddr: '--- 请选择收货地址 ---',
      namePlaceholder: '请填写收货人姓名',
      phonePlaceholder: '请填写收货人电话号码',
      detailAddPlaceholder: '请输入详细地址',
      // 占位符字体样式标识数组  0 正确 1错误
      formWrongArr: [0, 0, 0, 0],
      // 是否购买
      is_buy: 0,
      // 活动id
      relation_id: 1,
      // h5地址
      areaList: [],
      // h5选择器显示
      isVantAreaShow: false,
      // 未购买： 
      is_buy: 0,
      invite: '',
      // 礼物大图img
      bigImgUrl: '',
      bigImgShow: false
    }
  },
  methods: {
    // 获取省市区三级地址
    async getH5AddressArea() {
      await this.$api.getH5AddressArea().then(res => {
        if (res.code === 200) {
          this.areaList = res.data[0]
        }
      });
    },
    // 获取用户默认的收货地址
    async getDefaultUserAddress() {
      await this.$api.getDefaultUserAddress().then(res => {
        console.log(res);
        if (res.code === 200) {
          if (!res.data.list.province || res.data.list.province.length < 1) {
            this.addressFlag = 1
          }
          this.real_name = res.data.list.real_name,
            this.phone = res.data.list.phone,
            this.province = res.data.list.province_name,
            this.city = res.data.list.city_name,
            this.district = res.data.list.district_name,
            this.detail = res.data.list.detail,
            this.address_id = res.data.list.id,
            this.addressIds.province_id = res.data.list.province,
            this.addressIds.city_id = res.data.list.city,
            this.addressIds.area_id = res.data.list.district
        } else {
          this.addressFlag = 1
          this.clearUserAddress()
        }
      })
    },
    // 显示大图盒子
    showBigImgBox(item) {
      console.log('showBigBox...');
      this.bigImgUrl = item.icon
      this.bigImgShow = true
    },
    // 隐藏大图盒子
    hideBigImgBox() {
      console.log('hideBigBox...');
      this.bigImgShow = false
      this.bigImgUrl = ''
    },
    // 确认地址 
    confirmArea(e) {
      console.log('确认地址..', e);
      this.province = e[0].name
      this.city = e[1].name
      this.district = e[2].name
      this.addressIds.province_id = e[0].code
      this.addressIds.city_id = e[1].code
      this.addressIds.area_id = e[2].code
      this.addressFlag = 0
      this.isVantAreaShow = false
      console.log('area', this.$refs.area);
    },
    // 取消地址
    cancelArea() {
      this.addressFlag = 0
      console.log('取消。。。');
      this.isVantAreaShow = false
    },
    // 选择地址显示隐藏
    toggleVantAreaShow() {
      this.isVantAreaShow = true
    },
    // 清空地址信息
    clearUserAddress() {
      this.real_name = '',
        this.phone = '',
        this.province = '',
        this.city = '',
        this.district = '',
        this.detail = '',
        this.is_default = 0,
        this.address_id = ''
    },
    // 切换商品选中
    toggleSelected(index) {
      // 如果是第二次进入页面不让选
      if (this.is_buy) return
      let oneGift = this.giftList.find(item => item.is_default === 1)
      // 如果用户还没有选中礼包
      if (!oneGift) {
        this.$set(this.giftList[index], 'is_default', 1)
      } else {
        // 用户已有选中的礼包了
        // 判断用户是否想取消当前礼包
        if (index === oneGift.giftIndex) return this.$set(this.giftList[index], 'is_default', 0)
        // 所有礼包未选中状态
        this.giftList.map(item => item.is_default = 0)
        this.$set(this.giftList[index], 'is_default', 1)
      }
    },
    // 验证用户名
    validName() {
      let reg = /^[a-zA-Z0-9\u4E00-\u9FA5_-]{2,12}$/
      if (reg.test(this.real_name)) {
        this.formWrongArr[0] = 0
        this.namePlaceholder = '请填写收货人姓名'
        return true
      } else {
        this.formWrongArr[0] = 1
        this.real_name = ''
        this.namePlaceholder = '请输入2~12位用户名'
        return false
      }
    },
    // 验证手机号
    validPhone() {
      let reg = /^1[34578]\d{9}$/
      if (reg.test(this.phone)) {
        this.formWrongArr[1] = 0
        this.phonePlaceholder = '请填写收货人电话号码'
        return true
      } else {
        this.formWrongArr[1] = 1
        this.phone = ''
        this.phonePlaceholder = '请输入正确的手机号码'
        return false
      }
    },
    // 验证收货地址
    validAddr() {
      if (this.addressFlag !== 1) {
        this.formWrongArr[2] = 0
        return true
      } else {
        this.formWrongArr[2] = 1
        this.$toast('请选择地址')
        return false
      }
    },
    // 验证详细地址
    validAddrDetail() {
      let reg = /^[a-zA-Z0-9\u4E00-\u9FA5_-]{2,20}$/
      if (reg.test(this.detail)) {
        this.formWrongArr[3] = 0
        this.detailAddPlaceholder = '请输入详细地址'
        return true
      } else {
        this.formWrongArr[3] = 1
        this.detail = ''
        this.detailAddPlaceholder = '请输入2~20字的详细地址'
        return false
      }
    },
    // 验证用户有没有选择礼包
    validGiftChoosed() {
      let gift = this.giftList.find(item => item.is_default === 1)
      if (gift) {
        return true
      } else {
        this.$toast('请选择一个礼包')
        return false
      }
    },
    // 添加修改用户的收货地址
    async addOrEditUserAddress() {
      let that = this
      // 封装请求对象
      let params = {
        real_name: this.real_name,
        phone: this.phone,
        province: this.addressIds.province_id,
        city: this.addressIds.city_id,
        district: this.addressIds.area_id,
        detail: this.detail,
        is_default: this.is_default
      }

      let operatorAddrRes = {}
      //  添加或修改地址
      if (this.address_id.length === 0) {
        console.log(params);
        // 添加地址
        operatorAddrRes = await this.$api.addUserAddress(params)
      } else {
        console.log(params);
        // 修改地址
        params.address_id = this.address_id
        operatorAddrRes = await this.$api.addUserAddress(params)
      }
      // 给出不同响应		      
      if (operatorAddrRes.code === 200) {
        // uni.showToast({
        // 	title: '修改地址成功',
        // 	icon: 'success',
        // 	success() {
        // 		that.getDefaultUserAddress()
        // 	}
        // });
        return true
      } else {
        this.$toast('修改地址失败')
        return false
      }
    },
    // 校验数据
    validAllData() {
      let namePass = this.validName()
      let phonePass = this.validPhone()
      let addrPass = this.validAddr()
      let addrDetail = this.validAddrDetail()
      let giftPass = this.validGiftChoosed()
      return namePass && phonePass && addrPass && addrDetail && giftPass
    },
    // 提交订单
    async submitOrder() {
      // 1. 校验数据
      let validRes = this.validAllData()
      if (!validRes) return
      // 2. 添加或修改地址
      let operatorAddrRes = await this.addOrEditUserAddress()
      console.log(operatorAddrRes);
      if (!operatorAddrRes) return
      console.log('success....');
      // 3. 提交订单
      let selectedGift = this.giftList.find(item => item.is_default === 1)
      let gift_id = selectedGift ? selectedGift.giftIndex + 1 : 1
      // 把礼物储存到vuex中
      this.$store.dispatch("saveGift", JSON.stringify(selectedGift));
      this.$router.push({
        path: `./activitiesPay?relation_id=${this.relation_id}&gift_id=${gift_id}` + '&invite=' + this.invite
      })
      console.log('提交订单');
    },
    // 聚焦
    toUsernameFocus() {
      this.usernameFocus = !this.usernameFocus
    },
    toPhoneFocus() {
      this.phoneFocus = !this.phoneFocus
    },
    toDetailFocus() {
      this.detailFocus = !this.detailFocus
    },
    toRemarksFocus() {
      this.remarksFocus = !this.remarksFocus
    },
    // 获得活动列表
    async confirmActivityOrder() {
      await this.$api.confirmActivityOrder().then(res => {
        console.log(res);
        if (res.code === 200) {
          // 处理后端的数据 {1:{},2:{}} => [{},{},{}]
          // 判断用户是否有已选择的礼包
          let gift = {}
          for (let item in res.data.gift) {
            gift = res.data.gift[item]
            gift.giftIndex = item - 1
            if (gift.is_default === 1) this.giftFlag = true
            this.giftList.push(gift)
          }
          console.log(this.giftList);
        }
      })
    },
  },
  created() {
    this.relation_id = this.$route.query.relation_id || 1
    this.invite = this.$route.query.invite || '';
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
            // 获取省市区三级地址
            this.getH5AddressArea();
            // 获取用户默认的收货地址
            this.getDefaultUserAddress();
            // 获得活动列表
            this.confirmActivityOrder();
          }
        });
    }
  },
};
</script>

<style lang="less">
//谷歌适用

#activites {
  background-color: #f7f7f7;
  width: 100%;
  min-height: 100vh;
  padding-top: 24px;

  // 表单验证错误样式
  .wrong {
    input::-webkit-input-placeholder {
      color: #FF5555 !important;
    }
  }

  input {
    background: none !important;
    outline: none !important;
    border: none !important;
  }

  .label_class {
    flex: 1;
    display: flex;
    align-items: center;
  }

  .bigImg {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 1);

    img {
      margin-top: 30%;
      width: 100%;
      height: 55%;
    }
  }

  // 收货地址
  .address {
    box-sizing: border-box;
    padding: 35px 24px;
    margin: 0 auto;
    margin-bottom: 24px;
    width: 702px;
    height: 317px + 30 + 38;
    background: #ffffff;
    border-radius: 16px;

    // 标题
    .title {
      display: flex;
      margin-bottom: 127px - 35 - 35;
      flex-direction: row;
      align-items: center;
      height: 35px;
      width: 100%;

      .icon {
        margin-right: 47px - 25 - 7;
        width: 7px;
        height: 28px;
        background: #ffd200;
        border-radius: 3px;
      }

      .shipping_addr {
        // width: 122px;
        // height: 30px;
        font-size: 31px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #000000;
      }
    }

    // 选择城市的行
    .areaList {
      .areaControl {
        top: 0;
        left: 0;
        width: 100% !important;
      }
    }

    // 收货地址信息列表
    .addr_list {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 38px;
      height: 30px;

      .addr_list_key {
        width: 103px + 41;
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #222222;
      }

      .addr_list_value {
        flex: 1;
        font-size: 28px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #222222;

        input {
          width: 100%;
          height: 35px;
          outline: none !important;
          border: none !important;
          font-size: 28px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
        }
      }
    }
  }

  .icon_box {
    width: 22px;
    height: 22px;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .icon_box_big {
    width: 32px;
    height: 32px;
  }

  // 订单商品列表
  .order_goods_list {
    box-sizing: border-box;
    padding: 35px 24px 31px;
    margin: 0 auto;
    margin-top: 25px;
    width: 702px;
    height: 704px;
    background: #ffffff;
    border-radius: 16px;

    // 滚动条
    .scroll_bar {
      position: absolute;
      width: 10rpx;
      height: 40rpx;
      background-color: rgba(0, 0, 0, 0.3);
      top: 35rpx;
      right: 12rpx;
      border-radius: 5rpx;
      transition: top 0.02s;
    }

    // 纵向滑动商品列表
    .order_goods_swrap {
      width: 100%;
      height: 594px - 35 - 23;
      margin-bottom: 23px;
      overflow: auto;

      // 商品条目
      .order_goods_item {
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 150px;

        .img_container {
          margin-right: 24px;
          width: 148px;
          height: 148px;
          background-color: #fff;

          image {
            width: 100%;
            height: 100%;
          }
        }

        .goods_info {
          flex: 1;

          .title {
            margin-top: 43px - 35;
            font-size: 30px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #222222;
          }

          .description {
            margin-top: 12px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #9a9a9a;
          }

          .price {
            margin-top: 22px;
            font-size: 25px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #ff5656;
          }
        }

        .checked_icon {
          display: flex;
          align-items: center;

          .filledCircle {
            transform: translateX(-5px);
            width: 40px;
            height: 40px;
            border-radius: 40px;
            background-color: rgb(143, 143, 148);
          }
        }

      }
    }

    /* 定义滚动条样式 */
    .order_goods_swrap::-webkit-scrollbar {
      width: 6px;
      height: 6px;
      background-color: rgba(240, 240, 240, 1);
    }

    /*定义滚动条轨道 内阴影+圆角*/
    .order_goods_swrap::-webkit-scrollbar-track {
      box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
      border-radius: 10px;
      background-color: rgba(240, 240, 240, .5);
    }

    /*定义滑块 内阴影+圆角*/
    .order_goods_swrap::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 0px rgba(240, 240, 240, .5);
      background-color: rgba(240, 240, 240, .5);
    }

    // 订单其他信息
    .order_other_info {
      // width: 100%;
      height: 30px;
      margin-bottom: 29px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;

      .info_name {
        font-size: 26px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #222222;
      }

      .info_value_box {
        display: flex;
        flex-direction: row;
        align-items: center;

        .info_value {
          margin-right: 15px;
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;

          input {
            width: 100px;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #222222;
          }

          textarea {
            width: 500px;
            height: 70px;
            background: none !important;
            outline: none !important;
            border: none !important;
            resize: none !important;
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #222222;
          }
        }
      }
    }

    // 底部占位盒子
    .holder_box {
      height: 150px;
    }
  }

  // 订单统计底部控件
  .footer_order_control {
    position: fixed;
    box-sizing: border-box;
    padding: 0 28px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    bottom: 0;
    margin-top: 50px;
    width: 750px;
    height: 112px;
    background: #ffffff;
    box-shadow: 0px 0px 21px 0px rgba(0, 0, 0, 0.06);

    .price {
      font-size: 30px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #222222;

      span {
        color: #ff5656;
      }

    }

    .submit_btn {
      width: 209px;
      height: 84px;
      background: linear-gradient(90deg, #ffd801 0%, #ff8a01 100%);
      border-radius: 42px;
      text-align: center;
      line-height: 84px;
      font-size: 31px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      color: #ffffff;
    }
  }

}
</style>
