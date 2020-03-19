import request from '@/utils/request'

export const updateUserInfo = data => request({
  method: 'put',
  url: `/userInfo`,
  data,
})
