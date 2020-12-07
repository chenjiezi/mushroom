"use strict";

var _util = {
  // 获取url参数
  getUrlParams: function () {
    // url参数字符串
    var urlSearch = decodeURIComponent(window.location.search)

    // 无数据返回空数据
    if (!urlSearch) return {};
    
    var urlParams = urlSearch.split('?')[1]
    var paramObj = urlParams.split('&')
    var params = {}

    for (var item of paramObj) {
      var itemArr = item.split('=')
      params[itemArr[0]] = itemArr[1] ? itemArr[1] : ''
    }

    return params
  }
}