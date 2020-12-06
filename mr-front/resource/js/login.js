"use strict";

$(function($) {
  // 登录按钮操作
  $('#login-btn').click(function () {
    if (check()) {
      handleLoginSubmit()
    }
  });
  // 注册按钮操作
  $('#register-btn').click(function () {
    if (check() && checkTwicePassword()) {
      handleRegisterSubmit()
    }
  })
})


// 验证字段
function check () {
  var $ln = $('#loginname').val().trim();
  var $pw = $('#password').val().trim();

  // 1.账号或密码不能为空
  if (!$ln) {
    $('#err-tips').text('账号不能为空~').css('visibility', 'inherit')
    return false
  }
  if (!$pw) {
    $('#err-tips').text('密码不能为空~').css('visibility', 'inherit')
    return false
  }
  // 2.账号不能大于18位，密码长度不少于6位，不大于12位
  if ($ln && $ln.length > 18) {
    $('#err-tips').text('账号长度不大于18位~').css('visibility', 'inherit')
    return false
  }
  if ($pw && $pw.length < 6) {
    $('#err-tips').text('密码长度不少于6位~').css('visibility', 'inherit')
    return false
  }
  if ($pw && $pw.length > 12) {
    $('#err-tips').text('密码长度不大于12位~').css('visibility', 'inherit')
    return false
  }
  $('#err-tips').css('visibility', 'hidden')
  return true
}

// 验证两次密码是否一致
function checkTwicePassword () {
  var $pw = $('#password').val().trim();
  var $cpw = $('#confirm-password').val().trim();

  if ($pw !== $cpw) {
    $('#err-tips').text('两次密码不一致~').css('visibility', 'inherit')
    return false
  }
  $('#err-tips').css('visibility', 'hidden')
  return true
}

// 提交登录请求
function handleLoginSubmit () {
  var $ln = $('#loginname').val().trim();
  var $pw = $('#password').val().trim();
  console.log('$ln：', $ln);
  console.log('$pw：', $pw);
  // token 存储到本地
  _ms.set('token', $ln)
  // 跳转到首页
  window.location.href = 'index.html'
}

// 提交注册请求
function handleRegisterSubmit () {
  var $ln = $('#loginname').val().trim();
  var $pw = $('#password').val().trim();
  var $cpw = $('#confirm-password').val().trim();
  swal("注册成功~", {
    icon: 'success',
    buttons: ['取消', '去登录']
  }).then(res => {
    if (res) {
      console.log('$ln：', $ln);
      console.log('$pw：', $pw);
      console.log('$cpw：', $cpw);
      // 注册成功，跳转到登录页面
      window.location.href = 'login.html'
    }
  })
}

