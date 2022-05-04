/* 公共基础接口 */
import {get, post} from '@/util/request'
import {ILoginFormData, ILoginInfo, ILoginResponse} from '@/api/types/common'

export function getLoginInfo () {
  return get<ILoginInfo>('/login/info')
}

export function getCaptcha () {
  return get<Blob>('/captcha_pro', {
    params: {
      stamp: Date.now()
    },
    responseType: 'blob'
  })
}

export function login (data:ILoginFormData) {
  return post<ILoginResponse, ILoginFormData>('/login', data, {
    /* headers: {
      'content-type': 'application/json'
    } */
  })
}
