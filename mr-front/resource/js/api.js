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