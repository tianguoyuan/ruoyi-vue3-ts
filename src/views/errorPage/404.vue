<script lang="ts" setup>
const message = 'The webmaster said that you can not enter this page...'
</script>

<template>
	<div class="wscn-http404-container">
		<div class="wscn-http404">
			<div class="pic-404">
				<img
					class="pic-404__parent"
					src="@/assets/images/404_images/404.png"
					alt="404"
				/>
				<img
					class="pic-404__child left"
					src="@/assets/images/404_images/404_cloud.png"
					alt="404"
				/>
				<img
					class="pic-404__child mid"
					src="@/assets/images/404_images/404_cloud.png"
					alt="404"
				/>
				<img
					class="pic-404__child right"
					src="@/assets/images/404_images/404_cloud.png"
					alt="404"
				/>
			</div>
			<div class="bullshit">
				<div class="bullshit__oops">OOPS!</div>
				<div class="bullshit__info">
					All rights reserved
					<a
						style="color: #20a0ff"
						href="https://wallstreetcn.com"
						target="_blank"
						>wallstreetcn</a
					>
				</div>
				<div class="bullshit__headline">{{ message }}</div>
				<div class="bullshit__info">
					Please check that the URL you entered is correct, or click the button below to return to the homepage.
				</div>
				<RouterLink
					to="/"
					class="bullshit__return-home"
				>
					Back to home
				</RouterLink>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.wscn-http404-container {
	position: absolute;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
}
.wscn-http404 {
	position: relative;
	width: 1200px;
	padding: 0 50px;
	overflow: hidden;
	.pic-404 {
		position: relative;
		float: left;
		width: 600px;
		overflow: hidden;
		&__parent {
			width: 100%;
		}
		&__child {
			position: absolute;
			&.left {
				top: 17px;
				left: 220px;
				width: 80px;
				opacity: 0;
				animation-name: cloudLeft;
				animation-duration: 2s;
				animation-timing-function: linear;
				animation-delay: 1s;
				animation-fill-mode: forwards;
			}
			&.mid {
				top: 10px;
				left: 420px;
				width: 46px;
				opacity: 0;
				animation-name: cloudMid;
				animation-duration: 2s;
				animation-timing-function: linear;
				animation-delay: 1.2s;
				animation-fill-mode: forwards;
			}
			&.right {
				top: 100px;
				left: 500px;
				width: 62px;
				opacity: 0;
				animation-name: cloudRight;
				animation-duration: 2s;
				animation-timing-function: linear;
				animation-delay: 1s;
				animation-fill-mode: forwards;
			}

			@keyframes cloudLeft {
				0% {
					top: 17px;
					left: 220px;
					opacity: 0;
				}
				20% {
					top: 33px;
					left: 188px;
					opacity: 1;
				}
				80% {
					top: 81px;
					left: 92px;
					opacity: 1;
				}
				100% {
					top: 97px;
					left: 60px;
					opacity: 0;
				}
			}

			@keyframes cloudMid {
				0% {
					top: 10px;
					left: 420px;
					opacity: 0;
				}
				20% {
					top: 40px;
					left: 360px;
					opacity: 1;
				}
				70% {
					top: 130px;
					left: 180px;
					opacity: 1;
				}
				100% {
					top: 160px;
					left: 120px;
					opacity: 0;
				}
			}

			@keyframes cloudRight {
				0% {
					top: 100px;
					left: 500px;
					opacity: 0;
				}
				20% {
					top: 120px;
					left: 460px;
					opacity: 1;
				}
				80% {
					top: 180px;
					left: 340px;
					opacity: 1;
				}
				100% {
					top: 200px;
					left: 300px;
					opacity: 0;
				}
			}
		}
	}
	.bullshit {
		position: relative;
		float: left;
		width: 300px;
		padding: 30px 0;
		overflow: hidden;
		&__oops {
			margin-bottom: 20px;
			font-size: 32px;
			font-weight: bold;
			line-height: 40px;
			color: #1482f0;
			opacity: 0;
			animation-name: slideUp;
			animation-duration: 0.5s;
			animation-fill-mode: forwards;
		}
		&__headline {
			margin-bottom: 10px;
			font-size: 20px;
			font-weight: bold;
			line-height: 24px;
			color: #222222;
			opacity: 0;
			animation-name: slideUp;
			animation-duration: 0.5s;
			animation-delay: 0.1s;
			animation-fill-mode: forwards;
		}
		&__info {
			margin-bottom: 30px;
			font-size: 13px;
			line-height: 21px;
			color: grey;
			opacity: 0;
			animation-name: slideUp;
			animation-duration: 0.5s;
			animation-delay: 0.2s;
			animation-fill-mode: forwards;
		}
		&__return-home {
			display: block;
			float: left;
			width: 110px;
			height: 36px;
			font-size: 14px;
			line-height: 36px;
			color: #ffffff;
			text-align: center;
			cursor: pointer;
			background: #1482f0;
			border-radius: 100px;
			opacity: 0;
			animation-name: slideUp;
			animation-duration: 0.5s;
			animation-delay: 0.3s;
			animation-fill-mode: forwards;
		}

		@keyframes slideUp {
			0% {
				opacity: 0;
				transform: translateY(60px);
			}
			100% {
				opacity: 1;
				transform: translateY(0);
			}
		}
	}
}
</style>
