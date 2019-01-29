import React, { Component } from 'react';
import './index.scss'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import defauleAva from './../../static/default.png'
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.vipPage = 1
        this.normPage = 1
        this.otherPage = 1
        this.pageSize = 10
    }
    componentDidMount() {}
    vipScrollEnd = () => { }
    normScrollEnd = () => { }
    otherScrollEnd = () => { }
    render() {
        const vipCard = (
            <div className="card">
                <div className="left">
                    <img src={defauleAva} alt="" />
                </div>
                <div className="right">
                    <div className="name">王麻子</div>
                    <div className="title">光大什么职位</div>
                </div>
            </div>
        )
        const normCard = (
            <div className="card">
                <div className="left">
                    <img src={defauleAva} alt="" />
                </div>
                <div className="right">
                    <div className="name">王麻子</div>
                    <div className="title">光大什么职位</div>
                </div>
            </div>
        )
        const otherCard = (
            <div className="card">
                <div className="left">
                    <img src={defauleAva} alt="" />
                </div>
                <div className="right">
                    <div className="name">王麻子</div>
                </div>
            </div>
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
                                <div className="num">10<img className="vip" src={vipImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="title">陪访人员</div>
                                <div className="num">10<img className="norm" src={normImg} alt="" /></div>
                            </div>
                            <div>
                                <div className="title">其他人员</div>
                                <div className="num">10</div>
                            </div>
                        </div>
                    </div>
                    <div className="body-main">
                        <div>
                            <IScroll scrollEnd={this.vipScrollEnd} isShowBar={false}>
                                {vipCard}
                            </IScroll>
                        </div>
                        <div>
                            <IScroll scrollEnd={this.normScrollEnd} isShowBar={false}>
                                {normCard}
                            </IScroll>
                        </div>
                        <div>
                            <IScroll scrollEnd={this.otherScrollEnd} isShowBar={false}>
                                {otherCard}
                            </IScroll>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;