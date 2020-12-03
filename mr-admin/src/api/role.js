import request from '@/utils/axiosConfig.js'

// GET根据roleId查询角色信息
export const getRoleInfoByRoleId = (roleId) => {
  return request({
    method: 'get',
    url: `/role/info/${roleId}`,
  })
}

// POST获取角色列表
export const getRoleList = (data = {}) => {
  return request({
    method: 'post',
    url: `/role/list`,
    data
  })
}

// POST保存添加角色
export const saveRole = (data = {}) => {
  return request({
    method: 'post',
    url: `/role/save`,
    data
  })
}

// PUT更新角色信息
export const updateRole = (data = {}) => {
  return request({
    method: 'put',
    url: `/role/update`,
    data
  })
}

// DELETE根据roleId删除角色
export const deleteRoleByRoleId = (roleId) => {
  return request({
    method: 'delete',
    url: `/role/delete/${roleId}`
  })
}