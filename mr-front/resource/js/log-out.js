"use strict";

$(function($) {
  $('#log-out').click(function () {
    swal("是否退出登录?", {
      dangerMode: true,
      buttons: ['取消', '确定']
    }).then(isLogout => {
      if (isLogout) {

        // 请求： 退出登录
        _userApi.logout(function (res) {
          if (res.code === 200) {
            _ms.set('token', '')
            window.location.href = 'login.html'
          } else {
            swal(res.message, {
              icon: 'error'
            })
          }
        })

      }
    })
    
  })
})