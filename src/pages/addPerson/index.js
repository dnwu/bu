import React, { Component } from 'react';
import './index.scss'
import api from './../../server'
import { Input, Select, Button, Upload, Icon, message, Radio, Checkbox, Modal } from 'antd'
import IScroll from './../../component/IScroll'
import Head from './../../component/Head'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import defaultAva from './../../static/default.png'
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { TextArea } = Input;
class index extends Component {
    state = {
        tags: [],
        tagsLimit: 3,
        imageUrl: '',
        title: "添加人员",
        gender: "",
        type: 2,
        isSecrecy: false,
        coverType: 1,
        addTagModalVisible: false,
        coverCheckModalVisible: false,
        personDeleteModalVisible: false,
        similarList: [],
        selectSimilarId: "",
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
        this.refs.textArea.textAreaRef.value = cardInfo.remarks
        this.setState({
            gender: cardInfo.gender,
            type: cardInfo.type,
            isSecrecy: cardInfo.isSecrecy === 1 ? false : true,
            isModify: true,
            tags: cardInfo.tags,
            imageUrl: cardInfo.picture,
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
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJPG && isLt2M;
    }
    handleChange = (info) => {
        this.getBase64(info.file.originFileObj, imageUrl => this.setState({
            imageUrl,
            loading: false,
            file: info.file.originFileObj
        }));
    }
    upload = async () => {
        let file = this.state.file
        if (file) {
            let { data } = await api.uploadImg(file)
            if (data.code === 0) {
                return data.data.fileName
            }
        } else {
            return ""
        }
    }
    typeChange = (type) => {
        this.setState({ type: type.target.value })
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
        let picture = await this.upload()
        if (!picture) {
            message.warning("请选择头像")
            return
        }
        let name = this.refs.nameDOM.state.value
        let title = this.refs.titleDOM.state.value
        let age = parseInt(this.refs.ageDOM.state.value)
        let telephone = this.refs.phoneDOM.state.value
        let type = this.state.type
        let isSecrecy = this.state.isSecrecy === false ? 1 : 2
        let gender = this.state.gender
        let remarks = this.refs.textArea.textAreaRef.value
        let tags = this.state.tags
        let force = 1
        // name,gender,type, title, Age
        if (!name || !this.state.gender || !title) {
            message.warning('姓名,性别, 职位不能为空')
            return
        }
        let options = { name, type, title, age, telephone, isSecrecy, gender, picture, remarks, tags, force }
        let { data } = await api.addPerson(options)
        if (data.code === 0) {
            message.success("添加成功")
            this.props.history.push('/manage')
        } else if (data.code === 20106) {
            let similarList = data.data.similar
            this.setState({
                selectSimilarId: "",
                coverCheckModalVisible: true,
                similarList
            })
        } else {
            message.error(data.message)
        }
    }
    showDeleteModal = () => {
        this.setState({
            personDeleteModalVisible: true
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
    addTagOk = () => {
        let { tags } = this.state
        tags.push(this.refs.addTagInput.state.value)
        this.refs.addTagInput.state.value = ""
        this.setState({ tags, addTagModalVisible: false })
    }
    addTagCancel = () => {
        this.setState({
            addTagModalVisible: false
        })
    }
    personModify = async () => {
        let cardInfo = this.state.cardInfo
        let id = cardInfo.id
        let picture = await this.upload()
        if (!picture && cardInfo.picture) {
            picture = cardInfo.picture.match(/images\/(\S*)/)[1]
        } else if (!picture) {
            message.warning("请选择头像")
            return
        }
        let name = this.refs.nameDOM.state.value
        let title = this.refs.titleDOM.state.value
        let age = parseInt(this.refs.ageDOM.state.value)
        let telephone = this.refs.phoneDOM.state.value
        let type = this.state.type
        let isSecrecy = this.state.isSecrecy === false ? 1 : 2
        let gender = this.state.gender
        let remarks = this.refs.textArea.textAreaRef.value
        let tags = this.state.tags
        let force = 1
        if (!name || !this.state.gender || !title) {
            message.warning('姓名,性别, 职位不能为空')
            return
        }
        let options = { id, name, gender, type, title, age, telephone, isSecrecy, picture, remarks, tags, force }
        let { data } = await api.modifyPerson(options)
        if (data.code === 0) {
            message.success("人员信息修改成功")
            this.props.history.push('/manage')
        } else if (data.code === 20106) {
            let similarList = data.data.similar
            this.setState({
                selectSimilarId: "",
                coverCheckModalVisible: true,
                similarList
            })
        } else {
            message.error(data.message)
        }
    }
    forciblyCreatePerson = async () => {
        let cardInfo = this.state.cardInfo
        let picture = await this.upload()
        if (!picture && cardInfo.picture) {
            picture = cardInfo.picture.match(/images\/(\S*)/)[1]
        } else if (!picture) {
            message.warning("请选择头像")
            return
        }
        let name = this.refs.nameDOM.state.value
        let title = this.refs.titleDOM.state.value
        let age = parseInt(this.refs.ageDOM.state.value)
        let telephone = this.refs.phoneDOM.state.value
        let type = this.state.type
        let isSecrecy = this.state.isSecrecy === false ? 1 : 2
        let gender = this.state.gender
        let remarks = this.refs.textArea.textAreaRef.value
        let tags = this.state.tags
        let force = 2
        // name,gender,type, title, Age
        if (!name || !this.state.gender || !title) {
            message.warning('姓名,性别, 职位不能为空')
            return
        }
        let options = { name, type, title, age, telephone, isSecrecy, gender, picture, remarks, tags, force }
        let { data } = await api.addPerson(options)
        if (data.code === 0) {
            message.success("添加成功")
            this.props.history.push('/manage')
        } else if (data.code === 20106) {
            let similarList = data.data.similar
            this.setState({
                selectSimilarId: "",
                coverCheckModalVisible: true,
                similarList
            })
        } else {
            message.error(data.message)
        }
    }
    coverPerson = () => {
        if (this.state.coverType === 1) {
            this.coverPersonOnlyAva()
        } else if (this.state.coverType === 2) {
            this.coverPersonAllInfo()
        }
    }
    coverPersonOnlyAva = async () => {
        let cardInfo = this.state.cardInfo
        let id = this.state.selectSimilarId
        if (!id) {
            message.warning("请选择您想覆盖的人员")
            return
        }
        let info = await this.getPersonInfo(id)

        let picture = await this.upload()
        if (!picture && cardInfo.picture) {
            picture = cardInfo.picture.match(/images\/(\S*)/)[1]
        } else if (!picture) {
            message.warning("请选择头像")
            return
        }
        let { name, gender, type, title, age, telephone, isSecrecy, remarks, tags } = info
        let force = 2
        let options = { id, name, gender, type, title, age, telephone, isSecrecy, picture, remarks, tags, force }
        let { data } = await api.modifyPerson(options)
        if (data.code === 0) {
            message.success("人员信息覆盖成功")
            this.props.history.push('/manage')
        } else {
            message.error(data.message)
        }
    }
    coverPersonAllInfo = async () => {
        let id = this.state.selectSimilarId
        if (!id) {
            message.warning("请选择您想覆盖的人员")
            return
        }
        let cardInfo = this.state.cardInfo
        let picture = await this.upload()
        if (!picture && cardInfo.picture) {
            picture = cardInfo.picture.match(/images\/(\S*)/)[1]
        } else if (!picture) {
            message.warning("请选择头像")
            return
        }
        let name = this.refs.nameDOM.state.value
        let title = this.refs.titleDOM.state.value
        let age = parseInt(this.refs.ageDOM.state.value)
        let telephone = this.refs.phoneDOM.state.value
        let type = this.state.type
        let isSecrecy = this.state.isSecrecy === false ? 1 : 2
        let gender = this.state.gender
        let remarks = this.refs.textArea.textAreaRef.value
        let tags = this.state.tags
        let force = 2
        if (!name || !this.state.gender || !title) {
            message.warning('姓名,性别, 职位不能为空')
            return
        }
        let options = { id, name, gender, type, title, age, telephone, isSecrecy, picture, remarks, tags, force }
        let { data } = await api.modifyPerson(options)
        if (data.code === 0) {
            message.success("人员信息全部覆盖成功")
            this.props.history.push('/manage')
        } else if (data.code === 20106) {
            let similarList = data.data.similar
            this.setState({
                selectSimilarId: "",
                coverCheckModalVisible: true,
                similarList
            })
        } else {
            message.error(data.message)
        }
    }
    getPersonInfo = async (id) => {
        let { data } = await api.getPersonInfo(id)
        return data.data

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
    handleCancel = () => {
        this.setState({
            coverCheckModalVisible: false,
            personDeleteModalVisible: false
        })
    }
    coverTypeChange = (e) => {
        this.setState({
            coverType: e.target.value,
        });
    }
    selectSimilarItem = (id) => {
        this.setState({ selectSimilarId: id })
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
        const coverCheckModal = (
            <Modal
                className="coverCheckModal"
                width={600}
                title=""
                zIndex={999999}
                footer={null}
                onCancel={this.handleCancel}
                visible={this.state.coverCheckModalVisible}
            >
                <div className="left">
                    <div className="title">
                        <span>覆盖已有人员</span>
                        <span>检测到库中有相似人脸</span>
                    </div>
                    <div className="list">
                        <IScroll isShowBar={false}>
                            {
                                this.state.similarList.map((v, i) =>
                                    <div onClick={this.selectSimilarItem.bind(this, v.id)} key={i} className={this.state.selectSimilarId === v.id ? "card active" : "card"}>
                                        <div className="img">
                                            <img src={v.picture ? v.picture : defaultAva} alt="" />
                                        </div>
                                        <div className="info">
                                            <div className="name">{v.name}</div>
                                            <div className="title">{v.title}</div>
                                        </div>
                                    </div>
                                )
                            }
                        </IScroll>
                    </div>
                    <div className="btn">
                        <Button onClick={this.forciblyCreatePerson}>新建人员</Button>
                    </div>
                </div>
                <div className="right">
                    <div className="select">
                        <RadioGroup onChange={this.coverTypeChange} value={this.state.coverType}>
                            <Radio value={1}>只覆盖人员照片</Radio>
                            <Radio value={2}>照片与人员信息同时覆盖</Radio>
                        </RadioGroup>
                    </div>
                    <div className="btn">
                        <Button onClick={this.coverPerson}>覆盖已有人员</Button>
                    </div>
                </div>
            </Modal>
        )
        return (
            <div className="add-person">
                {deleteModal}
                {addTagModal}
                {coverCheckModal}
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
                        <div className="box tags">
                            <div className="key">活动标签</div>
                            <div className="value">
                                {this.state.tags.map((v, i) => (
                                    <span key={i} className="tag">{v}</span>
                                ))}
                                <span onClick={this.showTagModal} className="addBtn"><Icon type="plus" /></span>
                            </div>
                        </div>
                        <div className="box">
                            <div className="key">职位/称谓<span>*必填</span></div>
                            <div className="value">
                                <Input ref="titleDOM"></Input>
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
                        <div className="box">
                            <div className="key">备注</div>
                            <div className="value">
                                <TextArea ref="textArea" autosize={{ minRows: 2, maxRows: 4 }} />
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
                                action=""
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