import React, { Component } from 'react';
import './index.scss'
import { Icon } from 'antd'
import tools from './../../tools'
import positon from './../../static/position.svg'

let control = true
let scrollTop = 0
class index extends Component {
    state = {
        list: [],
        listInfo: {},
        isHas: false, // 判断是否还需要请求数据 , 到底没
        scrollTop: 0,  // 列表top值
        barTop: 0,    //滚动条top值,
        scrollEnd: null, // 滚动条触碰到底部,
        change:null,  //获取id,获取详情
        // control: true,  // 页面触及底部,控制请求次数,
        selectId: 1, // 选中的cardid
    }
    componentWillReceiveProps(props) {
        if (props.listInfo.total === props.list.length) {
            this.setState({
                list: props.list,
                scrollEnd: props.scrollEnd,
                change: props.change,
                // control: props.control,
                isHas: false,
                selectId: props.selectId
            })
        } else {
            this.setState({
                list: props.list,
                scrollEnd: props.scrollEnd,
                change: props.change,
                // control: props.control,
                isHas: true,
                selectId: props.selectId
            })
        }
    }
    componentDidMount() {
        // console.log(this.props.list);
        window.addEventListener('resize', this.windowResize)
    }
    componentDidUpdate() {
        // console.log('componentDidUpdate',this.state.scrollTop);
        this.setBarParams()
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.windowResize)
    }
    windowResize = () => {
        this.setBarParams()
    }
    select = (id) => {
        this.state.change(id)
        this.setState({
            selectId: id
        })
    }
    list = () => {
        let listDOM = this.state.list.map((v, i) => {
            return (
                <div onClick={this.select.bind(this, v.id)} className={`card ${this.state.selectId === v.id ? 'active' : ''}`} key={v.id}>
                    <div className="img"></div>
                    <div className="info">
                        <div className="title">
                            <span>{v.name}</span>
                            <span>{v.status === 2 ? '正在进行' : ''}</span>
                        </div>
                        <div className="t-info">
                            <img src={positon} alt="" />
                            <span>{v.city}</span>
                            <span>{tools.formatDate(v.startTime)}</span>
                            <span>{v.status === 1 ? '已预约' : v.status === 2 ? '已预约' : v.status === 3 ? '已结束' : '无状态'}</span>
                        </div>
                    </div>
                </div>
            )
        })
        return listDOM
    }
    setBarParams = () => {
        let scrollDOM = this.refs.scrollBox
        let scrollBoxH = scrollDOM.offsetHeight  // 获取滚动列表的高度
        let listBoxH = this.refs.list.offsetHeight        //获取滚动盒子的高度
        let barDOM = this.refs.bar        //获取左侧滚动条dom
        let barBoxH = this.refs.barBox.offsetHeight   // 获取滚动条的容器的高度
        // console.log(scrollBoxH, listBoxH);
        // 计算滚动条的高度
        let barH = barBoxH * listBoxH / scrollBoxH
        if (listBoxH / scrollBoxH > 1) {
            barDOM.style.display = "none"
        }else {
            barDOM.style.display = ""
        }
        // 设置滚动条的高
        barDOM.style.height = barH + 'px'
        // console.log('gundong');
    }
    resetDOM = () => {
        let scrollDOM = this.refs.scrollBox
        let barDOM = this.refs.bar        //获取左侧滚动条dom
        // // 重置滚动内容的top值
        scrollDOM.style.top = '0px'
        barDOM.style.top = '0px'
        scrollTop = 0
    }
    computeDOMValue = () => {
        let scrollDOM = this.refs.scrollBox
        let scrollBoxH = scrollDOM.offsetHeight  // 获取滚动列表的高度
        let listBoxH = this.refs.list.offsetHeight        //获取滚动盒子的高度
        let barDOM = this.refs.bar        //获取左侧滚动条dom
        let barBoxH = this.refs.barBox.offsetHeight   // 获取滚动条的容器的高度
        // console.log(scrollBoxH, listBoxH);
        // 计算滚动条的高度
        let barH = barBoxH * listBoxH / scrollBoxH
        if (listBoxH / scrollBoxH > 1) {
            barDOM.style.display = "none"
        }
        // 设置滚动条的高
        barDOM.style.height = barH + 'px'
        barDOM.style.top = this.state.barTop + 'px'
        scrollDOM.style.top = this.state.scrollTop + 'px'

    }
    scrollUp =async () => {
        let scrollBoxDOM = this.refs.scrollBox  //获取滚动内容dom
        let listBoxDOM = this.refs.list  //获取滚动容器dom
        let barDOM = this.refs.bar   //获取滚动条dom
        let BarBoxDOM = this.refs.barBox
        // 计算listBoxDOM的高度比scrollBoxDOM的高度高多少, 然后通过对比滚动距离和高度差的比例来计算滚动条需要滚动的距离
        let hdif = scrollBoxDOM.offsetHeight - listBoxDOM.offsetHeight
        if (hdif <= 0 || scrollTop >= hdif) return
        console.log(hdif);
        if (hdif - scrollTop < 20 && control) {
            control = false
            await this.state.scrollEnd('老大,请求数据')
            control = true
        }
        // 滚动条和滚动条容易高度差
        let hBarDif = BarBoxDOM.offsetHeight - barDOM.offsetHeight
        scrollTop = scrollTop + 20
        let ratio = scrollTop / hdif
        let barTop = hBarDif * ratio
        scrollBoxDOM.style.top = `${-scrollTop}px`
        barDOM.style.top = `${barTop}px`

    }
    scrollDown = () => {
        if (scrollTop <= 0) return
        let scrollBoxDOM = this.refs.scrollBox  //获取滚动内容dom
        let listBoxDOM = this.refs.list  //获取滚动容器dom
        let barDOM = this.refs.bar   //获取滚动条dom
        let BarBoxDOM = this.refs.barBox
        // 计算listBoxDOM的高度比scrollBoxDOM的高度高多少, 然后通过对比滚动距离和高度差的比例来计算滚动条需要滚动的距离
        let hdif = scrollBoxDOM.offsetHeight - listBoxDOM.offsetHeight
        if (hdif <= 0) return
        // 滚动条和滚动条容易高度差
        let hBarDif = BarBoxDOM.offsetHeight - barDOM.offsetHeight
        scrollTop = scrollTop - 20
        // console.log(scrollTop);
        let ratio = scrollTop / hdif
        let barTop = hBarDif * ratio

        scrollBoxDOM.style.top = `${-scrollTop}px`
        barDOM.style.top = `${barTop}px`
    }
    scroll = (e) => {
        if (e.nativeEvent.deltaY > 0) {
            this.scrollUp()
        } else {
            this.scrollDown()
        }
    }
    render() {
        return (
            <div onWheel={this.scroll} className="i-scroll">
                <div ref="barBox" className="sroll-bar">
                    <div ref="bar" className="bar"></div>
                </div>
                <div ref="list" className="list">
                    <div ref="scrollBox" className="scroll-box">
                        {this.list()}
                        {this.state.isHas ?
                            <div className="loading">
                                正在加载下一页数据...<Icon type="loading"></Icon>
                            </div> :
                            <div className="loading">
                                已经没有数据了
                            </div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default index;