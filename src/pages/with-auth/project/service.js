import request from '@/utils/request'

export const getProjects = () => request({
  url: '/projects',
})

export const createProject = data => request({
  method: 'post',
  url: '/project',
  data,
})
