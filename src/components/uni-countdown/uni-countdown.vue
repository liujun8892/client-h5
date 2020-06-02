<template>
	<div class="uni-countdown">
		<span v-if="showDay" :style="{ borderColor: borderColor, color: color, fontSize: fontSize, backgroundColor: backgroundColor }" class="uni-countdown__number">{{ d }}</span>
		<span v-if="showDay" :style="{ color: splitorColor }" class="uni-countdown__splitor">天</span>
		<span :style="{ borderColor: borderColor, color: color, fontSize: fontSize, backgroundColor: backgroundColor }" class="uni-countdown__number">{{ h }}</span>
		<span :style="{ color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '时' }}</span>
		<span :style="{ borderColor: borderColor, color: color, fontSize: fontSize, backgroundColor: backgroundColor }" class="uni-countdown__number">{{ i }}</span>
		<span :style="{ color: splitorColor }" class="uni-countdown__splitor">{{ showColon ? ':' : '分' }}</span>
		<span :style="{ borderColor: borderColor, color: color, fontSize: fontSize, backgroundColor: backgroundColor }" class="uni-countdown__number">{{ s }}</span>
		<span v-if="!showColon" :style="{ color: splitorColor }" class="uni-countdown__splitor">秒</span>
	</div>
</template>
<script>
	export default {
		name: 'UniCountdown',
		props: {
			showDay: {
				type: Boolean,
				default: false
			},
			showColon: {
				type: Boolean,
				default: true
			},
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
			borderColor: {
				type: String,
				default: '#000000'
			},
			color: {
				type: String,
				default: '#e4393c'
			},
			fontSize: {
				type: String,
				default: '24rpx'
			},
			splitorColor: {
				type: String,
				default: '#e4393c'
			},
			day: {
				type: Number,
				default: 0
			},
			hour: {
				type: Number,
				default: 0
			},
			minute: {
				type: Number,
				default: 0
			},
			second: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				timer: null,
				syncFlag: false,
				d: '00',
				h: '00',
				i: '00',
				s: '00',
				leftTime: 0,
				seconds: 0
			}
		},
		watch: {
			day() {
				this.changeFlag()
			},
			hour() {
				this.changeFlag()
			},
			minute() {
				this.changeFlag()
			},
			second() {
				this.changeFlag()
			}
		},
		created: function() {
			this.startData();
		},
		beforeDestroy() {
			clearInterval(this.timer)
		},
		methods: {
			toSeconds(day, hours, minutes, seconds) {
				return day * 60 * 60 * 24 + hours * 60 * 60 + minutes * 60 + seconds
			},
			timeUp() {
				clearInterval(this.timer)
				this.$emit('timeup')
			},
			countDown() {
				let seconds = this.seconds
				let [day, hour, minute, second] = [0, 0, 0, 0]
				if (seconds > 0) {
					day = Math.floor(seconds / (60 * 60 * 24))
					hour = Math.floor(seconds / (60 * 60)) - (day * 24)
					minute = Math.floor(seconds / 60) - (day * 24 * 60) - (hour * 60)
					second = Math.floor(seconds) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
				} else {
					this.timeUp()
				}
				if (day < 10) {
					day = '0' + day
				}
				if (hour < 10) {
					hour = '0' + hour
				}
				if (minute < 10) {
					minute = '0' + minute
				}
				if (second < 10) {
					second = '0' + second
				}
				this.d = day
				this.h = hour
				this.i = minute
				this.s = second
			},
			startData() {
				clearInterval(this.timer)
				this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second)
				if (this.seconds <= 0) {
					return
				}
				this.countDown()
				this.timer = setInterval(() => {
					this.seconds--
					if (this.seconds < 0) {
						this.timeUp()
						return
					}
					this.countDown()
				}, 1000)
			},
			changeFlag() {
				if (!this.syncFlag) {
					this.seconds = this.toSeconds(this.day, this.hour, this.minute, this.second)
					this.startData();
					this.syncFlag = true;
				}
			}
		}
	}
</script>
<style lang="less">
	.uni-countdown {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		// padding: 2rpx 0;
	}

	.uni-countdown__splitor {
		display: flex;
		justify-content: center;
		// padding: 5rpx;
		font-size: 24px;
	}

	.uni-countdown__number {
		display: flex;
		justify-content: center;
		align-items: center;
		// width: $countdown-width;
		// height: $countdown-height;
		// line-height: $countdown-height;
		margin: 0 5px;
		text-align: center;
		font-size: 24px;
	}
</style>
