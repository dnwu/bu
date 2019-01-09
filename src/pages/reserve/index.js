import React, { Component } from 'react';
import { Radio, Button, Icon } from 'antd'
import api from './../../server'
import tools from './../../tools'
import './index.scss'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import manageSvg from './../../static/manage.svg'
import tagSvg from './../../static/tag.svg'
import positonSvg from './../../static/positon.svg'
import pointSvg from './../../static/point.svg'
import logoImg from './../../static/logo.png'

let page = 1
let pageSize = 10
class index extends Component {
    state = {
        status: "", // status 1,2,3分别代表已预约, 进行中, 已结束 , 空表示全部
        activeInfo: {},
        activesInfo: {
            total: 0,
            totalThisMonth: 0
        },
        activeList: [],
        // control: true
    }
    componentDidMount() {
        this.getActiveList(1, 1)
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
        console.log(data);
        let list = JSON.parse(JSON.stringify(this.state.activeList))
        list.push(...data.data.activities)
        this.setState({
            activesInfo: data.data,
            activeList: list,
        })
        // 如果是第一次请求, 然后初始化活动详情
        if (page === 1) {
            this.getActiveInfo(data.data.activities[0].id)
            this.setState({
                selectId: data.data.activities[0].id,
            })
        }
    }
    downGetList =async (info) => {
        if (this.state.activeList.length === this.state.activesInfo.total) return
        page++
        await this.getActiveList(page, this.state.status)
        // this.getActiveInfo(this.state.selectId)
    }
    getActiveInfo = async (id) => {
        let { data } = await api.getActiveInfo(id)
        this.setState({
            activeInfo: data.data,
            selectId: id
        })
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
        }, () => {
            // console.log(this.state.activeList);
            this.getActiveList(1, e.target.value)
        })
    }
    render() {
        return (
            <div className="reserve">
                <Head></Head>
                <div className="top-nav">
                    <div className="nav">
                        <Radio.Group onChange={this.typeChage} className="nav-btn" defaultValue="" buttonStyle="solid">
                            <Radio.Button value="">全部</Radio.Button>
                            <Radio.Button value="1">已预约</Radio.Button>
                            <Radio.Button value="3">已结束</Radio.Button>
                        </Radio.Group>
                        <div className="info">
                            <div className="box">
                                <p className="title">所有活动</p>
                                <p className="num">{this.state.activesInfo.total}</p>
                            </div>
                            <div className="box">
                                <p className="title">本月活动</p>
                                <p className="num">{this.state.activesInfo.totalThisMonth}</p>
                            </div>
                        </div>
                    </div>
                    <div className="create">
                        <div className="icon"><Icon type="ellipsis" /></div>
                        <div className="btn"><Button>创建活动</Button></div>
                        <div className="icon"><Icon type="ellipsis" /></div>
                    </div>
                    <div className="manage">
                        <img src={manageSvg} alt="" />
                        <p className="ch">人员管理</p>
                        <p className="en">Management</p>
                    </div>
                </div>
                <div className="body-main">
                    <div className="body-main-left">
                        <IScroll
                            ref="IScroll"
                            // control={this.state.control}
                            selectId={this.state.selectId}
                            change={this.getActiveInfo}
                            scrollEnd={this.downGetList}
                            listInfo={this.state.activesInfo}
                            list={this.state.activeList} />
                    </div>
                    <div className="contain">
                        <div className="top">
                            <div className="c-left">
                                <h2>{this.state.activeInfo.name}</h2>
                                {
                                    this.state.activeInfo.tags ?
                                        this.state.activeInfo.tags.map((v, i) => (
                                            <span key={v} ><img src={tagSvg} alt="" />{v}</span>
                                        )) : ''
                                }
                            </div>
                            <div className="c-right">
                                <Icon type="setting" />
                                <p>编辑</p>
                            </div>
                        </div>
                        <div className="info">
                            <div className="info-left">
                                <h3>{this.state.activeInfo.status === 1 ? '已预约' : this.state.activeInfo.status === 2 ? '已预约' : this.state.activeInfo.status === 3 ? '已结束' : '无状态'}</h3>
                                <div className="positon">
                                    <img src={positonSvg} alt="" />
                                    <span>{this.state.activeInfo.city}</span>
                                    <span>{this.state.activeInfo.location}</span>
                                </div>
                                <div className="start-end-card">
                                    <h4>{tools.formatDate(this.state.activeInfo.startTime)}</h4>
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
                                <img src={logoImg} alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;