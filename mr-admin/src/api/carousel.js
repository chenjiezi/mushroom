import request from '@/utils/request'

// GET根据carouselId查询轮播图信息
export const getCarouselInfoByCarouselId = (carouselId) => {
  return request({
    method: 'get',
    url: `/carousel/info/${carouselId}`,
  })
}

// GET获取轮播图列表
export const getCarouselList = () => {
  return request({
    method: 'get',
    url: `/carousel/list`
  })
}

// POST保存添加轮播图
export const saveCarousel = (data = {}) => {
  return request({
    method: 'post',
    url: `/carousel/save`,
    data
  })
}

// PUT更新轮播图
export const updateCarousel = (data = {}) => {
  return request({
    method: 'put',
    url: `/carousel/update`,
    data
  })
}

// DELETE根据carouselId删除轮播图
export const deleteCarouselByCarouselId = (carouselId) => {
  return request({
    method: 'delete',
    url: `/carousel/delete/${carouselId}`
  })
}
