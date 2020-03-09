import request from '@/utils/request'

export const toLogin = (data) => request({
  method: 'post',
  url: '/login',
  data,
})

export const toRegister = (data) => request({
  method: 'post',
  url: '/register',
  data,
})
