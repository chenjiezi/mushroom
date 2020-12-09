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
    if (check() && checkTwicePassword() && checkRegister()) {
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

// 注册字段验证
function checkRegister () {
  var $nk = $('#nickname').val().trim();
  var $up = $('#userphone').val().trim();

  // 1.昵称或手机不能为空
  if (!$nk) {
    $('#err-tips').text('昵称不能为空~').css('visibility', 'inherit')
    return false
  }
  if (!$up) {
    $('#err-tips').text('手机号码不能为空~').css('visibility', 'inherit')
    return false
  }
  // 2.手机号码长度为11位
  if ($up && $up.length !== 11) {
    $('#err-tips').text('手机号码长度为11位~').css('visibility', 'inherit')
    return false
  }

  $('#err-tips').css('visibility', 'hidden')
  return true
}

// 提交登录请求
function handleLoginSubmit () {
  var loginName = $('#loginname').val().trim();
  var password = $('#password').val().trim();

  _userApi.login({loginName, password}, function (res) {
    if (res.code === 200) {
      // 登录成功

      // token 存储到本地
      _ms.set('token', res.data)
      // 登录成功,自动跳转到首页
      window.location.href = 'index.html'

    } else {
      // 登录失败
      swal(res.message, {
        icon: 'error'
      })
    }
  })
}

// 提交注册请求
function handleRegisterSubmit () {
  var loginName = $('#loginname').val().trim();
  var password = $('#password').val().trim();
  var nickName = $('#nickname').val().trim();
  var userPhone = $('#userphone').val().trim();

  var data = {
    loginName: loginName,
    password: password,
    nickName: nickName,
    userPhone: userPhone,
  }

  _userApi.registerUser(data, function (res) {
    if (res.code === 200) {
      // 注册成功
      swal(res.message, {
        icon: 'success',
        buttons: ['取消', '去登录']
      }).then(res => {
        if (res) {
          // 注册成功，跳转到登录页面
          window.location.href = 'login.html'
        }
      })

    } else {
      // 注册失败
      swal(res.message, {
        icon: 'error'
      })
    }
  })

}

