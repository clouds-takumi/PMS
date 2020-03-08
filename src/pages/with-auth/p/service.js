import request from '@/utils/request'

export const getProject = params => request({
  url: '/project',
  params
})
