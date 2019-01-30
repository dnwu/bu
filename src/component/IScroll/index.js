import React, { Component } from 'react';
import './index.scss'
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollTop: 0,  // 列表top值
            barTop: 0,    //滚动条top值,
            scrollEnd: null, // 滚动条触碰到底部,
            isShowBar: true
            // control: true,  // 页面触及底部,控制请求次数,
        }
        this.control = true
        this.scrollTop = 0
    }
    componentWillReceiveProps(props) {
        this.setState({
            scrollEnd: props.scrollEnd
        })
    }
    componentDidMount() {
        this.resetDOM()
        this.isShowBarControl()
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
    isShowBarControl = () => {
        let isShowBar
        if (this.props.isShowBar === undefined) {
            isShowBar = true
        } else if (this.props.isShowBar) {
            isShowBar = true
        } else {
            isShowBar = false
        }
        this.setState({
            isShowBar: isShowBar
        })
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
        this.scrollTop = 0
    }
    scrollUp = async () => {
        let scrollBoxDOM = this.refs.scrollBox  //获取滚动内容dom
        let listBoxDOM = this.refs.list  //获取滚动容器dom
        let barDOM = this.refs.bar   //获取滚动条dom
        let BarBoxDOM = this.refs.barBox
        // 计算listBoxDOM的高度比scrollBoxDOM的高度高多少, 然后通过对比滚动距离和高度差的比例来计算滚动条需要滚动的距离
        let hdif = scrollBoxDOM.offsetHeight - listBoxDOM.offsetHeight
        if (hdif <= 0 || this.scrollTop >= hdif) return
        if (hdif - this.scrollTop < 20 && this.control) {
            this.control = false
            // console.log(this.control);
            if (this.state.scrollEnd) {
                await this.state.scrollEnd('老大,请求数据')
            }
            this.control = true
        }
        // 滚动条和滚动条容易高度差
        let hBarDif = BarBoxDOM.offsetHeight - barDOM.offsetHeight
        this.scrollTop = this.scrollTop + 20
        let ratio = this.scrollTop / hdif
        let barTop = hBarDif * ratio
        scrollBoxDOM.style.top = `${-this.scrollTop}px`
        barDOM.style.top = `${barTop}px`

    }
    scrollDown = () => {
        if (this.scrollTop <= 0) return
        let scrollBoxDOM = this.refs.scrollBox  //获取滚动内容dom
        let listBoxDOM = this.refs.list  //获取滚动容器dom
        let barDOM = this.refs.bar   //获取滚动条dom
        let BarBoxDOM = this.refs.barBox
        // 计算listBoxDOM的高度比scrollBoxDOM的高度高多少, 然后通过对比滚动距离和高度差的比例来计算滚动条需要滚动的距离
        let hdif = scrollBoxDOM.offsetHeight - listBoxDOM.offsetHeight
        if (hdif <= 0) return
        // 滚动条和滚动条容易高度差
        let hBarDif = BarBoxDOM.offsetHeight - barDOM.offsetHeight
        this.scrollTop = this.scrollTop - 20
        // console.log(scrollTop);
        let ratio = this.scrollTop / hdif
        let barTop = hBarDif * ratio

        scrollBoxDOM.style.top = `${-this.scrollTop}px`
        barDOM.style.top = `${barTop}px`
    }
    scroll = (e) => {
        if (e.nativeEvent.deltaY > 0) {
            this.scrollUp()
        } else {
            this.scrollDown()
        }
    }
    mouseDown = (e) => {
        let barDOM = this.refs.bar
        let BarBoxDOM = this.refs.barBox
        let listBoxDOM = this.refs.list  //获取滚动容器dom 
        let scrollBoxDOM = this.refs.scrollBox  //获取滚动内容dom
        // console.log('barDOM', barDOM);
        // console.log(barDOM.offsetTop, e.pageY);
        let mousePageY = e.pageY   // 鼠标点击处, 距离页面top部的距离
        let barTop = barDOM.offsetTop // 鼠标点击时, 滚动条的top值

        document.onmousemove = async (e) => {
            let barH = barDOM.offsetHeight  //滚动条的高度
            let barBoxH = BarBoxDOM.offsetHeight // 滚动条容器的高度
            let listBoxH = listBoxDOM.offsetHeight // 滚动列表容器的高度
            let disY = e.pageY - mousePageY  // 鼠标移动的距离, 带正负
            let afterBarTop = barTop + disY
            if (afterBarTop <= 0 || afterBarTop >= barBoxH - barH) return  // 如果鼠标top值小于0或者滚动到外边了 ,就不要拖动了
            let percent = afterBarTop / barH  // 滚动条 滚动的距离占自身高度的比值
            this.scrollTop = listBoxH * percent
            barDOM.style.top = `${afterBarTop}px`
            scrollBoxDOM.style.top = `${-this.scrollTop}px`
            if (barBoxH - barH - afterBarTop <= 100) {
                await this.state.scrollEnd('老大,请求数据')
            }
        }
        document.onmouseup = () => {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    }
    mouseUp = () => {

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
                    <div onMouseDown={this.mouseDown} onMouseUp={this.mouseUp} ref="bar" className="bar"></div>
                </div>
                <div ref="list" className="component-list">
                    <div ref="scrollBox" className="scroll-box">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

export default index;