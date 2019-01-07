export const type = {
    TOKEN: "TOKEN",
    AUTH: "AUTH",
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