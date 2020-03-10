import request from '@/utils/request'

export const getIterations = (projectId, params) => request({
  url: `/p/${projectId}/iterations`,
  params,
})

export const createIteration = (projectId, data) => request({
  method: 'post',
  url: `/p/${projectId}/iteration`,
  data,
})

export const delIdIteration = (projectId, iterId) => request({
  method: 'delete',
  url: `/p/${projectId}/iteration/${iterId}`,
})