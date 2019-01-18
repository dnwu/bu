import React, { Component } from 'react';
import './index.scss'

class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            textColor: "#C9CFE5",
            xAxis: [],
            yAxis: []
        }
    }
    componentDidMount() {
        let yAxis = this.props.yAxis || []
        let max = Math.max(...yAxis)
        let newYAxis = yAxis.map(v => {
            return {
                value: v,
                percent: (v / max * 100).toFixed(2) + "%"
            }
        })
        // console.log(newYAxis);
        this.setState({
            xAxis: this.props.xAxis || [],
            yAxis: newYAxis
        })
    }
    render() {
        const style = {
            color: this.state.textColor
        }
        return (
            <div className="h-bar">
                <div style={style} className="key-box">
                    {
                        this.state.xAxis.map((v, i) =>
                            <div key={i}>{v}</div>
                        )
                    }
                </div>
                <div className="val-box">
                    {
                        this.state.yAxis.map((v, i) =>
                            <div key={i}>
                                <div style={{width: v.percent}} className="bar"></div>
                                <span>{v.value}</span>
                            </div>
                        )
                    }

                </div>
            </div>
        );
    }
}

export default index;