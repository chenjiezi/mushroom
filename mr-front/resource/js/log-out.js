"use strict";

$(function($) {
  $('#log-out').click(function () {
    _ms.set('token', '')
    window.location.href = 'login.html'
  })
})