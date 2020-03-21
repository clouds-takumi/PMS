import request from '@/utils/request'

// login
export const toLogin = (data) => request({
  method: 'post',
  url: '/login',
  data,
})
export const toRegister = (data) => request({
  method: 'post',
  url: '/register',
  data,
})

// userInfo
export const getUserInfo = () => request({
  url: '/userInfo',
})
export const updateUserInfo = data => request({
  method: 'put',
  url: '/userInfo',
  data,
})
export const getAllUsers = () => request({
  url: '/users',
})

// project
export const getProjects = () => request({
  url: '/projects',
})
export const getProject = params => request({
  url: '/project',
  params,
})
export const createProject = data => request({
  method: 'post',
  url: '/project',
  data,
})
export const editProject = (projectId, data) => request({
  method: 'put',
  url: `/project/${projectId}`,
  data,
})

// iteration
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
  url: `/p/${projectId}/iteration/${iterId}`
})

export const editIteration = (projectId, iterationId, data) => request({
  method: 'put',
  url: `/p/${projectId}/iteration/${iterationId}`,
  data,
})

//issue
export const getIssues = (projectId, params) => request({
  url: `/p/${projectId}/issues`,
  params,
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

export const editIssue = (projectId, issueId, data) => request({
  method: 'put',
  url: `/p/${projectId}/issue/${issueId}`,
  data,
})

//tag
export const getTags = (projectId, params) => request({
  url: `/p/${projectId}/tags`,
  params
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
