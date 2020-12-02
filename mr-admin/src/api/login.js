import request from '@/utils/axiosConfig.js'

// POST保存添加商品
export const login = (data = {}) => {
  return request({
    method: 'post',
    url: `login`,
    data
  })
}

export const getInfo = () => {
  return request({
    method: 'get',
    url: `getInfo`
  })
}

export const logout = () => {
  return request({
    method: 'get',
    url: `logout`
  })
}
