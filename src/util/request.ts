import axios, {AxiosRequestConfig} from 'axios'

export type ServerResp<D> = {
  data: D, msg: string, status: number
}

const instance = axios.create({
  baseURL: 'https://shop.fed.lagounews.com/api/admin'
  // baseURL: import.meta.env.BASE_URL
})

instance.interceptors.request.use((requestConfig) => {
  return requestConfig
}, error => {
  return Promise.reject(error)
})

instance.interceptors.response.use(response => {
  // console.log('response.headers')
  if (response.headers['content-type'] && response.headers['content-type'].indexOf('image/png') >= 0) {
    // content-type: "image/png; charset=utf-8"
    return response
  }
  if (response.data.status !== 200) {
    // 登录接口非 200 时没有 data
    return Promise.reject(new Error(response.data.status + ' : ' + response.data.msg))
  }

  return response
}, error => {
  // http 响应码 2xx 以外的走这个方法
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
