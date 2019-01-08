export const type = {
    TOKEN: "TOKEN",
    AUTH: "AUTH",
    USERNAME: "USERNAME"
}
export function setToken(token) {
    return {
        type: type.TOKEN,
        token
    }
}
export function setAuth(auth) {
    return {
        type: type.AUTH,
        auth
    }
}
export function setUserName(userName) {
    return {
        type: type.USERNAME,
        userName
    }
}