import request from '@/util/request';

/* 0编辑器,1产品图片,2拼团图片,3砍价图片,4秒杀图片,5文章图片,6组合数据图 */
export type ParamType ={
  pid?:number, page:number, limit:number
}

export const ImageType = ['编辑器', '产品图片', '拼团图片', '砍价图片', '秒杀图片', '文章图片', '组合数据图']
/**
 * 获取商品规格列表
 */
export const getAttachList = (params: ParamType) => {
  return request<{count:number, list:any[]}>({
    method: 'GET',
    url: '/file/file',
    params
  })
}

export const deleteAttach = (data: { ids:string }) => {
  return request({
    method: 'POST',
    url: '/file/file/delete',
    data
  })
}

export const updateAttachInfo = (data: { real_name:string}, id:number) => {
  return request({
    method: 'PUT',
    url: '/file/file/update/' + id,
    data
  })
}
export const uploadImage = (data:any) => {
  return request({
    method: 'POST',
    url: '/file/upload',
    data
  })
}
