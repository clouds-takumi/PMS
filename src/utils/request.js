import axios from 'axios'
import { message } from 'antd'
import router from 'umi/router'

axios.defaults.baseURL = 'http://localhost:7001'

axios.interceptors.request.use(
  config => { return config },
  error => { return Promise.reject(error) }
)

axios.interceptors.response.use(
  response => {
    const { status, data } = response
    console.log(response)
    if (status === 200 && data.code !== 0) {
      message.error(data.msg)
      if (data.code === 2) {
        localStorage.removeItem('token')
        router.replace('/login')
      }
      if (data.code === 1) {
        return Promise.reject(response)
      }
    }
    return data
  },
  error => {
    if (error.response) {
      let { response } = error
      switch (response.status) {
        case 401:
          router.replace('/login')
          break
        case 403:
          localStorage.removeItem('token')
          router.replace('/login')
          break
        case 404:
          router.replace('/404')
          break
        default:
      }
      return Promise.reject(error.response)
    } else {
      if (!window.navigator.onLine) {
        router.replace('/offline')
        return
      }
      return Promise.reject(error)
    }
  }
)

export default (config, noAuth) => {
  if (!noAuth) {
    const token = localStorage.getItem('token')
    const authHeader = {
      'Authorization': `Bearer ${token}`,
    }
    const { headers } = config
    config.headers = {
      ...headers,
      ...authHeader,
    }
    if (!config.method) {
      config.method = 'get'
    }
  }

  return axios(config)
}
