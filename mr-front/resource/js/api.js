// 服务端api地址
var baseUrl = 'http://10.65.41.1:9091'
// token（登录令牌）
var token = _ms.get('token') || ''
// get post put delete 请求封装
var _http = {}


/**
 * 用户接口
 */
var _userApi = {
  // 用户信息
  getUserInfo: function (resolve, reject) {
    _http.get({ url: '/getInfo' }, resolve, reject)
  },

  // 会员登录
  login: function (data, resolve, reject) {
    _http.post({ url: '/login', data }, resolve, reject)
  },

  // 会员退出登录
  logout: function (resolve, reject) {
    _http.get({ url: '/logout' }, resolve, reject)
  },

  // 注册会员用户
  registerUser: function (data, resolve, reject) {
    _http.post({ url: '/user/register', data }, resolve, reject)
  },

  // 更新用户个人信息
  updateUserInfo: function (data, resolve, reject) {
    _http.post({ url: '/user/updateInfo', data }, resolve, reject)
  },

  // 用户修改登录密码
  updateUserPassword: function (data, resolve, reject) {
    _http.put({ url: '/user/checkPass', data }, resolve, reject)
  },
}

/**
 * 支付接口
 */
var _payApi = {
  // 去支付
  pay: function (data, resolve, reject) {
    _http.post({ url: '/pay', data }, resolve, reject)
  },
}

/**
 * 购物车接口
 */ 
var _cartApi = {
  // 获取当前登录用户的购物车列表
  getCartList: function (resolve, reject) {
    _http.get({ url: '/cart/list' }, resolve, reject)
  },

  // 更新购物项数量
  cartUpdateCount: function (data, resolve, reject) {
    _http.put({ url: '/cart/updateCount', data }, resolve, reject)
  },

  // 将商品添加购物车
  cartSave: function (data, resolve, reject) {
    _http.post({ url: '/cart/save', data }, resolve, reject)
  },
  
  // 删除当前登录用户的购物车项
  deleteCartByCartId: function (cartId, resolve, reject) {
    _http.delete({ url: '/cart/delete/' + cartId }, resolve, reject)
  }
}

/**
 * 商品接口
 */
var _productApi = {
  // 首页分类栏数据
  getCategoryList: function (resolve, reject) {
    _http.get({ url: '/category/list' }, resolve, reject)
  },

  // 首页轮播图数据
  getCarouselList: function (resolve, reject) {
    _http.get({ url: '/carousel/list' }, resolve, reject)
  },
  
  // 查询商品列表
  productSearch: function (data, resolve, reject) {
    _http.post({ url: '/product/search', data }, resolve, reject)
  },

  // 查询最新商品
  getNewProduct: function (count, resolve, reject) {
    _http.get({ url: '/product/new/' + count }, resolve, reject)
  },

  // 首页下分类商品内容的显示
  getHomeCategory: function (count, resolve, reject)  {
    _http.get({ url: '/product/homeCategory/' + count }, resolve, reject)
  },

  // 根据商品id获取商品详情
  getProductInfo: function (productId, resolve, reject) {
    _http.get({ url: '/product/info/' + productId }, resolve, reject)
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
  addOrder: function (data, resolve, reject) {
    _http.post({ url: '/order/addOrder', data }, resolve, reject)
  },

  // 提交订单
  SubmitOrder: function (data, resolve, reject) {
    _http.put({ url: '/order/submit', data }, resolve, reject)
  },

  // 获取当前登录用户的订单列表
  getOrderList: function (data, resolve, reject) {
    _http.post({ url: '/order/list', data }, resolve, reject)
  },

  // 根据orderNo(订单号)查询到订单详情
  getOrderInfo: function (orderNo, resolve, reject) {
    _http.get({ url: '/order/info/' + orderNo }, resolve, reject)
  },

  // 取消当前用户的订单
  cancelOrder: function (orderNo, resolve, reject) {
    _http.put({ url: '/order/cancel/' + orderNo }, resolve, reject)
  },

  // 删除当前登录用户的订单
  deleteOrder: function (orderNo, resolve, reject) {
    _http.delete({ url: '/cart/delete/' + orderNo }, resolve, reject)
  }
}


/**
 * ajax 二次封装
 */

_http = {
  /**
   * GET请求
   * @param {Object} config { url, params }
   * @param {Function} success 成功回调
   * @param {Function} error 失败回调
   */
  get: function (config, success, error) {
    $.ajax({
      type: 'GET',
      url: baseUrl + config.url,
      headers: { Authorization: `Bearer` + token }, // http header 带token请求
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {

        responseInterceptor(res.code) // 响应拦截器

        success && success(res)
      },
      error: function (err) {
        error && error(err)
      }
    })
  },

  /**
   * POST请求
   * @param {Object} config { url, data }
   * @param {Function} success 成功回调
   * @param {Function} error 失败回调
   */
  post: function (config, success, error) {
    $.ajax({
      type: 'POST',
      url: baseUrl + config.url,
      headers: { Authorization: `Bearer` + token }, // http header 带token请求
      data: JSON.stringify(config.data),
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        
        responseInterceptor(res.code) // 响应拦截器

        success && success(res)
      },
      error: function (err) {
        error && error(err)
      }
    })
  },
  
  /**
   * PUT请求
   * @param {Object} config { url, data }
   * @param {Function} success 成功回调
   * @param {Function} error 失败回调
   */
  put: function (config, success, error) {
    $.ajax({
      type: 'PUT',
      url: baseUrl + config.url,
      headers: { Authorization: `Bearer` + token }, // http header 带token请求
      data: `password=${config.data}`,
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        
        responseInterceptor(res.code) // 响应拦截器

        success && success(res)
      },
      error: function (err) {
        error && error(err)
      }
    })
  },
  
  /**
   * DELETE请求
   * @param {Object} config { url, data }
   * @param {Function} success 成功回调
   * @param {Function} error 失败回调
   */
  delete: function (config, success, error) {
    $.ajax({
      type: 'DELETE',
      url: baseUrl + config.url,
      headers: { Authorization: `Bearer` + token }, // http header 带token请求
      dataType: 'json',
      contentType: 'application/json;charset=UTF-8',
      success: function (res) {
        
        responseInterceptor(res.code) // 响应拦截器

        success && success(res)
      },
      error: function (err) {
        error && error(err)
      }
    })

  },
}

// 响应拦截器
function responseInterceptor (code) {
  // token失效，清除本地token（登录状态），跳转到首页
  if (code === 900) {
    _ms.set('token', '')
    window.location.href = 'index.html'
  }
}