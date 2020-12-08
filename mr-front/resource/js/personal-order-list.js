// 分页参数
var page = {
  currentPage: 1,
  pageSize: 10,
  totalPage: 1,
  total: 10,
}
// 加载数据
getData()

// 请求订单列表数据
function getData () {
  _orderApi.getOrderList(page, function (res) {
    if (res.code === 200) {

      // 订单模板渲染
      res.data.resultList.forEach(item => {
        $('#order-list').append(render_order_html_template(item))
      })

      // 分页
      page = {
        currentPage: res.data.currentPage,
        pageSize: res.data.pageSize,
        total: res.data.total,
        totalPage: res.data.totalPage,
      }
      pageChange(page)

    }
  })
}

// 渲染订单模板
function render_order_html_template (data) {
  var product_info = ``

  // 订单状态文本
  var orderStatusText = _orderApi.getOrderStatusText(data.orderStatus)
  // 商品列表渲染
  data.orderItemList.forEach(item => {
    product_info += `
      <div class="product_info">
        <img src="${item.productImg}"
          style="width: 100px;height: 100px;" alt="">
        <div>${item.productName}</div>
        <div>${item.productPrice}元 x ${item.productCount}</div>
      </div>
    `
  })
  // 订单按钮文本
  var orderBtnText = '查看详情'
  if (orderStatusText === '已提交') {
    orderBtnText = '去支付'
  }

  return `
    <li class="order-item">
      <div class="order-info">
        <div>
          <p><span>订单状态:</span>${orderStatusText}</p>
          <p><span>创建日期:</span>${data.createTime}</p>
        </div>
        <div>
          <p class="price"><span>应付金额:</span>${data.totalPrice}元</p>
          <a class="btn btn-default order-btn" href="personal-order.html?orderNo=${data.orderNo}">${orderBtnText}</a>
        </div>
      </div>
      <div class="order-items">
        ${product_info}
      </div>
    </li>
  `
}

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

// 分页参数变化
function pageChange(page) {
  /* 
  1.currentPage不等于1时，可以点击上一页
  2.currentPage * pageSize < total,可以点击下一页
  */

 // 当前页码
 $('#current-page').text(page.currentPage)
 // 总页码
 $('#total-page').text(page.totalPage)
 // 总数据
 $('#total').text(page.total)

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