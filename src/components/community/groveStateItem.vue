<template>
	<div class="groveStateItem">
		<div class="user_info">
			<div class="left" @click.stop="$mRouter.push({ route: $mRoutesConfig.othersIntro, query: { type: 1, uid: item.user_info.id } })">
				<img :src="imgUrs(item.user_info.avatar)" mode="aspectFill"/>
				<div class="user_info_right">
					<div class="">{{ item.user_info.nick }}</div>
					<div class="">{{ item.created_at }} {{ item.area }}</div>
				</div>
			</div>
		</div>
		<div class="topic">#{{ item.topic }}#</div>
		<div class="content" @click.stop="toPostDetails">{{ item.content }}</div>
		<div class="imgs_odd" v-if="item.imgs.length == 1"><img :src="iconURL + item.imgs[0]" mode="aspectFill"/></div>
		<div v-if="item.imgs.length >= 2" class="imgs">
			<img v-for="(items, index) in [...item.imgs]" :key="index" :src="iconURL + items" mode="aspectFill"/>
		</div>
		<div class="item_bottom">
			<div class="share" @click.stop="$refs.woodsShare.open(7, item.id)">
				<i></i>
				分享
			</div>
			<div class="comment" @click.stop="toPostDetails">
				<b></b>
				评论
			</div>
			<div class="praise" @click.stop="good_num(itemIndex, item.is_clickgood, item.good_num)">
				<em v-if="!item.is_clickgood"></em>
				<b v-else></b>
				{{ item.good_num }}
			</div>
		</div>
	</div>
</template>

<script>
export default {
	components: {},
	props: {
		colors: {
			type: String,
			default: ''
		},
		item: {
			type: Object
		},
		itemIndex: {
			type: Number,
			default: 0
		},
		iconURL: {
			type: String,
			default: ''
		},
	},
	data() {
		return {
			attention: '关注',
		};
	},
	methods: {
		imgUrs(v) {
			if (!v) return '';
			return v.indexOf('http') !== -1 ? v : this.iconURL + v;
		},
		good_num() {
			const { id, is_clickgood, good_num } = this.item;
			let index = this.itemIndex;
			this.$emit('hanldGood', { id, is_clickgood, index, good_num });
		},
		toPostDetails() {
			this.$emit('toPostDetails', this.item.id);
		}
	},
	created() {},
	onLoad() {}
};
</script>

<style lang="less">
.groveStateItem {
	background: rgba(255, 255, 255, 1);
	border-radius: 16px;
	box-shadow: 1px 1px 3px 1px rgba(207, 207, 207, 0.2);
	margin-bottom: 24px;
	box-sizing: border-box;
	padding: 20px 20px 30px 20px;
	width: 702px;
	.user_info {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			margin-bottom: 24px;
			img {
				width: 58px;
				height: 58px;
				border-radius: 50%;
				box-shadow: 0px 0 0px 1px rgba(186, 186, 186, 0.2);
				margin-right: 17px;
			}
			.user_info_right {
				:nth-child(1) {
					font-size: 24px;
					font-weight: 400;
					color: rgba(115, 115, 115, 1);
				}
				:nth-child(2) {
					font-size: 22px;
					font-weight: 400;
					color: rgba(203, 203, 203, 1);
				}
			}
		}
	}
	.topic {
		font-size: 28px;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: rgba(5, 181, 142, 1);
	}
	.content {
		font-size: 28px;
		font-family: Source Han Sans CN;
		font-weight: 400;
		color: #242424;
		text-overflow: -o-ellipsis-lastline;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 4;
		-webkit-box-orient: vertical;
		word-break: break-all;
		margin-bottom: 20px;
	}
	.imgs_odd {
		img {
			display: block;
			width: 324px;
			height: 432px;
			border-radius: 8px;
		}
	}
	.imgs {
		display: flex;
		flex-wrap: wrap;
		img {
			display: block;
			width: 196px;
			height: 196px;
			border-radius: 8px;
			margin-right: 8px;
			margin-bottom: 10px;
		}
	}
	.item_bottom {
		display: flex;
		align-items: center;
		margin-top: 30px;
		justify-content: space-between;
		font-size: 22px;
		font-family: Source Han Sans CN;
		font-weight: 400;
		box-sizing: border-box;
		padding: 0 35px 0 14px;
		color: rgba(143, 143, 143, 1);
		.share {
			display: flex;
			align-items: center;
			i {
				display: inline-block;
				width: 26px;
				height: 26px;
				margin-right: 20px;
				background-image: url(../../assets/images/community/grove_share.png);
				background-size: 100% 100%;
			}
		}
		.comment {
			display: flex;
			align-items: center;
			b {
				display: inline-block;
				width: 30px;
				height: 28px;
				margin-right: 20px;
				background-image: url(../../assets/images/community/grove_commit.png);
				background-size: 100% 100%;
			}
		}
		.praise {
			display: flex;
			align-items: center;
			cursor: pointer;
			em {
				display: inline-block;
				width: 26px;
				height: 28px;
				margin-right: 20px;
				background-image: url(../../assets/images/community/praise.png);
				background-size: 100% 100%;
			}
			b {
				display: inline-block;
				width: 26px;
				height: 28px;
				margin-right: 20px;
				background-image: url(../../assets/images/community/praise2.png);
				background-size: 100% 100%;
			}
		}
	}
}
</style>
