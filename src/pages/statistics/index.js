import React, { Component } from 'react';
import Head from './../../component/Head'
import HBar from './../../component/HBar'
import Progress from './../../component/Progress'
import HProgress from './../../component/HProgress'
import VBar from './../../component/VBar'
import './index.scss'
import pointImg from './../../static/point.svg'
// 引入ECharts主模块
import echarts from 'echarts'
// 引入折线图
import "echarts/lib/chart/line"
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        this.drawLine()
    }
    drawLine = () => {
        let lineBoxDOM = this.refs.lineBox
        let myChart = echarts.init(lineBoxDOM)
        let option = {
            grid: {
                show: false,
                left: 20,
                top: 0,
                right: 20,
                bottom: 20
            },
            tooltip: {
                trigger: 'axis',
            },
            xAxis: {
                show: true,
                axisLabel: {
                    textStyle: {
                        color: '#626F86',
                        fontSize: '12'
                    }
                },
                type: 'category',
                boundaryGap: false,
                // show: false,
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                show: false,
                type: 'value',
                boundaryGap: false,
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
                areaStyle: {
                    color: "rgba(151, 95, 228,.8)",
                    shadowBlur: 2,
                    opacity: 0.4
                },
                lineStyle: {
                    color: "rgba(151, 95, 228,.4)"
                }
            }]
        };
        myChart.setOption(option)
    }
    render() {
        return (
            <div className="statistics">
                <Head></Head>
                <div className="body">
                    <div className="b-top">
                        <div className="b-t-left box">
                            <div className="header">
                                <span className="block"></span>
                                <span className="word">系统访问总人数</span>
                            </div>
                            <div ref="lineBox" className="item">
                            </div>
                        </div>
                        <div className="b-t-right box">
                            <div className="header">
                                <span className="block"></span>
                                <span className="word">活动频次统计</span>
                            </div>
                            <div className="item">
                                <div className="title">
                                    <div className="point">
                                        <img src={pointImg} alt="" />
                                    </div>
                                    <div className="num">
                                        <div className="key">活动总数</div>
                                        <div className="val">66</div>
                                    </div>
                                    <div className="point">
                                        <img src={pointImg} alt="" />
                                    </div>
                                </div>
                                <div className="num">
                                    <div>
                                        <div className="key">已预约</div>
                                        <div className="value">66</div>
                                    </div>
                                    <div>
                                        <div className="key">已完成</div>
                                        <div className="value">66</div>
                                    </div>
                                    <div>
                                        <div className="key">本月活动</div>
                                        <div className="value">66</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="b-bottom">
                        <div className="b-b-left box">
                            <div className="header">
                                <span className="block"></span>
                                <span className="word">人员到访列表</span>
                            </div>
                            <div className="item">
                                <div className="title">
                                    <div>
                                        <span>姓名</span>
                                        <span><img src={pointImg} alt="" /></span>
                                    </div>
                                    <div>访问次数</div>
                                </div>
                                <div className="item-body">
                                    <HBar xAxis={["王麻子", "小顺子", "二愣子", "名字比较长"]} yAxis={[20, 10, 5, 3]}></HBar>
                                </div>
                            </div>
                        </div>
                        <div className="b-b-mid box">
                            <div className="header">
                                <span className="block"></span>
                                <span className="word">访客属性统计</span>
                            </div>
                            <div className="item">
                                <div className="item-top">
                                    <div className="title">
                                        <span>性别分布</span><img src={pointImg} alt="" />
                                    </div>
                                    <div className="man sex-box">
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
                                    <div className="woman sex-box">
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
                                <div className="item-bottom">
                                    <div className="title">
                                        <span>年龄分布</span><img src={pointImg} alt="" />
                                    </div>
                                    <div className="item-bottom-box">
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
                            </div>
                        </div>
                        <div className="b-b-right">
                            <div className="b-b-r-top box">
                                <div className="header">
                                    <span className="block"></span>
                                    <span className="word">活动频次统计</span>
                                </div>
                                <div className="item">
                                    <div className="title">
                                        <span>活动次数</span><img src={pointImg} alt="" />
                                    </div>
                                    <div className="v-bar">
                                        <VBar yAxis={[12, 23, 34, 45]} xAxis={["10.10", "10.10", "10.10", "10.10"]}></VBar>
                                    </div>
                                </div>
                            </div>
                            <div className="b-b-r-bottom box">
                                <div className="header">
                                    <span className="block"></span>
                                    <span className="word">活动地点历史统计</span>
                                </div>
                                <div className="item">
                                    <div className="title layout">
                                        <div className="position">活动地点</div>
                                        <div className="times">活动次数</div>
                                        <div className="all-num">活动人员数</div>
                                        <div className="norm-num">陪访人员</div>
                                        <div className="vip-num">vip人员</div>
                                        <div className="done-times">已完成活动</div>
                                    </div>
                                    <div className="table">
                                        <div className="line layout">
                                            <div className="position">北京</div>
                                            <div className="times">8</div>
                                            <div className="all-num">66</div>
                                            <div className="norm-num">88</div>
                                            <div className="vip-num">66</div>
                                            <div className="done-times">55</div>
                                        </div>
                                        <div className="line layout">
                                            <div className="position">北京</div>
                                            <div className="times">8</div>
                                            <div className="all-num">66</div>
                                            <div className="norm-num">88</div>
                                            <div className="vip-num">66</div>
                                            <div className="done-times">55</div>
                                        </div>
                                        <div className="line layout">
                                            <div className="position">北京</div>
                                            <div className="times">8</div>
                                            <div className="all-num">66</div>
                                            <div className="norm-num">88</div>
                                            <div className="vip-num">66</div>
                                            <div className="done-times">55</div>
                                        </div>
                                        <div className="line layout">
                                            <div className="position">北京</div>
                                            <div className="times">8</div>
                                            <div className="all-num">66</div>
                                            <div className="norm-num">88</div>
                                            <div className="vip-num">66</div>
                                            <div className="done-times">55</div>
                                        </div>
                                    </div>
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


