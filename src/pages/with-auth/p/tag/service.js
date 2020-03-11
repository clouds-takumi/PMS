import request from '@/utils/request'

export const getTags = projectId => request({
    url: `/p/${projectId}/tags`
})

export const createTag = (projectId, data) => request({
    method: 'post',
    url: `/p/${projectId}/tag`,
    data
})

export const deleteCurTag = (projectId, id) => request({
    method: 'delete',
    url: `/p/${projectId}/tag/${id}`
})

export const updateCurTag = (projectId, id, data) => request({
    method: 'put',
    url: `/p/${projectId}/tag/${id}`,
    data
})

export const reqIdTag = (projectId, id) => request({
    url: `/p/${projectId}/tag/${id}`
})
