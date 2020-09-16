<template>
	<div>
		<div class="feng_flow">
			<div class="flow_block">
				<div class="flow_item" v-for="(item, i1) in lists1" :key="i1" @click.stop="$emit('goBaby',item.id)">
					<img :src="iconURL + item.cover_img" style="width: 100%;max-height: 250px;"/>
					<div class="flow_item_con">
						<div class="item_desc">{{ item.desc }}</div>
						<div class="flow_item_title"><span class="price"><span style="font-size: 9px;">￥</span>{{ item.price }}</span> <span>{{ item.browse_num }}人看过</span></div>
						<div class="user_info" v-if="item.user_info">
							<img :src="item.user_info.avatar" />
							<span>{{item.user_info.nick}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="flow_block">
				<div class="flow_item" v-for="(item2, i2) in lists2" :key="i2" @click.stop="$emit('goBaby',item2.id)">
					<img :src="iconURL + item2.cover_img" style="width: 100%;max-height: 250px;"/>
					<div class="flow_item_con">
						<div class="item_desc">{{ item2.desc }}</div>
						<div class="flow_item_title"><span class="price"><span style="font-size: 9px;">￥</span>{{ item2.price }}</span> <span>{{ item2.browse_num }}人看过</span></div>
						<div class="user_info" v-if="item2.user_info">
							<img :src="item2.user_info.avatar" />
							<span>{{item2.user_info.nick}}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="feng_flow" style="display: none;">
			<div class="flow_block">
				<div class="flow_item" v-for="(data, da_i) in dataLists" :key="da_i">
					<img :src="iconURL + data.cover_img" @error="imgError" @load="imgLoad($event, da_i)" :id="da_i" style="width:100%;"/>
				</div>
			</div>
			<div class="flow_block"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'fengFlow',
	props: {
		dataLists: {
			default: []
		},
		iconURL: {
			type: String
		},
		isEmpty:{
			default:false
		}
	},
	data() {
		return {
			lists1: [],
			lists2: [],
			list1Height: 0,
			list2Height: 0,
			tmp_data: [],
			loaded: [], //图片加载成功数组
			loadErr: [], //图片加载失败数组
			showLoad: false
		};
	},
	methods: {
		//处理数据
		refresData() {
			this.hideLoadFlag();
			// console.log(this.loaded.length , this.loadErr.length , this.tmp_data.length)
			if (this.loaded.length + this.loadErr.length < this.tmp_data.length) return;
			const that = this;
			// console.log(2344,this.tmp_data);
			this.tmp_data.map((da, di) => {
				if (that.list1Height > that.list2Height) {
					that.list2Height += da.img_height;
					that.lists2.push(da);
				} else {
					that.list1Height += da.img_height;
					that.lists1.push(da);
				}
			});
		},
		//图片加载完成补齐数据
		imgLoad(e,index) {
			console.log(e,index)
			// console.log(e.path[0].width)
			this.loaded.push(index);
			//存储数据
			this.tmp_data[index]['img_width'] = e.path[0].width;
			let height = e.path[0].height;
			this.tmp_data[index]['img_height'] = height > 250 ? 250 : height;
		},
		//图片未加载成功触发
		imgError(e) {
			console.log(e);
			this.loadErr.push(e.target.id);
		},
		showLoadFlag() {
			if (!this.showLoad) {
				this.showLoad = true;
				// uni.showLoading({
				// 	title: 'loading...',
				// 	mask: 'none'
				// });
				console.log('loading...')
			}
		},
		hideLoadFlag() {
			if (this.showLoad) {
				// uni.hideLoading();
				this.showLoad = false;
			}
		}
	},
	mounted() {
		console.log('数据变了触发', this.dataLists);
		const that = this;
		that.tmp_data = that.dataLists;
		that.showLoadFlag();
	},
	watch: {
		dataLists() {
			console.log('数据变了触发', this.dataLists);
			this.loaded = [];
			this.loadErr = [];
			this.tmp_data = this.dataLists;
			
			this.showLoadFlag();
		},
		isEmpty(v){
			if(v){
				console.log(23)
				this.lists1=[]
				this.lists2=[]
				// this.loaded = [];
				// this.loadErr = [];
			}
		},

		loaded() {
			// console.log('加载标记变化');
			//最后一个加载完成负责刷新数据
			this.refresData();
		},
		loadErr() {
			//最后一个加载完成负责刷新数据
			this.refresData();
		}
	}
};
</script>

<style>
.feng_flow {
	display: flex;
	/* padding: 15px; */
	box-sizing: border-box;
}
.flow_block {
	display: flex;
	flex: 1;
	flex-direction: column;
}
.flow_item {
	width: 340px;
	/* margin: 15px; */
	margin: 8px;
	background: #f6f6f6;
	border-radius: 0px 0px 16px 16px;
	overflow: hidden;
}
.flow_item_con {
	padding: 20px 20px 16px;
}
.price{
	font-size: 30px;
	font-weight: 500;
	color: #FC8024;
}
.user_info{
	display: flex;
	font-size: 20px;
	font-weight: 400;
	color: #A4A4A4;
	align-items: center;
}
.user_info img{
	width: 38px;
	height: 38px;
	border-radius: 50%;
	margin-right: 10px;
}
.flow_item_title {
	position: relative;
	font-size: 32px;
	font-weight: 700;
	margin-bottom: 5px;
	display: flex;
	justify-content: space-between;
	font-size: 20px;
	font-weight: 400;
	color: #888888;
	margin: 20px 0;
	line-height: 1;
}
.flow_item_des {
	font-size: 24px;
}
.item_desc {
	/* width: 340px; */
	/* width: 300px; */
	font-size: 26px;
	font-weight: 400;
	overflow: hidden;
	color: #2a2a2a;
	text-overflow: -o-ellipsis-lastline;
	 word-break:break-all;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2; /*  超几行写几 */
	 line-clamp: 2;
	-webkit-box-orient: vertical; 
}
</style>
