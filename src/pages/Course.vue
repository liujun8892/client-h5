<template>
	<div id="course" v-show="courseIntroduce" >
		<div v-if="courseIntroduce.type!=1">
			<div class="course_top">
				<div class="box_modol"></div>
				<div
					class="textHolder"
					:style="{
						backgroundImage: 'url(' + iconURL + courseIntroduce.cover + ')',
						backgroundPosition: '0px 0px',
						backgroundSize: 'cover',
						backgroundRepeat: 'no-repeat'
					}"
				></div>
			</div>
			<div class="content_box">
				<div class="content_box_pos">
					<div
						class="teacher_avatar"
						:style="{
							backgroundImage: 'url(' + iconURL + courseIntroduce.teacher_avatar + ')',
							backgroundSize: 'cover',
							backgroundRepeat: 'no-repeat'
						}"
					></div>
					<div class="teacher_right">
						<div class="title">{{ courseIntroduce.title }}</div>
						<div class="course_desc">{{ courseIntroduce.course_desc }}</div>
						<div class="teacher_name">主讲老师：{{ courseIntroduce.teacher_name }}</div>
					</div>
				</div>
			</div>
			<div class="separate"></div>
			
			<div class="cutTab_one" v-if="courseIntroduce.is_buy">课程学习</div>
           
			<div class="cutTab" v-if="!courseIntroduce.is_buy">
				<div :class="['tab',{ active: active == 1 }]" @click="cutTab(1)">课程介绍</div>
				<div :class="['tab',{ active: active == 2 }]" @click="cutTab(2)">课程目录
					<div class="audition" v-if="courseIntroduce.is_shiting">试听</div>
				</div>
			</div>
		</div>
		<div v-if="courseIntroduce.type==1">
			<div class="videoBg" style="background-color: #f00;" ></div>
			<video id="myVideo" ref="myVideo"
				class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
				controls type="application/x-mpegURL" allowsInlineMediaPlayback=YES webview.allowsInlineMediaPlayback=YES
				webkit-playsinline="true" playsinline="true"  x5-video-player-type="h5" x5-video-player-fullscreen="true"
				:poster="iconURL + courseIntroduce.cover"> 
			</video>
			<div class="cutTab_one cutTab_video" v-if="courseIntroduce.is_buy">课程学习</div>
			<div class="cutTab cutTab2" v-if="!courseIntroduce.is_buy">
				<div :class="['tab',{ active: active == 1 }]" @click="cutTab(1)">课程介绍</div>
				<div :class="['tab',{ active: active == 2 }]" @click="cutTab(2)">课程目录
					<div class="audition" v-if="courseIntroduce.is_shiting">试看</div>
				</div>
			</div>
		</div>

		<div class="cutTab_content" :class="{ cutTab_bottom: !courseIntroduce.is_buy }" v-show="active == 1 && !courseIntroduce.is_buy">
			<div class="content_box" v-if="courseIntroduce.type==1">
				<div class="content_box_pos">
					<div class="teacher_avatar"><img :src="iconURL + courseIntroduce.teacher_avatar"/></div>
					<div class="teacher_right">
						<div class="title">{{ courseIntroduce.title }}</div>
						<div class="course_desc">{{ courseIntroduce.course_desc }}</div>
						<div class="teacher_name">主讲老师：{{ courseIntroduce.teacher_name }}</div>
					</div>
				</div>
			</div>
			<div class="loadimage" v-for="(item, index) of courseIntroduce.course_poster" :key="index"><img v-lazy="$iconURL + item" /></div>
		</div>
		<div class="cutTab_contents" :class="{ cutTab_bottom: !courseIntroduce.is_buy }" v-show="active == 2 || courseIntroduce.is_buy">
			<mix-tree :list="list" :params="treeParams" @treeItemClick="treeItemClick" ref="mixTree"></mix-tree>
			<div class="cutTab_bottoms">- 下面没有了 -</div>
		</div>

		<div class="purchases" v-if="!courseIntroduce.is_buy">
			<div class="money">¥{{ courseIntroduce.price }}</div>
			<div class="button" @click="pay">
				<span v-if="courseIntroduce.is_free">立即领取</span>
				<span v-else>立即购买</span>
			</div>
		</div>

		<Register ref="register" @emitFree="emitFree" @collage="payment"></Register>
		
		<img src="../assets/images/loading.gif" class="is_loading" v-if="loading_show" />

		<van-overlay v-show="showOverlay" class="ignore">
			<div class="wrapper">
				<div class="block">
					<div class="cont">
						<p class="nick">
							<span>{{ username }}</span>
							邀请你一起学习课程
						</p>
						<p class="tit">
							《
							<span>{{ courseIntroduce.title }}</span>
							》
						</p>
						<p class="price">
							拼团价
							<span>¥{{ collage_price }}</span>
						</p>
						<button type="button" @click.stop="partake">参与拼团</button>
					</div>
					<van-icon name="close" @click.stop="showOverlay = false" />
				</div>
			</div>
		</van-overlay>
	</div>
</template>

<script>
// @ is an alias to /src
import wechatInterface from '@/common/config/wechatInterface';
import { Dialog } from 'vant';
import { Icon } from 'vant';
import { Overlay } from 'vant';
import { GetQueryString } from '@/common/utils/mixin.js';
import Register from '@/components/Register';
import mixTree from '@/components/mix-tree';
import videojs from 'video.js'
import 'video.js/dist/video-js.css'
export default {
	name: 'Home',
	components: {
		mixTree,
		Register,
		vanOverlay: Overlay,
		vanIcon: Icon
	},
	computed: {
		iconURL() {
			return this.$iconURL;
		}
	},
	data() {
		return {
			is_bindphone: 0, // 0未绑定手机
			courseIntroduce: '',
			active: 1,
			show: false,
			list: [],
			treeParams: {
				defaultIcon: '/static/i2.png', // 默认图标
				currentIcon: '/static/i1.png', // 展开图标
				lastIcon: '/static/i3.png', //最后一级图标
				border: true // 边框， 默认不显示
			},
			loading_show: false,
			showOverlay: false,
			course_id: '',
			collage_order_no: '',
			username: '',
			collage_price: '',
			player:'',
			options:{
				playbackRates: [0.5, 1, 1.5, 2],
				fullscreen:{
					navigationUI: 'hide'
				},
				controlBar: {
					fullscreenToggle: true,
					playbackRateMenuButton: true,
				}
			},
			invite:''
		};
    },
	methods: {
		emitFree() {
			console.log('免费课程并绑定手机');
			this.$api
				.createBuyCourseWap({
					course_id: this.course_id,
					pay_type: 2
				})
				.then(res => {
					if (res.code == 200) {
						this.$refs.register.close();
						this.$dalog
							.confirm({
								title: '领取成功',
								message: '下载APP即可获得完整体验',
								width: '72vw',
								className: 'DialogNmae',
								confirmButtonText: '去下载',
								cancelButtonText: '知道了'
							})

							.then(() => {
								this.$router.push({ path: '/h5/download' });
							})
							.catch(() => {
								this.$router.push({
									path: '/h5/course',
									query: {
										active: 2,
										course_id: this.course_id
									}
								});
							});

						return;
					}
				});
		},
		async updateIsPlay(courseItem={}, list=[]){
			await list.forEach((item, index)=>{
				if (Array.isArray(item.list) && item.list.length > 0) {
					this.updateIsPlay(courseItem, item.list);
				}else{
					list[index].is_play=0;
					if(courseItem.id==item.id && courseItem.course_id==item.course_id){
						list[index].is_play=1;
					}
				}
			});
		},
		treeItemClick(item) {
			console.log(item);
			let { id, status } = item;
			if (!status) {
				return;
			}
			this.updateIsPlay(item,this.courseIntroduce.list);
			if(this.courseIntroduce.type==1){
				console.log('切换视频')
				var data = {
					src: this.iconURL + item.audio_file,
					type: 'video/mp4'
				};
				this.player.src(data);
				this.player.load(data);
				this.player.play();
				return;
			}
			this.$router.push({
				path: '/h5/AudioDetails',
				query: { audio_id: id, course_id: this.course_id }
			});
		},
		pay() {
			if (this.courseIntroduce.is_buy) {
				this.$dalog
					.confirm({
						title: '购买成功',
						message: '下载APP即可获得完整体验',
						width: '72vw',
						className: 'DialogNmae',
						confirmButtonText: '去下载',
						cancelButtonText: '知道了'
					})
					.then(() => {
						// on confirm
						this.$router.push({ path: '/h5/download' });
					})
					.catch(() => {
						// that.$toast("取消支付");
						// on cancel
					});
				return;
			}
			if (this.is_bindphone) {
				if (this.courseIntroduce.is_free) {
					this.$dalog
						.confirm({
							title: '领取成功',
							message: '下载APP即可获得完整体验',
							width: '72vw',
							className: 'DialogNmae',
							confirmButtonText: '去下载',
							cancelButtonText: '知道了'
						})

						.then(() => {
							// on confirm
							this.$router.push({ path: '/h5/download' });
						})
						.catch(() => {
							this.$api
								.createBuyCourseWap({
									course_id: this.course_id,
									pay_type: 2
								})
								.then(res => {
									if (res.code == 200) {
										this.$router.push({
											path: '/h5/course',
											query: {
												active: 2,
												course_id: this.course_id
											}
										});
										return;
									}
								});
							// on cancel
						});
				} else {
					this.$router.push({
						path: '/h5/pay',
						query: { 
							course_id: this.course_id,
							invite: this.invite
						}
					});
				}
			} else {
				this.$refs.register.isshow(this.courseIntroduce.is_free,false);
			}
		},
		cutTab(active) {
			console.log(233);
			this.active = active;
		},
		warning() {
			console.log(232332);
			Dialog.alert({
				width: '72vw',
				message: '\n 弹窗内容 \n \n',
				className: 'DialogNmae'
			}).then(res => {
				this.$api.getAgreement({ type: 1 }).then(res => {
					console.log(res);
				});
				console.log(res);
			});
		},

		authorize() {
			this.$api.getCourse({ course_id: this.course_id }).then(res => {
				this.loading_show = false;
				if (res.code != 200) return;
				this.courseIntroduce = res.data;
				this.list = res.data.list;
                if (!res.data.is_buy) {
                    if (this.$route.query.collage_order_no!='' && this.$route.query.collage_order_no!=0
                        && this.$route.query.collage_order_no!='0' &&
                        this.$route.query.collage_order_no!=undefined && this.$route.query.collage_order_no!='undefined') {
                        this.collage_order_no = this.$route.query.collage_order_no;
                        this.username = this.$route.query.username;
                        this.collage_price = this.$route.query.collage_price;
                        this.showOverlay = true;
                    }
				}
				console.log(this.$refs.myVideo)
				this.$nextTick(()=>{
					this.player = videojs(this.$refs.myVideo, this.options);
				})
            });
            
		},
		partake() {
            if (this.is_bindphone) {
                this.payment();
            }else{
                this.$refs.register.isshow(this.courseIntroduce.is_free,true);
            }
		},
		payment() {
            //调用微信支付
            let params = {
                course_id: this.course_id,
                pay_type: 2,
                is_collage: 1,
                collage_order_no: this.collage_order_no
            };
			this.$api.createBuyCourseWap(params).then(res => {
				console.log(res, 'createBuyCourseWap');
				if (res.code == 200) {
					wechatInterface(
						res.data.pay_info,
						() => {
							this.$dalog
								.confirm({
									title: '支付成功',
									message: '下载APP即可获得完整体验',
									width: '72vw',
									className: 'DialogNmae',
									confirmButtonText: '去下载',
									cancelButtonText: '知道了'
								})
								.then(() => {
									// on confirm
									this.$router.push({
										path: '/h5/download'
									});
								})
								.catch(() => {
									this.$router.go(-1);
									this.$router.push({
										path: '/h5/course',
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
					); //失败
				} else {
					Dialog({ message: res.msg });
				}
			});
		}
	},
	created() {
		this.loading_show = true;
		console.log(GetQueryString('code'), 56);

		this.course_id = GetQueryString('course_id');
		this.invite = GetQueryString('invite');
		if (this.$GetQueryString('active')) {
			this.active = this.$GetQueryString('active');
		}
		console.log(this.$store.state.UserInfo.code);
		if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
			this.$api.wxH5register({ code: this.$store.state.UserInfo.code }).then(res => {
				console.log(res);
				if (res.code == 200) {
					this.$store.dispatch('saveToken', res.data.token);
					this.is_bindphone = res.data.is_bindphone;
					this.authorize();
				}
			});
        }
	},
	mounted(){
		
	},
	beforeDestroy(){
		videojs(this.$refs.myVideo).dispose();
	},
	destroyed() {
        this.loading_show = false;
        // localStorage.removeItem('code');
	},
	beforeRouteEnter(to, from, next) {
		console.log(to, from.name);
		if (from.name == 'pay') {
			to.meta.keepAlive = false;
		}
		if (from.name == 'AudioDetails') {
			to.meta.keepAlive = true;
		}
		next();
	},
	watch: {
		$route() {
			try {
				this.$router.go(0);
			} catch (error) {
				window.location.reload();
			}
		}
	}
};
</script>
<style lang="less">
.van-overlay {
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 999 !important;
}
.DialogNmae {
	.van-dialog__header {
		font-size: 34px;
		line-height: 40px;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(0, 0, 0, 1);
	}
	.van-dialog__message {
		font-size: 30px;
		font-family: PingFang SC;
		line-height: 40px;
		font-weight: bold;
		color: rgba(102, 102, 102, 1);
		padding: 60px 40px;
	}
	.van-button {
		height: 80px;
		line-height: 80px;
	}
	.van-button__text {
		font-size: 30px;
		font-family: PingFang SC;
	}
}
#course {
	width: 100vw;
	// height: 100vh;
	overflow-x: hidden;
	// separate 分隔线
	.separate {
		width: 100%;
		height: 20px;
		background: rgba(240, 240, 240, 1);
	}
	.videoBg{
		height: 550px;
	}
	#myVideo{
		display: block;
		width: 100%;
		height: 450px;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
	}
	.is_loading {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: block;
		width: 120px;
		height: 120px;
	}
	.course_top {
		position: relative;
		height: 300px;
		.textHolder {
			width: 100%;
			height: 300px;
			position: absolute;
			top: 0;
			overflow: hidden;
			filter: blur(5px);
		}
		.box_modol {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			z-index: 1;
			background: rgba(0, 0, 0, 0.6);
		}
	}
	.content_box {
		width: 100%;
		height: 150px;
		position: relative;
		background: #fff;
		z-index: 30;
		border-radius: 24px 24px 0px 0px;
		margin-top: -24px;
		.teacher_avatar {
			width: 200px;
			height: 200px;
			box-shadow: 0px 0px 18px 2px rgba(102, 102, 102, 0.35);
			background: rgba(153, 153, 153, 1);
			border-radius: 20px;
			margin: 0 32px 0 60px;
			img {
				display: block;
				position: relative;
				z-index: 33;
				width: 100%;
				height: 100%;
				border-radius: 20px;
			}
		}
		.content_box_pos {
			display: flex;
			// transform: translateY(-90px);
			top: -90px;
			position: absolute;
			z-index: 30;
			.teacher_right {
				flex: 1;
				margin-right: 90px;
				.title {
					font-size: 32px;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(255, 255, 255, 1);
					line-height: 1.3;
					min-height: 72px;
				}
				.course_desc {
					margin: 38px 0 10px 0;
					font-size: 26px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(153, 153, 153, 1);
				}
				.teacher_name {
					font-size: 26px;
					font-family: PingFang SC;
					font-weight: bold;
					color: rgba(51, 51, 51, 1);
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}
	.cutTab {
		width: 100%;
		display: flex;
		height: 60px;
		line-height: 60px;
		padding: 20px 0;
		.tab {
			width: 50%;
			font-size: 36px;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(85, 85, 85, 1);
			text-align: center;
			position: relative;
			.audition {
				width: 72px;
				height: 34px;
				text-align: center;
				background: rgba(236, 94, 51, 1);
				box-shadow: 0px 2px 8px 0px rgba(243, 133, 99, 0.15);
				border-radius: 21px 17px 17px 2px;
				font-size: 22px;
				line-height: 34px;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				position: absolute;
				right: 20px;
				top: -3px;
			}
		}
		.active {
			color: rgba(42, 193, 124, 1);
			position: relative;
		}
		.active::after {
			content: '';
			position: absolute;
			width: 52px;
			height: 6px;
			background: rgba(42, 193, 124, 1);
			border-radius: 3px;
			bottom: -14px;
			left: 50%;
			margin-left: -26px;
		}
	}
	.cutTab2{
		position: fixed;
		top: 450px;
		left: 0;
		z-index: 100;
		background-color: #fff;
	}

	.cutTab_one {
		width: 100%;
		height: 100px;
		display: flex;
		justify-content: center;
		font-size: 36px;
		line-height: 100px;
		color: rgba(85, 85, 85, 1);
		background-color: #fff;
		font-family: PingFang SC;
	}
	.cutTab_video{
		position: fixed;
		top: 450px;
		left: 0;
		z-index: 100;
	}
	.cutTab_content {
		padding: 32px;
		img {
			display: block;
			width: 100%;
		}
		.loadimage {
			width: 100%;
		}
		.content_box{
			height: auto;
			z-index: 1;
			margin: 0 auto 32px;
			padding-top: 30px;
			.content_box_pos{
				position: static;
				top: 0;
				.teacher_right .title{
					color: #333;
				}
			}
			.teacher_avatar{
				// margin-left: 0;
				img{object-fit: cover;}
			}
		}
		.content_box::after{
			height: 0;
		}
	}
	.cutTab_contents {
		padding: 32px 0;
		.cutTab_bottoms {
			font-size: 22px;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			text-align: center;
			margin-top: 70px;
		}
	}
	.cutTab_bottom {
		padding-bottom: 160px;
	}

	.purchases {
		z-index: 888 !important;
		width: 100%;
		height: 118px;
		background: rgba(247, 247, 247, 1);
		border-radius: 24px 24px 0 0;
		position: fixed;
		bottom: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		.money {
			font-size: 40px;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(239, 92, 65, 1);
			margin-left: 32px;
			// line-height:50px;
		}
		.button {
			width: 240px;
			height: 80px;
			text-align: center;
			line-height: 80px;
			margin-right: 32px;
			font-size: 30px;
			font-family: PingFang SC;
			font-weight: bold;
			color: rgba(255, 255, 255, 1);
			background: linear-gradient(-37deg, rgba(42, 193, 124, 1), rgba(42, 193, 145, 1));
			box-shadow: 0 10px 30px 0 rgba(51, 226, 148, 0.5);
			border-radius: 40px;
		}
	}
}
.wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	.block {
		width: 609px;
		height: 706px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		.cont {
			width: 609px;
			height: 609px;
			background: url(../assets/images/h5_share.png) center no-repeat;
			background-size: 100% auto;
			text-align: center;
			.nick {
				width: 500px;
				font-size: 36px;
				line-height: 40px;
				color: #f1ff16;
				padding: 80px 0;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 auto;
				span {
					display: inline-block;
					max-width: 160px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.tit {
				width: 562px;
				font-size: 38px;
				line-height: 42px;
				color: #ffffff;
				padding-bottom: 38px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin: 0 auto;
				span {
					display: inline-block;
					max-width: 500px;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
			.price {
				width: 500px;
				font-size: 28px;
				line-height: 42px;
				color: #eeeeee;
				padding-bottom: 150px;
				display: flex;
				align-items: flex-end;
				justify-content: center;
				margin: 0 auto;
				span {
					font-size: 44px;
					line-height: 48px;
					color: #f1ff16;
					padding-left: 10px;
				}
			}
			button {
				width: 440px;
				height: 80px;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 10px 30px 0px rgba(51, 226, 148, 0.5);
				border-radius: 40px;
				font-size: 34px;
				font-weight: bold;
				color: rgba(91, 194, 109, 1);
				border: none;
			}
		}
		.van-icon {
			font-size: 42px;
			color: #fff;
		}
	}
}
</style>
