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
    // 获取城市列表
    getCityList() {
        return axios.get('/admin/cities')
    }
    // 获取详细地址列表
    getDetailList(city_id) {
        return axios.get('/admin/locations', {
            params: { city_id }
        })
    }
    /**
     * 添加城市
     * @param {name} name 
     */
    addCity(name) {
        return axios.post('/admin/city', { name })
    }
    // 删除城市
    deleteCity(id) {
        return axios.delete("/admin/city", {
            data: { id }
        })
    }

    /**
     * 添加详细地址
     * @param {city_id, name} options 
     */
    addDetail(options) {
        return axios.post('/admin/location', options)
    }
    // 删除详细地址
    deleteDetail(id) {
        return axios.delete("/admin/location", {
            data: { id }
        })
    }

    /**
     * 上传图片
     */
    uploadImg(flie) {
        // FormData 对象
        var form = new FormData();
        // 文件对象
        form.append("file", flie);
        let config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };
        return axios.post('/admin/file/image', form, config)
    }

    /**
     * 创建活动
     * @param {name, reserveStartTime, reserveFinishTime, city_id, picture, location_id, tags, remarks,user,userDepartment,personClass,personName} options 
     */
    createActive(options) {
        return axios.post('/admin/activity', options)
    }

    /**
     * 修改活动状态
     * @param {id, status} options 
     */
    modifyActiveStatus(options) {
        return axios.post('/admin/activity/status', options)
    }

    /**
     * 删除活动
     * @param {*} id 
     */
    deleteActive(id) {
        return axios.delete('/admin/activity', {
            data: { id }
        })
    }
    /**
     * 编辑活动
     * @param {name, startTime, finishTime, city_id, location_id, tags} options 
     */
    modifyActive(options) {
        return axios.put('/admin/activity', options)
    }

    /**
     * type 0, 1, 2 分别代表全部, 陪访, vip人员
     * @param {offset,limit,type} options 
     */
    getPersonList(options) {
        return axios.get('/admin/persons', {
            params: options
        })
    }

    getPersonInfo(id) {
        return axios.get('/admin/person', {
            params: { id }
        })
    }

    /**
     * gender 1,2代表男女
     * isSecrecy 1,2代表 否 ,是
     * type 0, 1, 2 分别代表全部, 陪访, vip人员
     * force 强制添加人员 1 否 2 是
     * @param {name,gender,type, title, Age, telephone, isSecrecy,picture,remarks,tags,,tags,force} options 
     */
    addPerson(options) {
        return axios.post('/admin/person', options)
    }

    /**
     * 
     * @param {id ,name,gender,type, title, Age, telephone, isSecrecy,picture,remarks,tags,force} options 
     */
    modifyPerson(options) {
        return axios.put('/admin/person', options)
    }

    /**
     * 删除人员
     * @param {*} id 
     */
    deletePerson(id) {
        return axios.delete('admin/person', {
            data: { id }
        })
    }
    /**
     * 搜索活动
     * @param {key, city_id, startTIme, endTIme, offset, limit} options 
     */
    getActivesBySearch(options) {
        return axios.get('/admin/search/activities', {
            params: options
        })
    }
    /**
     * 搜索人员
     * @param {key, offset, limit} options 
     */
    getPersonsBySearch(options) {
        return axios.get('/admin/search/persons', {
            params: options
        })
    }


    /**
     * // 获取搜索人员信息中统计信息
     *  id(number): 人员id
     *  offset(number): 偏移量
     *  limit(number): 数量
     *  imgOffset(number): 抓拍小图偏移量
     *  imgLimit(number): 抓拍小图数量
     * 
     * @param {id, offset, limit, imgOffset, imgLimit} options 
     */
    getpersonStatisticsInfo(options) {
        return axios.get('/admin/statistics/person', {
            params: options
        })
    }
    /**
     * 获取人员参加的活动列表
     * @param {offset, limit, id} options 
     */
    getPersonActiveList(options) {
        return axios.get('/admin/person/activities', {
            params: options
        })
    }

    /**
     * 获取搜索活动信息中统计信息
     * @param {id} options 
     */
    getActiveStatisticsInfo(options) {
        return axios.get('/admin/statistics/activity', {
            params: options
        })
    }

    /**
     * 获取参加某活动的各类人员列表
     * type(number): 人员类别 人员属性 -1 未知 1 内部陪访人员 2 VIP
     * @param {offset, limit, type, id} options 
     */
    getActivePersonList(options) {
        return axios.get('/admin/activity/persons', {
            params: options
        })
    }


    // 活动频次统计
    getActivityRate() {
        return axios.get('/admin/statistics/activity/count')
    }

    /**
     * 每周活动频次统计  活动频次统计
     * @param {offset, limit} options 
     */
    getActivityRateByWeek(offset, limit) {
        return axios.get('/admin/statistics/activity/weekly/count', {
            params: { offset, limit }
        })
    }
    // 活动地点历史统计
    getActivityByCity() {
        return axios.get("/admin/statistics/city/count")
    }
    // 访客属性统计
    getPeopleAttribute() {
        return axios.get('/admin/statistics/person/attr/count')
    }

    /**
     * // 系统访问总人数
     * @param {offset, limit} options 
     */
    getStatisticsByPeopleNum(offset, limit) {
        return axios.get("/admin/statistics/person/count", {
            params: { offset, limit }
        })
    }

    /**
     *  人员到访列表
     * @param {offset, limit} options 
     */
    getStatisticsBypeopleList(offset, limit) {
        return axios.get("/admin/statistics/person/ranking/count", {
            params: { offset, limit }
        })
    }
}

export default new api()