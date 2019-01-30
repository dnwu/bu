import React, { Component } from 'react';
import { Icon, DatePicker, Empty } from 'antd'
import moment from 'moment'
import api from './../../server'
import './index.scss'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import LogoImg from './../../static/logo.png'
import defaultImg from './../../static/init.png'
import positonImg from './../../static/positon.svg'
import tagImg from './../../static/tag.svg'
const { RangePicker } = DatePicker;
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerVisible: false,
            activesList: [],
            activeIsHas: true,
            startTIme: moment().format("X"),
            endTIme: moment().format("X")
        }
        this.page = 1
        this.pageSize = 10
    }
    componentDidMount() {
        this.getList(1)
    }
    getList = async (page) => {
        let options
        if (this.state.drawerVisible) {
            options = {
                key: "",
                city_id: "",
                startTime: this.state.startTIme,
                endTime: this.state.endTIme,
                offset: (page - 1) * this.pageSize,
                limit: this.pageSize
            }
        } else {
            options = {
                key: "",
                city_id: "",
                startTime: 0,
                endTime: 999999999999,
                offset: (page - 1) * this.pageSize,
                limit: this.pageSize
            }
        }
        let { data } = await api.getActivesBySearch(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.activesList))
            list.push(...data.data.activities)
            if (list.length === data.data.total) {
                this.setState({
                    activesList: list,
                    acitiveTotal: data.data.total,
                    activeIsHas: false
                })
            } else {
                this.setState({
                    activesList: list,
                    acitiveTotal: data.data.total,
                    activeIsHas: true
                })
            }
        }
    }
    listScrollEnd = async () => {
        if (!this.state.activeIsHas) return
        this.page++
        await this.getList(this.page)
    }
    drawerClose = () => {
        this.setState({
            drawerVisible: false,
            activesList: []
        }, () => {
            this.getList(1)
        })
    }
    showDrawer = () => {
        this.setState({
            drawerVisible: true
        })
    }
    rangePickerChange = (date) => {
        let start = moment(date[0]).format("X")
        let end = moment(date[1]).format("X")
        this.setState({
            startTIme: start,
            endTIme: end,
            activesList: []
        }, () => {
            this.getList(1)
        })
    }
    render() {
        const drawer = (
            this.state.drawerVisible ?
                <div className="drawer">
                    <div className="close"><Icon onClick={this.drawerClose} type="close-circle" /></div>
                    <div className="logo">
                        <Icon type="schedule" />
                        <p className="ch">时段查询</p>
                        <p className="en">Query by time</p>
                    </div>
                    <div className="picker">
                        <p>活动日期选择</p>
                        <RangePicker onChange={this.rangePickerChange} open></RangePicker>
                    </div>
                    <div className="info">
                        <p>筛选日期</p>
                        <div className="time-box">{moment(this.state.startTIme * 1000).format("YYYY-MM-DD")}</div>
                        <div className="word">至</div>
                        <div className="time-box">{moment(this.state.endTIme * 1000).format("YYYY-MM-DD")}</div>
                    </div>

                </div> : null
        )
        const card = (
            this.state.activesList.map((v, i) =>
                <div key={i} className="card">
                    <div className="left">
                        <img src={v.picture ? v.picture : defaultImg} alt="" />
                    </div>
                    <div className="right">
                        <div className="top">
                            <div className="title">{v.name}</div>
                            <div className="tags">
                                {
                                    v.tags && v.tags.map((v, i) =>
                                        <span key={i}><img src={tagImg} alt="" />{v}</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="position">
                                <img src={positonImg} alt="" />
                                <span className="city">{v.city}</span>
                                <span className="time">{moment(v.startTime * 1000).format("YYYY.MM.DD")}</span>
                            </div>
                            <div className={v.status === 2 ? "status active" : "status"}>{v.status === 1 ? "已预约" : v.status === 2 ? "进行中" : v.status === 3 ? "已结束" : "未知"}</div>
                        </div>
                    </div>
                </div>
            )
        )
        return (
            <div className="all-active">
                {drawer}
                <Head></Head>
                <div className="body">
                    <div className="body-head">
                        <div className="left">
                            <h4>所有活动列表</h4>
                            <div>
                                <div className="title">所有活动</div>
                                <div className="num">{this.state.acitiveTotal}</div>
                            </div>
                        </div>
                        <div className="right">
                            <Icon onClick={this.showDrawer} type="schedule" />
                            <div className="ch">活动时段</div>
                            <div className="en">Query by time</div>
                        </div>
                    </div>
                    <div className="body-main">
                        <div className="list">
                            <IScroll scrollEnd={this.listScrollEnd} isShowBar={false}>
                                {card}
                                {this.state.activeIsHas ?
                                    <div className="loading">
                                        正在加载下一页数据...<Icon type="loading"></Icon>
                                    </div> :
                                    this.state.activesList.length === 0 ?
                                        <Empty image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" className="empty" description="暂无数据"></Empty> :
                                        <div className="loading">
                                            已经没有数据了
                                        </div>
                                }
                            </IScroll>
                        </div>
                        <div className="logo">
                            <img src={LogoImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;