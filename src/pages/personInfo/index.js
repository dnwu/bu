import React, { Component } from 'react'
import { Icon } from "antd"
import './index.scss'
import Head from './../../component/Head'
import VipImg from './../../static/VIP.png'
import tagImg from './../../static/tag.svg'
import defaultImg from './../../static/default.png'
import pointImg from './../../static/point.svg'
import logoImg from './../../static/logo.png'

class index extends Component {
    render() {
        return (
            <div className="person-info">
                <Head></Head>
                <div className="body">
                    <div className="tit">
                        <div className="left">
                            <h3>王麻子<img src={VipImg} alt="" /></h3>
                            <div>
                                <span><img src={tagImg} alt="" />标签1</span>
                                <span><img src={tagImg} alt="" />标签2</span>
                                <span><img src={tagImg} alt="" />标签3</span>
                            </div>
                        </div>
                        <div className="right">
                            <Icon type="menu-unfold" />
                            <p className="ch">出席活动列表</p>
                            <p className="en">Activities List</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="left-info">
                            <div className="info">
                                <div className="box">
                                    <div className="key">性别</div>
                                    <div className="val">男</div>
                                </div>
                                <div className="box">
                                    <div className="key">职位/称谓</div>
                                    <div className="val">光大产品总监</div>
                                </div>
                                <div className="box">
                                    <div className="key">年龄</div>
                                    <div className="val">16</div>
                                </div>
                                <div className="box">
                                    <div className="key">手机号</div>
                                    <div className="val">169243265567</div>
                                </div>
                            </div>
                            <div className="mark">
                                <span>一个重要的领导，在某某活动、某某活动对特斯联进行了考察。一个重要的领导，
    在某某活动、某某活动对特斯联进行了考察。一个重要的领导，在某某活动、某某活动对特斯联进行了考察。一个重要的领导，
    在某某活动、某某活动对特斯联进行了考察。</span>
                            </div>
                            <div className="num">
                                <div className="num">12</div>
                                <div className="desc">出席活动次数</div>
                            </div>
                        </div>
                        <div className="right-img">
                            <img src={defaultImg} alt="" />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="left">
                            <div className="title">活动频次<img src={pointImg} alt="" /></div>
                            <div className="statistics-box">

                            </div>
                        </div>
                        <div className="right">
                            <div className="title">最近匹配<img src={pointImg} alt="" /></div>
                            <div className="statistics-box">
                                <div className="img-box">
                                    <div className="img">
                                        <img src={defaultImg} alt="" />
                                    </div>
                                    <p>2010-10-10</p>
                                </div>
                                <div className="img-box">
                                    <div className="img">
                                        <img src={defaultImg} alt="" />
                                    </div>
                                    <p>2010-10-10</p>
                                </div>
                                <div className="img-box">
                                    <div className="img">
                                        <div className="none" >
                                            <img src={logoImg} alt="" />
                                        </div>
                                    </div>
                                    <p>2010-10-10</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;