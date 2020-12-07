"use strict";

/**
 * 加载数据
 */
_cartApi.getCartList(function (res) {
  if (res.code === 200) {
    var dataList = res.data

    // 无数据渲染
    if (!dataList || dataList.length === 0) {
      $('#product-list').append(render_no_data_html_template())
      return false
    }

    // 数据渲染
    dataList.forEach(function (item) {
      $('#product-list').append(render_html_template(item))
    })

    /**
     * 监听事件
     */
    // "+"按钮
    $('.increase').each(function () {
      $(this).click(increase_count)
    })
    // "-"按钮
    $('.reduce').each(function () {
      $(this).click(reduce_count)
    })
    // 单选框
    $('input[name="single-check"]').each(function () {
      $(this).click(single_check)
    })
    // 多选框
    $('input[name="all-check"]').each(function () {
      $(this).click(all_check)
    })
    // "下单支付"按钮
    $('#buy').click(order_payment)
    // "删除"按钮
    $('.del-btn').each(function () {
      $(this).click(del_data)
    })
    // "删除选中"按钮 FIXME: 不支持多删
    // $('#select-del-btn').click(select_del_btn)

  } else {
    $('#product-list').append(render_no_data_html_template())
  }
}, function () {
  $('#product-list').append(render_no_data_html_template())
})


// 下单支付
function order_payment() {
  swal("是否下单支付?", {
    buttons: ['取消', '下单支付']
  }).then(isPay => {
    if (isPay) {
      var cartIds = []
      $('.product-item').each(function () {
        var isChecked = $(this).find('input[name="single-check"]').prop('checked')
        if (isChecked) {
          var cartId = $(this).attr('id')
          cartIds.push(cartId)
        }
      })
      if (cartIds.length === 0) {
        swal({
          text: '请勾选要下单支付的商品~',
          icon: 'warning'
        })
      } else {
        // TODO:
        console.log('cartIds：', cartIds)
      }
    }
  })
}

// 删除单条数据
function del_data() {
  swal("是否删除?", {
    dangerMode: true,
    buttons: ['取消', '删除']
  }).then(isDel => {
    if (isDel) {
      var cartId = get_id(this)
      _cartApi.deleteCartByCartId(cartId, function (res) {
        if (res.code === 200) {
          // 删除成功，刷新页面
          window.location.reload()
        }
      })
    }
  })
}

// 删除选中数据
function select_del_btn() {
  swal("是否删除选中?", {
    dangerMode: true,
    buttons: ['取消', '删除']
  }).then(isDel => {
    if (isDel) {
      var idArr = []
      $('.product-item').each(function () {
        var isChecked = $(this).find('input[name="single-check"]').prop('checked')
        if (isChecked) {
          var id = $(this).attr('id')
          idArr.push(id)
        }
      })
      if (idArr.length === 0) {
        swal({
          text: '请勾选要删除的商品~',
          icon: 'warning'
        })
      } else {
        console.log('idArr：', idArr)
      }
    }
  })
}

// 单品总价计算
function single_product_total(that) {
  var count = +$(that).parents('.product-item').find('.product-count').text()
  var price = +$(that).parents('.product-item').find('.product-price').text()
  var single_total = $(that).parents('.product-item').find('.single-product-total')
  $(single_total).text(count * price)
}
// 全部合计计算
function all_product_total() {
  var total = 0
  $('.product-item').each(function () {
    var isChecked = $(this).find('input[name="single-check"]').prop('checked')
    if (isChecked) {
      total += +$(this).find('.single-product-total').text()
    }
  })
  $('#total').text(total)
}
// 新增商品数量
function increase_count() {
  var that = this
  var ipt = $(this).parents('.product-item').find('.product-count')
  var count = +$(ipt).text()
  $(ipt).text(count + 1)
  // 请求更新购物项数量
  _cartApi.cartUpdateCount({
    cartId: get_id(that),
    productCount: count + 1
  }, function (res) {
    if (res.code === 200) {
      single_product_total(that)
      all_product_total()
    }
  })
  
}
// 减少商品数量
function reduce_count() {
  var that = this
  var ipt = $(this).parents('.product-item').find('.product-count')
  var count = +$(ipt).text()
  if (count > 1) {
    $(ipt).text(count - 1)
    // 请求更新购物项数量
    _cartApi.cartUpdateCount({
      cartId: get_id(that),
      productCount: count - 1
    }, function (res) {
      if (res.code === 200) {
        single_product_total(that)
        all_product_total()
      }
    })
  }
}
// 单选/单取消
function single_check() {
  if (this.checked) {
    var isAll = true
    $('input[name="single-check"]').each(function () {
      if (!$(this).prop('checked')) {
        isAll = false
      }
    })
    if (isAll) {
      $('input[name="all-check"]').each(function () {
        $(this).prop('checked', true)
      })
    }
  } else {
    $('input[name="all-check"]').each(function () {
      $(this).prop('checked', false)
    })
  }
  all_product_total()
}
// 全选/全取消
function all_check() {
  if (this.checked) {
    $('input[name="all-check"]').each(function () {
      $(this).prop('checked', true)
    })
    $('input[name="single-check"]').each(function () {
      $(this).prop('checked', true)
    })
  } else {
    $('input[name="all-check"]').each(function () {
      $(this).prop('checked', false)
    })
    $('input[name="single-check"]').each(function () {
      $(this).prop('checked', false)
    })
  }
  all_product_total()
}
// 获取Id
function get_id(that) {
  return $(that).parents('.product-item').attr('id')
}
// 渲染数据模板
function render_html_template(data) {
  return `
      <div class="product-item" id="${data.cartId}">
        <div class="row">
          <div class="col-xs-1">
            <input type="checkbox" name="single-check">
          </div>
          <div class="col-xs-3 product-name">
            ${data.productVo.productName}
          </div>
          <div class="col-xs-2">
            <img src="${data.productVo.productImg}" class="product-img">
          </div>
          <div class="col-xs-1 product-price">
            ${data.productVo.productPrice}
          </div>
          <div class="col-xs-2">
            <button class="btn btn-default reduce">-</button>
            <button class="btn btn-default product-count active">${data.productCount}</button>
            <button class="btn btn-default increase">+</button>
          </div>
          <div class="col-xs-1 single-product-total">
            ${data.productVo.productPrice * data.productCount}
          </div>
          <div class="col-xs-2 del-btn">
            删除
          </div>
        </div>
      </div>
			`
}
// 渲染无数据模板
function render_no_data_html_template () {
  return `
    <div class="product-item no-data">
      <div class="row">
        <div class="col-xs-12">
          <div class="tips">您的购物车还是空的，赶快去挑选商品吧！</div>
          <div>去 <a href="index.html">商城首页</a> 看看吧</div>
        </div>
      </div>
    </div>
  `
}