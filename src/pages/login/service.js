import request from '@/utils/request'

export const toLogin = (data) => request({
  method: 'post',
  url: '/login',
  data,
})
