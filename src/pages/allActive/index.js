import React, { Component } from 'react';
import './index.scss'
import Head from './../../component/Head'
class index extends Component {
    render() {
        return (
            <div className="all-active">
                <Head></Head>
                <div className="body">
                    <div className="body-head"></div>
                    <div className="body-main"></div>
                </div>
            </div>
        );
    }
}

export default index;