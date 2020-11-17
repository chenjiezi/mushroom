import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  headers: {
    'Content-Type': 'application/json;charset=utf-8;',
  }

})

service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  }
)

export default service
