import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8;',
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 请求时，带上token
    if (store.getters.token) {
      config.headers['Authorization'] = `Bearer ${getToken()}`
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 相应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  }
)

export default service
