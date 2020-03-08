import request from '@/utils/request'

export const getUserInfo = () => request({
  url: '/userInfo',
})
