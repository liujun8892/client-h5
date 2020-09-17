<template>
	<div id="productDetails">
		<div class="commodity">
			<swiper class="swiper" ref="mySwiper" :options="swiperOptions" v-if="swiperList">
				<swiper-slide v-for="(item,index) in swiperList" :key="index">
					<div v-if="item.type == 'video'">
						<video class="goodsVideo" :src="item.url" :poster="item.poster" controls></video>
					</div>
					<div v-else>
						<img class="swiperImg" :src="item.url"/>
					</div>
				</swiper-slide>
			</swiper>
		</div>
		
		<div class="price">
			￥
			<span>{{ product.price }}</span>
		</div>
		<div class="product_content">
			<div class="name">{{ product.name }}</div>
			<div class="desc">{{ product.desc }}</div>
			<div class="userinfo" v-if="product.user_info">
				<img class="avatar" :src="product.user_info.avatar"/>
				<div class="info">
					<div class="nick">{{product.user_info.nick}}</div>
					<!-- <div class="level">
						<img src="../assets/images/community/level_v.png"/>
						<span>普通用户</span>
					</div> -->
				</div>
			</div>
		</div>
		
		<commentList ref="commentListWoods" :user_post_id="thing_id" :mold="2" style="padding:0 6px" v-if="product.name"></commentList>

		<div class="commit_box" @click="toDownload">
			<img class="avatar" :src="product.myself_avatar"/>
			<div class="innder_box">看对眼就赶紧留言，问问更多细节</div>
		</div>
		
	</div>
</template>

<script>
import commentList from '@/components/community/commentList.vue';
import wechatInterface from '@/common/config/wechatInterface';
import schemes from '@/common/utils/schemes.js';
import { GetQueryString } from '@/common/utils/mixin.js';
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { Dialog } from 'vant';
import "swiper/css/swiper.css";
export default {
	components: {
		commentList,
		Swiper,
        SwiperSlide
	},
	computed: {
		iconURL() {
			return this.$iconURL;
		}
	},
	data() {
		return {
			thing_id: '',
			swiperList: [],
			product: '',
			swiperOptions: {
                autoplay: false
            },
		};
	},
	methods: {
		toDownload(){
			var schemesObj = {
              pkgname: 'com.listeningtrees.webapp',
              appleId: '1503106436',
              app_qq: 'https://a.app.qq.com/o/simple.jsp?pkgname=',
              appleUrl: ' https://itunes.apple.com/cn/app/id'
            }
            var isschemes = new schemes('listeningtrees://', schemesObj)
            isschemes.init()
		},
		//宝贝详情
		thingsDetail() {
			this.$api.thingsDetail({ thing_id: this.thing_id }).then(res => {
				switch (res.code) {
					case 200:
						this.product = res.data;
						if (this.product.video) {
							this.swiperList = [{ id: 0, type: 'video', url: this.iconURL + this.product.video, poster: this.iconURL + this.product.video_pic }];
						}
						this.product.imgs.map((v, i) => {
							this.swiperList.push({ type: 'image', url: this.iconURL + v, id: this.product.video ? i + 1 : i });
						});
						break;
					default:
                        Dialog({ message: res.msg });
						break;
				}
            });
        },
        getShareAddress(){
			let url=location.href.split('#')[0];
			console.log('url',url);
			this.$api.getShareAddress({ type: 6, relation_id: this.thing_id, url: url }).then(res => {
				console.log('获取分享信息');
				console.log(res)
				if (res.code == 200) {
					this.doShare(res.data);
				}
			});
		},
		doShare(shareInfo) {
			let data=shareInfo.config;
			wechatInterface(
				data,
				()=>{
					console.log('分享成功')
				},
				()=>{
					console.log('分享失败')
				},
				true,
				shareInfo
			);
		}
    },
    created(){
        if (GetQueryString('thing_id')) {
            this.thing_id = GetQueryString('thing_id');
            if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
                this.$api.wxH5register({ code: this.$store.state.UserInfo.code }).then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        this.$store.dispatch('saveToken', res.data.token);
                        this.getShareAddress();
                        this.thingsDetail();
                    }
                });
            }
        }
        // this.thingsDetail();
    },
};
</script>

<style lang="less">
#productDetails {
	width: 100%;
	padding-bottom: 120px;
	.commodity {
		width: 750px;
		height: 640px;
		background-color: #f6f6f6;
		.swiper{
			width: 100%;
			height: 640px;
			.swiperImg,.goodsVideo{
				width: 100%;
				height: 640px;
			}
		}
	}
	.price {
		padding: 24px 0 18px;
		margin-left: 22px;
		font-size: 32px;
		font-weight: 500;
		color: #fc7f23;
		line-height: 42px;
		span {
			font-size: 42px;
		}
	}
	.product_content {
		width: 100%;
		padding: 0 34px 0 24px;
		box-sizing: border-box;
		font-size: 30px;
		font-family: PingFang SC;
		border-bottom: 22px solid #f6f6f6;
		margin-bottom: 24px;
		.name {
			font-weight: bold;
			color: #151515;
			line-height: 46px;
		}
		.desc {
			color: #2A2A2A;
		}
		.userinfo{
			margin: 36px 24px 31px 0;
			display: flex;
			align-items: center;
			.avatar{
				display: block;
				width: 68px;
				height: 68px;
				border-radius: 50%;
				margin-right: 10px;
			}
			.info{
				.nick{
					font-size: 28px;
					font-weight: 500;
					color: #252525;
					line-height: 30px;
				}
				.level{
					margin-top: 4px;
					padding: 0 12px 0 4px;
					height: 34px;
					background: #CDCFD4;
					border-radius: 17px;
					display: flex;
					align-items: center;
					img{
						width: 29px;
						height: 29px;
					}
					span{
						font-size: 24px;
						color: #FFFFFF;
						padding-left: 6px;
					}
				}
			}
		}
	} 
	.commit_box {
		width: 100%;
		height: 74px;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 2;
		background: #fff;
		display: flex;
		align-items: center;
		.avatar {
			display: block;
			width: 56px;
			height: 56px;
			border-radius: 50%;
			margin-left: 36px;
		}
		.innder_box {
			width: 614px;
			height: 64px;
			background: #f6f6f7;
			border-radius: 32px;
			margin-left: 16px;
			font-size: 26px;
			color: #b3b3b3;
			line-height: 64px;
			box-sizing: border-box;
			padding: 0 36px;
			cursor: pointer;
		}
	}
}
</style>
