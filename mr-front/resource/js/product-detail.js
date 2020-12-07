"use strict";

// url参数
var urlParams = _util.getUrlParams()

_productApi.getProductInfo(urlParams['productId'], function(res) {
  if (res.code === 200) {
    var data = res.data
    
    // 数据渲染
    $('#info-img').attr('src', data.productImg)
    $('#info-title').text(data.productName)
    $('#info-price').text(data.productPrice)
    $('#add-cart-btn').data('productId',data.productId)

    //  商品详情
    if (data.productDetail) {
      $('#details-content').text(data.productDetail)
    } else {
      $('#details-content').html('<div class="no-data">暂无商品详情~</div>')
    }


    // "加入购物车"按钮操作
    $('#add-cart-btn').click(function () {
      var token = _ms.get('token') || ''

      // 未登录，跳转到登录页面
      if (!token) {
        window.location.href = 'login.html'
        return false
      }

      // 商品ID
      var productId = $('#add-cart-btn').data('productId')

      // 请求商品添加购物车
      _cartApi.cartSave({productId}, function (res) {
        if (res.code === 200) {
          swal({
            icon: 'success',
            text: '成功加入购物车~',
            buttons: ['继续购物', '去购物车结算']
          }).then(res => {
            if (res) {
              window.location.href = 'cart.html'
            }
          })
        }
      })
    })
  }
})