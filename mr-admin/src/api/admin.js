import request from '@/utils/request'

// GET根据adminId查询管理员信息
export const getAdminInfoByAdminId = (adminId) => {
  return request({
    method: 'get',
    url: `/admin/info/${adminId}`,
  })
}

// POST获取管理员列表
export const getAdminList = (data = {}) => {
  return request({
    method: 'post',
    url: `/admin/list`,
    data
  })
}

// POST保存添加管理员
export const saveAdmin = (data = {}) => {
  return request({
    method: 'post',
    url: `/admin/save`,
    data
  })
}

// PUT更新管理员信息
export const updateAdmin = (data = {}) => {
  return request({
    method: 'put',
    url: `/admin/update`,
    data
  })
}

// DELETE根据adminId删除管理员
export const deleteAdminByAdminId = (adminId) => {
  return request({
    method: 'delete',
    url: `/admin/delete/${adminId}`
  })
}
