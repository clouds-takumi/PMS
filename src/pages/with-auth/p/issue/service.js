import request from '@/utils/request'

export const getIssues = projectId => request({
  url: `/p/${projectId}/issues`,
  params: { pageSize: 9999999 }
})

export const createIssue = (projectId, data) => request({
  method: 'post',
  url: `/p/${projectId}/issue`,
  data,
})

export const deleteCurIssue = (projectId, id) => request({
  method: 'delete',
  url: `/p/${projectId}/issue/${id}`
})

export const getIterations = (projectId, params) => request({
  url: `/p/${projectId}/iterations`,
  params,
})
