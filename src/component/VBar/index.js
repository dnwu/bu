import React, { Component } from 'react';
import './index.scss'
class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            xAxis: [],
            yAxis: []
        }
    }
    componentDidMount() {
        let yAxis = this.props.yAxis || []
        let max = Math.max(...yAxis)
        let newYAxis = yAxis.map((v, i) => {
            return {
                value: v,
                percent: (v / max * 100).toFixed(2) + "%"
            }
        })
        this.setState({
            xAxis: this.props.xAxis || [],
            yAxis: newYAxis,
        })
    }
    render() {
        return (
            <div className="v-bar">
                <div className="v-val-box">
                    {
                        this.state.yAxis.map((v, i) =>
                            <div key={i} className="v-bar-val-box">
                                <span>{v.value}</span>
                                <div style={{ height: v.percent }} className="progress"></div>
                            </div>
                        )
                    }

                </div>
                <div className="v-key-box">
                    {
                        this.state.xAxis.map((v, i) =>
                            <div key={i}>{v}</div>
                        )
                    }
                </div>
            </div>
        );
    }
}

export default index;