import React, { Component } from 'react';
import './index.scss'
import api from './../../server'
import { Input, Select, Button, Upload, Icon, message, Radio, Checkbox, Modal } from 'antd'
import Head from './../../component/Head'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
const Option = Select.Option;
const RadioGroup = Radio.Group;
class index extends Component {
    state = {
        imageUrl: '',
        title: "添加人员",
        gender: "",
        type: 2,
        isSecrecy: false
    }
    componentDidMount() {
        let cardInfo = this.props.location.params && this.props.location.params.cardInfo
        // 如果有cardInfo就存
        if (cardInfo) {
            sessionStorage.setItem('cardInfo', JSON.stringify(cardInfo))
        }
        cardInfo = cardInfo || JSON.parse(sessionStorage.getItem('cardInfo'))
        // 如果有cardInfo, 就初始化活动信息页
        if (cardInfo) {
            this.initActiveInfoPage(cardInfo)
        }
    }
    initActiveInfoPage = (cardInfo) => {
        this.refs.nameDOM.state.value = cardInfo.name
        this.refs.titleDOM.state.value = cardInfo.title
        this.refs.ageDOM.state.value = cardInfo.age
        this.refs.phoneDOM.state.value = cardInfo.telephone
        this.setState({
            gender: cardInfo.gender,
            type: cardInfo.type,
            isSecrecy: cardInfo.isSecrecy === 1 ? false : true,
            isModify: true,
            personDeleteModalVisible: false,
            cardInfo,
        })
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

    typeChange = (type) => {
        this.setState({ type })
    }
    secrecyChange = (isSecrecy) => {
        this.setState({ isSecrecy: isSecrecy.target.checked })
    }
    genderChange = (gender) => {
        this.setState({
            gender
        })
    }
    addPerson = async () => {
        let name = this.refs.nameDOM.state.value
        let title = this.refs.titleDOM.state.value
        let age = parseInt(this.refs.ageDOM.state.value)
        let telephone = this.refs.phoneDOM.state.value
        let type = this.state.type
        let isSecrecy = this.state.isSecrecy === false ? 1 : 2
        // name,gender,type, title, Age
        if (!name || !this.state.gender || !title) {
            message.warning('姓名,性别, 职位不能为空')
            return
        }
        let options = { name, type, title, age, telephone, isSecrecy, gender: this.state.gender }
        let { data } = await api.addPerson(options)
        if (data.code === 0) {
            message.success("添加成功")
            this.props.history.push('/manage')
        }else {
            message.error(data.message)
        }
    }
    handleCancel = () => {
        this.setState({
            personDeleteModalVisible: false
        })
    }
    showDeleteModal = () => {
        this.setState({
            personDeleteModalVisible: true
        })
    }
    personModify = async () => {
        let cardInfo = this.state.cardInfo
        let id = cardInfo.id
        let name = this.refs.nameDOM.state.value
        let title = this.refs.titleDOM.state.value
        let age = parseInt(this.refs.ageDOM.state.value)
        let telephone = this.refs.phoneDOM.state.value
        let type = this.state.type
        let isSecrecy = this.state.isSecrecy === false ? 1 : 2
        let gender = this.state.gender
        let options = { id, name, gender, type, title, age, telephone, isSecrecy }
        let { data } = await api.modifyPerson(options)
        if (data.code === 0) {
            message.success("人员信息修改成功")
            this.props.history.push('/manage')
        } else {
            message.error(data.message)
        }
    }
    delete = async () => {
        let id = this.state.cardInfo.id
        let { data } = await api.deletePerson(id)
        if (data.code === 0) {
            message.success("删除成功")
            this.props.history.push('/manage')
        } else {
            message.error(data.message)
        }
    }
    render() {
        const imageUrl = this.state.imageUrl;
        const uploadButton = (
            <div>
                <Icon type={this.state.loading ? 'loading' : 'picture'} />
                <div className="ant-upload-text">上传照片</div>
            </div>
        );
        const deleteModal = (
            <Modal
                className='person-delete-model'
                visible={this.state.personDeleteModalVisible}
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
                    <Button onClick={this.handleCancel} className="cancel">取消</Button>
                    <Button onClick={this.delete} className="sure">确认</Button>
                </div>
            </Modal>
        )
        return (
            <div className="add-person">
                {deleteModal}
                <Head></Head>
                <div className="add-person-body">
                    <div className="left">
                        <div className="title">{this.state.title}</div>
                        <div className="box">
                            <div className="key">姓名<span>*必填</span></div>
                            <div className="value">
                                <Input ref="nameDOM"></Input>
                            </div>
                        </div>
                        <div className="box">
                            <div className="key">性别<span>*必填</span></div>
                            <div className="value">
                                <Select
                                    style={{ width: "100%" }}
                                    onChange={this.genderChange}
                                    value={this.state.gender}
                                >
                                    <Option value={1}>男</Option>
                                    <Option value={2}>女</Option>
                                </Select>
                            </div>
                        </div>
                        <div className="box">
                            <div className="key">职位/称谓<span>*必填</span></div>
                            <div className="value">
                                <Input ref="titleDOM"></Input>
                            </div>
                        </div>
                        <div className="box">
                            <div className="key">年龄</div>
                            <div className="value">
                                <Input ref="ageDOM"></Input>
                            </div>
                        </div>
                        <div className="box">
                            <div className="key">手机</div>
                            <div className="value">
                                <Input ref="phoneDOM"></Input>
                            </div>
                        </div>
                    </div>
                    <div className="select">
                        <div className="upload-ava">
                            <div className="key">
                                人员照片
                            </div>
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
                        <div className="person-type">
                            <div className="key">身份</div>
                            <div className="value">
                                <RadioGroup defaultValue={2} value={this.state.type} onChange={this.typeChange}>
                                    <Radio value={2}>
                                        <img src={vipImg} alt="" /><span className="v">VIP重要人员</span>
                                    </Radio>
                                    <Radio value={1}>
                                        <img className="norm-img" src={normImg} alt="" /><span className="v">陪访人员</span>
                                    </Radio>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className="is-secrecy">
                            <div className="key">身份敏感</div>
                            <Checkbox checked={this.state.isSecrecy} onChange={this.secrecyChange}>启用</Checkbox>
                            <p>打开后，在后续的搜索和统计中，看不到他的信息</p>
                        </div>
                    </div>
                    <div className="right">
                        {
                            this.state.isModify ?
                                (<>
                                    <Button className="delete" onClick={this.showDeleteModal}>删除</Button>
                                    <Button className="sure" onClick={this.personModify}>确认</Button>
                                </>) :
                                (<Button className="create" onClick={this.addPerson}>添加</Button>)
                        }
                    </div>

                </div>
            </div>
        );
    }
}

export default index;