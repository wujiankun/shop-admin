import request, {get} from '@/util/request'
import {
  CategoryForEdit, CategoryList, CategoryListParams
} from './types/product-category'

/**
 * 获取商品分类列表
 */
export const getCategoryList = (params?:CategoryListParams) => {
  return get<CategoryList>('/product/category', { params })
}
/**
 * 获取商品分类列表
 */
export const getCategories = (params?:CategoryListParams, type?:0|1) => {
  return get<CategoryList>('/product/category/tree/' + (type === undefined ? 1 : type), { params })
}
/**
 * 编辑分类
 */
export const editCategory = (id:string|number, data:CategoryForEdit) => {
  return request({
    method: 'PUT',
    url: '/product/category/' + id,
    data
  })
}
/**
 * 编辑分类
 */
export const getCategoryById = (id:string|number) => {
  return request({
    method: 'GET',
    url: '/product/category/' + id
  })
}

/**
 * 删除分类
 */
export const deleteCategory = (id:string|number) => {
  return request({
    method: 'DELETE',
    url: '/product/category/' + id
  })
}
/**
 * 添加分类
 */
export const addCategory = (data:CategoryForEdit) => {
  return request({
    method: 'POST',
    url: '/product/category',
    data
  })
}

/**
 * 添加分类
 */
export const changeState = (id:number, is_show:boolean|number|string) => {
  return request({
    method: 'PUT',
    url: `/product/category/set_show/${id}/${is_show}`
  })
}
