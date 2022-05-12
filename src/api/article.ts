import request from '@/util/request';

export type ArticleListParams = Partial<{
  page: number, // 当前页码
  limit: number, // 每页大小
  pid:number, title:string
}>
export type ArticleItem = {
  id:number, cid:number, image?:string, title:string, author:string, image_input:string[],
  synopsis:string, share_title:string, share_synopsis:string, visit:string, sort:number, url:string,
  content: string, add_time?:string, product_id:number,
  is_hot: number,
  status: number
}

export const getArticleList = (params:ArticleListParams) => {
  return request<{count:number, list:ArticleItem[]}>({
    method: 'GET',
    url: '/cms/cms',
    params
  })
}

export const getArticleById = (id:any) => {
  return request<ArticleItem>({
    method: 'GET',
    url: '/cms/cms/' + id
  })
}

export const deleteArticle = (id:any) => {
  return request({
    method: 'DELETE',
    url: '/cms/cms/' + id
  })
}

export const unRelation = (id:number) => {
  return request({
    method: 'PUT',
    url: '/cms/cms/unrelation/' + id
  })
}
export const relation = (id:number|string, data:{product_id:number}) => {
  return request({
    method: 'PUT',
    url: '/cms/cms/relation/' + id,
    data
  })
}
export const postArticle = (data:any) => {
  return request({
    method: 'POST',
    url: '/cms/cms',
    data
  })
}
