<script lang="ts" setup name="Page401">
import errGif from '@/assets/images/401_images/401.gif'

const router = useRouter()
const route = useRoute()
const errImg = errGif + '?' + +new Date()
function back() {
	if (route.query.noGoBack) {
		router.push({ path: '/' })
	} else {
		router.go(-1)
	}
}
</script>

<template>
	<div class="errPage-container">
		<ElButton
			class="pan-back-btn"
			icon="ArrowLeft"
			type="primary"
			@click="back"
		>
			返回
		</ElButton>
		<ElRow>
			<ElCol :span="12">
				<h1 class="text-jumbo text-ginormous">Oops!</h1>

				<h2>你没有权限去该页面</h2>
				<ul class="list-unstyled">
					<li class="link-type">
						<RouterLink to="/"> 回首页 </RouterLink>
					</li>
				</ul>
			</ElCol>
			<ElCol :span="12">
				<img
					alt="Girl has dropped her ice cream."
					height="428"
					:src="errImg"
					width="313"
				/>
			</ElCol>
		</ElRow>
	</div>
</template>

<style lang="scss" scoped>
.errPage-container {
	width: 800px;
	max-width: 100%;
	margin: 100px auto;
	.pan-back-btn {
		color: #ffffff;
		background: #008489;
		border: none !important;
	}
	.pan-gif {
		display: block;
		margin: 0 auto;
	}
	.pan-img {
		display: block;
		width: 100%;
		margin: 0 auto;
	}
	.text-jumbo {
		font-size: 60px;
		font-weight: 700;
		color: #484848;
	}
	.list-unstyled {
		font-size: 14px;
		li {
			padding-bottom: 5px;
		}
		a {
			color: #008489;
			text-decoration: none;
			&:hover {
				text-decoration: underline;
			}
		}
	}
}
</style>
