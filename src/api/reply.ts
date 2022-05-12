import request from '@/util/request';

export type ReplyListParams = Partial<{
  page:number, limit:number, account:string,
  is_reply:0|1|undefined, store_name:string, product_id:number
}>
export type ReplyItem = {
  id:number, image:string, add_time:string, merchant_reply_content:string, score:string,
  comment:string, create_time:string, time:string,
  is_reply:boolean, store_name:string, product_id:number
}

export const getReplyList = (params:ReplyListParams) => {
  return request<{count:number, list:ReplyItem[]}>({
    method: 'GET',
    url: '/product/reply',
    params
  })
}

export const deleteReply = (id:any) => {
  return request({
    method: 'DELETE',
    url: '/product/reply/' + id
  })
}

export const doReply = (data: { content:string }, id:number) => {
  return request({
    method: 'PUT',
    url: '/product/reply/set_reply/' + id,
    data
  })
}
