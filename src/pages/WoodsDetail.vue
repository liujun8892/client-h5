<template>
	<div id="woodDetails">
		<div class="top" >
			<div class="bgc" :style="{ backgroundImage: `url(${iconURL + woods_info.cover_pic})` }"></div>
			<div class="user_infor">
				<div class="cover_pic"><img :src="iconURL + woods_info.cover_pic" /></div>
				<div class="center">
					<div class="name">{{ woods_info.name }}</div>
					<div class="people_num">{{ woods_info.people_num }}人在这里</div>
					<div class="avatar_bottom" >
						<img class="avatar" v-for="(item, index) of woods_info.member_info" :src="item.avatar"  :key="index"/>
						<van-icon name="arrow" :size="12" color="#fff" @click="toDownload"/>
					</div>
				</div>
				<div v-if="user_identity === 0" class="left" @click.stop="joinWoods">{{ text }}</div>
			</div>
		</div>
		<div class="notice-box" @click="toDownload">
			<div class="left_box">公告</div>
			<div class="">{{ notice }}</div>
		</div>
		
		<div class="content_bottom">
			<div class="operation">
				<div class="operation_right">
					<div @click="cut(index)" :class="['operation_item', { active: cutIndex == index }]" v-for="(item, index) in operationList" :key="index">{{ item.name }}</div>
				</div>
			</div>
			<waterfall :isEmpty="isEmpty" :iconURL="iconURL" v-if="thingsLists.length >= 1 && cutIndex == 0" :dataLists="thingsLists"></waterfall>
			<div class="woodsPostLists">
				<div v-for="(item, index) of woodsPostLists" :key="index" v-if="cutIndex == 1">
					<groveStateItem
						colors="color"
						width_v="702px"
						v-if="woodsPostLists.length >= 1"
						:iconURL="iconURL"
						:item="item"
						:itemIndex="index"
					></groveStateItem>
				</div>
			</div>
		</div>
		<!-- <div class="publishBtn">
			<div class="">+</div>
			<div class="text">发布</div>
		</div> -->
	</div>
</template>

<script>
import { Icon } from "vant";
import waterfall from '@/components/community/waterfall.vue';
import groveStateItem from '@/components/community/groveStateItem';
import wechatInterface from '@/common/config/wechatInterface';
import { GetQueryString } from '@/common/utils/mixin.js';
import schemes from '@/common/utils/schemes.js';
import { Dialog } from 'vant';

export default {
	computed: {
		iconURL() {
			return this.$iconURL;
		},
	},
	components: {
		vanIcon: Icon,
		waterfall,
		groveStateItem
	},
	data() {
		return {
			isEmpty:false,
			user_identity:'',// 0=未加入树林，1=加入，2=林主
			isShow: false,
			scrollTop: 0,
			scrollData: {},
			color: '#FFFFFF;',
			is_task: 0,
			cutIndex: 0,
			operationList: [
				{
					id: 1,
					name: '置换区',
					active: 1
				},
				{
					id: 2,
					name: '交流区',
					active: 0
				}
			],
			woods_info: '',
			text: '加入',
			woods_id: '',
			thingsLists: [],
			woodsPostLists: [],
			notice: '',
			word:'',
			page: 1,
			pagesize: 5,
			reqTime: 0
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
		userWoodsIdentity(){
			let self = this;
			this.$api.userWoodsIdentity({woods_id:this.woods_id}).then(res=>{
				console.log(res)
				switch (res.code) {
					case 200:
						self.user_identity = res.data
						break;
					default:
						break;
				}
			})
		},
		joinWoods() {
			// Dialog({ message: '请下载app操作' });
			this.$api.joinWoods({ woods_id: this.woods_id }).then(res => {
				switch (res.code) {
					case 200:
						console.log(res);
						this.userWoodsIdentity();
						this.woodsDetail(this.woods_id);
						this.$dalog
							.confirm({
								title: '加入成功',
								message: '下载APP即可获得完整体验',
								width: '72vw',
								className: 'DialogNmae',
								confirmButtonText: '去下载',
								cancelButtonText: '知道了'
							})
							.then(() => {
								// on confirm
								// this.$router.push({ path: '/h5/download' });
								this.toDownload();
							})
							.catch(() => {
								// on cancel
							});
						break;
					default:
						break;
				}
			});
		},
		woodsDetail(woods_id) {
			// 获取树林详情
			this.$api.woodsDetail({woods_id}).then(res => {
				switch (res.code) {
					case 200:
						this.is_task = res.data.is_task;
						this.woods_info = res.data.woods_info;
						this.notice = res.data.notice;
						break;
					default:
						Dialog({ message: res.msg });
						break;
				}
			});
		},
		thingsList() {
			//获取树林置换区详情
			this.$api.thingsList({woods_id: this.woods_id}).then(res => {
				switch (res.code) {
					case 200:
						this.thingsLists = res.data.list;
						break;
					default:
						Dialog({ message: res.msg });
						break;
				}
			});
		},
		woodsPostList() {
			this.$api.woodsPostList({woods_id: this.woods_id}).then(res => {
				console.log(res);
				switch (res.code) {
					case 200:
						this.woodsPostLists = res.data.list;
						break;
					default:
						break;
				}
			});
		},
		cut(index) {
			let self = this;
			this.cutIndex = index;
			if (this.cutIndex == 1) {
				self.woodsPostList();
			}else{
				self.thingsList();
			}
		},
		getShareAddress(){
			let url=location.href.split('#')[0];
			console.log('url',url);
			this.$api.getShareAddress({ type: 9, relation_id: this.woods_id, url: url }).then(res => {
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
		},
	},
	created(){
		if (GetQueryString('woods_id')) {
            this.woods_id = GetQueryString('woods_id');
            if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
                this.$api.wxH5register({ code: this.$store.state.UserInfo.code }).then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        this.$store.dispatch('saveToken', res.data.token);
                        this.getShareAddress();
                        this.userWoodsIdentity()
						this.woodsDetail(this.woods_id);
						this.thingsList();
                    }
                });
            }
		}
		// this.woodsDetail(this.woods_id);
		// this.thingsList();
	},
};
</script>

<style lang="less">
body{
	background-color: #f6f6f6;
}
#woodDetails {
	width: 100%;
	.top {
		width: 750px;
		// height: 502px;
		height: 472px;
		position: relative;
		// padding-top: 76px;
		padding-top: 46px;
		box-sizing: border-box;
		.bgc {
			background-size: cover;
			background-repeat: no-repeat;
			filter: blur(10px);
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 0;
		}
		.user_infor {
			display: flex;
			padding-left: 20px;
			box-sizing: border-box;
			padding-top: 20px;
			overflow: hidden;
			position: relative;
			z-index: 2;
			.avatar_bottom {
				display: flex;
				align-items: center;
				.avatar{
					margin-left: -12px;
				}
				:first-child{
					margin-left: 0px;
				}
				.uni-icon-wrapper {
					margin-left: 10px;
				}
			}
		}

		.cover_pic {
			img {
				width: 160px;
				height: 160px;
				border-radius: 16px;
				object-fit: cover;
			}
		}

		.center {
			margin-left: 25px;
			flex: 1;
			img {
				width: 56px;
				height: 56px;
				background: rgba(112, 112, 112, 1);
				border: 2px solid rgba(255, 255, 255, 1);
				border-radius: 50%;
			}
			.name {
				font-size: 30px;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				line-height: 1;
			}
			.people_num {
				font-size: 22px;
				font-family: Source Han Sans CN;
				font-weight: 400;
				color: rgba(255, 255, 255, 1);
				line-height: 1;
				margin-top: 10px;
				margin-bottom: 26px;
			}
		}

		.left {
			margin-top: 90px;
			margin-right: 24px;
			width: 144px;
			height: 52px;
			cursor: pointer;
			background: linear-gradient(269deg, rgba(5, 181, 142, 0.99), rgba(10, 215, 135, 0.99));
			border-radius: 26px;
			font-size: 28px;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: #ffffff;
			text-align: center;
			line-height: 52px;
		}
	}
	.top::after {
		content: '';
		background: rgba(128, 128, 128, 0.6);
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
	}

	.notice-box {
		width: 704px;
		height: 88px;
		position: relative;
		margin: 0 auto;
		margin-top: -214px;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 16px;
		margin-bottom: 22px;
		font-size: 30px;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(246, 246, 246, 1);
		line-height: 88px;
		display: flex;
		align-items: center;
		box-sizing: border-box;
		padding: 0 20px 0 24px;

		.left_box {
			width: 56px;
			height: 32px;
			background: rgba(237, 195, 88, 1);
			border-radius: 8px;
			margin-right: 18px;
			font-size: 20px;
			font-family: Source Han Sans CN;
			font-weight: 400;
			color: rgba(255, 255, 255, 1);
			line-height: 32px;
			text-align: center;
		}

		:nth-child(2) {
			flex: 1;
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
			word-break: break-all;
		}
	}

	.content_bottom {
		margin-top: 24px;
		width: 750px;
		background: #fff;
		border-radius: 16px;
		box-sizing: border-box;
		padding: 24px 24px 300px;
		position: relative;
		.operation {
			display: flex;
			margin-bottom: 20px;
			.operation_right {
				display: flex;
				align-items: center;

				.operation_item {
					font-size: 30px;
					font-family: Source Han Sans CN;
					font-weight: 400;
					color: #a7a7a7;
					margin-right: 50px;
					cursor: pointer;
				}

				.active {
					font-size: 32px;
					font-family: Source Han Sans CN;
					font-weight: 500;
					color: #262626;
					position: relative;
				}

				.active::after {
					content: '';
					position: absolute;
					bottom: -20px;
					width: 24px;
					height: 6px;
					background: #06b68e;
					border-radius: 3px;
					left: 50%;
					transform: translateX(-50%);
				}
			}
		}

		.woodsPostLists {
			// width: 702px;
			// background: #FFFFFF;
			border-radius: 16px;
			margin: 10px auto;
			box-sizing: border-box;
		}
	}

	.publishBtn {
		width: 114px;
		height: 114px;
		cursor: pointer;
		background: #06b68e;
		border: 6px solid #ffffff;
		box-shadow: 1px 1px 10px #f6f6f6;
		border-radius: 50%;
		position: fixed;
		bottom: 35px;
		left: 50%;
		color: #ffffff;
		transform: translateX(-50%);
		:nth-child(1) {
			text-align: center;
			font-size: 70px;
			line-height: 1;
		}
		.text {
			font-size: 22px;
			font-weight: 400;
			text-align: center;
			// margin-top: 70px;
		}
	}
}
</style>
