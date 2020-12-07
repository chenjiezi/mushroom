"use strict";


// 搜索内容
var UrlParams = _util.getUrlParams()
var page = {
  currentPage: 1,
  pageSize: 10,
  totalPage: 1,
  total: 10,
}

// 初始化
init()

// 初始化
function init () {
  // 查询商品名称，显示输入框里
  if (UrlParams['productName']) {
    $('#search-ipt').val(UrlParams['productName'])
  }
  
  // 向服务端请求数据
  getData()
}

// 搜索按钮操作
$('#search-btn').click(function () {
  var productName = $('#search-ipt').val().trim()
  window.location.href = `search.html?productName=${productName}`
})

// 上一页
$('#prev').click(function () {
  var hasPage = !$(this).hasClass('disabled')
  if(hasPage) {
    page.currentPage -= 1
    getData()
  }
})

// 下一页
$('#next').click(function () {
  var hasPage = !$(this).hasClass('disabled')
  if(hasPage) {
    page.currentPage += 1
    getData()
  }
})

// 加载数据
function getData () {
  var params = {
    categoryId: UrlParams['categoryId'],
    productName: UrlParams['productName'],
    ...page
  }
  _productApi.productSearch(params, function (res) {
    if (res.code === 200) {
      var dataList = res.data.resultList
      page = {
        currentPage: res.data.currentPage,
        pageSize: res.data.pageSize,
        total: res.data.total,
        totalPage: res.data.totalPage,
      }
      pageChange(page)
      // 重置容器
      $('#product-list').empty()
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

// 分页参数变化
function pageChange(page) {
  /* 
  1.currentPage不等于1时，可以点击上一页
  2.currentPage * pageSize < total,可以点击下一页
  */

 // 当前页码
 $('#current-page').html(page.currentPage)
 // 总页码
 $('#total-page').html(page.totalPage)
 // 总数据
 $('#total').html(page.total)

  if (page.currentPage === 1) {
    $('#prev').addClass('disabled')
  } else {
    $('#prev').removeClass('disabled')
  }

  if (page.currentPage * page.pageSize >= page.total) {
    $('#next').addClass('disabled')
  } else {
    $('#next').removeClass('disabled')
  }
}

// 渲染商品模板
function render_product_html_template (data) {
  return `
    <a target="_blank" href="product-detail.html?productId=${data.productId}" class="product-card-warp" id="${data.productId}">
      <div class="product-card">
        <img class="product-img" id="product-img" src="${data.productImg}" alt="">
        <p class="product-name" id="product-name" title="${data.productName}">${data.productName}</p>
        <p class="price"> <span id="product-price">${data.productPrice || '-'}</span> 元</p>
      </div>
    </a>
  `
}

