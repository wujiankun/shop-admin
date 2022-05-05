import axios, {AxiosRequestConfig} from 'axios'
import store from '@/store';
import router from '@/router/'
import {ElMessage} from 'element-plus';
export type ServerResp<D> = {
  data: D, msg: string, status: number
}

const instance = axios.create({
  baseURL: 'https://shop.fed.lagounews.com/api/admin'
  // baseURL: import.meta.env.BASE_URL
})
instance.interceptors.request.use((requestConfig) => {
  if (store.state.user) {
    requestConfig.headers = requestConfig.headers ? requestConfig.headers : {}
    requestConfig.headers.Authorization = `Bearer ${store.state.user.token}`
  }
  return requestConfig
}, error => {
  return Promise.reject(error)
})
let isHandling400 = false
instance.interceptors.response.use(response => {
  // console.log('response.headers')
  if (response.headers['content-type'] && response.headers['content-type'].indexOf('image/png') >= 0) {
    // content-type: "image/png; charset=utf-8"
    return response
  }
  if (response.data.status !== 200) {
    // 登录接口非 200 时没有 data
    if (response.data.status === 410000 && !isHandling400) {
      isHandling400 = true
      // 未登录
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.value.fullPath
        }
      }).finally(() => {
        isHandling400 = false
      })
      ElMessage.error('you are not sign in,please login first')
      return Promise.reject(new Error('you are not sign in,please login first'))
    }
    ElMessage.error(response.data.status + ' : ' + response.data.msg)
    return Promise.reject(new Error(response.data.status + ' : ' + response.data.msg))
  }

  return response
}, error => {
  // http 响应码 2xx 以外的走这个方法
  ElMessage.error(error.message || error.msg || error)
  return Promise.reject(error)
})

export default <T>(option: AxiosRequestConfig) => {
  return instance.request(option).then(ret => {
    return [null, ret.data.data || ret.data] as [null | any, T]
  }).catch(err => {
    return [err, {}] as [null | any, T]
  })
}

export const get = <T>(url: string, option?:AxiosRequestConfig) => {
  return instance.get<ServerResp<T>>(url, option).then(ret => {
    return [null, ret.data.data || ret.data] as [null | any, T]
  }).catch(err => {
    return [err, {}] as [null | any, T]
  })
}

export const post = <T, D>(url: string, data?: D, config?: AxiosRequestConfig) => {
  return instance.post(url, data, config).then(ret => {
    return [null, ret.data.data || ret.data] as [null | any, T]
  }).catch(err => {
    return [err, {}] as [null | any, T]
  })
}
