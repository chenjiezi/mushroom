// 服务端api地址
var baseUrl = 'http://10.65.41.1:9091'

/**
 * 用户接口
 */
var _userApi = {
  // 用户信息
  getUserInfo: function (resolve, reject) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      url: baseUrl + '/getInfo',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 会员登录
  login: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/login',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 会员退出登录
  logout: function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: baseUrl + '/logout',
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 注册会员用户
  registerUser: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/user/register',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 更新用户个人信息
  updateUserInfo: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/user/updateInfo',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 用户修改登录密码
  updateUserPassword: function (password, resolve, reject) {
    $.ajax({
      type: 'PUT',
      url: baseUrl + '/user/checkPass',
      data: `password=${password}`,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
}

/**
 * 支付接口
 */
var _payApi = {
  // 去支付
  pay: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/pay',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
}

/**
 * 购物车接口
 */ 
var _cartApi = {
  // 获取当前登录用户的购物车列表
  getCartList: function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: baseUrl + '/cart/list',
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 更新购物项数量
  cartUpdateCount: function (params, resolve, reject) {
    $.ajax({
      type: 'PUT',
      url: baseUrl + '/cart/updateCount',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 将商品添加购物车
  cartSave: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/cart/save',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 删除当前登录用户的购物车项
  deleteCartByCartId: function (cartId, resolve, reject) {
    $.ajax({
      type: 'DELETE',
      url: baseUrl + '/cart/delete/' + cartId,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  }
}

/**
 * 商品接口
 */
var _productApi = {
  // 首页分类栏数据
  getCategoryList: function (resolve, reject) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      url: baseUrl + '/category/list',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },

  // 首页轮播图数据
  getCarouselList: function (resolve, reject) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      url: baseUrl + '/carousel/list',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  
  // 查询商品列表
  productSearch: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/product/search',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },

  // 查询最新商品
  getNewProduct: function (count, resolve, reject) {
    $.ajax({
      type: 'get',
      url: baseUrl + '/product/new/' + count,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },

  // 首页下分类商品内容的显示
  getHomeCategory: function (count, resolve, reject)  {
    $.ajax({
      type: 'get',
      url: baseUrl + '/product/homeCategory/' + count,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },

  // 根据商品id获取商品详情
  getProductInfo: function (productId, resolve, reject) {
    $.ajax({
      type: 'get',
      url: baseUrl + '/product/info/' + productId,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  }
}

/**
 * 订单接口
 */
var _orderApi = {
  // 获取订单状态
  getOrderStatusText: function (orderStatus) {
    var orderStatusText = {
      '0': '未提交',
      '1': '已提交',
      '2': '已支付',
      '-1': '手动关闭',
      '-2': '商家关闭'
    }
    return orderStatusText[`${orderStatus}`]
  },
  // 购物车添加到订单，返回OrderNo(订单号)
  addOrder: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/order/addOrder',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 提交订单
  SubmitOrder: function (params, resolve, reject) {
    $.ajax({
      type: 'PUT',
      url: baseUrl + '/order/submit',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 获取当前登录用户的订单列表
  getOrderList: function (params, resolve, reject) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/order/list',
      data: JSON.stringify(params),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 根据orderNo(订单号)查询到订单详情
  getOrderInfo: function (orderNo, resolve, reject) {
    $.ajax({
      type: 'GET',
      url: baseUrl + '/order/info/' + orderNo,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 取消当前用户的订单
  cancelOrder: function (orderNo, resolve, reject) {
    $.ajax({
      type: 'PUT',
      url: baseUrl + '/order/cancel/' + orderNo,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  },
  // 删除当前登录用户的订单
  deleteOrder: function (orderNo, resolve, reject) {
    $.ajax({
      type: 'DELETE',
      url: baseUrl + '/order/delete/' + orderNo,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        resolve && resolve(res)
      },
      error: function (err) {
        reject && reject(err)
      }
    })
  }
}