import React, { Component } from 'react';
import api from './../../server'
import moment from 'moment'
import { Icon, message } from "antd"
import Head from './../../component/Head'
import Progress from './../../component/Progress'
import HProgress from './../../component/HProgress'
import HBar from './../../component/HBar'
import './index.scss'
import tagImg from './../../static/tag.svg'
// import defaultImg from './../../static/default.png'
import pointImg from './../../static/point.svg'
import logoImg from './../../static/logo.png'
import position from './../../static/positon.svg'
import point from "./../../static/point.svg"
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeInfo: {},
            statistics: {
                gender: {
                    man: { percent: 0, val: 0 },
                    woman: { percent: 0, val: 0 }
                },
                age: { young: 0, middle: 0, elderly: 0 },
                type: [0, 0, 0]
            }
        }
    }
    componentDidMount() {
        let id = this.props.location.params && this.props.location.params.id
        if (!id) {
            id = sessionStorage.getItem("activeId")
        }
        this.getActiveInfo(id)
        this.getActiveStatisticsInfo(id)
    }
    getActiveInfo = async (id) => {
        let { data } = await api.getActiveInfo(id)
        if (data.code === 0) {
            // console.log(data.data);
            sessionStorage.setItem("activeInfo", JSON.stringify(data.data))
            this.setState({ activeInfo: data.data })
        } else {
            message.warning(data.message)
        }
    }
    getActiveStatisticsInfo = async (id) => {
        let options = { id }
        let { data } = await api.getActiveStatisticsInfo(options)
        // console.log(data.data);
        if (data.code === 0) {
            let obj = this.fromatStatistics(data.data)
            this.setState({ statistics: obj })
        } else {
            message.warning(data.message)
        }
    }
    fromatStatistics = (data) => {
        let totalAge = this.add(data.age)
        let totalGender = this.add(data.gender)
        let age, gender
        if (totalAge === 0) {
            age = { young: 0, middle: 0, elderly: 0 }
        } else {
            age = {
                young: Math.round(data.age[0] / totalAge * 10000) / 100.00,
                middle: Math.round(data.age[1] / totalAge * 10000) / 100.00,
                elderly: Math.round(data.age[2] / totalAge * 10000) / 100.00
            }
        }

        if (totalGender === 0) {
            gender = {
                man: { percent: 0, val: 0 },
                woman: { percent: 0, val: 0 }
            }
        } else {
            gender = {
                man: {
                    val: data.gender[0],
                    percent: Math.round(data.gender[0] / totalGender * 10000) / 100.00
                },
                woman: {
                    val: data.gender[1],
                    percent: Math.round(data.gender[1] / totalGender * 10000) / 100.00
                }
            }
        }
        let obj = { age, gender, type: data.type }
        return obj
    }
    // 数组求和
    add = (arr) => {
        let num = 0
        arr.forEach(v => {
            num += v
        })
        return num
    }
    goto = () => {
        this.props.history.push("/search/active-person-list")
    }
    render() {
        let { activeInfo, statistics } = this.state
        console.log(activeInfo);
        
        return (
            <div className="active-info">
                <Head></Head>
                <div className="body">
                    <div className="tit">
                        <div className="left">
                            <h3>{activeInfo.name}</h3>
                            <div>
                                {activeInfo.tags && activeInfo.tags.map((v, i) =>
                                    <span key={i}><img src={tagImg} alt="" />{v}</span>
                                )}
                            </div>
                        </div>
                        <div className="right">
                            <Icon onClick={this.goto} type="menu-unfold" />
                            <p className="ch">到访人员列表</p>
                            <p className="en">People List</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-left">
                            <div className="info-title">
                                <div className={activeInfo.status === 2 ? "status active" : "status"}>{activeInfo.status === 1 ? "已预约" : activeInfo.status === 2 ? "进行中" : activeInfo.status === 3 ? "已结束" : "未知"}</div>
                                <div className="time"><img src={position} alt="" />{moment(activeInfo.startTime * 1000).format("YYYY-MM-DD")}</div>
                                <div className="positon">{activeInfo.city}</div>
                                <div className="detail">{activeInfo.location}</div>
                            </div>
                            <div className="info-detail">
                                <div className="box">
                                    <div className="key">预约人员</div>
                                    <div className="val">{activeInfo.user ? activeInfo.user : "无"}</div>
                                </div>
                                <div className="box">
                                    <div className="key">预约部门</div>
                                    <div className="val">{activeInfo.userDepartment ? activeInfo.userDepartment : "无"}</div>
                                </div>
                                <div className="box">
                                    <div className="key">客户名称</div>
                                    <div className="val">{activeInfo.personName ? activeInfo.personName : "无"}</div>
                                </div>
                                <div className="box">
                                    <div className="key">客户类型</div>
                                    <div className="val">{activeInfo.personClass ? activeInfo.personClass : "无"}</div>
                                </div>
                            </div>
                            <div className="mark">
                                <span>{activeInfo.remarks ? activeInfo.remarks : "无"}</span>
                            </div>
                            <div className="info-time-card">
                                <div className="time-card-left">
                                    <div className="reserve-time">预约开始 {moment(activeInfo.reserveStartTime*1000).format("hh:mm")}</div>
                                    <div className="real">开始时间 {moment(activeInfo.startTime*1000).format("hh:mm")}</div>
                                </div>
                                <div className="time-card-mid">
                                    <img src={pointImg} alt="" />
                                    <div className="line"></div>
                                </div>
                                <div className="time-card-right">
                                    <div className="reserve-time">预约结束 {moment(activeInfo.reserveFinishTime*1000).format("hh:mm")}</div>
                                    <div className="real">结束时间 {moment(activeInfo.finishTime*1000).format("hh:mm")}</div>
                                </div>
                            </div>
                        </div>
                        <div className="info-img">
                            {
                                activeInfo.picture ? <img src={activeInfo.picture} alt="" /> : <img className="none" src={logoImg} alt="" />
                            }

                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="left">
                            <div className="title">
                                <span>性别分布</span><img src={point} alt="" />
                            </div>
                            <div className="man box">
                                <div className="box-desc">
                                    <div className="box-desc-left">
                                        <div className="key">男性</div>
                                        <div className="val">{statistics.gender.man.val}</div>
                                    </div>
                                    <div className="box-desc-right">
                                        {statistics.gender.man.percent}%
                                    </div>
                                </div>
                                <div className="box-progress">
                                    <HProgress percent={statistics.gender.man.percent}></HProgress>
                                </div>
                            </div>
                            <div className="woman box">
                                <div className="box-desc">
                                    <div className="box-desc-left">
                                        <div className="key">女性</div>
                                        <div className="val">{statistics.gender.woman.val}</div>
                                    </div>
                                    <div className="box-desc-right">
                                        {statistics.gender.woman.percent}%
                                    </div>
                                </div>
                                <div className="box-progress">
                                    <HProgress percent={statistics.gender.woman.percent} bgColor="#8A56A7"></HProgress>
                                </div>
                            </div>
                        </div>
                        <div className="mid">
                            <div className="title">
                                <span>年龄分布</span><img src={point} alt="" />
                            </div>
                            <div className="box">
                                <div className="box-item">
                                    <div className="progress">
                                        <Progress percent={statistics.age.young}></Progress>
                                    </div>
                                    <div className="type">青年</div>
                                </div>
                                <div className="box-item">
                                    <div className="progress">
                                        <Progress percent={statistics.age.middle}></Progress>
                                    </div>
                                    <div className="type">中年</div>
                                </div>
                                <div className="box-item">
                                    <div className="progress">
                                        <Progress percent={statistics.age.elderly}></Progress>
                                    </div>
                                    <div className="type">老年</div>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="title">
                                <span>出席人员</span><img src={point} alt="" />
                            </div>
                            <div className="box">
                                <div className="progress">
                                    <HBar xAxis={["重要人员", "陪访人员", "其他人员"]} yAxis={statistics.type}></HBar>
                                </div>
                                <div className="num">
                                    <div className="key">{this.add(statistics.type)}</div>
                                    <div className="val">本次活动人数</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;