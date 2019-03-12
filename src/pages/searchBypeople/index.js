import React, { Component } from 'react';
import { Select, Input, Icon, DatePicker, Button } from 'antd';
import './index.scss'
import Head from './../../component/Head'
import Nav from './../../component/SearchNav'
import pointSvg from './../../static/point.svg'
const Option = Select.Option;
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startValue: null,
            endValue: null,
            endOpen: false,
        }
    }
    disabledStartDate = (startValue) => {
        const endValue = this.state.endValue;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.state.startValue;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }
    render() {
        const { startValue, endValue, endOpen } = this.state;
        return (
            <div className="search-by-people">
                <Head></Head>
                <div className="search-by-people-page">
                    <div className="nav">
                        <Nav history={this.props.history}></Nav>
                    </div>
                    <div className="search-by-people-condition">
                        <div className="condition">
                            <div className="point">
                                <img src={pointSvg} alt="" />
                            </div>
                            <div className="detail">
                                <div>
                                    <div className="key">性别</div>
                                    <div className="value">
                                        <Select defaultValue="" style={{ width: "100%" }}>
                                            <Option value="">不限</Option>
                                            <Option value="jack">男</Option>
                                            <Option value="lucy">女</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <div className="key">年龄</div>
                                    <div className="value">
                                        <Select defaultValue="" style={{ width: "100%" }}>
                                            <Option value="">不限</Option>
                                            <Option value="jack">青年</Option>
                                            <Option value="lucy">中年</Option>
                                            <Option value="Yiminghe">老年</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <div className="key">表情</div>
                                    <div className="value">
                                        <Select defaultValue="" style={{ width: "100%" }}>
                                            <Option value="">不限</Option>
                                            <Option value="jack">开心</Option>
                                            <Option value="lucy">平静</Option>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <div className="key">嘴型</div>
                                    <div className="value">
                                        <Select defaultValue="" style={{ width: "100%" }}>
                                            <Option value="">不限</Option>
                                            <Option value="jack">开口</Option>
                                            <Option value="lucy">闭合</Option>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="condition">
                            <div className="point">
                                <img src={pointSvg} alt="" />
                            </div>
                            <div className="key">信息过滤</div>
                            <div className="value">
                                <Input className="info-filter" placeholder="姓名、标签、备注"></Input>
                            </div>
                        </div>
                        <div className="condition">
                            <div className="point">
                                <img src={pointSvg} alt="" />
                            </div>
                            <div className="key">访问时段</div>
                            <div className="value">
                                <div className="icon">
                                    <Icon type="calendar" />
                                </div>
                                <div className="start">
                                    <DatePicker
                                        disabledDate={this.disabledStartDate}
                                        format="YYYY-MM-DD"
                                        showToday={false}
                                        value={startValue}
                                        placeholder="开始时间"
                                        onChange={this.onStartChange}
                                        onOpenChange={this.handleStartOpenChange}
                                    />
                                </div>
                                <div className="word">至</div>
                                <div className="end">
                                    <DatePicker
                                        disabledDate={this.disabledEndDate}
                                        format="YYYY-MM-DD"
                                        showToday={false}
                                        value={endValue}
                                        placeholder="结束时间"
                                        onChange={this.onEndChange}
                                        open={endOpen}
                                        onOpenChange={this.handleEndOpenChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="btn">
                            <Button>搜索</Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;