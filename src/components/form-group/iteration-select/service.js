import request from '@/utils/request'

export const getIterations = projectId => request({
    url: `/p/${projectId}/iterations`,
    params: { pageSize: 99999999 }
})