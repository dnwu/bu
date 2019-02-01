import React, { Component } from 'react';
import './index.scss'
import { DatePicker, Input, Icon, Upload, Button, Slider, message, Modal } from 'antd'
import api from './../../server'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const { TextArea } = Input;
class index extends Component {
    state = {
        title: "创建活动",
        loading: false,
        date: "",
        transDate: moment().format("YYYY-MM-DD"),
        startTime: "",
        endTime: "",
        transStartTime: "",
        transEndTIme: "",
        defaultTime: [10.5, 12],
        tags: [],
        tagsLimit: 3,
        cityList: [],
        selectCityId: "",
        selectCityName: "",
        transSelectCityName: "",
        selectDetailId: "",
        selectDetailName: "",
        transSelectDetailName: "",
        detailList: [],
        addTagModalVisible: false,
        deleteModalVisible: false,
        dateModalVisible: false,
        timeModalVisible: false,
        positionModalVisible: false,
        clientType: ["政府", "金融机构", "物业", "投资人", "国企", "地产", "学校", "协会"],
    };
    componentDidMount() {
        let activeInfo = this.props.location.params && this.props.location.params.activeInfo
        // 如果有activeInfo就存
        if (activeInfo) {
            sessionStorage.setItem('activeInfo', JSON.stringify(activeInfo))
        }
        activeInfo = activeInfo || JSON.parse(sessionStorage.getItem('activeInfo'))
        // 如果有activeInfo, 就初始化活动信息页
        if (activeInfo) {
            this.initActiveInfoPage(activeInfo)
        }
        this.getCityList()
    }
    // 如果是从编辑按钮跳转过来的就调用这个函数 ,初始化页面信息
    initActiveInfoPage = (activeInfo) => {
        let nameDOM = this.refs.nameDOM,
            textAreaDOM = this.refs.textarea,
            peopleDOM = this.refs.peopleDOM,
            departmentDOM = this.refs.departmentDOM,
            clientNameDOM = this.refs.clientNameDOM,
            clientTypeDOM = this.refs.clientTypeDOM
        nameDOM.state.value = activeInfo.name
        peopleDOM.state.value = activeInfo.user
        departmentDOM.state.value = activeInfo.userDepartment
        clientNameDOM.state.value = activeInfo.personName
        clientTypeDOM.state.value = activeInfo.personClass
        textAreaDOM.textAreaRef.value = activeInfo.remarks
        this.initSliderTime(activeInfo.reserveStartTime, activeInfo.reserveFinishTime)
        this.setState({
            tags: activeInfo.tags,
            date: moment(activeInfo.reserveStartTime * 1000).format("YYYY-MM-DD"),
            transDate: moment(activeInfo.reserveStartTime * 1000).format("YYYY-MM-DD"),
            startTime: moment(activeInfo.reserveStartTime * 1000).format("HH:mm"),
            endTime: moment(activeInfo.reserveFinishTime * 1000).format("HH:mm"),
            selectDetailId: activeInfo.location_id,
            selectCityId: activeInfo.city_id,
            title: "编辑活动",
            imageUrl: activeInfo.picture,
            selectCityName: activeInfo.city,
            selectDetailName: activeInfo.location,
            activeInfo
        })

    }
    initSliderTime = (start, end) => {
        let s = moment(start * 1000).format("HH:mm").split(':')
        let e = moment(end * 1000).format("HH:mm").split(':')
        let defaultStart, defaultEnd
        if (s[1] === "00") {
            defaultStart = parseInt(s[0])
        } else {
            defaultStart = parseInt(s[0]) + 0.5
        }
        if (e[1] === "00") {
            defaultEnd = parseInt(e[0])
        } else {
            defaultEnd = parseInt(e[0]) + 0.5
        }
        this.setState({
            defaultTime: [defaultStart, defaultEnd]
        })
    }
    getCityList = async () => {
        let { data: cityList } = await api.getCityList()
        if (cityList.code === 0) {
            this.setState({
                cityList: cityList.data.cities,
            })
        }
    }
    getDetailList = async (id) => {
        let { data: detailList } = await api.getDetailList(id)
        if (detailList.code === 0) {

            this.setState({
                detailList: detailList.data.locations,
            })
        }
    }
    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file) => {
        const isJPG = file.type === 'image/jpeg';
        if (!isJPG) {
            message.error('You can only upload JPG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
        // return false   // 手动上传
    }
    handleChange = (info) => {
        // if (info.file.status === 'uploading') {
        //     this.setState({ loading: true });
        //     return;
        // }

        // if (info.file.status === 'done') {
        //     // Get this url from response in real world.
        //     this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        //         imageUrl,
        //         loading: false,
        //     }));
        // }
        // console.log(info);
        this.getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
            file: info.file.originFileObj
        }));
    }
    sliderChange = (value) => {
        let int1 = parseInt(value[0])
        int1 = int1 < 10 ? `0${int1}` : int1
        let float1 = value[0] % 1

        let int2 = parseInt(value[1])
        int2 = int2 < 10 ? `0${int2}` : int2
        let float2 = value[1] % 1
        let start = float1 === 0.5 ? `${int1}:30` : `${int1}:00`
        let end = float2 === 0.5 ? `${int2}:30` : `${int2}:00`
        this.setState({
            transStartTime: start,
            transEndTIme: end
        })

    }
    selectTime = () => {
        this.setState({
            startTime: this.state.transStartTime || "10:00",
            endTime: this.state.transEndTIme || "18:00",
            timeModalVisible: false
        })
    }
    dateChange = (date) => {
        this.setState({
            transDate: moment(date).format("YYYY-MM-DD")
        })
    }
    selectDate = () => {
        this.setState({
            date: this.state.transDate,
            dateModalVisible: false
        })
    }
    showTagModal = () => {
        if (this.state.tags.length >= this.state.tagsLimit) {
            message.warning(`最多创建${this.state.tagsLimit}个标签`);
            return
        }
        this.setState({
            addTagModalVisible: true,
        });
    }
    showDeleteModal = () => {
        this.setState({
            deleteModalVisible: true
        })
    }
    showSelectDateModel = () => {
        this.setState({ dateModalVisible: true })
    }
    showSelectTimeModal = () => {
        this.setState({ timeModalVisible: true })
    }
    showPositionModal = () => {
        this.setState({
            positionModalVisible: true,
            transSelectCityName: "",
            transSelectDetailName: ""
        })
    }
    addTagOk = () => {
        let { tags } = this.state
        tags.push(this.refs.addTagInput.state.value)
        this.refs.addTagInput.state.value = ""
        this.setState({ tags, addTagModalVisible: false })

    }
    addCityOk = async () => {
        let name = this.refs.addCityInput.state.value
        let { data } = await api.addCity(name)
        if (data.code === 0) {
            message.success('城市添加成功')
            this.getCityList()
        } else if (data.code === 20002) {
            message.warning('城市已存在')
        }
    }
    addDetailOk = async () => {
        let options = {
            city_id: this.state.selectCityId,
            name: this.refs.addDetailInput.state.value
        }
        let { data } = await api.addDetail(options)
        if (data.code === 0) {
            message.success('添加成功')
            await this.getDetailList(this.state.selectCityId)
        } else if (data.code === 20002) {
            message.warning('地址已存在')
        }
    }
    upload = async () => {
        return new Promise(async (resolve, reject) => {
            let file = this.state.file
            if (file) {
                let { data } = await api.uploadImg(file)
                if (data.code === 0) {
                    // return data.data.url
                    resolve(data.data.fileName)
                }else {
                    message.warning(data.message)
                }
            } else {
                resolve("")
            }
        })
    }
    createActive = async () => {
        let fileName = await this.upload()
        let nameDOM = this.refs.nameDOM
        let textAreaDOM = this.refs.textarea
        let peopleDOM = this.refs.peopleDOM
        let departmentDOM = this.refs.departmentDOM
        let clientNameDOM = this.refs.clientNameDOM
        let clientTypeDOM = this.refs.clientTypeDOM
        let options = {
            name: nameDOM.input.value,
            reserveStartTime: parseInt(moment(`${this.state.date} ${this.state.startTime}`, "YYYY-MM-DD HH:mm").format("x") / 1000),
            reserveFinishTime: parseInt(moment(`${this.state.date} ${this.state.endTime}`, "YYYY-MM-DD HH:mm").format("x") / 1000),
            city_id: this.state.selectCityId,
            location_id: this.state.selectDetailId,
            picture: fileName,
            remarks: textAreaDOM.textAreaRef.value,
            tags: this.state.tags,
            user: peopleDOM.input.value,
            userDepartment: departmentDOM.input.value,
            personClass: clientTypeDOM.input.value,
            personName: clientNameDOM.input.value
        }
        if (!options.name) {
            message.warning('活动名称不能为空')
            return
        }
        if (options.tags.length === 0) {
            message.warning('活动标签不能为空')
            return
        }
        if (!options.city_id) {
            message.warning('请选择活动地址')
            return
        }
        if (!this.state.date) {
            message.warning('请选择活动日期')
            return
        }
        if (!this.state.startTime) {
            message.warning('请选择活动时段')
            return
        }
        let { data } = await api.createActive(options)
        if (data.code === 0) {
            message.success('活动创建成功')
            // nameDOM.state.value = ""
            // this.setState({
            //     tags: []
            // })
        } else {
            message.warning(data.message)
        }
    }
    delete = async () => {
        let id = this.state.activeInfo.id
        let { data } = await api.deleteActive(id)
        if (data.code === 0) {
            message.success("删除成功")
            this.props.history.push('/reserve')
        } else {
            message.success(data.message)
        }
    }
    modify = async () => {
        let fileName = await this.upload()
        let nameDOM = this.refs.nameDOM
        let textAreaDOM = this.refs.textarea
        let peopleDOM = this.refs.peopleDOM
        let departmentDOM = this.refs.departmentDOM
        let clientNameDOM = this.refs.clientNameDOM
        let clientTypeDOM = this.refs.clientTypeDOM
        let options = {
            id: this.state.activeInfo.activeId,
            name: nameDOM.input.value,
            reserveStartTime: parseInt(moment(`${this.state.date} ${this.state.startTime}`).format("x") / 1000),
            reserveFinishTime: parseInt(moment(`${this.state.date} ${this.state.endTime}`).format("x") / 1000),
            city_id: this.state.selectCityId,
            location_id: this.state.selectDetailId,
            picture: fileName,
            remarks: textAreaDOM.textAreaRef.value,
            tags: this.state.tags,
            user: peopleDOM.input.value,
            userDepartment: departmentDOM.input.value,
            personClass: clientTypeDOM.input.value,
            personName: clientNameDOM.input.value
        }
        if (!options.name) {
            message.warning('活动名称不能为空')
            return
        }
        if (options.tags.length === 0) {
            message.warning('活动标签不能为空')
            return
        }
        if (!options.city_id) {
            message.warning('请选择活动地址')
            return
        }
        if (!this.state.date) {
            message.warning('请选择活动日期')
            return
        }
        if (!this.state.startTime) {
            message.warning('请选择活动时段')
            return
        }
        let { data } = await api.modifyActive(options)
        if (data.code === 0) {
            message.success('活动编辑成功')
            this.props.history.push("/reserve")
        } else {
            message.warning(data.message)
        }
    }
    deleteCity = async (e, id) => {
        e.stopPropagation();
        let { data } = await api.deleteCity(id)
        if (data.code === 0) {
            message.success("删除成功")
            this.getCityList()
        }

    }
    deleteDetail = async (e, id) => {
        e.stopPropagation();
        let { data } = await api.deleteDetail(id)
        if (data.code === 0) {
            message.success("删除成功")
            this.getDetailList(this.state.selectCityId)
        }
    }
    selectCity = (id, name) => {
        // this.state.transSelectDetailName = ""
        this.getDetailList(id)
        this.setState({
            transSelectDetailName: "",
            selectCityId: id,
            transSelectCityName: name
        })
    }
    selectDetail = (id, name) => {
        this.setState({
            selectDetailId: id,
            transSelectDetailName: name
        })
    }
    selectPosition = () => {
        if (!this.state.transSelectCityName || !this.state.transSelectDetailName) {
            message.warning('请选择城市和详细地址')
            return
        }
        this.setState({
            selectCityName: this.state.transSelectCityName,
            selectDetailName: this.state.transSelectDetailName,
            positionModalVisible: false
        })
    }
    addTagCancel = () => {
        this.setState({
            addTagModalVisible: false,
            deleteModalVisible: false,
            dateModalVisible: false,
            timeModalVisible: false,
            positionModalVisible: false
        });
    }
    tipFormatter = (v) => {
        let int = parseInt(v)
        int = int < 10 ? `0${int}` : int
        let float = v % 1
        return float === 0.5 ? `${int}:30` : `${int}:00`
    }
    triggerClientTypeFocus = () => {
        this.refs.clientTypeDOM.focus()
    }
    clientTypeBlur = () => {
        setTimeout(() => {
            this.refs.clientTypeListDOM.style.display = "none"
        }, 300)
    }
    clientTypeFocus = () => {
        this.refs.clientTypeListDOM.style.display = "inline-block"
    }
    selectClientType = (item) => {
        this.refs.clientTypeDOM.state.value = item
        this.refs.clientTypeDOM.input.value = item
    }
    render() {
        const imageUrl = this.state.imageUrl;
        const calibrationNum = ["08", "-1", "09", "-1", "10", "-1", "11", "-1", "12", "-1", "13", "-1", "14", "-1", "15", "-1", "16", "-1", "17", "-1", "18", "-1", "19", "-1", "20"]
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const addTagModal = (
            <Modal
                className="addTagModal"
                zIndex={999999}
                footer={null}
                closable={false}
                visible={this.state.addTagModalVisible}
            >
                <div>
                    <Input ref="addTagInput" placeholder="请输入标签名"></Input>
                </div>
                <div className="btn">
                    <Button onClick={this.addTagCancel} className="cancel">取消</Button>
                    <Button onClick={this.addTagOk} className="add">确定</Button>
                </div>
            </Modal>
        )
        const deleteModal = (
            <Modal
                className='delete-model'
                visible={this.state.deleteModalVisible}
                footer={false}
                zIndex={1050}
                onOk={this.handleOk}
            >
                <div className="body-icon">
                    <p className="icon"><Icon type="question-circle" /></p>
                    <p className="word">确认要删除吗</p>
                </div>
                <div className="btn">
                    <Button onClick={this.addTagCancel} className="cancel">取消</Button>
                    <Button onClick={this.delete} className="sure">确认</Button>
                </div>
            </Modal>
        )
        const DateModal = (
            <Modal
                className='date-modal'
                visible={this.state.dateModalVisible}
                footer={false}
                zIndex={1050}
                onOk={this.handleOk}
                destroyOnClose={true}
            >
                <div className="date-modal-body">
                    <p>活动日期选择</p>
                    <DatePicker value={moment(this.state.transDate)} open locale={locale} onChange={this.dateChange} />
                </div>
                <div className="btn">
                    <Button onClick={this.addTagCancel} className="cancel">取消</Button>
                    <Button onClick={this.selectDate} className="sure">确认</Button>
                </div>
            </Modal>
        )
        const timeModal = (
            <Modal
                className='time-modal'
                visible={this.state.timeModalVisible}
                footer={false}
                width={1000}
                zIndex={1050}
                onOk={this.handleOk}
                destroyOnClose={true}
            >
                <div className="date-modal-body">
                    <p>活动时段选择</p>
                    <div className="slider">
                        <div className="calibration">
                            {calibrationNum.map((v, i) => (
                                <div key={i}>
                                    <div className="num">{v === "-1" ? "" : v}</div>
                                    <div className={v === "-1" ? "s" : "l"}></div>
                                </div>
                            ))}
                        </div>
                        <Slider
                            max={20}
                            tipFormatter={this.tipFormatter}
                            min={8}
                            range
                            step={0.5}
                            defaultValue={this.state.defaultTime}
                            onChange={this.sliderChange} />
                    </div>
                </div>
                <div className="btn">
                    <Button onClick={this.addTagCancel} className="cancel">取消</Button>
                    <Button onClick={this.selectTime} className="sure">确认</Button>
                </div>
            </Modal>
        )
        const positionModal = (
            <Modal
                className='position-modal'
                visible={this.state.positionModalVisible}
                footer={false}
                width={1000}
                zIndex={1050}
                onOk={this.handleOk}
                destroyOnClose={true}
            >
                <div className="position-modal-body">
                    <div className="city">
                        <p>城市</p>
                        <div className="add-box">
                            <Input ref="addCityInput"></Input>
                            <Button onClick={this.addCityOk}>添加</Button>
                        </div>
                        <div className="list">
                            <IScroll>
                                {
                                    this.state.cityList.map((v, i) =>
                                        <div onClick={this.selectCity.bind(this, v.id, v.name)} key={v.id} className={this.state.selectCityId === v.id ? "active item" : "item"}><span>{v.name}</span><span onClick={(e) => { this.deleteCity(e, v.id) }} className="icon"><Icon type="close" /></span></div>
                                    )
                                }
                            </IScroll>
                        </div>
                    </div>
                    <div className="detail">
                        <p>地址</p>
                        <div className="add-box">
                            <Input ref="addDetailInput"></Input>
                            <Button onClick={this.addDetailOk}>添加</Button>
                        </div>
                        <div className="list">
                            <IScroll>
                                {
                                    this.state.detailList.map((v, i) =>
                                        <div onClick={this.selectDetail.bind(this, v.id, v.name)} key={v.id} className={this.state.selectDetailId === v.id ? "active item" : "item"}><span>{v.name}</span><span onClick={(e) => { this.deleteDetail(e, v.id) }} className="icon"><Icon type="close" /></span></div>
                                    )
                                }
                            </IScroll>
                        </div>
                    </div>
                </div>
                <div className="btn">
                    <Button onClick={this.addTagCancel} className="cancel">取消</Button>
                    <Button onClick={this.selectPosition} className="sure">确认</Button>
                </div>
            </Modal>
        )
        return (
            <div className="create-active">
                {addTagModal}
                {deleteModal}
                {DateModal}
                {timeModal}
                {positionModal}
                <Head></Head>
                <div className="create-body">
                    <div className="info-box">
                        <div className="title">{this.state.title}</div>
                        <div className="box">
                            <div className="key">活动名称<span>*必填</span></div>
                            <div className="value">
                                <Input ref="nameDOM"></Input>
                            </div>
                        </div>
                        <div className="box tags">
                            <div className="key">活动标签<span>*必填</span></div>
                            <div className="value">
                                {this.state.tags.map((v, i) => (
                                    <span key={i} className="tag">{v}</span>
                                ))}
                                <span onClick={this.showTagModal} className="addBtn"><Icon type="plus" /></span>
                            </div>
                        </div>
                        <div className="box reserve-people">
                            <div className="key">预约人员</div>
                            <div className="value">
                                <Input ref="peopleDOM"></Input>
                            </div>
                        </div>
                        <div className="box reserve-department">
                            <div className="key">预约部门</div>
                            <div className="value">
                                <Input ref="departmentDOM"></Input>
                            </div>
                        </div>
                        <div className="box client-name">
                            <div className="key">客户名称</div>
                            <div className="value">
                                <Input ref="clientNameDOM"></Input>
                            </div>
                        </div>
                        <div className="box client-type">
                            <div className="key">客户类型</div>
                            <div className="value">
                                <Input
                                    onBlur={this.clientTypeBlur}
                                    onFocus={this.clientTypeFocus}
                                    ref="clientTypeDOM"
                                    suffix={<Icon onClick={this.triggerClientTypeFocus} className="client-type-icon" type="down" />}
                                ></Input>
                                <ul ref="clientTypeListDOM">
                                    {
                                        this.state.clientType.map((v, i) =>
                                            <li onClick={this.selectClientType.bind(this, v)} key={i}>{v}</li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>
                        <div className="box mark">
                            <div className="key">
                                备注
                            </div>
                            <div className="value">
                                <TextArea ref="textarea" autosize={{ minRows: 2, maxRows: 4 }}></TextArea>
                            </div>
                        </div>
                    </div>
                    <div className="info-box item2">
                        <div className="box positon">
                            <div className="key">活动详址<span>*必填</span></div>
                            <div className="value">{this.state.selectCityName ? this.state.selectCityName + " " + this.state.selectDetailName : "未选择"}</div>
                            <div className="select-btn">
                                <Button onClick={this.showPositionModal}>选择地址</Button>
                            </div>
                        </div>
                        <div className="box date">
                            <div className="key">活动日期<span>*必填</span></div>
                            <div className="value">{this.state.date ? this.state.date : "未选择"}</div>
                            <div className="select-btn">
                                <Button onClick={this.showSelectDateModel}>选择日期</Button>
                            </div>
                        </div>
                        <div className="box time">
                            <div className="key">活动时段<span>*必填</span></div>
                            <div className="value">
                                <div className="start">{this.state.startTime ? this.state.startTime : "未选择"}</div>
                                <div className="line">-</div>
                                <div className="end">{this.state.endTime ? this.state.endTime : "未选择"}</div>
                            </div>
                            <div className="select-btn">
                                <Button onClick={this.showSelectTimeModal}>选择时段</Button>
                            </div>
                        </div>
                    </div>
                    <div className="info-box item3">
                        <div className="box img">
                            <div className="key">活动照片</div>
                            <div className="value">
                                <Upload
                                    name="avatar"
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    showUploadList={false}
                                    action=""
                                    // beforeUpload={this.beforeUpload}
                                    onChange={this.handleChange}
                                >
                                    {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                                </Upload>
                            </div>
                        </div>
                        <div className="box btn">
                            {
                                this.state.activeInfo ?
                                    (<>
                                        <Button className="delete" onClick={this.showDeleteModal}>删除</Button>
                                        <Button className="sure" onClick={this.modify}>确认</Button>
                                    </>) :
                                    (<Button className="create" onClick={this.createActive}>创建</Button>)
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;