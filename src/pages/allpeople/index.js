import React, { Component } from 'react';
import './index.scss'
import { Empty, Icon } from 'antd'
import api from './../../server'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import defauleAva from './../../static/default.png'
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vipList: [],
            normList: [],
            otherList: [],
            vipIsHas: true,
            normIsHas: true,
            otherIsHas: true,
            vipTotal: 0,
            normTotal: 0,
            otherTotal: 0,
        }
        this.vipPage = 1
        this.normPage = 1
        this.otherPage = 1
        this.pageSize = 10
    }
    componentDidMount() {
        this.getVipList(1)
        this.getNormList(1)
        this.getOtherList(1)
    }
    getVipList = async (page) => {
        // type 0, 1, 2 3分别代表全部, 陪访, vip人员 其他
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type: 2,
        }
        let { data } = await api.getPersonList(options)
        console.log(data.data.persons);
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.vipList))
            list.push(...data.data.persons)
            if (list.length === data.data.total) {
                this.setState({
                    vipTotal: data.data.total,
                    vipList: list,
                    vipIsHas: false
                })
            } else {
                this.setState({
                    vipTotal: data.data.total,
                    vipList: list,
                    vipIsHas: true
                })
            }
        }
    }
    getNormList = async (page) => {
        // type 0, 1, 2 3分别代表全部, 陪访, vip人员 其他
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type: 1,
        }
        let { data } = await api.getPersonList(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.normList))
            list.push(...data.data.persons)
            if (list.length === data.data.total) {
                this.setState({
                    normTotal: data.data.total,
                    normList: list,
                    normIsHas: false
                })
            } else {
                this.setState({
                    normTotal: data.data.total,
                    normList: list,
                    normIsHas: true
                })
            }
        }
    }
    getOtherList = async (page) => {
        // type 0, 1, 2 3分别代表全部, 陪访, vip人员 其他
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type: 3,
        }
        let { data } = await api.getPersonList(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.otherList))
            list.push(...data.data.persons)
            if (list.length === data.data.total) {
                this.setState({
                    otherTotal: data.data.total,
                    otherList: list,
                    otherIsHas: false
                })
            } else {
                this.setState({
                    otherTotal: data.data.total,
                    otherList: list,
                    otherIsHas: true
                })
            }
        }
    }
    vipScrollEnd = async () => {
        if (!this.state.vipIsHas) return
        this.vipPage++
        await this.getVipList(this.vipPage)
    }
    normScrollEnd = async () => {
        if (!this.state.normIsHas) return
        this.normPage++
        await this.getVipList(this.normPage)
    }
    otherScrollEnd = async () => {
        if (!this.state.otherIsHas) return
        this.otherPage++
        await this.getVipList(this.otherPage)
    }
    render() {
        const vipCard = (
            this.state.vipList.map((v, i) =>
                <div key={i} className="card">
                    <div className="left">
                        <img src={v.picture ? v.picture : defauleAva} alt="" />
                    </div>
                    <div className="right">
                        <div className="name">{v.name}</div>
                        <div className="title">{v.title}</div>
                    </div>
                </div>
            )
        )
        const normCard = (
            this.state.normList.map((v, i) =>
                <div key={i} className="card">
                    <div className="left">
                        <img src={v.picture ? v.picture : defauleAva} alt="" />
                    </div>
                    <div className="right">
                        <div className="name">{v.name}</div>
                        <div className="title">{v.title}</div>
                    </div>
                </div>
            )
        )
        const otherCard = (
            this.state.otherList.map((v, i) =>
                <div key={i} className="card">
                    <div className="left">
                        <img src={defauleAva} alt="" />
                    </div>
                    <div className="right">
                        <div className="name">{v.name}</div>
                    </div>
                </div>
            )
        )
        return (
            <div className="all-people">
                <Head></Head>
                <div className="body">
                    <div className="body-head">
                        <div className="top">
                            <span>所有人员列表</span><span>10人</span>
                        </div>
                        <div className="bottom">
                            <div>
                                <div className="title">VIP人员</div>
                                <div className="num">{this.state.vipTotal}<img className="vip" src={vipImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="title">陪访人员</div>
                                <div className="num">{this.state.normTotal}<img className="norm" src={normImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="title">其他人员</div>
                                <div className="num">{this.state.otherTotal}</div>
                            </div>
                        </div>
                    </div>
                    <div className="body-main">
                        <div>
                            <IScroll scrollEnd={this.vipScrollEnd} isShowBar={false}>
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
                        <div>
                            <IScroll scrollEnd={this.normScrollEnd} isShowBar={false}>
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
                        <div>
                            <IScroll scrollEnd={this.otherScrollEnd} isShowBar={false}>
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