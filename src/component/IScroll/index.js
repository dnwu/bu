import React, { Component } from 'react';
import './index.scss'

let control = true
let scrollTop = 0
class index extends Component {
    state = {
        scrollTop: 0,  // 列表top值
        barTop: 0,    //滚动条top值,
        scrollEnd: null, // 滚动条触碰到底部,
        isShowBar: true
        // control: true,  // 页面触及底部,控制请求次数,
    }
    componentWillReceiveProps(props) {
        let isShowBar
        if (props.isShowBar === undefined) {
            isShowBar = true
        } else if (props.isShowBar) {
            isShowBar = true
        } else {
            isShowBar = false
        }
        this.setState({
            scrollEnd: props.scrollEnd,
            isShowBar: isShowBar
        })
    }
    componentDidMount() {
        // console.log(this.props.list);
        this.resetDOM()
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
        } else {
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
    scrollUp = async () => {
        let scrollBoxDOM = this.refs.scrollBox  //获取滚动内容dom
        let listBoxDOM = this.refs.list  //获取滚动容器dom
        let barDOM = this.refs.bar   //获取滚动条dom
        let BarBoxDOM = this.refs.barBox
        // 计算listBoxDOM的高度比scrollBoxDOM的高度高多少, 然后通过对比滚动距离和高度差的比例来计算滚动条需要滚动的距离
        let hdif = scrollBoxDOM.offsetHeight - listBoxDOM.offsetHeight
        if (hdif <= 0 || scrollTop >= hdif) return
        if (hdif - scrollTop < 20 && control) {
            control = false
            if (this.state.scrollEnd) {
                await this.state.scrollEnd('老大,请求数据')
            }
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
        let style
        if (this.state.isShowBar) {
            style = {
                display: "inline-block"
            }
        } else {
            style = {
                display: "none"
            }
        }
        return (
            <div onWheel={this.scroll} className="i-scroll">
                <div style={style} ref="barBox" className="sroll-bar">
                    <div ref="bar" className="bar"></div>
                </div>
                <div ref="list" className="list">
                    <div ref="scrollBox" className="scroll-box">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default index;