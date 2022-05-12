export interface Category {
  id:number,
  pid:number,
  cate_name:string
  sort:number
  pic:string
  is_show:number
  add_time:string
  big_pic:string
  children: Category[]
  statusLoading?:boolean
}
export type CategoryList = {
  count:number,
  list : Category[]
}

export type CategoryForEdit = Pick<Category, 'cate_name'|'pic'|'sort'|'is_show'|'pid'>

export interface CategoryListParams {
  page?: number
  limit?: number
  is_show?: 0 | 1
  pid?: number
  cate_name?: string
}
