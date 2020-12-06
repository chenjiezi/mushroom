"use strict";

// 搜索
$('#search-btn').click(function () {
  var searchContent = $('#search-ipt').val().trim()
  window.location.href = `search.html?search=${searchContent}`
})



// 请求数据 TODO: 请求数据
loadData()

function loadData () {
  // 查询内容
  var c = window.location.search.split('=')[1]
  $('#search-ipt').val(decodeURIComponent(c))
  var dataList = [
    {
      id: 1,
      img: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/ef4c68fed730ec26bf2fa0ff620975c5.jpg',
      title: '小米有线耳机（K歌版） 白色',
      price: 149
    }, {
      id: 1,
      img: 'https://cdn.cnbj1.fds.api.mi-img.com/mi-mall/ef4c68fed730ec26bf2fa0ff620975c5.jpg',
      title: '小米有线耳机（K歌版） 白色',
      price: 149
    }
  ]
  if (dataList.length === 0) {
    $('#product-list').html('<div style="text-align: center;">搜索不到任何商品~</div>')
    return false
  }
  dataList.forEach(item => {
    $('#product-list').append(render_product_html_template(item))
  })
}

// 渲染商品模板
function render_product_html_template (data) {
  return `
  <div class="product-card-warp" id="${data.id}">
    <div class="product-card">
      <img id="product-img" src="${data.img}" alt="">
      <p class="product-name" id="product-name">${data.title}</p>
      <p class="price"> <span id="product-price">${data.price}</span> 元</p>
    </div>
  </div>
  `
}