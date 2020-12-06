"use strict";

var userInfo = {
	loginName: '德鲁叔叔',
	nickName: 'Esummer',
	phone: '12312312312',
	address: '广东省汕头市潮阳区',
	touxiang: './resource/images/avtor.png'
}
$('#info-container').append(render_html_template(userInfo))

// 渲染模板
function render_html_template(data) {
  return `
				<div class="item-warp">
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
						<span class="key">收获地址：</span>
						<span class="value" id="address">${data.address}</span>
					</div>
				</div>
				<img id="touxiang" src="${data.touxiang}" class="img-circle">
			`
}