<!-- 加入班级 -->
<template>
    <div id="joinClass">
        <div class="name">{{name}}</div>
        <div class="classNo">
            <span class="left">邀请您加入：</span>
            <span class="right">班级号：{{class_number}}</span>
        </div>
        <div class="line"></div>
        <div class="className">{{class_name}}</div>
        <div class="whiteBg">
            <div class="txt">和我一同关注孩子们的成长点滴吧</div>
            <button type="button" class="btn" @click="join">加入班级</button>
        </div>
    </div>
</template>
<script>
import { GetQueryString } from '@/common/utils/mixin.js';
export default {
    components: {},
    data() {
        return {
			class_name:'',
			class_number:'',
			name:'',
			class_id:''
        }; 
    },
    computed: {},
    watch: {}, 
    methods: {
        join(){
			this.$api.addLessClassH5({ code: this.$route.query.recode }).then(res=>{
				console.log(res);
				if(res.code==200){
					this.$router.replace({path: "/h5/download2"});
				}else{
					this.$toast(res.msg);
				}
			});
		}
    }, 
    created() {
		if (this.$store.state.UserInfo.code && this.$store.state.UserInfo.token) {
            this.$api
                .wxH5register({ code: this.$store.state.UserInfo.code })
                .then(res => {
                    console.log(res);
                    if (res.code == 200) {
                        this.$store.dispatch("saveToken", res.data.token);
						
						this.class_id=this.$route.query.class_id;
						this.class_name=this.$route.query.class_name;
						this.class_number=this.$route.query.class_number;
						this.name=this.$route.query.name;
                    }
                });
        }
	}, 
    mounted() {}, 
};

</script>
<style lang="less" >
    #joinClass{
        background: url(../assets/images/joinBg.png) top left no-repeat;
		background-size: 100% auto;
		padding-top: 100px;
		.name{
			padding: 10px 50px;
			font-size:46px;
			line-height: 66px;
			font-family:Source Han Sans CN;
			color:rgba(255,255,255,1);
		}
		.classNo{
			height: 60px;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 50px;
			.left{
				font-size:50px;
				font-family:Source Han Sans CN;
				color:rgba(255,255,255,1);
				line-height: 60px;
			}
			.right{
				display: inline-block;
				height:60px;
				padding: 0 20px;
				background:rgba(255,255,255,1);
				border-radius:10px;
				font-size:26px;
				font-family:Source Han Sans CN;
				color:rgba(36,198,150,1);
				line-height: 60px;
			}
		}
		.line{
			margin: 30px 50px;
			width:38px;
			height:5px;
			background:rgba(255,255,255,1);
		}
		.className{
			padding: 0 50px 44px;
			font-size:56px;
			font-family:Source Han Sans CN;
			color:rgba(255,255,255,1);
			line-height: 76px;
		}
		.whiteBg{
			box-sizing: border-box;
			width:666px;
			height:628px;
			background:rgba(255,255,255,1);
			box-shadow:0px 4px 30px 0px rgba(0, 0, 0, 0.3);
			border-radius:15px;
			margin: 0 auto;
			padding: 146px 63px 30px;
			.txt{
				font-size:36px;
				font-family:Source Han Sans CN;
				color:rgba(61,61,61,1);
				line-height: 152px;
				text-align: center;
				border-top: 3px solid rgba(238,238,238,1);
				border-bottom: 3px solid rgba(238,238,238,1);
				margin-bottom: 90px;
			}
			.btn{
				display: block;
				margin: 0 auto;
				width:486px;
				height:88px;
				background:rgba(64,213,134,1);
				border-radius:44px;
				font-size:36px;
				font-family:Source Han Sans CN;
				font-weight:500;
				color:rgba(255,255,255,1);
				border: none;
			}
		}
    }
</style>