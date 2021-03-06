import React, { Component } from 'react';
import { Radio, Button, Icon, Spin, Modal, message, Empty } from 'antd'
import api from './../../server'
import moment from "moment"
import tools from './../../tools'
import './index.scss'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import manageSvg from './../../static/manage.svg'
import tagSvg from './../../static/tag.svg'
import positonSvg from './../../static/positon.svg'
import pointSvg from './../../static/point.svg'
import logoImg from './../../static/logo.png'
// import defaultImg from './../../static/init.png'

let page = 1
let pageSize = 10
class index extends Component {
    state = {
        deleteModalVisible: false,
        selectType: "-1",
        status: "", // status 1,2,3分别代表已预约, 进行中, 已结束 , 空表示全部
        activeInfo: {},
        activesInfo: {
            total: 0,
            totalThisMonth: 0
        },
        activeList: [],
        loading: false,
        isHas: true
        // control: true
    }
    componentDidMount() {
        page = 1

        this.getActiveList(1, -1)
    }
    getActiveList = async (page, status) => {
        // status 1,2,3分别代表已预约, 进行中, 已结束 ,空表示全部
        // 
        let options = {
            offset: (page - 1) * pageSize,
            limit: pageSize,
            status: status
        }
        let { data } = await api.getActiveList(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.activeList))
            list.push(...data.data.activities)
            if (list.length === data.data.total) {
                this.setState({
                    activesInfo: data.data,
                    activeList: list,
                    isHas: false
                })
            } else {
                this.setState({
                    activesInfo: data.data,
                    activeList: list,
                    isHas: true
                })
            }
            // 如果是第一次请求, 然后初始化事件详情
            if (page === 1) {
                if (data.data.activities[0]) {
                    await this.getActiveInfo(data.data.activities[0].id)
                    this.setState({
                        selectId: data.data.activities[0].id,
                    })
                }
            }
        }
    }
    downGetList = async (info) => {
        if (this.state.activeList.length === this.state.activesInfo.total) return
        page++
        await this.getActiveList(page, this.state.status)
        // this.getActiveInfo(this.state.selectId)
    }
    // 获取右侧事件信息
    getActiveInfo = async (id) => {
        this.setState({
            loading: true
        })
        let { data } = await api.getActiveInfo(id)
        if (data.code === 0) {
            this.setState({
                activeInfo: data.data,
                selectId: id,
                loading: false
            })
        }
    }
    typeChage = (e) => {
        page = 1
        this.refs.IScroll.resetDOM()
        this.setState({
            activesInfo: {
                total: 0,
                totalThisMonth: 0
            },
            activeList: [],
            selectType: e.target.value
        }, () => {
            this.getActiveList(1, e.target.value)
        })
    }
    goto = (path) => {
        sessionStorage.removeItem('activeInfo')
        this.props.history.push(path)
    }
    modifyActive = () => {
        // 'create-active?id=' + this.state.selectId
        this.props.history.push({ pathname: "create-active", params: { activeInfo: JSON.parse(JSON.stringify({ ...this.state.activeInfo, activeId: this.state.selectId })) } })
    }
    modifyActiveStatus = async () => {
        let type = this.state.type
        let id = this.state.activeInfo.id
        let status = -1
        if (type === 'start') {
            status = 2
        } else if (type === 'end') {
            status = 3
        }
        let options = {
            id,
            status,
        }
        let { data } = await api.modifyActiveStatus(options)
        if (data.code === 0) {
            page = 1
            this.setState({ loading: true, deleteModalVisible: false })
            setTimeout(() => {
                this.setState({
                    activesInfo: {
                        total: 0,
                        totalThisMonth: 0
                    },
                    loading: false,
                    activeList: [],

                }, async () => {
                    await this.getActiveList(1, this.state.selectType)
                    await this.getActiveInfo(id)
                    if (type === 'start') {
                        message.success("事件开始啦")
                    } else if (type === 'end') {
                        message.success("事件结束")
                    }
                })
            }, 2000)
        }
    }
    modifyActiveStatusBtn = (type) => {
        let modalTit
        if (type === 'start') {
            modalTit = "确认要开始事件吗"
        } else if (type === 'end') {
            modalTit = "确认要结束事件吗"
        }
        this.setState({ deleteModalVisible: true, type, modalTit })
    }
    handleCancel = () => { this.setState({ deleteModalVisible: false }) }
    select = (id) => {
        this.getActiveInfo(id)
        this.setState({
            selectId: id
        })
    }
    render() {
        // let activeInfo = this.state.activeInfo
        const cardList = (
            this.state.activeList.map((v, i) => {
                return (
                    <div onClick={this.select.bind(this, v.id)} className={`card ${this.state.selectId === v.id ? 'active' : ''}`} key={v.id}>
                        <div className="img"><img src={v.Picture} alt="" /></div>
                        <div className="info">
                            <div className="title">
                                <span>{v.name}</span>
                                <span>{v.status === 2 ? '正在进行' : ''}</span>
                            </div>
                            <div className="t-info">
                                <img src={positonSvg} alt="" />
                                <span>{v.city}</span>
                                <span>{tools.formatDate(v.startTime)}</span>
                                <span>{v.status === 1 ? '已预约' : v.status === 2 ? '已预约' : v.status === 3 ? '已结束' : '无状态'}</span>
                            </div>
                        </div>
                    </div>
                )
            })
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
                    <p className="word">{this.state.modalTit}</p>
                </div>
                <div className="btn">
                    <Button onClick={this.handleCancel} className="cancel">取消</Button>
                    <Button onClick={this.modifyActiveStatus} className="sure">确认</Button>
                </div>
            </Modal>
        )
        return (
            <div className="reserve">
                {deleteModal}
                <Head></Head>
                <div className="top-nav">
                    <div className="nav">
                        <Radio.Group onChange={this.typeChage} className="nav-btn" defaultValue="-1" buttonStyle="solid">
                            <Radio.Button value="-1">全部</Radio.Button>
                            <Radio.Button value="1">已预约</Radio.Button>
                            <Radio.Button value="3">已结束</Radio.Button>
                        </Radio.Group>
                        <div className="info">
                            <div className="box">
                                <p className="title">所有事件</p>
                                <p className="num">{this.state.activesInfo.total}</p>
                            </div>
                            <div className="box">
                                <p className="title">本月事件</p>
                                <p className="num">{this.state.activesInfo.totalThisMonth}</p>
                            </div>
                        </div>
                    </div>
                    <div className="create">
                        <div className="icon"><Icon type="ellipsis" /></div>
                        <div className="btn"><Button onClick={this.goto.bind(this, '/create-active')}>创建事件</Button></div>
                        <div className="icon"><Icon type="ellipsis" /></div>
                    </div>
                    <div className="manage-box">
                        <img onClick={this.goto.bind(this, '/manage')} src={manageSvg} alt="" />
                        <p className="ch">人员管理</p>
                        <p className="en">Management</p>
                    </div>
                </div>
                <div className="body-main">
                    <div className="body-main-left">
                        <IScroll
                            ref="IScroll"
                            scrollEnd={this.downGetList}
                        >
                            {cardList}
                            {this.state.isHas ?
                                <div className="loading">
                                    正在加载下一页数据...<Icon type="loading"></Icon>
                                </div> :
                                this.state.activeList.length === 0 ?
                                    <Empty image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" className="empty" description="暂无数据"></Empty> :
                                    <div className="loading">
                                        已经没有数据了
                                    </div>
                            }
                            {/* {this.state.isHas ?
                                <div className="loading">
                                    正在加载下一页数据...<Icon type="loading"></Icon>
                                </div> :
                                <div className="loading">
                                    已经没有数据了
                            </div>
                            } */}
                        </IScroll>
                    </div>
                    <Spin delay={500} spinning={this.state.loading} tip="Loading...">
                        <div className="contain">
                            <div className="top">
                                <div className="c-left">
                                    <h2>{this.state.activeInfo.name}</h2>
                                    <div>
                                        {
                                            this.state.activeInfo.tags ?
                                                this.state.activeInfo.tags.map((v, i) => (
                                                    <span key={v} ><img src={tagSvg} alt="" />{v}</span>
                                                )) : ''
                                        }
                                    </div>
                                </div>
                                <div className="c-right">
                                    {
                                        this.state.activeInfo.status === 2 ?
                                            <div>
                                                <Icon onClick={this.modifyActiveStatusBtn.bind(this, 'end')} type="issues-close" />
                                                <p>结束</p>
                                            </div> :
                                            this.state.activeInfo.status === 1 ?
                                                <>
                                                    <div>
                                                        <Icon onClick={this.modifyActiveStatusBtn.bind(this, 'start')} type="dashboard" />
                                                        <p>开始</p>
                                                    </div>

                                                    <div>
                                                        <Icon onClick={this.modifyActive} type="setting" />
                                                        <p>编辑</p>
                                                    </div>
                                                </>
                                                : null
                                    }
                                </div>
                            </div>
                            <div className="info">
                                <div className="info-left">
                                    <div className="h">
                                        <span>{this.state.activeInfo.status === 3 ? '已结束' : "已预约"}</span>
                                        <span>{this.state.activeInfo.status === 2 ? '正在进行' : ""}</span>
                                        <span>{moment(this.state.activeInfo.startTime*1000).format("YYYY-MM-DD")}</span>
                                    </div>
                                    <div className="positon">
                                        <img src={positonSvg} alt="" />
                                        <span>{this.state.activeInfo.city}</span>
                                        <span>{this.state.activeInfo.location}</span>
                                    </div>
                                    <div className="reserve-info">
                                        <div className="box">
                                            <div className="key">预约人员</div>
                                            <div className="value">{this.state.activeInfo.user?this.state.activeInfo.user:"无"}</div>
                                        </div>
                                        <div className="box">
                                            <div className="key">预约部门</div>
                                            <div className="value">{this.state.activeInfo.userDepartment?this.state.activeInfo.userDepartment:"无"}</div>
                                        </div>
                                    </div>
                                    <div className="reserve-info">
                                        <div className="box">
                                            <div className="key">客户名称</div>
                                            <div className="value">{this.state.activeInfo.personName?this.state.activeInfo.personName:"无"}</div>
                                        </div>
                                        <div className="box">
                                            <div className="key">预约部门</div>
                                            <div className="value">{this.state.activeInfo.personClass?this.state.activeInfo.personClass:"无"}</div>
                                        </div>
                                    </div>
                                    <div className="remark">{this.state.activeInfo.remarks}</div>
                                    <div className="start-end-card">
                                        <div className="start-end">
                                            <div className="start">
                                                <p>{tools.formatTime(this.state.activeInfo.startTime)}</p>
                                                <p>开始</p>
                                            </div>
                                            <div className="mid">
                                                <p><img src={pointSvg} alt="" /></p>
                                                <p className="line"></p>
                                            </div>
                                            <div className="end">
                                                <p>{tools.formatTime(this.state.activeInfo.finishTime)}</p>
                                                <p>结束</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="info-right">
                                    <img className={this.state.activeInfo.picture ? "has" : ""} src={this.state.activeInfo.picture ? this.state.activeInfo.picture : logoImg} alt="" />
                                </div>
                            </div>
                        </div>
                    </Spin>
                </div>
            </div>
        );
    }
}

export default index;