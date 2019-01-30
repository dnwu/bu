import React, { Component } from 'react';
import { Icon, Modal, Button, Message } from 'antd'
import api from './../../server'
import './index.scss'
import nav1 from './../../static/nav1.jpg'
import nav2 from './../../static/nav2.jpg'
import nav3 from './../../static/nav3.jpg'

import { connect } from 'react-redux'
import { setUserName } from './../../redux/action'
const mapState = state => {
    return {
        userName: state.userName
    }
}
class index extends Component {
    state = {
        visible: false,
    }
    componentDidMount() {
        if (!this.props.userName) {
            let userName = sessionStorage.getItem('userName')
            const { dispatch } = this.props
            dispatch(setUserName(userName))
        }
    }
    logout = async () => {
        let { data } = await api.logout()
        console.log(data);
        if (data.code === 0) {
            Message.success('登出成功,请重新登录');
            sessionStorage.removeItem('token')
            sessionStorage.removeItem('userName')
            this.props.history.push('/login')
        }
    }
    goto = (path) => {
        this.props.history.push(path)
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    render() {
        return (
            <div className='nav-main'>
                <div className="top">
                    <div className="nav-left">
                        <div onClick={this.goto.bind(this, '/reserve')} className="nav">
                            <div className="img"><img src={nav1} alt="" /></div>
                            <div className="desc">
                                <div className="ch">活动预约</div>
                                <div className="en">Activity arrangement</div>
                            </div>
                        </div>
                        <div onClick={this.goto.bind(this, '/statistics')} className="nav analysis">
                            <div className="img"><img src={nav2} alt="" /></div>
                            <div className="desc">
                                <div className="ch">数据统计与分析</div>
                                <div className="en">Data statistics and analysis</div>
                            </div>
                        </div>
                        <div onClick={this.goto.bind(this, '/search/index')} className="nav search">
                            <div className="img"><img src={nav3} alt="" /></div>
                            <div className="desc">
                                <div className="ch">搜索查询</div>
                                <div className="en">Search</div>
                            </div>
                        </div>
                    </div>
                    <div className="nav-logo">
                        <div className="logo"></div>
                        <div className="word">
                            <p className="en">welcome</p>
                            <p className="ch">欢迎使用</p>
                        </div>
                    </div>
                </div>
                <div className="bottom">
                    <div className="user-icon"><Icon type="user" /></div>
                    <div className="username">{this.props.userName}</div>
                    <div className="logout" onClick={this.showModal}>登出</div>
                    {/* 登出model */}
                    <Modal
                        className='logout-model'
                        visible={this.state.visible}
                        footer={false}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <div className="body-icon">
                            <p className="icon"><Icon type="user" /></p>
                            <p className="word">确认要登出吗</p>
                        </div>
                        <div className="btn">
                            <Button onClick={this.handleCancel} className="cancel">取消</Button>
                            <Button onClick={this.logout} className="sure">确认</Button>
                        </div>
                    </Modal>
                </div>

            </div>
        );
    }
}

export default connect(mapState)(index);