<template>
	<div id="classDetails">
		<div v-if="postDe" class="whiteBg">
			<div class="content_item">
				<div class="title">{{postDe.title}}</div>
				<div class="user_info" v-if="postDe.user_info">
					<img :src=" postDe.user_info.avatar" />
					<div class="user_box">{{ postDe.user_info.nick }}</div>
				</div>
				<div class="content_desc">{{ postDe.desc }}</div>
				<div :class="[{content_imag:postDe.imgs.length == 1},{content_imags:postDe.imgs.length >= 2}]" v-if="postDe.imgs">
					<div class="images_item" v-for="(img, indexs) of postDe.imgs" :key="indexs">
						<img :src="iconURL+img" />
					</div>
				</div>
				<div class="content_bottom">
					<div class="item">
						<img src="../assets/images/community/praise.png" v-show="!postDe.is_clickgood"/>
						<img src="../assets/images/community/praise2.png" v-show="postDe.is_clickgood"/>
						<span>{{postDe.good_num}}</span>
					</div>
					<div class="item talk">
						<img src="../assets/images/community/comment.png"/>
						<span>评论</span>
					</div>
				</div>
			</div>
			
			<commentList ref="commentListWoods" :user_post_id="user_post_id" :mold="0" v-if="postDe.title"></commentList>

			<div class="commit_box"><div class="innder_box">我想说点什么...</div></div>
			
		</div>
	</div>
</template>

<script>
import commentList from '@/components/community/commentList.vue';
import wechatInterface from '@/common/config/wechatInterface';
import { GetQueryString } from '@/common/utils/mixin.js';

export default {
	components: { commentList },
	computed: {
		iconURL() {
			return this.$iconURL;
		}
	},
	data() {
		return {
			user_post_id: '',
			postDe: {},
		};
	},
	methods: {
		// 帖子详情
		userPostDetail() {
			this.$api.userPostDetail({ user_post_id: this.user_post_id, type: 0 }).then(res => {
				console.log(res);
				if(res.code!=200){
					Dialog({ message: res.msg });
					return
				}
				this.postDe = res.data;
			});
			console.log(this.postDe,'问答详情')
		},
		getShareAddress(){
			let url=location.href.split('#')[0];
			console.log('url',url);
			this.$api.getShareAddress({ type: 10, relation_id: this.user_post_id, url: url }).then(res => {
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
		//问答详情
		this.user_post_id = GetQueryString('post_id');
		if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
			this.$api.wxH5register({ code: this.$store.state.UserInfo.code }).then(res => {
				console.log(res);
				if (res.code == 200) {
					this.$store.dispatch('saveToken', res.data.token);
					this.getShareAddress();
					this.userPostDetail();
				}
			});
		}
		// this.userPostDetail();
	},
};
</script>

<style lang="less">
body{
	background-color: #F6F6F6;
}
#classDetails {
	width: 100%;
	padding: 20px 0 120px;
	.whiteBg{
		width:702px;
		background:rgba(255,255,255,1);
		border-radius:16px;
		margin: 0 auto;
		padding-bottom: 30px;
	}
	.commit_box {
		width: 750px;
		height: 98px;
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 2;
		background: #FFFFFF;
		.innder_box {
			width: 630px;
			height: 60px;
			background: rgba(255, 255, 255, 1);
			border-radius: 30px;
			margin: 18px auto;
			font-size: 26px;
			color: #8B8B8B;
			line-height: 60px;
			padding:0 20px;
			cursor: pointer;
			border: 1px solid #ECECEC;
		}
	}
	.content_item {
		padding: 25px 22px 21px;
		.title{
			 font-size:28px;
			 color:rgba(63,63,63,1);
			 line-height: 34px;
			 margin-bottom: 14px;
			 font-weight: bold;
		}
		.user_info {
			display: flex;
			align-items: center;
			margin-bottom: 10px;
			img{
				display: block;
				width:36px;
				height:36px;
				border-radius:50%;
			}
			.user_box {
				padding-left: 12px;
				font-size:22px;
				color:rgba(115,115,115,1);
			}
		}
		.content_desc {
			font-size:26px;
			color:rgba(69,69,69,1);
			line-height:42px;
			margin-bottom: 10px;
			word-break: break-all;
		}
		.content_imag{
			margin-bottom: 10px;
			img{
				display: block;
				width:352px;
				height:268px;
				object-fit: cover;
			}
		}
		.content_imags {
			display: flex;
			flex-wrap: wrap;
			.images_item {
				width: 214px;
				height: 184px;
				margin-bottom: 10px;
				margin-right: 8px;
				background: rgba(255, 255, 255, 1);
				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}
			}
			.images_item:nth-child(3n){
				margin-right: 0;
			}
		}
		.content_bottom {
			font-size:24px;
			color: #A5A5A5;
			line-height: 40px;
			padding: 10px 0;
			display: flex;
			align-items: center;
			.item{
				display: flex;
				align-items: center;
				padding-right: 36px;
				img{
					width: 28px;
					height: 28px;
				}
				span{
					padding-left: 10px;
				}
			}
			.talk{
				img{
					width: 26px;
					height: 25px;
				}
				span{
					font-size:22px;
					color: #999999;
				}
			}
		}
	}
}
</style>
