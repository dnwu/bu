import React, { Component } from 'react';
import api from './../../server'
import './index.scss'
import {
    Form, Icon, Input, Button, message
} from 'antd';

import { connect } from 'react-redux'
import { setUserName } from './../../redux/action'

const mapState = state => {
    return {
        userName: state.userName
    }
}
class index extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                let options = {
                    username: values.userName, password: values.password
                }
                let { data } = await api.login(options)
                if (data.code === 20102) {
                    message.error(data.message);
                }
                if (data.code === 0) {
                    message.success("欢迎您, 尊贵的" + values.userName);
                    const { dispatch } = this.props
                    dispatch(setUserName(values.userName))
                    sessionStorage.setItem('userName', values.userName)
                    sessionStorage.setItem('token', data.data.token)
                    this.props.history.push('/main')
                }
            }
        })
    }
    render() {
        const formItemLayout = {
            labelCol: { span: 0 },
            wrapperCol: { span: 24 },
        };
        const { getFieldDecorator } = this.props.form;
        return (
            <div className='login'>
                <div className="logo"></div>
                <div className="tit">
                    <p className="ch">人脸结构化数据分析</p>
                    <p className="en">Face recognition Structural analysis</p>
                </div>
                <div className="form">
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item className="userName" {...formItemLayout}>
                            {getFieldDecorator('userName', {
                                rules: [{ required: true, message: 'Please input your username!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} autoComplete="off" placeholder="Terminus" />
                            )}
                        </Form.Item>
                        <Form.Item className="password" {...formItemLayout}>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="输入密码" />
                            )}
                        </Form.Item>
                        <Form.Item className="btn" {...formItemLayout}>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                进入系统
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        );
    }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(connect(mapState)(index));
export default WrappedNormalLoginForm;