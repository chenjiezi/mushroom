import request from '@/utils/request'

// GET根据categoryId查询商品分类信息
export const getCategoryInfoByCategoryId = (categoryId) => {
  return request({
    method: 'get',
    url: `/category/info/${categoryId}`,
  })
}

// GET获取所有商品分类
export const getCategorylist = () => {
  return request({
    method: 'get',
    url: `/category/list`
  })
}

// POST保存添加商品分类
export const saveCategory = (data = {}) => {
  return request({
    method: 'post',
    url: `/category/save`,
    data
  })
}

// PUT更新商品分类
export const updateCategory = (data = {}) => {
  return request({
    method: 'put',
    url: `/category/update`,
    data
  })
}

// DELETE根据categoryId删除商品分类
export const deleteCategoryBycategoryId = (categoryId) => {
  return request({
    method: 'delete',
    url: `/category/delete/${categoryId}`
  })
}
