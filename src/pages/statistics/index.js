import React, { Component } from 'react';
import axios from 'axios'
import api from './../../server'
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
        this.state = {
            activityRate: {},
            activityRateByWeek: { x: [], y: [] },
            activityByCity: [],
            peopleAttribute: {
                gender: { man: { val: 0, percent: 0 }, woman: { val: 0, percent: 0 } },
                age: { young: 0, middle: 0, elderly: 0 }
            },
            statisticsByPeopleNum: null,
            statisticsBypeopleList: { xAxis: [], yAxis: [] },
        }
    }
    componentDidMount() {
        this.drawLine()
        this.getAllData()
    }
    getAllData = () => {

        axios.all([
            api.getActivityRate(), // 活动频次统计
            api.getActivityRateByWeek(0, 10), // 活动频次统计
            api.getActivityByCity(),    // 活动地点历史统计
            api.getPeopleAttribute(),    // 访客属性统计
            api.getStatisticsByPeopleNum(0, 7),  // 系统访问总人数
            api.getStatisticsBypeopleList(0, 10)  // 人员到访列表
        ])
            .then(axios.spread((
                activityRate,
                activityRateByWeek,
                activityByCity,
                peopleAttribute,
                statisticsByPeopleNum,
                statisticsBypeopleList,
            ) => {
                
                this.setState({
                    activityRate: activityRate.data.data,
                    activityRateByWeek: this.formatActivityRateByWeek(activityRateByWeek.data.data.weeklyCount),
                    activityByCity: this.formatActivityByCity(activityByCity.data.data.citiesCount),
                    peopleAttribute: this.formatPeopleAttribute(peopleAttribute.data.data),
                    statisticsByPeopleNum: statisticsByPeopleNum.data.data && statisticsByPeopleNum.data.data.dailyCount ,
                    statisticsBypeopleList: this.formatStatisticsBypeopleList(statisticsBypeopleList.data.data.Ranking),
                }, () => {
                    
                    this.state.statisticsByPeopleNum && this.fromatStatisticsByPeopleNum(this.state.statisticsByPeopleNum)
                })
            }))
    }
    formatActivityRateByWeek = (data) => {
        let x = Object.keys(data)
        let y = Object.values(data)
        x.forEach((v, i) => {
            x[i] = v.slice(-5)
        })
        return { x, y }
    }
    formatActivityByCity = (data) => {
        let arr = []
        Object.keys(data).forEach((v, i) => {
            arr.push({
                city: v,
                value: data[v]
            })
        })
        return arr
    }
    formatPeopleAttribute = (data) => {
        let totalAge = this.add(data.age)
        let totalGender = this.add(data.gender)
        let age, gender
        if (totalAge === 0) {
            age = { young: 0, middle: 0, elderly: 0 }
        } else {
            age = {
                young: Math.round(data.age[0] / totalAge * 10000) / 100.00,
                middle: Math.round(data.age[1] / totalAge * 10000) / 100.00,
                elderly: Math.round(data.age[2] / totalAge * 10000) / 100.00
            }
        }

        if (totalGender === 0) {
            gender = {
                man: { percent: 0, val: 0 },
                woman: { percent: 0, val: 0 }
            }
        } else {
            gender = {
                man: {
                    val: data.gender[0],
                    percent: Math.round(data.gender[0] / totalGender * 10000) / 100.00
                },
                woman: {
                    val: data.gender[1],
                    percent: Math.round(data.gender[1] / totalGender * 10000) / 100.00
                }
            }
        }
        let obj = { age, gender, type: data.type }
        return obj
    }
    fromatStatisticsByPeopleNum = (data) => {
        let xAxis = Object.keys(data)
        let yAxis = Object.values(data)
        this.state.myChart.setOption({
            xAxis: {
                data: xAxis
            },
            series: [{
                data: yAxis
            }]
        })
    }
    formatStatisticsBypeopleList = (data) => {
        let xAxis = []
        let yAxis = []
        data.forEach(v => {
            xAxis.push(v.name)
            yAxis.push(v.visitCount)
        })
        return { xAxis, yAxis }
    }
    // 数组求和
    add = (arr) => {
        let num = 0
        arr.forEach(v => {
            num += v
        })
        return num
    }
    drawLine = () => {
        let lineBoxDOM = this.refs.lineBox
        let myChart = echarts.init(lineBoxDOM)
        this.setState({
            myChart
        })
        let option = {
            grid: {
                show: false,
                left: 40,
                top: 0,
                right: 40,
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
                data: []
            },
            yAxis: {
                show: false,
                type: 'value',
                boundaryGap: false,
            },
            series: [{
                data: [],
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
        var {activityRate, activityRateByWeek, activityByCity, peopleAttribute, statisticsBypeopleList} = this.state
        
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
                                        <div className="val">{activityRate.total}</div>
                                    </div>
                                    <div className="point">
                                        <img src={pointImg} alt="" />
                                    </div>
                                </div>
                                <div className="num">
                                    <div>
                                        <div className="key">已预约</div>
                                        <div className="value">{activityRate.reserved}</div>
                                    </div>
                                    <div>
                                        <div className="key">已完成</div>
                                        <div className="value">{activityRate.finished}</div>
                                    </div>
                                    <div>
                                        <div className="key">本月活动</div>
                                        <div className="value">{activityRate.thisMonth}</div>
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
                                    <HBar xAxis={statisticsBypeopleList.xAxis} yAxis={statisticsBypeopleList.yAxis}></HBar>
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
                                                <div className="val">{peopleAttribute.gender.man.val}</div>
                                            </div>
                                            <div className="box-desc-right">
                                                {peopleAttribute.gender.man.percent}%
                                            </div>
                                        </div>
                                        <div className="box-progress">
                                            <HProgress percent={peopleAttribute.gender.man.percent}></HProgress>
                                        </div>
                                    </div>
                                    <div className="woman sex-box">
                                        <div className="box-desc">
                                            <div className="box-desc-left">
                                                <div className="key">女性</div>
                                                <div className="val">{peopleAttribute.gender.woman.val}</div>
                                            </div>
                                            <div className="box-desc-right">
                                                {peopleAttribute.gender.woman.percent}%
                                            </div>
                                        </div>
                                        <div className="box-progress">
                                            <HProgress percent={peopleAttribute.gender.woman.percent} bgColor="#8A56A7"></HProgress>
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
                                                <Progress percent={peopleAttribute.age.young}></Progress>
                                            </div>
                                            <div className="type">青年</div>
                                        </div>
                                        <div className="box-item">
                                            <div className="progress">
                                                <Progress percent={peopleAttribute.age.middle}></Progress>
                                            </div>
                                            <div className="type">中年</div>
                                        </div>
                                        <div className="box-item">
                                            <div className="progress">
                                                <Progress percent={peopleAttribute.age.elderly}></Progress>
                                            </div>
                                            <div className="type">老年</div>
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
                                        <VBar yAxis={activityRateByWeek.y} xAxis={activityRateByWeek.x}></VBar>
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
                                        {
                                            activityByCity.map((v, i) => (
                                                <div key={i} className="line layout">
                                                    <div className="position">{v.city}</div>
                                                    {v.value.map((val, index) =>
                                                        <div key={index}>{val}</div>
                                                    )}
                                                </div>
                                            ))
                                        }
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


