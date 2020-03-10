import request from '@/utils/request'

export const reqTags = (projectId, params) => request({
    method: 'get',
    url: `/p/${projectId}/tags`,
    params
})

export const reqIdTag = (projectId, id) => request({
    method: 'get',
    url: `/p/${projectId}/tag/${id}`
})

export const addTag = (projectId, data) => request({
    method: 'post',
    url: `/p/${projectId}/iteration`,
    data
})

export const delIdTag = (projectId, id) => request({
    method: 'delete',
    url: `/p/${projectId}/tag/${id}`
})

export const updataIdTag = (projectId, id, data) => request({
    method: 'put',
    url: `/p/${projectId}/tag/${id}`,
    data
})

