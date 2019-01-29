import React, { Component } from 'react';
import { Icon } from "antd"
import Head from './../../component/Head'
import Progress from './../../component/Progress'
import HProgress from './../../component/HProgress'
import HBar from './../../component/HBar'
import './index.scss'
import tagImg from './../../static/tag.svg'
// import defaultImg from './../../static/default.png'
import pointImg from './../../static/point.svg'
import logoImg from './../../static/logo.png'
import position from './../../static/positon.svg'
import point from "./../../static/point.svg"
class index extends Component {
    componentDidMount() {
        console.log(this.props);
    }
    render() {
        return (
            <div className="active-info">
                <Head></Head>
                <div className="body">
                    <div className="tit">
                        <div className="left">
                            <h3>重庆未来城市BU参观</h3>
                            <div>
                                <span><img src={tagImg} alt="" />标签1</span>
                                <span><img src={tagImg} alt="" />标签2</span>
                                <span><img src={tagImg} alt="" />标签3</span>
                            </div>
                        </div>
                        <div className="right">
                            <Icon type="menu-unfold" />
                            <p className="ch">到访人员列表</p>
                            <p className="en">People List</p>
                        </div>
                    </div>
                    <div className="info-card">
                        <div className="info-left">
                            <div className="info-title">
                                <div className="status">已结束</div>
                                <div className="time"><img src={position} alt="" />2010-10-10</div>
                                <div className="positon">重庆</div>
                                <div className="detail">大坪英利国际</div>
                            </div>
                            <div className="info-detail">
                                <div className="box">
                                    <div className="key">预约人员</div>
                                    <div className="val">小屁孩</div>
                                </div>
                                <div className="box">
                                    <div className="key">预约部门</div>
                                    <div className="val">重庆分公司市场部</div>
                                </div>
                                <div className="box">
                                    <div className="key">客户名称</div>
                                    <div className="val">某某领导</div>
                                </div>
                                <div className="box">
                                    <div className="key">客户类型</div>
                                    <div className="val">政府</div>
                                </div>
                            </div>
                            <div className="mark">
                                <span>一次重要的活动，某某领导、某某领导对特斯联进行了考察。一次重要的活动，某某领导、某某
领导对特斯联进行了考察。</span>
                            </div>
                            <div className="info-time-card">
                                <div className="time-card-left">
                                    <div className="reserve-time">预约开始 08:00</div>
                                    <div className="real">开始时间 08:00</div>
                                </div>
                                <div className="time-card-mid">
                                    <img src={pointImg} alt="" />
                                    <div className="line"></div>
                                </div>
                                <div className="time-card-right">
                                    <div className="reserve-time">预约结束 08:00</div>
                                    <div className="real">结束时间 08:00</div>
                                </div>
                            </div>
                        </div>
                        <div className="info-img">
                            <img className="none" src={logoImg} alt="" />
                        </div>
                    </div>
                    <div className="statistics-card">
                        <div className="left">
                            <div className="title">
                                <span>性别分布</span><img src={point} alt="" />
                            </div>
                            <div className="man box">
                                <div className="box-desc">
                                    <div className="box-desc-left">
                                        <div className="key">男性</div>
                                        <div className="val">666</div>
                                    </div>
                                    <div className="box-desc-right">
                                        66%
                                    </div>
                                </div>
                                <div className="box-progress">
                                    <HProgress percent="66"></HProgress>
                                </div>
                            </div>
                            <div className="woman box">
                                <div className="box-desc">
                                    <div className="box-desc-left">
                                        <div className="key">女性</div>
                                        <div className="val">666</div>
                                    </div>
                                    <div className="box-desc-right">
                                        34%
                                    </div>
                                </div>
                                <div className="box-progress">
                                    <HProgress percent="34" bgColor="#8A56A7"></HProgress>
                                </div>
                            </div>
                        </div>
                        <div className="mid">
                            <div className="title">
                                <span>年龄分布</span><img src={point} alt="" />
                            </div>
                            <div className="box">
                                <div className="box-item">
                                    <div className="progress">
                                        <Progress percent="55"></Progress>
                                    </div>
                                    <div className="type">青年</div>
                                </div>
                                <div className="box-item">
                                    <div className="progress">
                                        <Progress percent="33"></Progress>
                                    </div>
                                    <div className="type">青年</div>
                                </div>
                                <div className="box-item">
                                    <div className="progress">
                                        <Progress percent="12"></Progress>
                                    </div>
                                    <div className="type">青年</div>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <div className="title">
                                <span>出席人员</span><img src={point} alt="" />
                            </div>
                            <div className="box">
                                <div className="progress">
                                    <HBar xAxis={["重要人员", "陪访人员", "其他人员"]} yAxis={[10, 59, 4]}></HBar>
                                </div>
                                <div className="num">
                                    <div className="key">89</div>
                                    <div className="val">本次活动人数</div>
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