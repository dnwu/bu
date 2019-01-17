import React, { Component } from 'react';
import Head from './../../component/Head'
import './index.scss'
class index extends Component {
    render() {
        return (
            <div className="statistics">
                <Head></Head>
            </div>
        );
    }
}

export default index;


// option = {
//     xAxis: {
//         type: 'category',
//         boundaryGap: false,
//         show: false,
//         data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
//     },
//     yAxis: {
//         show: false,
//         type: 'value'
//     },
//     series: [{
//         data: [820, 932, 901, 934, 1290, 1330, 1320],
//         type: 'line',
//         smooth: true,
//         areaStyle: {
//             color: "#975FE4",
//             shadowBlur:2,
//             opacity:0.4
//         },
//         lineStyle: {
//             color: "#975FE4"
//         }
//     }]
// };