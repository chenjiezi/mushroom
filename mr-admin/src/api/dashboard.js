import request from '@/utils/request'

export const getUserData = () => {
  return request({
    method: 'get',
    url: `/dashboard/user`
  })
}

export const getOrderData = () => {
  return request({
    method: 'get',
    url: `/dashboard/order`
  })
}

export const getProductData = () => {
  return request({
    method: 'get',
    url: `/dashboard/product`
  })
}
