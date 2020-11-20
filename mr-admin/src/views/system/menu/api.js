import request from '@/utils/axiosConfig.js'

// GET根据menuId查询菜单信息
export const getMenuInfoByMenuId = (menuId) => {
  return request({
    method: 'get',
    url: `/menu/info/${menuId}`,
  })
}

// GET获取所有菜单
export const getMenulist = () => {
  return request({
    method: 'get',
    url: `/menu/list`
  })
}

// POST保存添加菜单
export const saveMenu = (data = {}) => {
  return request({
    method: 'post',
    url: `/menu/save`,
    data
  })
}

// PUT更新菜单
export const updateMenu = (data = {}) => {
  return request({
    method: 'put',
    url: `/menu/update`,
    data
  })
}

// DELETE根据menuId删除菜单
export const deleteMenuBymenuId = (menuId) => {
  return request({
    method: 'delete',
    url: `/menu/delete/${menuId}`
  })
}