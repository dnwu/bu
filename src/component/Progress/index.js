import React, { Component } from 'react';
import './index.scss'

class index extends Component {
    constructor(props) {
        super(props)
        this.state = {
            width: 200,
            height: 200,
            lineColor: "#D1C3E9",
            circleBgColor: "#19C1AA",
            rad: Math.PI * 2 / 100,
            percent: null
        }
    }
    componentWillReceiveProps(props) {
        let circleBgColor;
        if (props.percent < 20) {
            circleBgColor = "#9BE8DD"
        } else if (props.percent < 50) {
            circleBgColor = "#67BFB3"
        } else {
            circleBgColor = "#19C1AA"
        }
        this.setState({
            circleBgColor,
            percent: props.percent ? props.percent : 0
        }, () => {
            this.toCanvas()
        })
    }
    componentDidMount() {
        var myCanvas = this.refs.container
        let width = myCanvas.offsetWidth
        let height = myCanvas.offsetHeight
        let circleBgColor;
        if (this.props.percent < 20) {
            circleBgColor = "#9BE8DD"
        } else if (this.props.percent < 50) {
            circleBgColor = "#67BFB3"
        } else {
            circleBgColor = "#19C1AA"
        }
        this.setState({
            width,
            height,
            circleBgColor,
            percent: this.props.percent ? this.props.percent : 0,
        }, () => {

            // this.toCanvas()
        })
    }
    toCanvas = () => {
        var myCanvas = this.refs.canvas
        var ctx = myCanvas.getContext("2d");

        let center_x = myCanvas.offsetWidth / 2
        let center_y = myCanvas.offsetHeight / 2
        this.backgroundCircle(ctx, center_x, center_y)
        this.foregroundCircle(ctx, center_x, center_y)
        this.text(ctx, center_x, center_y)
    }
    backgroundCircle = (ctx, center_x, center_y) => {
        let borderWidth = 1
        let radius = Math.min(center_x, center_y) - 10
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = this.state.lineColor
        ctx.lineWidth = borderWidth; //设置线宽
        ctx.setLineDash([5, 10]);
        ctx.lineCap = "round";
        ctx.arc(center_x, center_y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    foregroundCircle = (ctx, center_x, center_y) => {
        let lineWidth = 10
        let radius = Math.min(center_x, center_y) - lineWidth
        ctx.save();
        ctx.strokeStyle = this.state.circleBgColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        // var radius = center_x - ctx.lineWidth;
        ctx.beginPath();
        ctx.arc(center_x, center_y, radius, -Math.PI / 2, -Math.PI / 2 + this.state.percent * this.state.rad); //用于绘制圆弧ctx.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    text = (ctx, center_x, center_y) => {
        ctx.save(); //save和restore可以保证样式属性只运用于该段canvas元素
        ctx.fillStyle = "#D1C3E9";
        let font_size = 20;
        ctx.font = font_size + "px Helvetica";
        let text_width = ctx.measureText(this.state.percent + "%").width;
        ctx.fillText(this.state.percent + "%", center_x - text_width / 2, center_y + font_size / 2);
        ctx.restore();
    }
    render() {
        return (
            <div ref="container" className="component-progress">
                <canvas ref="canvas" id="myCanvas" height={this.state.height} width={this.state.width} className="container"></canvas>
            </div>
        );
    }
}

export default index;