import { Component } from 'react'
import { Form, Input, Button } from 'antd';
import s from './style.less'
import router from 'umi/router';
import { toLogin, toRegister } from './service'

class Login extends Component {
  state = {
    type: 1
  }

  render() {
    const { type } = this.state

    return (
      <div className={s.wrapper}>
        <div className={s.logo}>PMS</div>
        <div className={s.box}>
          <Form
            size='large'
            onFinish={this.onFinish}>
            { type === 1 && this.renderLogin() }
            { type === 2 && this.renderRegister() }
            <Button type='primary' htmlType='submit' style={{width: '100%'}}>
              { type === 1 && '登录' }
              { type === 2 && '注册' }
            </Button>
          </Form>
        </div>
      </div>
    )
  }

  renderLogin = () => {
    return (
      <>
        <Form.Item
          label=''
          name='username'
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder='用户名' />
        </Form.Item>
        <Form.Item
          label=''
          name='password'
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder='密码' />
        </Form.Item>
        <div className={s.text}>
          还没帐号?
          <span onClick={() => this.handleChangeType(2)}>去注册</span>
        </div>
      </>
    )
  }

  renderRegister = () => {
    return (
      <>
        <Form.Item
          label=''
          name='username'
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input placeholder='用户名' />
        </Form.Item>
        <Form.Item
          label=''
          name='password'
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder='密码' />
        </Form.Item>
        <Form.Item
          label=''
          name='repassword'
          rules={[{ required: true, message: '请输入确认密码' }]}
        >
          <Input.Password placeholder='确认密码' />
        </Form.Item>
        <div className={s.text}>
          已有帐号?
          <span onClick={() => this.handleChangeType(1)}>去登录</span>
        </div>
      </>
    )
  }

  componentDidMount() {
    const token = localStorage.getItem('token')

    if (token) {
      router.replace('/')
    }
  }

  handleChangeType = type => {
    this.setState({ type })
  }

  onFinish = (values) => {
    const { type } = this.state

    if (type === 1) {
      toLogin(values).then(({ data }) => {
        if (data && data.token) {
          localStorage.setItem('token', data.token)
          router.replace('/')
        }
      })
    }
  }
}

export default Login
