<template>
	<div>
		<div class="discuss">全部{{mold==0? '回答' : mold==2 ? '留言': '评论'}}<span>({{total}})</span></div>
		
		<div class="getCommentList">
			<div class="getCommentList_item" v-for="(item, index) in getCommentLists" :key="index">
				<div class="item_comment">
					<div class="left">
						<img :src="item.user_info.avatar"/>
						</div>
					<div class="right">
						<div class="top">{{ item.user_info.nick }}</div>
						<div :class="['center', { ifAfter: item.txtLen }, { ifunfold: item.ifunfold }]">
							{{ item.content }}
							<div class="unfold" v-if="item.txtLen" @click.stop="unfold(index)">{{ item.unfoldText }}</div>
						</div>
						<div class="bottom">
							<div class="time">{{ item.created_at | dateFormat }}</div>
							<div class="ope">
								<i class="love loved" v-if="item.is_clickgood==1"></i>
								<i class="love " v-else></i>
								<span>{{ item.good_num }}</span>
								<i class="talk"></i>
								<span>{{ item.reply_count }}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="item_reply">
					<div class="item_reply_top" v-for="(items, indexs) in item.reply" :key="indexs">
						<div class="left">
							<img :src=" items.user_info1.avatar" />
							</div>
						<div class="right">
							<div class="top">{{ items.user_info1.nick }}</div>
							<div class="center">
								<span class="text1" v-if="items.user_info2">回复</span>
								<span class="text2" v-if="items.user_info2">{{ items.user_info2.nick }}：</span>
								{{ items.content }}
							</div>
							<div class="bottom">
								<div class="time">{{ items.created_at | dateFormat }}</div>
							</div>
						</div>
					</div>
					<div class="more_reply" v-if="item.reply_count > 3 && item.reply.length < item.reply_count">查看更多回复</div>
				</div>
			</div>
			<div class="naData" v-if="getCommentLists.length<1">暂时没有收到任何评论哦~</div>
		</div>
		
	</div>
</template>

<script>
	export default {
		computed:{
			
		},
		props: {
			user_post_id: {
				type: String,
				default() {
					return '';
				}
			},
			mold: {
				type: Number,
				default() {
					return 0;
				}
			}
		},
		data() {
			return {
				getCommentLists:[],
				total:0,
				page: 1,
				pagesize: 10,
				status: 'more',
				reload:false,
			};
		},
		mounted() {
			console.log('mounted')
			this.getCommentListWoods();
		},
		methods: {
			unfold(index) {
				if (!this.getCommentLists[index].ifunfold) {
					this.getCommentLists[index].ifunfold = true;
					this.getCommentLists[index].unfoldText = '收起';
				} else {
					this.getCommentLists[index].ifunfold = false;
					this.getCommentLists[index].unfoldText = '展开';
				}
			},
			getCommentListWoods() {
				let parmas = {
					user_post_id: this.user_post_id,
					page: this.page,
					pagesize: this.pagesize,
					mold: this.mold, //0=社区问答，1=树林动态，2=宝贝，3=公告，4=社群话题
				};
				this.$api.getCommentListWoods(parmas).then(res => {
					console.log(res);
					switch (res.code) {
						case 200:
							res.data.list.map(v => {
								if (this.getByteLen(v.content) >= 100) {
									v.ifunfold = false;
									v.unfoldText = '展开';
									v.txtLen = true;
								}
								if (v.reply_count > 3) {
									v.ReplyPage = 2;
								}
							});
							this.getCommentLists = this.reload ? this.getCommentLists.concat(res.data.list) : res.data.list;
							this.total = res.data.total;
							break;
						default:
							break;
					}
				});
			},
			loadMoreData(){
				this.page++;
				//上拉加载
				this.reload = true;
				this.status = 'more';
				let tem = setTimeout(() => {
					if (this.total > this.getCommentLists.length) {
						this.getCommentListWoods()
					} else {
						this.status = 'noMore';
					}
					clearTimeout(tem);
				}, 200);
			},
			getByteLen(v) {
				var len = 0;
				for (var i = 0; i < v.length; i++) {
					var a = v.charAt(i);
					if (a.match(/[^\x00-\xff]/gi) != null) {
						len += 2;
					} else {
						len += 1;
					}
				}
				return len;
			},
		},
		filters:{
			dateFormat(v) {
				v=v.replace(/-/g,'/')
				v=new Date(v);
				var month = (v.getMonth()+1).toString().padStart(2,'0')
				var day = v.getDate().toString().padStart(2,'0')
	　　　　　　 return month+'-'+day;
			}
		},
	};
</script>

<style lang="less">
	.discuss {
		padding: 0 22px;
		font-size:30px;
		font-weight: bold;
		color: #090B0D;
		// color:rgba(9,11,13,1);
		line-height: 50px;
		span{
			padding-left: 14px;
			// color: #B4B4B4;
			// font-weight: normal;
		}
	}
	.getCommentList {
		margin-bottom: 40px;
		.naData{
			padding: 100px;
			text-align: center;
			font-size: 24px;
			color: #A9A8A8;
		}
		.getCommentList_item {
			padding: 10px 22px;
			.item_comment {
				display: flex;
				.left {
					width: 42px;
					height: 42px;
					img {
						width: 42px;
						height: 42px;
						border-radius: 50%;
					}
				}
				.right {
					padding-left: 18px;
					padding-bottom: 16px;
					flex: 1;
					border-bottom: 1px solid rgba(237,237,237,0.5);
					.top {
						font-size: 22px;
						color: #919191;
						line-height: 42px;
					}
					.center {
						width: 100%;
						position: relative;
						font-size: 26px;
						line-height: 34px;
						color: #6A6A6A;
						word-break: break-all;
						display: -webkit-box;
						-webkit-line-clamp: 3;
						-webkit-box-orient: vertical;
						overflow: hidden;
						letter-spacing: 1.2px;
						margin-bottom: 10px;
						// white-space: pre-wrap;
					}
					.ifAfter::after {
						content: '';
						background-color: #fff;
						position: absolute;
						z-index: 1;
						right: 0;
						bottom: 0;
						width: 80px;
						height: 40px;
					}
					.ifunfold {
						display: inline-block;
					}
					.unfold {
						position: absolute;
						z-index: 2;
						cursor: pointer;
						right: 14px;
						bottom: 0px;
						font-size: 24px;
						font-family: Source Han Sans CN;
						font-weight: 400;
						color: #33BC84;
					}
					.bottom {
						display: flex;
						justify-content: space-between;
						align-items: center;
						padding-bottom: 10px;
						.time{
							font-size: 22px;
							color: #9D9D9D;
						}
						.ope{
							height: 28px;
							display: flex;
							align-items: center;
							span{
								font-size:24px;
								color: #A5A5A5;
								padding-left: 9px;
							}
							.love{
								display: block;
								width: 28px;
								height: 28px;
								background-image: url(../../assets/images/community/praise.png);
								background-size: 28px auto;
								background-position: center;
								background-repeat: no-repeat;
							}
							.loved{
								background-image: url(../../assets/images/community/praise2.png);
							}
							.talk{
								display: block;
								width: 28px;
								height: 28px;
								background-image: url(../../assets/images/community/comment.png);
								background-size: 28px auto;
								background-position: center;
								background-repeat: no-repeat;
								margin-left: 30px;
							}
						}
					}
				}
			}
			.item_reply {
				padding: 0 0 0 42px;
				.item_reply_top {
					padding-top: 20px;
					display: flex;
					.left {
						width: 38px;
						height: 38px;
						img {
							width: 38px;
							height: 38px;
							border-radius: 50%;
						}
					}
					.right {
						padding-left: 18px;
						padding-bottom: 10px;
						flex: 1;
						border-bottom: 1px solid rgba(237,237,237,0.5);
						.top {
							font-size: 22px;
							color: #919191;
							line-height: 38px;
							margin-bottom: 3px;
						}
						.center {
							font-size: 26px;
							color: rgba(51, 51, 51, 1);
							line-height: 34px;
							color: #6A6A6A;
							word-break: break-all;
							margin-bottom: 10px;
							.text1 {
								color: #6A6A6A;
								margin-right: 10px;
							}
							.text2 {
								color: #919191;
							}
						}
						.bottom {
							display: flex;
							justify-content: space-between;
							align-items: center;
							padding-bottom: 10px;
							.time{
								font-size: 22px;
								color: #9D9D9D;
							}
						}
					}
				}
				.more_reply {
					display: inline-block;
					font-size: 20px;
					position: relative;
					color: rgba(186, 186, 186, 1);
					cursor: pointer;
					margin-left: 88px;
				}
				.more_reply::after {
					position: absolute;
					left: -46px;
					top: 50%;
					content: '';
					width: 36px;
					height: 1px;
					background: rgba(186, 186, 186, 1);
				}
				.more_reply::before {
					position: absolute;
					content: '';
					right: -26px;
					top: 40%;
					border: 10px solid rgba(186, 186, 186, 1);
					border-left-color: transparent;
					border-right-color: transparent;
					border-bottom-color: transparent;
				}
			}
		}
	}
</style>
