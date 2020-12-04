import request from '@/utils/request'

// GET根据orderId查询订单详细信息
export const updateOrderItem = (data = {}) => {
  return request({
    method: 'put',
    url: `/orderItem/update`,
    data
  })
}
