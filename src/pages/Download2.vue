<!-- 加入班级，去下载 -->
<template>
    <div id="download">
        <p class="tips">快下载「轻听树下APP」，看看老师发了什么~</p>
		<div class="logo">
			<img class="img" src="../assets/images/logo_qtsx.png" />
			<div class="slogon">
				<p>轻听树下APP</p>
				<p>成为更好的家长</p>
			</div>
		</div>
		<button type="button" class="btn" @click="downloadTop">前往轻听树下APP</button>
    </div>
</template>
<script>
import schemes from '@/common/utils/schemes.js';
export default {
    components: {},
    data() {
        return {

        }; 
    },
    computed: {},
    watch: {}, 
    methods: {
        downloadTop() {
            var schemesObj = {
              pkgname: 'com.listeningtrees.webapp',
              appleId: '1503106436',
              app_qq: 'https://a.app.qq.com/o/simple.jsp?pkgname=',
              appleUrl: ' https://itunes.apple.com/cn/app/id'
            }
            var isschemes = new schemes('listeningtrees://', schemesObj)
            isschemes.init()
        }
    }, 
    created() {}, 
    mounted() {}, 
};

</script>
<style lang="less" >
    #download{
		.tips{
			font-size:28px;
			font-family:Source Han Sans CN;
			color:rgba(51,51,51,1);
			line-height:38px;
			padding: 76px 60px;
		}
		.logo{
			height: 144px;
			display: flex;
			align-items: center;
			padding: 0 60px;
			.img{
				display: block;
				width:144px;
				height:144px;
				margin-right: 32px;
			}
			.slogon{
				p:first-child{
					font-size:40px;
					font-family:PingFang SC;
					font-weight:bold;
					color:rgba(32,32,32,1);
					line-height:44px;
					padding-bottom: 24px;
				}
				p:last-child{
					font-size:28px;
					font-family:PingFang SC;
					color:rgba(136,136,136,1);
					line-height:32px;
				}
			}
		}
		.btn{
			display: block;
			margin: 236px auto 30px;
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
</style>