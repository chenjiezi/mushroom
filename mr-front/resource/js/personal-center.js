"use strict";

// 存放用户信息
var userInfo = {}
var isUpdateUserInfo = false

// 请求用户信息
_userApi.getUserInfo(function (res) {
	if (res.code === 200) {
		userInfo = res.data

		// 显示修改用户信息按钮
		$('#show_user_info_modal').show()
		// 显示修改密码按钮
		$('#show_password_modal').show()
		// 渲染用户信息模板
		$('#info-container').append(render_html_template(userInfo))
	}
})

//  TODO:
$('#update_btn').click(function () {
	 // 修改用户信息操作
	if (isUpdateUserInfo) {
		var nickName = $('#nick-name-ipt').val().trim()
		var userPhone = $('#phone-ipt').val().trim()
		var address = $('#address-ipt').val().trim()

		if (!nickName || !userPhone || !address) {
			swal({ icon: 'warning', text: '不能为空~'})
			return false
		}

		var params = {
			nickName,
			userPhone,
			address
		}

		// 请求： 修改用户信息
		_userApi.updateUserInfo(params, function (res) {
			if (res.code === 200) {
				// window.location.reload()
			}
		})

	} else {
		// 修改密码操作
		
		var password = $('#password-ipt').val().trim()
		var againPassword = $('#again-password-ipt').val().trim()

		if (!password || !againPassword) {
			swal({ icon: 'warning', text: '不能为空~'})
			return false
		}

		if (password.length < 6) {
			swal({ icon: 'warning', text: '密码不得少于6位~'})
			return false
		}

		if (password !== againPassword) {
			swal({ icon: 'warning', text: '两次密码不一致~'})
			return false
		}
		

		// 请求： 修改密码
		_userApi.updateUserPassword(password, function (res) {
			if (res.code === 200) {
				// window.location.reload()
			}
		})

	}
	
})

// 显示修改用户弹窗
$('#show_user_info_modal').click(function () {
	isUpdateUserInfo = true
	$('#user-info-content-modal').show()
	$('#password-content-modal').hide()
	$('#myModalLabel').text('用户信息修改')

	$('#nick-name-ipt').val(userInfo.nickName)
	$('#phone-ipt').val(userInfo.userPhone)
	$('#address-ipt').val(userInfo.address)

	$('#myModal').modal('show')
})

// 显示修改密码弹窗
	$('#show_password_modal').click(function () {
		isUpdateUserInfo = false
		$('#user-info-content-modal').hide()
		$('#password-content-modal').show()
		$('#myModalLabel').text('密码修改')

		$('#password-ipt').val('')
		$('#again-password-ipt').val('')

		$('#myModal').modal('show')
	})


// 渲染模板
function render_html_template(data) {
  return `
				<div class="item-warp" ${data.userId}>
					<div class="item">
						<span class="key">昵称：</span>
						<span class="value" id="nick-name">${data.nickName}</span>
					</div>
					<div class="item">
						<span class="key">账号：</span>
						<span class="value" id="login-name">${data.loginName}</span>
					</div>
					<div class="item">
						<span class="key">手机：</span>
						<span class="value" id="phone">${data.userPhone}</span>
					</div>
					<div class="item">
						<span class="key">收货地址：</span>
						<span class="value" id="address">${data.address || '-'}</span>
					</div>
				</div>
				<img id="touxiang" src="${data.avatar}" class="img-circle">
			`
}