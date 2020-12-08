"use strict";

// 存放用户信息
var userInfo = {}

// 请求用户信息
_userApi.getUserInfo(function (res) {
	if (res.code === 200) {
		userInfo = res.data

		// 显示修改按钮
		$('#show_user_info_modal').show()
		// 渲染用户信息模板
		$('#info-container').append(render_html_template(userInfo))
	}
})

// 修改用户信息操作
$('#update_user_info_btn').click(function () {
	// TODO:
})

// 显示修改用户弹窗
$('#show_user_info_modal').click(function () {
	$('#nick-name-ipt').val(userInfo.nickName)
	$('#phone-ipt').val(userInfo.phone)
	$('#address-ipt').val(userInfo.address)
	$('#myModal').modal('show')
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
						<span class="value" id="phone">${data.phone}</span>
					</div>
					<div class="item">
						<span class="key">收货地址：</span>
						<span class="value" id="address">${data.address}</span>
					</div>
				</div>
				<img id="touxiang" src="${data.avatar}" class="img-circle">
			`
}