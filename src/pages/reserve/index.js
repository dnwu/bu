import React, { Component } from 'react';
import { Radio, Button, Icon } from 'antd'
import api from './../../server'
import './index.scss'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import manageSvg from './../../static/manage.svg'
class index extends Component {
    state = {
        page: 1,
        pageSize: 10,
        activeInfo: {}
    }
    componentDidMount() {
        this.getActiveList(1, 1)
    }
    getActiveList = async (page, status) => {
        // status 1,2,3分别代表全部, 已预约, 已结束
        // 
        let options = {
            offset: (page - 1) * this.state.pageSize,
            limit: this.state.pageSize,
            status: status
        }
        let { data } = await api.getActiveList(options)
        console.log(data);
        this.setState({
            activeInfo: data.data
        })
    }
    render() {
        return (
            <div className="reserve">
                <Head></Head>
                <div className="top-nav">
                    <div className="nav">
                        <Radio.Group className="nav-btn" defaultValue="a" buttonStyle="solid">
                            <Radio.Button value="a">全部</Radio.Button>
                            <Radio.Button value="b">已预约</Radio.Button>
                            <Radio.Button value="c">已结束</Radio.Button>
                        </Radio.Group>
                        <div className="info">
                            <div className="box">
                                <p className="title">所有活动</p>
                                <p className="num">{this.state.activeInfo.total}</p>
                            </div>
                            <div className="box">
                                <p className="title">本月活动</p>
                                <p className="num">{this.state.activeInfo.totalThisMonth}</p>
                            </div>
                        </div>
                    </div>
                    <div className="create">
                        <div className="icon"><Icon type="ellipsis" /></div>
                        <div className="btn"><Button>创建活动</Button></div>
                        <div className="icon"><Icon type="ellipsis" /></div>
                    </div>
                    <div className="manage">
                        <img src={manageSvg} alt=""/>
                        <p className="ch">人员管理</p>
                        <p className="en">Management</p>
                    </div>
                </div>
                <div className="body-main">
                    <div className="left">
                        <IScroll list={this.state.activeInfo.activities}></IScroll>
                    </div>
                    <div className="contain">
                    </div>
                </div>
            </div>
        );
    }
}

export default index;