<!-- 加入班级，去下载 -->
<template>
	<div id="art">
		<div class="title">{{ informationDetails.title }}</div>
		<div class="people" v-if="informationDetails.course_teacher_info">
			<img class="head" :src="iconURL + informationDetails.course_teacher_info.course_teacher_avatar" />
			<div class="des">
				<p>{{ informationDetails.course_teacher_info.course_teacher_name }}</p>
				<p>{{ informationDetails.course_teacher_info.course_teacher_desc }}</p>
			</div>
		</div>
		<div class="cont" v-html="content"></div>
		<button type="button" class="btn" @click="toDownload">下载APP成为智慧家长</button>
	</div>
</template>
<script>
import wechatInterface from '@/common/config/wechatInterface.js';

export default {
	components: {},
	data() {
		return {
			informationDetails: {},
			content: '',
			article_id:0,
		};
	},
	computed: {
		iconURL() {
			return this.$iconURL;
		}
	},
	watch: {},
	methods: {
		toDownload() {
			this.$router.push({ path: '/h5/download' });
		},
		informationDetail() {
			this.$api.informationDetail({ article_id: this.article_id }).then(res => {
				// console.log(res);
				if (res.code == 200) {
					this.informationDetails = res.data;
					this.content = res.data.content;
				}
			});
		},
		getShareAddress(){
			let url=location.href.split('#')[0];
			console.log('url',url);
			//encodeURIComponent(url)
			this.$api.getShareAddress({ type: 3, article_id: this.article_id, url: url }).then(res => {
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
	created() {
	},
	mounted() {
		this.article_id=this.$route.query.article_id;
		// const ua = window.navigator.userAgent.toLowerCase();
		// if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		// 	this.getShareAddress()
		// }
		if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
			this.$api.wxH5register({ code: this.$store.state.UserInfo.code }).then(res => {
				// console.log(res);
				if (res.code == 200) {
					this.$store.dispatch('saveToken', res.data.token);
					this.informationDetail();
					this.getShareAddress()
				}
			});
        }
	},
	activated() {}
};
</script>
<style lang="less">
#art {
	.title {
		font-size: 44px;
		font-family: PingFang SC;
		font-weight: bold;
		color: rgba(51, 51, 51, 1);
		line-height: 62px;
		padding: 56px 36px 26px;
	}
	.people {
		margin-top: 20px;
		padding: 0 36px;
		display: flex;
		align-items: center;
		margin-bottom: 40px;
		.head {
			display: block;
			width: 72px;
			height: 72px;
			border-radius: 50%;
			margin-right: 20px;
		}
		.des {
			flex: 1;
			p:first-child {
				font-size: 28px;
				font-family: Source Han Sans CN;
				color: rgba(69, 69, 69, 1);
				line-height: 32px;
				padding-bottom: 6px;
			}
			p:last-child {
				font-size: 22px;
				font-family: Source Han Sans CN;
				color: rgba(153, 153, 153, 1);
				line-height: 26px;
			}
		}
	}
	.cont {
		padding: 0 36px 160px;
		font-size: 34px;
		font-family: Source Han Sans CN;
		color: rgba(68, 68, 68, 1);
		line-height: 60px;
		img {
			display: block;
			width: 100%;
			height: auto;
			margin: 8px 0;
		}
	}
	.btn {
		display: block;
		width: 486px;
		height: 88px;
		background: rgba(64, 213, 134, 1);
		border-radius: 44px;
		font-size: 34px;
		font-family: Source Han Sans CN;
		font-weight: 500;
		color: rgba(255, 255, 255, 1);
		border: none;
		position: fixed;
		bottom: 20px;
		left: 50%;
		margin-left: -243px;
		z-index: 10;
	}
}
</style>
