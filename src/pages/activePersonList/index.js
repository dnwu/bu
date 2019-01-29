import React, { Component } from 'react';
import './index.scss'
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
            activeInfo: {}
        }
        this.vipPage = 1
        this.normPage = 1
        this.otherPage = 1
        this.pageSize = 10
    }
    componentDidMount() {
        let id = sessionStorage.getItem("activeId")
        this.setState({
            id
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
    }
    vipDownGetList = async () => { }
    normDownGetList = async () => { }
    otherDownGetList = async () => { }
    render() {
        let { activeInfo } = this.state
        const vipCard = (
            <div className="card">
                <div className="left">
                    <div className="img"><img src={defaultAva} alt="" /></div>
                    <div className="info">
                        <div className="name">名字</div>
                        <div className="title">职位XXXX</div>
                    </div>
                </div>
                <div className="right">
                    <div className="time">10:10</div>
                    <div className="times"><span>到访次数:</span><span>10</span></div>
                </div>
            </div>
        )
        const normCard = (
            <div className="card">
                <div className="left">
                    <div className="img"><img src={defaultAva} alt="" /></div>
                    <div className="info">
                        <div className="name">名字</div>
                        <div className="title">职位XXXX</div>
                    </div>
                </div>
                <div className="right">
                    <div className="time">10:10</div>
                    <div className="times"><span>到访次数:</span><span>10</span></div>
                </div>
            </div>
        )
        const otherCard = (
            <div className="card">
                <div className="left">
                    <div className="img"><img src={defaultAva} alt="" /></div>
                    <div className="info">
                        <div className="name">名字</div>
                        <div className="title">职位XXXX</div>
                    </div>
                </div>
                <div className="right">
                    <div className="time">10:10</div>
                    <div className="times"><span>到访次数:</span><span>10</span></div>
                </div>
            </div>
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
                                    XXXXXXXXX
                                </div>
                                <div className="tags">
                                    <span><img src={tagImg} alt="" />{"标签"}</span>
                                    <span><img src={tagImg} alt="" />{"标签"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="t-bottom">
                            <div>
                                <div className="tit">VIP人员</div>
                                <div className="num">10 <img className="vip" src={vipImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="tit">陪访人员</div>
                                <div className="num">10 <img className='norm' src={normImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="tit">其他人员</div>
                                <div className="num">10</div>
                            </div>
                        </div>
                    </div>
                    <div className="body-main">
                        <div className="vip">
                            <IScroll scrollEnd={this.vipDownGetList} isShowBar={false}>
                                {vipCard}
                            </IScroll>
                        </div>
                        <div className="norm">
                            <IScroll scrollEnd={this.normDownGetList} isShowBar={false}>
                                {normCard}
                            </IScroll>
                        </div>
                        <div className="other">
                            <IScroll scrollEnd={this.otherDownGetList} isShowBar={false}>
                                {normCard}
                            </IScroll>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;