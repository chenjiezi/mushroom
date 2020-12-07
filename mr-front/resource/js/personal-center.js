"use strict";

// 请求用户信息
_userApi.getUserInfo(function (res) {
	if (res.code === 200) {
		var userInfo = res.data
		$('#info-container').append(render_html_template(userInfo))
	}
})

// 渲染模板
function render_html_template(data) {
  return `
				<div class="item-warp" ${data.userId}>
					<div class="item">
						<span class="key">昵称：</span>
						<span class="value" id="nick-name">${data.loginName}</span>
					</div>
					<div class="item">
						<span class="key">账号：</span>
						<span class="value" id="login-name">${data.nickName}</span>
					</div>
					<div class="item">
						<span class="key">手机：</span>
						<span class="value" id="phone">${data.loginName}</span>
					</div>
					<div class="item">
						<span class="key">收货地址：</span>
						<span class="value" id="address">${data.address}</span>
					</div>
				</div>
				<img id="touxiang" src="${data.avatar}" class="img-circle">
			`
}