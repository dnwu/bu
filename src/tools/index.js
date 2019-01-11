class Tools {
    formatDate(time, symbol) {
        if (!time) {
            return ""
        }
        let date = new Date(time * 1000)
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        month = month < 10 ? `0${month}` : month
        day = day < 10 ? `0${day}` : day
        if (symbol) {
            return `${year}${symbol}${month}${symbol}${day}`
        } else {
            return `${year}.${month}.${day}`
        }
    }
    formatTime(time) {
        if (!time) {
            return ""
        }
        let date = new Date(time * 1000)
        let hour = date.getHours()
        let minute = date.getMinutes()
        hour = hour < 10 ? `0${hour}` : hour
        minute = minute < 10 ? `0${minute}` : minute
        return `${hour}:${minute}`
    }
}
export default new Tools()