/**
 *所有请求api
 */
import axios from './../axios/'

class api {
    /**
     * 登录
     * @param {username, password} options 
     */
    login(options) {
        return axios.post('/admin/login', options)
    }
    /**
     * 注销登录
     */
    logout() {
        return axios.delete('/admin/login')
    }

    /**
     * 获取活动列表
     * status = "" //全部
     * status = 1 //已预约
     * status = 2 //进行中
     * status = 3 //已完成
     * @param {offset, limit, status} options 
     */
    getActiveList(options) {
        return axios.get('/admin/activities', {
            params: options
        })
    }

    getActiveInfo(id) {
        return axios.get('/admin/activity', {
            params: { id }
        })
    }
}

export default new api()