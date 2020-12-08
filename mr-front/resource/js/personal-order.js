
// 获取url参数
var urlParams = _util.getUrlParams()
// 订单号
var orderNo = urlParams['orderNo']

if(orderNo) {
  _orderApi.getOrderInfo(orderNo, function (res) {
    if (res.code === 200) {
      var data = res.data

      // 订单编号
      $('#order_No').text(data.orderNo)

      // 商品列表
      data.orderItemList.forEach(item => {
        $('#product_list').append(`
          <div class="product_info">
            <img src="${item.productImg}"
              style="width: 100px;height: 100px;" alt="">
            <div>${item.productName}</div>
            <div>${item.productPrice}元 x ${item.productCount}</div>
          </div>
        `)
      })

      var orderStatus = data.orderStatus
      var order_title = '订单信息'
      var order_btn = ''
      var order_status = ''
      var order_text = ''
      if (orderStatus === 0) { // 未提交
        order_title = '填写并核对订单信息'
        order_btn = '提交订单'
        order_status = '未提交'
        order_text = '请尽快提交订单哦~'
        // 显示修改地址按钮
        $('#update_address_btn').show()
        // 显示确认订单按钮
        $('#order_btn').show()
      } else if (orderStatus === 1) { // 已提交
        order_btn = '去支付'
        order_status = '待支付'
        order_text = '请尽快完成支付哦~'
        // 显示确认订单按钮
        $('#order_btn').show()
      } else if (orderStatus === 2) { // 已支付
        order_btn = '取消订单'
        order_status = '已支付'
        order_text = '订单确认中~'
        // 显示确认订单按钮
        $('#order_btn').show()
      } else if (orderStatus === -1) { // 手动关闭
        order_status = '手动关闭'
        order_text = '交易已关闭~'
      } else if (orderStatus === -2) { // 商家关闭
        order_status = '商家关闭'
        order_text = '交易已关闭~'
      }

      // 标题
      $('#order_title').text(order_title)
      // 订单操作按钮
      $('#order_btn').text(order_btn)
      // 订单状态
      $('#order_status').text(order_status)
      // 订单文本
      $('#order_text').text(order_text)
      // 地址
      $('#address').text(data.userAddress)
      // 订单总价
      $('#total').text(data.totalPrice)
      
      // 修改地址按钮操作 TODO:
      $('#update_address_btn').click(function () {
        console.log('修改地址~~~')
      })

      var orderNo = data.orderNo
      // 订单按钮操作
      $('#order_btn').click(function () {
        if (orderStatus === 0) { // 未提交
          // FIXME:请求：提交订单
          _orderApi.SubmitOrder({orderNo}, function(res) {
            if (res.code === 200) {
              // 提交订单成功，刷新页面
              window.location.reload()
            }
          })
        } else if (orderStatus === 1) { // 已提交
          // FIXME:请求：去支付
          _payApi.pay({orderNo}, function(res) {
            if (res.code === 200) {
              var form_html = res.data
              // 显示支付页面
              $('body').html(form_html)
            }
          })
        } else if (orderStatus === 2) { // 已支付
          // FIXME:请求：取消订单
          _orderApi.cancelOrder({orderNo}, function(res) {
            if (res.code === 200) {
              // 提交订单成功，刷新页面
              window.location.reload()
            }
          })
        }
      })
    }
  })
}