import request from '@/utils/axiosConfig.js'

// GET根据userId获取用户信息
export const getUserInfoByUserId = (userId) => {
  return request({
    method: 'get',
    url: `/user/info/${userId}`,
  })
}

// POST获取所有用户
export const getUserList = (data = {}) => {
  return request({
    method: 'post',
    url: `/user/list`,
    data
  })
}

// POST保存添加用户
export const saveUser = (data = {}) => {
  return request({
    method: 'post',
    url: `/user/save`,
    data
  })
}

// PUT更新用户
export const updateUser = (data = {}) => {
  return request({
    method: 'put',
    url: `/user/update`,
    data
  })
}

// DELETE根据userId删除用户
export const deleteUserByUserId = (userId) => {
  return request({
    method: 'delete',
    url: `/user/delete/${userId}`
  })
}