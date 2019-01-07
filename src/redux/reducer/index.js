import { type } from './../action'
const initState = {
    token: "",     // token
    auth: 'false',  // 是否登录   
}
export default (state = initState, action) => {
    switch (action.type) {
        case type.TOKEN:
            return {
                ...state,
                token: action.token
            }
        case type.AUTH:
            return {
                ...state,
                auth: action.auth
            }
        default:
            return {
                ...state
            }
    }
}
