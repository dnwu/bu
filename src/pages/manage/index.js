import React, { Component } from 'react';
import './index.scss'
import { Button, Icon } from 'antd'
import Head from './../../component/Head'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import point from './../../static/point.svg'
import defaultImg from './../../static/init.png'

class index extends Component {
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
                                    <span>11</span>
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
                                    <span>12</span>
                                    <span><img src={normImg} alt="" /></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="t-right">
                        <div className="point"><img src={point} alt="" /></div>
                        <div className="btn"><Button>添加人员</Button></div>
                        <div className="point"><img src={point} alt="" /></div>
                    </div>
                </div>
                <div className="contain">
                    <div className="c-left">
                        <div className="vip-list"></div>
                        <div className="norm-list"></div>
                    </div>
                    <div className="c-right">
                        <div className="info-top">
                            <div className="info-tit-left">
                                <p>王麻子<img src={vipImg} alt="" /></p>
                                <div className="role">光大总理</div>
                            </div>
                            <div className="info-tit-right">
                                <p><Icon type="setting" /></p>
                                <p>编辑</p>
                            </div>
                        </div>
                        <div className="info-card">
                            <div className="info-card-left">
                                <div className="name">
                                    <div>
                                        <p className="key">性别</p>
                                        <p className="value">男</p>
                                    </div>
                                    <div>
                                        <p className="key">年龄</p>
                                        <p className="value">28</p>
                                    </div>
                                </div>
                                <div className="phone">
                                    <div>
                                        <p className="key">手机号</p>
                                        <p className="value">18676665636</p>
                                    </div>
                                </div>
                            </div>
                            <div className="info-card-right">
                                <img src={defaultImg} alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;