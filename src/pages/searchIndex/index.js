import React, { Component } from 'react';
import './index.scss'
import { Icon, Input, Button, Select } from 'antd'
import api from './../../server'
import Head from './../../component/Head'
import logoIcon from './../../static/logo.png'
const Option = Select.Option;
class index extends Component {
    state = {
        cityList: [],
        city: "",
    }
    componentDidMount() {
        this.getCityList()
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
    search = () => {
        let value = this.refs.input.state.value,
            city = this.state.city

        this.props.history.push({ pathname: '/search/page', params: {value, city} })
    }
    selectChange = (city) => {
        this.setState({ city })
    }
    render() {
        return (
            <div className="search-index">
                <Head></Head>
                <div className="body">
                    <div className="search-icon">
                        <Icon type="ellipsis" /><Icon type="search" /><Icon type="ellipsis" />
                    </div>
                    <div className="input">
                        <Input ref="input" style={{ width: 400 }} placeholder="输入要搜索的活动名称、标签或人员姓名"></Input>
                        <Button onClick={this.search}>搜索</Button>
                        <Select value={this.state.city} defaultValue="" style={{ width: 120 }} onChange={this.selectChange}>
                            {
                                this.state.cityList.map((v, i) =>
                                    <Option value={v.id} key={i}>{v.name}</Option>
                                )
                            }
                        </Select>
                    </div>
                    <div className="logo-icon">
                        <img src={logoIcon} alt="" />
                    </div>
                </div>
            </div>
        );
    }
}

export default index;