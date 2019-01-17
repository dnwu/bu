import React, { Component } from 'react';
import './index.scss'
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            percent: 0,
            bgColor: "#567FA7"
        }
    }
    componentDidMount() {
        if (this.props.bgColor) {
            this.setState({
                percent: this.props.percent,
                bgColor: this.props.bgColor
            })
        } else {
            this.setState({
                percent: this.props.percent,
            })
        }
    }
    render() {
        let style = {
            backgroundColor: this.state.bgColor,
            width: this.state.percent + "%"
        }
        return (
            <div className="h-progress-box">
                <div className="h-progress-bg"></div>
                <div style={style} className="h-progress"></div>
            </div>
        );
    }
}

export default index;