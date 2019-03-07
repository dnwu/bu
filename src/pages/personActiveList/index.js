import React, { Component } from 'react';
import api from './../../server'
import { Icon,Empty } from "antd"
import moment from 'moment';
import './index.scss'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import logoImg from './../../static/logo.png'
import positonImg from './../../static/positon.svg'
import defaultImg from './../../static/init.png'
import tagImg from './../../static/tag.svg'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeList: [],
            isHas: true,
            activesInfo: {},
            personInfo: {}
        }
        this.page = 1
        this.pageSize = 10
    }
    componentDidMount() {
        let id = sessionStorage.getItem("personId")
        let personInfo = JSON.parse(sessionStorage.getItem("personInfo"))
        console.log('id', id);
        this.setState({
            id,
            personInfo
        }, () => {
            this.getList(1)
        })
    }
    getList = async (page) => {
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            id: this.state.id
        }
        let { data } = await api.getPersonActiveList(options)
        console.log(data.data);
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
        }
    }
    downGetList = async () => {
        if (this.state.activeList.length === this.state.activesInfo.total) return
        this.page++
        await this.getList(this.page)
    }
    render() {
        let { personInfo, activesInfo, activeList } = this.state
        const activeCard = (
            activeList.map((v, i) => (
                <div className="card">
                    <div className="img">
                        <img src={v.picture ? v.picture : defaultImg} alt="" />
                    </div>
                    <div className="info">
                        <div className="top">
                            <div className="name">{v.name}</div>
                            <div className="tags">
                                {
                                    v.tags && v.tags.map((ele, index) => 
                                        <span key={index}><img src={tagImg} alt="" />{v}</span>
                                    )
                                }
                            </div>
                        </div>
                        <div className="bottom">
                            <div className="positon">
                                <img src={positonImg} alt="" />
                                <span className="positon">{v.city}</span>
                                <span className="time">{moment(v.startTime * 1000).format("YYYY.MM.DD")}</span>
                            </div>
                            <div className={v.status === 2 ? "status active" : "status"}>{v.status === 1 ? "已预约" : v.status === 2 ? "进行中" : v.status === 3 ? "已结束" : "未知"}</div>
                        </div>
                    </div>
                </div>
            ))
        )
        return (
            <div className="person-active-list">
                <Head></Head>
                <div className="body">
                    <div className="body-head">
                        <div className="left">
                            <div className="tit">出席事件列表</div>
                            <div className="num">
                                <div className="title">出席事件</div>
                                <div className="num">{activesInfo.total}</div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="name"><img className={personInfo.type === 2 ? "" : 'norm'} src={personInfo.type === 2 ? vipImg : normImg} alt="" />{personInfo.name}</div>
                            <div className="tags">
                                {
                                    personInfo.tags && personInfo.tags.map((v, i) =>
                                        <span key={i}><img src={tagImg} alt="" />{v}</span>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="body-main">
                        <div className="scroll">
                            <IScroll
                                scrollEnd={this.downGetList}
                                isShowBar={false}>
                                {activeCard}
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
                            </IScroll>
                        </div>
                        <div className="logo">
                            <img src={logoImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;