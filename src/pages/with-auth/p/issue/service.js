import request from '@/utils/request'

export const getIssues= (projectId, params) => request({
  url: `/p/${projectId}/issues`,
  params,
})

export const createIssue = (projectId, data) => request({
  method: 'post',
  url: `/p/${projectId}/issue`,
  data,
})
