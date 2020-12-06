"use strict";


// 初始化
init()

// 搜索
$('#search-btn').click(function () {
  var searchContent = $('#search-ipt').val().trim()
  window.location.href = `search.html?search=${searchContent}`
})

// 上一页
$('#prev').click(function () {
  var hasPage = !$(this).hasClass('disabled')
  if(hasPage) {
    page.curPage -= 1
    pageChange(page)
  }
})

// 下一页
$('#next').click(function () {
  var hasPage = !$(this).hasClass('disabled')
  if(hasPage) {
    page.curPage += 1
    pageChange(page)
  }
})


// 初始化
function init () {
  // 查询内容
  var c = window.location.search
    ? decodeURIComponent(window.location.search.split('=')[1])
    : ''
  $('#search-ipt').val(c)

  var params = {
    search: c,
    curPage: 1,
    pgaeSize: 10,
    total: 10
  }
  // 向服务端请求数据
  getData (params, function (res) {
    if (res.code === 200) {
      var dataList = res.data.dataList
      var page = {
        curPage: res.data.curPage,
        pgaeSize: res.data.pgaeSize,
        total: res.data.total,
      }
      pageChange(page)
      // 查找不到数据
      if (dataList.length === 0) {
        $('#product-list').html('<div style="text-align: center;">搜索不到任何商品~</div>')
        return false
      }

      dataList.forEach(item => {
        $('#product-list').append(render_product_html_template(item))
      })
    }
  })
  
  
}

// TODO: 请求数据
function getData (params, callback) {
  var res = {
    code: 200,
    data: {
      dataList: [
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
      ],
      curPage: 1,
      pgaeSize: 10,
      total: 10
    }
  }
  callback && callback(res)
}

// 分页参数变化
function pageChange(page) {
  /* 
  1.curPage不等于1时，可以点击上一页
  2.curPage * pageSize < total,可以点击下一页
  */
  if (page.curPage === 1) {
    $('#prev').addClass('disabled')
  } else {
    $('#prev').removeClass('disabled')
  }

  if (page.curPage * page.pageSize >= page.total) {
    $('#next').addClass('disabled')
  } else {
    $('#next').removeClass('disabled')
  }
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