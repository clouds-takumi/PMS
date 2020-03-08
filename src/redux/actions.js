import { USERINFO, PROJECTINFO } from './action-types'

export const setUserInfo = (userInfo) => ({ type: USERINFO, userInfo })
export const setProjectInfo = (projectInfo) => ({ type: PROJECTINFO, projectInfo })
