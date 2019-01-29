import React, { Component } from 'react'
import api from './../../server'
import moment from 'moment'
import { Icon, message } from "antd"
import './index.scss'
import Head from './../../component/Head'
import VBar from './../../component/VBar'
import VipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import tagImg from './../../static/tag.svg'
import defaultImg from './../../static/default.png'
import pointImg from './../../static/point.svg'
import logoImg from './../../static/logo.png'

class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            personInfo: {},
            statistics: {
                activityTotal: 0,
                times: {
                    xAxis: [],
                    yAxis: []
                },
                imgs: []
            }
        }
    }
    componentDidMount() {
        let id = this.props.location.params && this.props.location.params.id
        if (!id) {
            id = sessionStorage.getItem("personId")
        }
        this.getPersonInfo(id)
        this.getpersonStatisticsInfo(id)
    }
    getPersonInfo = async (id) => {
        let { data } = await api.getPersonInfo(id)
        if (data.code === 0) {
            sessionStorage.setItem("personInfo", JSON.stringify(data.data))
            this.setState({
                personInfo: data.data
            })
        } else {
            message.warning(data.message)
        }
    }
    getpersonStatisticsInfo = async (id) => {
        let options = {
            id,
            offset: 0,
            limit: 10,
            imgOffset: 0,
            imgLimit: 3
        }
        let { data } = await api.getpersonStatisticsInfo(options)
        if (data.code === 0) {
            this.formatStatisticsData(data.data)
        } else {
            message.warning(data.message)
        }
    }
    formatStatisticsData(data) {
        let xAxis = Object.keys(data.monthlyCount)
        let yAxis = Object.values(data.monthlyCount)
        xAxis.forEach((v, i) => {
            xAxis[i] = v.slice(-5)
        })
        let imgs = [0, 0, 0]
        imgs.unshift(...data.imgs)
        imgs.splice(3)
        let obj = {
            activityTotal: data.activityTotal,
            times: {
                xAxis,
                yAxis
            },
            imgs
        }
        this.setState({
            statistics: obj
        })
    }
    goto = () => {
        this.props.history.push('/search/person-active-list')
    }
    render() {
        let { personInfo, statistics } = this.state
        return (
            <div className="person-info">
                <Head></Head>
                <div className="body">
                    <div className="tit">
                        <div className="left">
                            <h3>{personInfo.name}<img className={personInfo.type === 2 ? "" : 'norm'} src={personInfo.type === 2 ? VipImg : normImg} alt="" /></h3>
                            <div>
                                {
                                    personInfo.tags && personInfo.tags.map((v, i) =>
                                        <span key={i}><img src={tagImg} alt="" />{v}</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="right">
                            <Icon onClick={this.goto} type="menu-unfold" />
                            <p className="ch">出席活动列表</p>
                            <p className="en">Activities List</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="left-info">
                            <div className="info">
                                <div className="box">
                                    <div className="key">性别</div>
                                    <div className="val">{personInfo.gender === 1 ? "男" : "女"}</div>
                                </div>
                                <div className="box">
                                    <div className="key">职位/称谓</div>
                                    <div className="val">{personInfo.title}</div>
                                </div>
                                <div className="box">
                                    <div className="key">年龄</div>
                                    <div className="val">{personInfo.age}</div>
                                </div>
                                <div className="box">
                                    <div className="key">手机号</div>
                                    <div className="val">{personInfo.telephone ? personInfo.telephone : "无"}</div>
                                </div>
                            </div>
                            <div className="mark">
                                <span>{personInfo.remarks ? personInfo.remarks : "无"}</span>
                            </div>
                            <div className="num">
                                <div className="num">{statistics.activityTotal}</div>
                                <div className="desc">出席活动次数</div>
                            </div>
                        </div>
                        <div className="right-img">
                            <img src={personInfo.picture ? personInfo.picture : defaultImg} alt="" />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="left">
                            <div className="title">活动频次<img src={pointImg} alt="" /></div>
                            <div className="statistics-box">
                                <VBar
                                    xAxis={statistics.times.xAxis}
                                    yAxis={statistics.times.yAxis}></VBar>
                            </div>
                        </div>
                        <div className="right">
                            <div className="title">最近匹配<img src={pointImg} alt="" /></div>
                            <div className="statistics-box">
                                {
                                    statistics.imgs.map((v, i) => {
                                        if (v === 0) {
                                            return (
                                                <div key={i} className="img-box">
                                                    <div className="img">
                                                        <div className="none" >
                                                            <img src={logoImg} alt="" />
                                                        </div>
                                                    </div>
                                                    <p>暂无</p>
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={i} className="img-box">
                                                    <div className="img">
                                                        <img src={"data:image/png;base64," + v.img} alt="" />
                                                    </div>
                                                    <p>{moment(v.ts * 1000).format("YYYY-MM-DD")}</p>
                                                </div>
                                            )
                                        }
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;