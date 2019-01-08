import { type } from './../action'
const initState = {
    token: "",     // token
    auth: 'false',  // 是否登录 
    userName: '' //用户名  
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
        case type.USERNAME:
            return {
                ...state,
                userName: action.userName
            }
        default:
            return {
                ...state
            }
    }
}
