import React, { Component } from 'react';
import './index.scss'
import api from './../../server'
import { Input, Button, Select, Icon, Drawer, DatePicker } from 'antd'
import Head from './../../component/Head'
import IScroll from './../../component/IScroll'
import defaultImg from './../../static/default.png'
import defaultActiveImg from './../../static/init.png'
import vipImg from './../../static/VIP.png'
import normImg from './../../static/norm.png'
import tagIcon from './../../static/tag.svg'
import position from './../../static/positon.svg'

import moment from 'moment';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
const Option = Select.Option
const { RangePicker } = DatePicker;
let personPage = 1
let personPageSize = 10
let activePage = 1
let activePageSize = 10
class index extends Component {
    state = {
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
        startTIme: 0,
        endTIme: 999999999999
    }
    componentDidMount() {
        personPage = 1
        activePage = 1
        this.getCityList()
        this.getActives("", "", 1)
        this.getPersons("", 1)
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
        let options = {
            key,
            city_id,
            startTIme: this.state.startTIme,
            endTIme: this.state.endTIme,
            offset: (page - 1) * activePageSize,
            limit: activePageSize
        }
        let { data } = await api.getActivesBySearch(options)
        if (data.code === 0) {
            let list = JSON.parse(JSON.stringify(this.state.activesList))
            list.push(...data.data.activities)
            list = this.filterText(list)
            if (list.length === data.data.activitiesTotal) {
                this.setState({
                    activesList: list,
                    acitiveTotal: data.data.activitiesTotal,
                    activeIsHas: false
                })
            } else {
                this.setState({
                    activesList: list,
                    acitiveTotal: data.data.activitiesTotal,
                    activeIsHas: true
                })
            }
        }

    }
    getPersons = async (key, page) => {
        let options = {
            key,
            offset: (page - 1) * personPageSize,
            limit: personPageSize
        }
        let { data } = await api.getPersonsBySearch(options)
        console.log(data);
        if (data.code === 0) {
            // console.log('persons', data);
            let list = JSON.parse(JSON.stringify(this.state.personsList))
            list.push(...data.data.persons)
            list = this.filterText(list)
            // console.log(list);
            if (list.length === data.data.personTotal) {
                this.setState({
                    personsList: list,
                    personTotal: data.data.personTotal,
                    personIsHas: false
                })
            } else {
                this.setState({
                    personsList: list,
                    personTotal: data.data.personTotal,
                    personIsHas: true
                })
            }
        }
    }
    search = async () => {
        personPage = 0
        activePage = 0
        let key = this.refs.input.state.value,
            city = this.state.city
        this.setState({
            key,
            city_id: city
        }, async () => {
            await this.getActives(key, city, 1)
            await this.getPersons(key, 1)
        })
    }
    personScrollEnd = async () => {
        if (this.state.personsList.length === this.state.personTotal) return
        let key = this.refs.input.state.value
        personPage++
        await this.getPersons(key, personPage)
    }
    activeScrollEnd = async () => {
        if (this.state.activesList.length === this.state.acitiveTotal) return
        let key = this.refs.input.state.value,
        city = this.state.city
        activePage++
        // console.log(activePage, this.state.activesList.length, this.state.acitiveTotal);
        await this.getActives(key, city, activePage)
    }
    selectChange = (city) => {
        this.setState({ city })
    }
    dateChange = (date) => {
        this.setState({
            date: moment(date).format("YYYY-MM-DD")
        })
    }
    select = (id) => {
        console.log(id);
        // this.setState({ selectId: id })
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
            v.remarks = v.remarks.replace(re, `<span class="height-text">${keyWord}</span>`)
        })
        return list
    }
    render() {
        const acitveCard = (
            this.state.activesList.map((v, i) => (
                <div onClick={this.select.bind(this, v.id)} className="card" key={i}>
                    <img src={defaultActiveImg} alt="" />
                    <div className="info">
                        <div className="name">
                            <div className="tit" dangerouslySetInnerHTML={{ __html: v.name }}></div>
                            <div className="tags">
                                {
                                    v.tags.map((ele, index) => <div key={index}><img src={tagIcon} alt="" /><span>{ele}</span></div>)
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
                <div onClick={this.select.bind(this, v.id)} className="card" key={i}>
                    <img src={defaultImg} alt="" />
                    <div className="info">
                        <div className="name">
                            <span dangerouslySetInnerHTML={{ __html: v.name }}></span>
                            <img src={v.type === 2 ? vipImg : normImg} className={v.type === 2 ? "vip" : "norm"} alt="" />
                        </div>
                        <div className="title">{v.title}</div>
                        {v.remarks === "" ?
                            <div className="mark none">暂无备注</div> :
                            <div className="mark" dangerouslySetInnerHTML={{ __html: v.remarks }}></div>
                        }
                    </div>
                </div>
            ))
        )
        const drawer = (
            <div className="drawer">
                <RangePicker open></RangePicker>
            </div>
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
                            <div className="box">
                                <p>人员</p>
                                <p>{this.state.personTotal}</p>
                            </div>
                            <div className="box">
                                <p>活动</p>
                                <p>{this.state.acitiveTotal}</p>
                            </div>
                        </div>
                        <div className="m-right"></div>
                    </div>
                    <div className="bottom">
                        <div className="b-left">
                            <div className="box">
                                <IScroll
                                    scrollEnd={this.personScrollEnd}
                                    isShowBar={false}>
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
                            <div className="box">
                                <IScroll
                                    scrollEnd={this.activeScrollEnd}
                                    isShowBar={false}>
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
                        <div className="b-right"></div>
                    </div>

                </div>
            </div>
        );
    }
}

export default index;