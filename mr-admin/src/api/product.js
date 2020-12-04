import request from '@/utils/request'

// POST根据商品名称或分类id获取商品列表
export const getProductList = (data = {}) => {
  return request({
    method: 'post',
    url: `/product/list`,
    data
  })
}

// GET根据productId查询商品信息
export const getProductInfoByProductId = (productId) => {
  return request({
    method: 'get',
    url: `/product/info/${productId}`
  })
}

// POST保存添加商品
export const saveProduct = (data = {}) => {
  return request({
    method: 'post',
    url: `/product/save`,
    data
  })
}

// PUT更新商品信息
export const updateProduct = (data = {}) => {
  return request({
    method: 'put',
    url: `/product/update`,
    data
  })
}

// DELETE根据productId删除商品
export const deleteProductInfoByProductId = (productId) => {
  return request({
    method: 'delete',
    url: `/product/delete/${productId}`
  })
}
