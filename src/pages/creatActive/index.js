import React, { Component } from 'react';
import './index.scss'
import { DatePicker, Input, Icon, Select, Upload, Button, Slider, message, Modal } from 'antd'
import api from './../../server'
import Head from './../../component/Head'
import locale from 'antd/lib/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option;
class index extends Component {
    state = {
        title: "创建活动",
        loading: false,
        date: moment().format("YYYY-MM-DD"),
        startTime: "10:00",
        endTime: "18:00",
        tags: [],
        tagsLimit: 3,
        cityList: [],
        cityId: "",
        detailId: "",
        detailList: [],
        addTagModalVisible: false,
        addCityModalVisible: false,
        addDtetailModalVisible: false,
        deleteModalVisible: false
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
        console.log(activeInfo);
        this.getCityList()
    }
    // 如果是从编辑按钮跳转过来的就调用这个函数 ,初始化页面信息
    initActiveInfoPage = (activeInfo) => {
        let nameDOM = this.refs.nameDOM
        nameDOM.state.value = activeInfo.name
        this.setState({
            tags: activeInfo.tags,
            date: moment(activeInfo.startTime * 1000).format("YYYY-MM-DD"),
            startTime: moment(activeInfo.startTime * 1000).format("HH:mm"),
            endTime: moment(activeInfo.finishTime * 1000).format("HH:mm"),
            detailId: activeInfo.location_id,
            cityId: activeInfo.city_id,
            title: "编辑活动",
            activeInfo
        })

    }
    cityChange = (id) => {
        // console.log(this.refs.addDetailSelect);
        this.setState({ cityId: id })
        this.getDetailList(id)
    }
    detailChange = (id) => {
        this.setState({ detailId: id })
    }
    getCityList = async () => {
        let { data: cityList } = await api.getCityList()
        if (cityList.code === 0) {
            let firstId = cityList.data.cities[0].id

            await this.getDetailList(firstId)
            this.setState({
                cityList: cityList.data.cities,
                cityId: firstId
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
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
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

        this.getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
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
            startTime: start,
            endTime: end
        })

    }
    dateChange = (date) => {
        this.setState({
            date: moment(date).format("YYYY-MM-DD")
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
    showCityModal = () => {
        this.setState({
            addCityModalVisible: true
        })
    }
    showDetailModal = () => {
        console.log('daf');
        this.setState({
            addDtetailModalVisible: true
        })
    }
    showDeleteModal = () => {
        this.setState({
            deleteModalVisible: true
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
        console.log(data);
        if (data.code === 0) {
            message.success('城市添加成功')
            this.getCityList()
            this.setState({
                addCityModalVisible: false
            })
        } else if (data.code === 20002) {
            message.warning('城市已存在')
        }
    }
    addDetailOk = async () => {
        let options = {
            city_id: this.state.cityId,
            name: this.refs.addDetailInput.state.value
        }
        console.log(options);
        let { data } = await api.addDetail(options)
        if (data.code === 0) {
            message.success('添加成功')
            this.setState({
                addDtetailModalVisible: false
            })
            await this.getDetailList(this.state.cityId)
        } else if (data.code === 20002) {
            message.warning('地址已存在')
        }
    }
    createActive = async () => {
        let nameDOM = this.refs.nameDOM
        let options = {
            name: nameDOM.state.value,
            startTime: parseInt(moment(`${this.state.date} ${this.state.startTime}`).format("x") / 1000),
            finishTime: parseInt(moment(`${this.state.date} ${this.state.endTime}`).format("x") / 1000),
            city_id: this.state.cityId,
            location_id: this.state.detailId,
            tags: this.state.tags
        }
        if (!options.name) {
            message.warning('活动名称不能为空')
            return
        }
        if (!options.location_id) {
            message.warning('活动详址不能为空')
            return
        }
        let { data } = await api.createActive(options)
        if (data.code === 0) {
            message.success('活动创建成功')
            nameDOM.state.value = ""
            this.setState({
                tags: []
            })
        }
    }
    delete = async () => {
        let id = this.state.activeInfo.id
        let { data } = await api.deleteActive(id)
        console.log(data);
        if (data.code === 0) {
            message.success("删除成功")
            this.props.history.push('/reserve')
        } else {
            message.success(data.message)
        }
    }
    modify = async () => {
        let nameDOM = this.refs.nameDOM
        let options = {
            id: this.state.activeInfo.activeId,
            name: nameDOM.state.value,
            startTime: parseInt(moment(`${this.state.date} ${this.state.startTime}`).format("x") / 1000),
            finishTime: parseInt(moment(`${this.state.date} ${this.state.endTime}`).format("x") / 1000),
            city_id: this.state.cityId,
            location_id: this.state.detailId,
            tags: this.state.tags
        }
        if (!options.name) {
            message.warning('活动名称不能为空')
            return
        }
        if (!options.location_id) {
            message.warning('活动详址不能为空')
            return
        }
        console.log(options);
        let { data } = await api.modifyActive(options)
        if (data.code === 0) {
            message.success('活动编辑成功')
        }
    }
    addTagCancel = () => {
        this.setState({
            addTagModalVisible: false,
            addCityModalVisible: false,
            addDtetailModalVisible: false,
            deleteModalVisible: false
        });
    }
    tipFormatter = (v) => {
        let int = parseInt(v)
        int = int < 10 ? `0${int}` : int
        let float = v % 1
        return float === 0.5 ? `${int}:30` : `${int}:00`
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
        const addCityModal = (
            <Modal
                className="addCityModal"
                zIndex={999999}
                footer={null}
                closable={false}
                visible={this.state.addCityModalVisible}
            >
                <div>
                    <Input ref="addCityInput" placeholder="请输入城市名"></Input>
                </div>
                <div className="city-body">
                    {this.state.cityList.map((v, i) => (
                        <div className="city" key={i}>{v.name}</div>
                    ))}
                </div>
                <div className="btn">
                    <Button onClick={this.addTagCancel} className="cancel">取消</Button>
                    <Button onClick={this.addCityOk} className="add">确定</Button>
                </div>
            </Modal>
        )
        const addDetailModal = (
            <Modal
                className="addDetailModal"
                zIndex={1050}
                footer={null}
                closable={false}
                visible={this.state.addDtetailModalVisible}
            >
                <div>
                    <Select
                        showSearch
                        style={{ width: "100%" }}
                        placeholder="活动城市"
                        optionFilterProp="children"
                        onChange={this.cityChange}
                        value={this.state.cityId}
                    >
                        {this.state.cityList.map((v, i) => (
                            <Option key={i} value={v.id}>{v.name}</Option>
                        ))}
                    </Select>
                    <Input ref="addDetailInput" placeholder="请输入详细地址"></Input>
                </div>
                <div className="city-body">
                    {this.state.detailList.map((v, i) => (
                        <div className="city" key={i}>{v.name}</div>
                    ))}
                </div>
                <div className="btn">
                    <Button onClick={this.addTagCancel} className="cancel">取消</Button>
                    <Button onClick={this.addDetailOk} className="add">确定</Button>
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
                onCancel={this.handleCancel}
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
        return (
            <div className="create-active">
                {addTagModal}
                {addCityModal}
                {addDetailModal}
                {deleteModal}
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
                            <div className="key">活动标签</div>
                            <div className="value">
                                {this.state.tags.map((v, i) => (
                                    <span key={i} className="tag">{v}</span>
                                ))}
                                <span onClick={this.showTagModal} className="addBtn"><Icon type="plus" /></span>
                            </div>
                        </div>
                        <div className="box city">
                            <div className="key">活动城市<span>*必填</span></div>
                            <div className="value">
                                <Select
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="活动城市"
                                    optionFilterProp="children"
                                    onChange={this.cityChange}
                                    value={this.state.cityId}
                                >
                                    {this.state.cityList.map((v, i) => (
                                        <Option key={i} value={v.id}>{v.name}</Option>
                                    ))}
                                </Select>
                                <span onClick={this.showCityModal} className="addBtn"><Icon type="plus" /></span>
                            </div>
                        </div>
                        <div className="box detail">
                            <div className="key">活动详址<span>*必填</span></div>
                            <div className="value">
                                <Select
                                    showSearch
                                    style={{ width: "100%" }}
                                    placeholder="活动详址"
                                    optionFilterProp="children"
                                    onChange={this.detailChange}
                                    value={this.state.detailId}
                                >
                                    {this.state.detailList.map((v, i) => (
                                        <Option key={i} value={v.id}>{v.name}</Option>
                                    ))}
                                </Select>
                                <span onClick={this.showDetailModal} className="addBtn"><Icon type="plus" /></span>
                            </div>
                        </div>
                        <div className="box date">
                            <div className="key">活动日期<span>*必填</span></div>
                            <div className="value">
                                {this.state.date}
                            </div>
                        </div>
                        <div className="box time">
                            <div className="key">活动时段<span>*必填</span></div>
                            <div className="value">
                                <span className="t">{this.state.startTime}</span>
                                <span className="line">-</span>
                                <span className="t">{this.state.endTime}</span>
                            </div>
                        </div>
                    </div>
                    <div className="select-box">
                        <div className="date-img-box">
                            <div className="date">
                                <p>活动日期选择</p>
                                <DatePicker value={moment(this.state.date)} open locale={locale} onChange={this.dateChange} />
                            </div>
                            <div className="img">
                                <p>活动照片</p>
                                <div className="clearfix">
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        beforeUpload={this.beforeUpload}
                                        onChange={this.handleChange}
                                    >
                                        {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                                    </Upload>
                                </div>
                            </div>
                        </div>
                        <div className="slider">
                            <div className="calibration">
                                {calibrationNum.map((v, i) => (
                                    <div key={i}>
                                        <div className="num">{v === "-1" ? "" : v}</div>
                                        <div className={v === "-1" ? "s" : "l"}></div>
                                    </div>
                                ))}
                            </div>
                            <Slider max={20} tipFormatter={this.tipFormatter} min={8} range step={0.5} defaultValue={[10, 18]} onChange={this.sliderChange} />
                        </div>
                    </div>
                </div>
                <div className="btn">
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
        );
    }
}

export default index;