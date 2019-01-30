import React, { Component } from 'react';
import './index.scss'
import { Button, Icon } from 'antd'
import IScroll from './../../component/IScroll'
import api from './../../server'
import Head from './../../component/Head'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import point from './../../static/point.svg'
import defaultAva from './../../static/default.png'
import tagSvg from './../../static/tag.svg'

class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            vipList: [],
            normList: [],
            vipTotalInfo: {},
            normTotalInfo: {},
            cardInfo: {},  //右側信息
            selectId: -1,
            vipIsHas: true,
            normIsHas: true
        }
        this.vipPage = 1
        this.normPage = 1
        this.pageSize = 10
    }
    componentDidMount() {
        this.vipPage = 1
        this.normPage = 1
        this.getVipList(1)
        this.getNormList(1)
    }
    getVipList = async (page) => {
        // type 0, 1, 2 3分别代表全部, 陪访, vip人员 其他
        let options = {
            offset: (page - 1) * this.pageSize,
            limit: this.pageSize,
            type: 2,
        }
        let { data } = await api.getPersonList(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.vipList))
            list.push(...data.data.persons)
            if (list.length === data.data.total) {

                this.setState({
                    vipTotalInfo: data.data,
                    vipList: list,
                    vipIsHas: false
                })
            } else {
                this.setState({
                    vipTotalInfo: data.data,
                    vipList: list,
                    vipIsHas: true
                })
            }
            if (this.vipPage === 1) {
                let id = data.data.persons[0].id
                this.getPersonInfo(id)
            }
        }
    }
    getNormList = async (page) => {
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
                    normTotalInfo: data.data,
                    normList: list,
                    normIsHas: false
                })
            } else {
                this.setState({
                    normTotalInfo: data.data,
                    normList: list,
                    normIsHas: true
                })
            }
        }
    }
    getPersonInfo = async (id) => {
        let { data } = await api.getPersonInfo(id)
        console.log(data);
        if (data.code === 0) {
            this.setState({
                cardInfo: data.data,
                selectId: data.data.id
            })
        }
    }
    select = (id) => {
        this.setState({
            selectId: id
        }, async () => {
            this.getPersonInfo(id)
        })
    }
    vipList = () => {
        let listDOM = this.state.vipList.map((v, i) => {
            return (
                <div onClick={this.select.bind(this, v.id)} className={`card ${this.state.selectId === v.id ? 'active' : ''}`} key={v.id}>
                    {
                        v.picture ?
                            <img src={v.picture} alt="" /> :
                            <img src={defaultAva} alt="" />
                    }
                    <div>
                        <div className="name">{v.name}</div>
                        <div className="position">{v.title}</div>
                    </div>
                </div>
            )
        })
        return listDOM
    }
    normList = () => {
        let listDOM = this.state.normList.map((v, i) => {
            return (
                <div onClick={this.select.bind(this, v.id)} className={`card ${this.state.selectId === v.id ? 'active' : ''}`} key={v.id}>
                    {
                        v.picture ?
                            <img src={v.picture} alt="" /> :
                            <img src={defaultAva} alt="" />
                    }
                    <div>
                        <div className="name">{v.name}</div>
                        <div className="position">{v.title}</div>
                    </div>
                </div>
            )
        })
        return listDOM
    }
    vipScrollEnd = async () => {
        if (this.state.vipList.length === this.state.vipTotalInfo.total) return
        this.vipPage++
        await this.getVipList(this.vipPage)
    }
    normScrollEnd = async () => {
        if (this.state.normList.length === this.state.normTotalInfo.total) return
        this.normPage++
        await this.getNormList(this.normPage)
    }
    goto = (path) => {
        sessionStorage.removeItem('cardInfo')
        this.props.history.push(path)
    }
    modifyPerson = () => {
        this.props.history.push({ pathname: "add-person", params: { cardInfo: JSON.parse(JSON.stringify(this.state.cardInfo)) } })
    }
    render() {
        return (
            <div className="manage">
                <Head></Head>
                <div className="top">
                    <div className="t-left">
                        <div className="vip">
                            <div className="title">人员信息</div>
                            <div className="box">
                                <div className="t">
                                    vip人员
                                </div>
                                <div className="num">
                                    <span>{this.state.vipTotalInfo.total}</span>
                                    <span><img src={vipImg} alt="" /></span>
                                </div>
                            </div>
                        </div>
                        <div className="norm">
                            <div className="title"></div>
                            <div className="box">
                                <div className="t">
                                    陪访人员
                                </div>
                                <div className="num">
                                    <span>{this.state.normTotalInfo.total}</span>
                                    <span><img src={normImg} alt="" /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="t-right">
                        <div className="point"><img src={point} alt="" /></div>
                        <div className="btn"><Button onClick={this.goto.bind(this, '/add-person')}>添加人员</Button></div>
                        <div className="point"><img src={point} alt="" /></div>
                    </div>
                </div>
                <div className="contain">
                    <div className="c-left">
                        <div className="vip-list">
                            <IScroll scrollEnd={this.vipScrollEnd} ref="vpiListDOM" isShowBar={false}>
                                {this.vipList()}
                                {this.state.vipIsHas ?
                                    <div className="loading">
                                        正在加载下一页数据...<Icon type="loading"></Icon>
                                    </div> :
                                    <div className="loading">
                                        已经没有数据了
                                    </div>
                                }
                            </IScroll>
                        </div>
                        <div className="norm-list">
                            <IScroll scrollEnd={this.normScrollEnd} ref="normListDOM" isShowBar={false}>
                                {this.normList()}
                                {this.state.normIsHas ?
                                    <div className="loading">
                                        正在加载下一页数据...<Icon type="loading"></Icon>
                                    </div> :
                                    <div className="loading">
                                        已经没有数据了
                                    </div>
                                }
                            </IScroll>
                        </div>
                    </div>
                    <div className="c-right">
                        <div className="info-top">
                            <div className="info-tit-left">
                                <p>{this.state.cardInfo.name}<img src={this.state.cardInfo.type === 2 ? vipImg : normImg} alt="" /></p>
                                <div>
                                    {
                                        this.state.cardInfo.tags ?
                                            this.state.cardInfo.tags.map((v, i) => (
                                                <span key={v} ><img src={tagSvg} alt="" />{v}</span>
                                            )) : ''
                                    }
                                </div>
                            </div>
                            <div className="info-tit-right">
                                <p><Icon onClick={this.modifyPerson} type="setting" /></p>
                                <p>编辑</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-card-left">
                                <div className="box name">
                                    <div>
                                        <p className="key">性别</p>
                                        <p className="value">{this.state.cardInfo.gender === 1 ? '男' : '女'}</p>
                                    </div>
                                    <div>
                                        <p className="key">职位/称谓</p>
                                        <p className="value">{this.state.cardInfo.title}</p>
                                    </div>
                                </div>
                                <div className="box">
                                    <div>
                                        <p className="key">年龄</p>
                                        <p className="value">{this.state.cardInfo.age ? this.state.cardInfo.age : "无"}</p>
                                    </div>
                                    <div>
                                        <p className="key">手机号</p>
                                        <p className="value">{this.state.cardInfo.telephone ? this.state.cardInfo.telephone : "无"}</p>
                                    </div>
                                </div>
                                <div className="remark">
                                    <p className="key">备注</p>
                                    {this.state.cardInfo.remarks ? this.state.cardInfo.remarks : "无"}
                                </div>
                            </div>
                            <div className="info-card-right">
                                {
                                    this.state.cardInfo.picture ?
                                        <img src={this.state.cardInfo.picture} alt="" /> :
                                        <img src={defaultAva} alt="" />
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