import React, { Component } from 'react';
import './index.scss'
import api from './../../server'
import { Input, Button, Select, Icon, DatePicker } from 'antd'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import defaultImg from './../../static/default.png'
import defaultActiveImg from './../../static/init.png'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import tagIcon from './../../static/tag.svg'
import position from './../../static/positon.svg'

import moment from 'moment';
// import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option
const { RangePicker } = DatePicker;
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment().format("YYYY-MM-DD"),
            drawerVisible: false,
            key: "",
            acitiveTotal: 0,
            activesList: [],
            personTotal: 0,
            personsList: [],
            activeIsHas: true,
            personIsHas: true,
            cityList: [],
            city: "",
            startTIme: moment().format("X"),
            endTIme: moment().format("X")
        }
        this.personPage = 1
        this.activePage = 1
        this.personPageSize = 10
        this.activePageSize = 10
    }

    componentDidMount() {
        // 初始化搜索框value
        let trans = this.props.location.params || { value: "", city: "" }
        this.refs.input.state.value = trans.value
        this.setState({
            city: trans.city
        })

        // 初始化page
        this.personPage = 1
        this.activePage = 1
        this.getCityList()
        // this.getActives("", "", 1)
        // this.getPersons("", 1)
        this.search()
    }
    getCityList = async () => {
        let { data } = await api.getCityList()
        data.data.cities.unshift({ id: "", name: "全国" })
        if (data.code === 0) {
            this.setState({
                cityList: data.data.cities
            })
        }
    }
    getActives = async (key, city_id, page) => {
        let options
        if (this.state.drawerVisible) {
            options = {
                key,
                city_id,
                startTime: this.state.startTIme,
                endTime: this.state.endTIme,
                offset: (page - 1) * this.activePageSize,
                limit: this.activePageSize
            }
        } else {
            options = {
                key,
                city_id,
                startTime: 0,
                endTime: 999999999999,
                offset: (page - 1) * this.activePageSize,
                limit: this.activePageSize
            }
        }
        let { data } = await api.getActivesBySearch(options)
        // console.log(data.data.activities);
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.activesList))
            list.push(...data.data.activities)
            list = this.filterText(list)
            if (list.length === data.data.total) {
                this.setState({
                    activesList: list,
                    acitiveTotal: data.data.total,
                    activeIsHas: false
                })
            } else {
                this.setState({
                    activesList: list,
                    acitiveTotal: data.data.total,
                    activeIsHas: true
                })
            }
        }

    }
    getPersons = async (key, page) => {
        let options = {
            key,
            offset: (page - 1) * this.personPageSize,
            limit: this.personPageSize
        }
        let { data } = await api.getPersonsBySearch(options)
        // console.log(data);
        if (data.code === 0) {
            console.log('persons', data.data.persons);
            let list = JSON.parse(JSON.stringify(this.state.personsList))
            list.push(...data.data.persons)
            list = this.filterText(list)
            // console.log(list);
            if (list.length === data.data.total) {
                this.setState({
                    personsList: list,
                    personTotal: data.data.total,
                    personIsHas: false
                })
            } else {
                this.setState({
                    personsList: list,
                    personTotal: data.data.total,
                    personIsHas: true
                })
            }
        }
    }
    search = async () => {
        this.personPage = 1
        this.activePage = 1
        let key = this.refs.input.state.value,
            city = this.state.city
        this.setState({
            key,
            city_id: city,
            activesList: [],
            personsList: [],
        }, async () => {
            await this.getActives(key, city, 1)
            await this.getPersons(key, 1)
            this.refs.personScroll.resetDOM()
            this.refs.activeScroll.resetDOM()
        })
    }
    personScrollEnd = async () => {
        if (!this.state.personIsHas) return
        let key = this.refs.input.state.value
        this.personPage++
        await this.getPersons(key, this.personPage)
    }
    activeScrollEnd = async () => {
        if (!this.state.activeIsHas) return
        let key = this.refs.input.state.value,
            city = this.state.city
        this.activePage++
        // console.log(this.activePage, this.state.activesList.length, this.state.acitiveTotal);
        await this.getActives(key, city, this.activePage)
    }
    selectChange = (city) => {
        this.setState({ city })
    }
    dateChange = (date) => {
        this.setState({
            date: moment(date).format("YYYY-MM-DD")
        })
    }
    selectPerson = (id) => {
        sessionStorage.setItem("personId", id)
        this.props.history.push({
            pathname: '/search/person-info',
            params: { id }
        })
    }
    selectActive = (id) => {
        sessionStorage.setItem("activeId", id)
        this.props.history.push({
            pathname: '/search/active-info',
            params: { id }
        })
    }
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
    filterText = (list) => {
        let keyWord = this.state.key
        if (!keyWord) return list
        var re = new RegExp(keyWord, "g")
        list.forEach((v, i) => {
            v.name = v.name.replace(re, `<span class="height-text">${keyWord}</span>`)
            v.remarks = v.remarks ? v.remarks.replace(re, `<span class="height-text">${keyWord}</span>`) : ""
            v.tags = v.tags.map(item => {
                return item.replace(re, `<span class="height-text">${keyWord}</span>`)
            })
        })
        return list
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
        const acitveCard = (
            this.state.activesList.map((v, i) => (
                <div onClick={this.selectActive.bind(this, v.id)} className="card" key={i}>
                    <img src={v.picture ? v.picture : defaultActiveImg} alt="" />
                    <div className="info">
                        <div className="name">
                            <div className="tit" dangerouslySetInnerHTML={{ __html: v.name }}></div>
                            <div className="tags">
                                {
                                    v.tags && v.tags.map((ele, index) => <div key={index}><img src={tagIcon} alt="" /><span dangerouslySetInnerHTML={{ __html: ele }}></span></div>)
                                }
                            </div>
                        </div>
                        <div className="time">
                            <img src={position} alt="" /><span>{v.city}</span><span>{moment(v.startTime * 1000).format("YYYY.MM.DD")}</span>
                        </div>
                        <div className="mark">
                            {v.remarks === "" ?
                                <div className="mark none">暂无备注</div> :
                                <div className="mark" dangerouslySetInnerHTML={{ __html: v.remarks }}></div>
                            }
                            <div className="status">{v.status === 2 ? '正在进行' : ''}</div>
                            <div className="type">{v.status === 3 ? '已完成' : '已预约'}</div>
                        </div>
                    </div>
                </div>
            ))
        )
        const personCard = (
            this.state.personsList.map((v, i) => (
                <div onClick={this.selectPerson.bind(this, v.id)} className="card" key={i}>
                    <img src={v.picture ? v.picture : defaultImg} alt="" />
                    <div className="info">
                        <div className="name">
                            <div className="tit">
                                <span dangerouslySetInnerHTML={{ __html: v.name }}></span>
                                <img src={v.type === 2 ? vipImg : normImg} className={v.type === 2 ? "vip" : "norm"} alt="" />
                            </div>
                            <div className="tags">
                                {
                                    v.tags.map((ele, index) => <div key={index}><img src={tagIcon} alt="" /><span dangerouslySetInnerHTML={{ __html: ele }}></span></div>)
                                }
                            </div>

                        </div>
                        <div className="title">{v.title}</div>
                        {/* {v.remarks === "" ?
                            <div className="mark none">暂无备注</div> :
                            <div className="mark" dangerouslySetInnerHTML={{ __html: v.remarks }}></div>
                        } */}
                    </div>
                </div>
            ))
        )
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
        return (
            <div className="search-page">
                {drawer}
                <Head></Head>
                <div className="body">
                    <div className="top">
                        <div className="t-left">
                            <Input ref="input" style={{ width: 500 }} placeholder="输入要搜索的活动名称、标签或人员姓名"></Input>
                            <Button onClick={this.search}>搜索</Button>
                            <Select value={this.state.city} defaultValue="" style={{ width: 120 }} onChange={this.selectChange}>
                                {
                                    this.state.cityList.map((v, i) =>
                                        <Option value={v.id} key={i}>{v.name}</Option>
                                    )
                                }
                            </Select>
                            <p>搜索结果</p>
                        </div>
                        <div className="t-right">
                            <Icon onClick={this.showDrawer} type="schedule" />
                            <p className="ch">时段查询</p>
                            <p className="en">Query by time</p>
                        </div>
                    </div>
                    <div className="mid">
                        <div className="m-left">
                            {
                                this.state.drawerVisible ? null :
                                    <div className="box">
                                        <p>人员</p>
                                        <p>{this.state.personTotal}</p>
                                    </div>
                            }
                            <div className="box">
                                <p>活动</p>
                                <p>{this.state.acitiveTotal}</p>
                            </div>
                        </div>
                        <div style={this.state.drawerVisible ? null : { display: "none" }} className="m-right"></div>
                    </div>
                    <div className="bottom">
                        <div className="b-left">
                            <div style={this.state.drawerVisible ? { display: "none" } : null} className="box person-list">
                                <IScroll
                                    scrollEnd={this.personScrollEnd}
                                    ref="personScroll"
                                >
                                    {personCard}
                                    {this.state.personIsHas ?
                                        <div className="loading">
                                            正在加载下一页数据...<Icon type="loading"></Icon>
                                        </div> :
                                        <div className="loading">
                                            已经没有数据了
                                            </div>
                                    }
                                </IScroll>
                            </div>
                            <div className={this.state.drawerVisible ? "box padding active-list" : "box active-list"}>
                                <IScroll
                                    scrollEnd={this.activeScrollEnd}
                                    ref="activeScroll"
                                >
                                    {acitveCard}
                                    {this.state.activeIsHas ?
                                        <div className="loading">
                                            正在加载下一页数据...<Icon type="loading"></Icon>
                                        </div> :
                                        <div className="loading">
                                            已经没有数据了
                                        </div>
                                    }
                                </IScroll>
                            </div>
                        </div>
                        <div style={this.state.drawerVisible ? null : { display: "none" }} className="b-right"></div>
                    </div>

                </div>
            </div>
        );
    }
}

export default index;