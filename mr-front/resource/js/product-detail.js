"use strict";

var data = {
  id: '123',
  title: 'HUAWEI Mate 30 Pro 双4000万徕卡电影四摄',
  price: '99.00',
  img: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/c892a7640f58032489cbff8a948b50f9.jpg',
}

$('#info-img').attr('src', data.img)
$('#info-title').text(data.title)
$('#info-price').text(data.price)
if (data.content) {
  $('#details-content').text(data.content)
} else {
  $('#details-content').html('<div class="no-data">暂无商品详情~</div>')
}
$('#add-cart-btn').data('id',data.id)
// 加入购物车
$('#add-cart-btn').click(function () {
  var token = _ms.get('token') || ''
  // 未登录，跳转到登录页面
  if (!token) {
    window.location.href = 'login.html'
    return false
  }
  
  swal({
    icon: 'success',
    text: '成功加入购物车~',
    buttons: ['继续购物', '去购物车结算']
  }).then(res => {
    if (res) {
      window.location.href = 'cart.html'
    }
  })
})