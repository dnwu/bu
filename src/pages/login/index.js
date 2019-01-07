import React, { Component } from 'react';
import './index.scss'
import {
    Form, Icon, Input, Button, Checkbox,
} from 'antd';


class index extends Component {
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
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(index);
export default WrappedNormalLoginForm;