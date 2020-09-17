<template>
	<div id="classDetails">
		<div v-if="postDe" class="whiteBg">
			<div class="content_item">
				<div class="user_info" v-if="postDe.user_info">
					<img :src=" postDe.user_info.avatar"/>
					<div class="user_box">
						<div class="nick">{{ postDe.user_info.nick }}</div>
						<div class="time">{{postDe.created_at}} · {{postDe.area}}</div>
					</div>
				</div>
				<div class="title">#{{postDe.topic}}#</div>
				<div class="content_desc">{{ postDe.content }}</div>
				<div :class="[{content_imag:postDe.imgs.length == 1},{content_imags:postDe.imgs.length >= 2}]" v-if="postDe.imgs.length>0 ">
					<div class="images_item" v-for="(img, indexs) of postDe.imgs" :key="indexs">
						<img :src="iconURL+img" />
					</div>
				</div>
				<div class="content_bottom">
					<div class="item" @click="toDownload">
						<img src="../assets/images/community/praise.png" v-show="!postDe.is_clickgood"/>
						<img src="../assets/images/community/praise2.png" v-show="postDe.is_clickgood"/>
						<span>{{postDe.good_num}}</span>
					</div>
					<div class="item talk" @click="toDownload">
						<img src="../assets/images/community/comment.png"/>
						<span>评论</span>
					</div>
				</div>
			</div>
			
			<commentList ref="commentListWoods" :user_post_id="woods_post_id" :mold="1" v-if="postDe.topic"></commentList>

			<div class="commit_box"><div class="innder_box" @click="toDownload">我想说点什么...</div></div>
			
		</div>
	</div>
</template>

<script>
import commentList from '@/components/community/commentList.vue';
import { GetQueryString } from '@/common/utils/mixin.js';
import wechatInterface from '@/common/config/wechatInterface';
import schemes from '@/common/utils/schemes.js';
import { Dialog } from 'vant';

export default {
	components: { commentList },
	computed: {
		iconURL() {
			return this.$iconURL;
		}
	},
	data() {
		return {
			woods_post_id: '',
			postDe: '',
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
		woodsPostDetail() {
			this.$api.woodsPostDetail({ woods_post_id: this.woods_post_id }).then(res => {
				// console.log(res);
				if(res.code!=200){
					Dialog({ message: res.msg });
					return
				}
				this.postDe = res.data;
				console.log(this.postDe)
            });
        },
        getShareAddress(){
			let url=location.href.split('#')[0];
			console.log('url',url);
			this.$api.getShareAddress({ type: 7, relation_id: this.woods_post_id, url: url }).then(res => {
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
        if (GetQueryString('woods_post_id')) {
            this.woods_post_id = GetQueryString('woods_post_id');
            if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
                this.$api.wxH5register({ code: this.$store.state.UserInfo.code }).then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        this.$store.dispatch('saveToken', res.data.token);
                        this.getShareAddress();
                        //树林帖子详情
			            this.woodsPostDetail();
                    }
                });
            }
        }
        // this.woodsPostDetail();
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
		padding: 24px;
		.title{
			 font-size: 28px;
			 color: #05B58E;
			 line-height: 42px;
		}
		.user_info {
			display: flex;
			align-items: center;
			margin-bottom: 24px;
			img{
				display: block;
				width:80px;
				height:80px;
				border-radius:50%;
			}
			.user_box {
				padding-left: 18px;
				.nick{
					font-size: 30px;
					line-height: 44px;
					color: #181818;
				}
				.time{
					padding-top: 2px;
					font-size: 22px;
					line-height: 28px;
					color: #CBCBCB;
				}
			}
		}
		.content_desc {
			font-size: 28px;
			color: #242424;
			line-height: 42px;
			word-break: break-all;
			margin-bottom: 12px;
		}
		.content_imag{
			margin-bottom: 10px;
			img{
				display: block;
				width:352px;
				height:268px;
                border-radius: 8px;
                object-fit: cover;
			}
		}
		.content_imags {
			display: flex;
			flex-wrap: wrap;
			.images_item {
				width: 212px;
				height: 212px;
				border-radius: 8px;
				margin-bottom: 10px;
				margin-right: 8px;
				background: rgba(255, 255, 255, 1);
				img {
					width: 100%;
					height: 100%;
                    border-radius: 8px;
                    object-fit: cover;
				}
			}
			.images_item:nth-child(3n){
				margin-right: 0;
			}
		}
		.content_bottom {
			font-size:22px;
			color: #8F8F8F;
			line-height: 40px;
			padding: 8px 0 14px;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			.item{
				display: flex;
				align-items: center;
				padding-left: 46px;
				img{
					width: 26px;
					height: 28px;
				}
				span{
					padding-left: 10px;
				}
			}
			.talk{
				img{
					width: 30px;
					height: 28px;
				}
			}
		}
	}
}
</style>
