"use strict";

var token = _ms.get('token') || ''
if (token) {
  // 已登录，导航栏 top-nav 显示 订单、个人中心、购物车
  $('#order-nav-btn').css('display', 'inline-block')
  $('#personal-nav-btn').css('display', 'inline-block')
  $('#cart-nav-btn').css('display', 'inline-block')
} else {
  // 未登录，导航栏 top-nav 显示 登录 和 注册
  $('#login-nav-btn').css('display', 'inline-block')
  $('#register-nav-btn').css('display', 'inline-block')
  // 未登录，访问不了 购物车、个人中心、订单列表、订单详情，自动导航到 首页
  var hasLoginUrl = [
    'cart.html',
    'personal-center.html',
    'personal-order-list.html',
    'personal-order.html',
  ]
  for (var url of hasLoginUrl) {
    var curUrl = window.location.pathname;
    var res = curUrl.indexOf(url)
    if (res >= 0) { 
      window.location.href = 'index.html'
    }
  }
}