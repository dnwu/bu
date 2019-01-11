import React, { Component } from 'react';
import './index.scss'
import { Icon } from 'antd'
import headImg from './../../static/head.png'

class index extends Component {
    back = () => {
        window.history.go(-1)
    }
    render() {
        return (
            <div className="head">
                <Icon onClick={this.back} type="arrow-left" />
                <img src={headImg} alt="" />
            </div>
        );
    }
}

export default index;