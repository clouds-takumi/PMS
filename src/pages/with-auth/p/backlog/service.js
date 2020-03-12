import request from '@/utils/request'

export const getBacklogIssues = projectId => request({
    url: `/p/${projectId}/issues`,
    params: { pageSize: 99999999999, iterationId: 0 }
})
export const getIteraions = projectId => request({
    url: `/p/${projectId}/iterations`,
    params: { pageSize: 99999999999 }
})

export const getIterationIssues = (projectId, id) => request({
    url: '/issues',
    params: { pageSize: 99999999999, iterationId: id }
})