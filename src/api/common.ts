/* 公共基础接口 */
import request, {get} from '@/util/request'
import {ILoginInfo} from '@/api/types/common'

console.log(request)

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
