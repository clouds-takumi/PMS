import request from '@/utils/request'

export const reqUsers = projectId => request({
    url: `/p/${projectId}/users`
})