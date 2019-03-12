import React, { Component } from 'react';
import './index.scss'
import peopleSvg from './../../static/manage.svg'
import eventSvg from './../../static/event.svg'
import captureSvg from './../../static/capture.svg'
class index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "people"
        }
    }
    goto = (path) => {
        let pathname = this.props.history.location.pathname
        if (pathname === path) return
        this.props.history.push(path)
    }
    render() {
        // let { active } = this.state
        return (
            <div className="search-nav">
                <div className="item active" onClick={this.goto.bind(this, '/search-by-people')}>
                    <div className="icon">
                        <img src={peopleSvg} alt="" />
                    </div>
                    <div className="title">
                        <p className="ch">人员搜索</p>
                        <p className="en">Search People </p>
                    </div>
                </div>
                <div className="item">
                    <div className="icon">
                        <img src={eventSvg} alt="" />
                    </div>
                    <div className="title">
                        <p className="ch">人员搜索</p>
                        <p className="en">Search People </p>
                    </div>
                </div>
                <div className="item">
                    <div className="icon">
                        <img src={captureSvg} alt="" />
                    </div>
                    <div className="title">
                        <p className="ch">人员搜索</p>
                        <p className="en">Search People </p>
                    </div>
                </div>
                <div className="bottom">
                    <div>
                        <p className="ch">所有人员</p>
                        <p className="en">All People</p>
                    </div>
                    <div>
                        <p className="ch">所有事件</p>
                        <p className="en">All Events</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default index;