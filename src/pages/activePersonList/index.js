import React, { Component } from 'react';
import './index.scss'
import { Empty, Icon } from 'antd'
import moment from 'moment'
import api from './../../server'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import tagImg from './../../static/tag.svg'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import defaultAva from './../../static/default.png'
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            activeInfo: {},
            vipList: [],
            normList: [],
            otherList: [],
            vipTotal: 0,
            normTotal: 0,
            otherTotal: 0,
            vipIsHas: true,
            normIsHas: true,
            otherIsHas: true
        }
        this.vipPage = 1
        this.normPage = 1
        this.otherPage = 1
        this.pageSize = 10
    }
    componentDidMount() {
        let id = sessionStorage.getItem("activeId")
        let activeInfo = JSON.parse(sessionStorage.getItem("activeInfo"))
        console.log('activeInfo', activeInfo);
        this.setState({
            id,
            activeInfo
        }, () => {
            this.getVipList(1, 2) // vip
            this.getNormList(1, 1) // 陪访
            this.getOtherList(1, -1) // 其他
        })
    }
    getVipList = async (page, type) => {
        // type(number): 人员类别 人员属性 -1 未知 1 内部陪访人员 2 VIP
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type,
            id: this.state.id
        }
        let { data } = await api.getActivePersonList(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.vipList))
            list.push(...data.data.persons)
            if (list.length === data.data.total) {
                this.setState({
                    vipList: list,
                    vipTotal: data.data.total,
                    vipIsHas: false
                })
            } else {
                this.setState({
                    vipList: list,
                    vipTotal: data.data.total,
                    vipIsHas: true
                })
            }
        }
        console.log(data);
    }
    getNormList = async (page, type) => {
        // type(number): 人员类别 人员属性 -1 未知 1 内部陪访人员 2 VIP
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type,
            id: this.state.id
        }
        let { data } = await api.getActivePersonList(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.normList))
            list.push(...data.data.persons)
            if (list.length === data.data.total) {
                this.setState({
                    normList: list,
                    normTotal: data.data.total,
                    normIsHas: false
                })
            } else {
                this.setState({
                    normList: list,
                    normTotal: data.data.total,
                    normIsHas: true
                })
            }
        }
        console.log(data);
    }
    getOtherList = async (page, type) => {
        // type(number): 人员类别 人员属性 -1 未知 1 内部陪访人员 2 VIP
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type,
            id: this.state.id
        }
        let { data } = await api.getActivePersonList(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.otherList))
            list.push(...data.data.persons)
            if (list.length === data.data.total) {
                this.setState({
                    otherList: list,
                    otherTotal: data.data.total,
                    otherIsHas: false
                })
            } else {
                this.setState({
                    otherList: list,
                    otherTotal: data.data.total,
                    otherIsHas: true
                })
            }
        }
        console.log(data);
    }
    vipDownGetList = async () => {
        if (!this.state.vipIsHas) return
        this.vipPage++
        await this.getVipList(this.vipPage, 2)
    }
    normDownGetList = async () => {
        if (!this.state.normIsHas) return
        this.normPage++
        await this.getVipList(this.normPage, 1)
    }
    otherDownGetList = async () => {
        if (!this.state.otherIsHas) return
        this.otherPage++
        await this.getVipList(this.otherPage, -1)
    }
    render() {
        let { activeInfo } = this.state
        const vipCard = (
            this.state.vipList.map((v, i) =>
                <div className="card" key={i}>
                    <div className="left">
                        <div className="img"><img src={v.picture ? v.picture : defaultAva} alt="" /></div>
                        <div className="info">
                            <div className="name">{v.name}</div>
                            <div className="title">{v.title}</div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="time">{moment(v.createdTime * 1000).format("hh:mm")}</div>
                        <div className="times"><span>到访次数:</span><span>{v.number}</span></div>
                    </div>
                </div>
            )
        )
        const normCard = (
            this.state.normList.map((v, i) =>
                <div className="card" key={i}>
                    <div className="left">
                        <div className="img"><img src={v.picture ? v.picture : defaultAva} alt="" /></div>
                        <div className="info">
                            <div className="name">{v.name}</div>
                            <div className="title">{v.title}</div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="time">{moment(v.createdTime * 1000).format("hh:mm")}</div>
                        <div className="times"><span>到访次数:</span><span>{v.number}</span></div>
                    </div>
                </div>
            )
        )
        const otherCard = (
            this.state.otherList.map((v, i) =>
                <div className="card" key={i}>
                    <div className="left">
                        <div className="img"><img src={v.picture ? v.picture : defaultAva} alt="" /></div>
                        <div className="info">
                            <div className="name">{v.name}</div>
                            <div className="title">{v.title}</div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="time">{moment(v.createdTime * 1000).format("hh:mm")}</div>
                        <div className="times"><span>到访次数:</span><span>{v.number}</span></div>
                    </div>
                </div>
            )
        )
        return (
            <div className="active-person-list">
                <Head></Head>
                <div className="body">
                    <div className="top">
                        <div className="t-top">
                            <div className="left">
                                <span>到访人员列表</span><span>10人</span>
                            </div>
                            <div className="right">
                                <div className="name">
                                    {activeInfo.name}
                                </div>
                                <div className="tags">
                                    {
                                        activeInfo.tags && activeInfo.tags.map((v, i) =>
                                            <span key={i}><img src={tagImg} alt="" />{v}</span>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="t-bottom">
                            <div>
                                <div className="tit">VIP人员</div>
                                <div className="num">{this.state.vipTotal} <img className="vip" src={vipImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="tit">陪访人员</div>
                                <div className="num">{this.state.normTotal} <img className='norm' src={normImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="tit">其他人员</div>
                                <div className="num">{this.state.otherTotal}</div>
                            </div>
                        </div>
                    </div>
                    <div className="body-main">
                        <div className="vip">
                            <IScroll scrollEnd={this.vipDownGetList} isShowBar={false}>
                                {vipCard}
                                {this.state.vipIsHas ?
                                    <div className="loading">
                                        正在加载下一页数据...<Icon type="loading"></Icon>
                                    </div> :
                                    this.state.vipList.length === 0 ?
                                        <Empty image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" className="empty" description="暂无数据"></Empty> :
                                        <div className="loading">
                                            已经没有数据了
                                        </div>
                                }
                            </IScroll>
                        </div>
                        <div className="norm">
                            <IScroll scrollEnd={this.normDownGetList} isShowBar={false}>
                                {normCard}
                                {this.state.normIsHas ?
                                    <div className="loading">
                                        正在加载下一页数据...<Icon type="loading"></Icon>
                                    </div> :
                                    this.state.normList.length === 0 ?
                                        <Empty image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" className="empty" description="暂无数据"></Empty> :
                                        <div className="loading">
                                            已经没有数据了
                                        </div>
                                }
                            </IScroll>
                        </div>
                        <div className="other">
                            <IScroll scrollEnd={this.otherDownGetList} isShowBar={false}>
                                {otherCard}
                                {this.state.otherIsHas ?
                                    <div className="loading">
                                        正在加载下一页数据...<Icon type="loading"></Icon>
                                    </div> :
                                    this.state.otherList.length === 0 ?
                                        <Empty image="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCAxKSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxlbGxpcHNlIGZpbGw9IiNGNUY1RjUiIGN4PSIzMiIgY3k9IjMzIiByeD0iMzIiIHJ5PSI3Ii8+CiAgICA8ZyBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI0Q5RDlEOSI+CiAgICAgIDxwYXRoIGQ9Ik01NSAxMi43Nkw0NC44NTQgMS4yNThDNDQuMzY3LjQ3NCA0My42NTYgMCA0Mi45MDcgMEgyMS4wOTNjLS43NDkgMC0xLjQ2LjQ3NC0xLjk0NyAxLjI1N0w5IDEyLjc2MVYyMmg0NnYtOS4yNHoiLz4KICAgICAgPHBhdGggZD0iTTQxLjYxMyAxNS45MzFjMC0xLjYwNS45OTQtMi45MyAyLjIyNy0yLjkzMUg1NXYxOC4xMzdDNTUgMzMuMjYgNTMuNjggMzUgNTIuMDUgMzVoLTQwLjFDMTAuMzIgMzUgOSAzMy4yNTkgOSAzMS4xMzdWMTNoMTEuMTZjMS4yMzMgMCAyLjIyNyAxLjMyMyAyLjIyNyAyLjkyOHYuMDIyYzAgMS42MDUgMS4wMDUgMi45MDEgMi4yMzcgMi45MDFoMTQuNzUyYzEuMjMyIDAgMi4yMzctMS4zMDggMi4yMzctMi45MTN2LS4wMDd6IiBmaWxsPSIjRkFGQUZBIi8+CiAgICA8L2c+CiAgPC9nPgo8L3N2Zz4K" className="empty" description="暂无数据"></Empty> :
                                        <div className="loading">
                                            已经没有数据了
                                        </div>
                                }
                            </IScroll>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;