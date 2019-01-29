import React, { Component } from 'react';
import { Icon, DatePicker } from 'antd'
import moment from 'moment'
import './index.scss'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import LogoImg from './../../static/logo.png'
import defaultImg from './../../static/init.png'
import positonImg from './../../static/positon.svg'
import tagImg from './../../static/tag.svg'
const { RangePicker } = DatePicker;
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            drawerVisible: false,
            startTIme: moment().format("X"),
            endTIme: moment().format("X")
        }
    }
    listScrollEnd = async () => { }
    drawerClose = () => {
        this.setState({
            drawerVisible: false
        })
    }
    showDrawer = () => {
        this.setState({
            drawerVisible: true
        })
    }
    rangePickerChange = (date) => {
        let start = moment(date[0]).format("X")
        let end = moment(date[1]).format("X")
        this.setState({
            startTIme: start,
            endTIme: end
        })
    }
    render() {
        const drawer = (
            this.state.drawerVisible ?
                <div className="drawer">
                    <div className="close"><Icon onClick={this.drawerClose} type="close-circle" /></div>
                    <div className="logo">
                        <Icon type="schedule" />
                        <p className="ch">时段查询</p>
                        <p className="en">Query by time</p>
                    </div>
                    <div className="picker">
                        <p>活动日期选择</p>
                        <RangePicker onChange={this.rangePickerChange} open></RangePicker>
                    </div>
                    <div className="info">
                        <p>筛选日期</p>
                        <div className="time-box">{moment(this.state.startTIme * 1000).format("YYYY-MM-DD")}</div>
                        <div className="word">至</div>
                        <div className="time-box">{moment(this.state.endTIme * 1000).format("YYYY-MM-DD")}</div>
                    </div>

                </div> : null
        )
        const card = (
            <div className="card">
                <div className="left">
                    <img src={defaultImg} alt="" />
                </div>
                <div className="right">
                    <div className="top">
                        <div className="title">XXXXXX职位</div>
                        <div className="tags">
                            <span><img src={tagImg} alt="" />{"标签"}</span>
                            <span><img src={tagImg} alt="" />{"标签"}</span>
                        </div>
                    </div>
                    <div className="bottom">
                        <div className="position">
                            <img src={positonImg} alt="" />
                            <span className="city">北京</span>
                            <span className="time">10-10-10</span>
                        </div>
                        <div className="status">已结束</div>
                    </div>
                </div>
            </div>
        )
        return (
            <div className="all-active">
                {drawer}
                <Head></Head>
                <div className="body">
                    <div className="body-head">
                        <div className="left">
                            <h4>所有活动列表</h4>
                            <div>
                                <div className="title">所有活动</div>
                                <div className="num">100</div>
                            </div>
                        </div>
                        <div className="right">
                            <Icon onClick={this.showDrawer} type="schedule" />
                            <div className="ch">活动时段</div>
                            <div className="en">Query by time</div>
                        </div>
                    </div>
                    <div className="body-main">
                        <div className="list">
                            <IScroll scrollEnd={this.listScrollEnd} isShowBar={false}>
                                {card}
                            </IScroll>
                        </div>
                        <div className="logo">
                            <img src={LogoImg} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;