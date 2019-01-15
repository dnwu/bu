import React, { Component } from 'react';
import './index.scss'
import { Icon } from 'antd'
import headImg from './../../static/head.png'

class index extends Component {
    componentDidMount() {
    }
    back = () => {
        window.history.go(-1)
    }
    goto = (path) => {
        window.location.href = path
    }
    render() {
        return (
            <div className="head">
                <Icon onClick={this.back} type="arrow-left" />
                <img onClick={this.goto.bind(this, '/main')} src={headImg} alt="" />
            </div>
        );
    }
}

export default index;