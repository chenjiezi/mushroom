import request from '@/utils/axiosConfig.js'

// GET根据orderId查询订单详细信息
export const getOrderInfoByOrderId = (orderId) => {
  return request({
    method: 'get',
    url: `/order/info/${orderId}`,
  })
}

// POST根据查询订单列表
export const getOrderList = (data = {}) => {
  return request({
    method: 'post',
    url: `/order/list`,
    data
  })
}

// PUT更新订单信息
export const updateOrder = (data = {}) => {
  return request({
    method: 'put',
    url: `/order/update`,
    data
  })
}

// DELETE根据orderId删除订单(内部为假删除)
export const deleteOrderByOrderId = (orderId) => {
  return request({
    method: 'delete',
    url: `/order/delete/${orderId}`
  })
}

// GET根据orderId关闭订单
export const closeOrderByOrderId = (orderId) => {
  return request({
    method: 'get',
    url: `/order/closeOrder/${orderId}`
  })
}