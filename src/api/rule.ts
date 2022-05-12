import request from '@/util/request';

/**
 * 获取商品规格列表
 */
export const getProductRules = (params:any) => {
  return request({
    method: 'GET',
    url: '/product/product/rule',
    params
  })
}

export const deleteRules = (data: { ids:string }) => {
  return request({
    method: 'DELETE',
    url: '/product/product/rule/delete',
    data
  })
}

export const updateRules = (data: { rule_name:string, spec:{value:string, detail:string[]}[] }, id:number) => {
  return request({
    method: 'POST',
    url: '/product/product/rule/' + id,
    data
  })
}
export const getRuleById = (id:number) => {
  return request({
    method: 'GET',
    url: '/product/product/rule/' + id
  })
}
