import { USERINFO, PROJECTINFO } from './action-types'

const initialState = {
  userInfo: {},
  projectInfo: {},
}

function store(state = initialState, action) {
    switch (action.type) {
        case USERINFO:
            return { ...state, userInfo: action.userInfo }
        case PROJECTINFO:
            return { ...state, projectInfo: action.projectInfo }
        default:
            return state
    }
}
export default store
