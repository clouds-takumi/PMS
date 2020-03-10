import { Component } from 'react'
import s from './style.less'
import router from 'umi/router';
import { toLogin, toRegister } from './service'
import FormGroup from '@/components/form-group'

class Login extends Component {
  state = {
    type: 1,
    loginForms: [
      {
        name: 'username',
        label: '',
        placeholder: '用户名',
        size: 'large',
        rules: [
          { required: true, message: '请输入用户名' },
          { min: 6, message: '用户名至少6位' },
        ],
      },
      {
        type: 'password',
        name: 'password',
        label: '',
        placeholder: '密码',
        size: 'large',
        rules: [
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' },
        ],
      }
    ],
    registerForms: [
      {
        name: 'username',
        label: '',
        placeholder: '用户名',
        size: 'large',
        rules: [
          { required: true, message: '请输入用户名' },
          { min: 6, message: '用户名至少6位' },
        ],
      },
      {
        type: 'password',
        name: 'password',
        label: '',
        placeholder: '密码',
        size: 'large',
        rules: [
          { required: true, message: '请输入密码' },
          { min: 6, message: '密码至少6位' },
        ],
      },
      {
        type: 'password',
        name: 'repassword',
        label: '',
        placeholder: '确认密码',
        size: 'large',
        dependencies: ['password'],
        rules: [
          { required: true, message: '请输入确认密码' },
          ({ getFieldValue }) => ({
            validator(rule, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject('两次输入密码不相同');
            }
          })
        ],
      }
    ],
  }

  render() {
    const { type, loginForms, registerForms } = this.state

    return (
      <div className={s.wrapper}>
        <div className={s.logo}>PMS</div>
        <div className={s.box}>
          {
            type === 1 && (
              <>
                <FormGroup
                  forms={loginForms}
                  onFinish={this.loginFinish}
                  btnText='登录'
                  btnStyle={{ width: '100%' }} />
                <div className={s.text}>
                  还没帐号?
                  <span onClick={() => this.handleChangeType(2)}>去注册</span>
                </div>
              </>
            )
          }
          {
            type === 2 && (
              <>
                <FormGroup
                  forms={registerForms}
                  onFinish={this.registerFinish}
                  btnText='注册'
                  btnStyle={{ width: '100%' }} />
                <div className={s.text}>
                  已有帐号?
                  <span onClick={() => this.handleChangeType(1)}>去登录</span>
                </div>
              </>
            )
          }
        </div>
      </div>
    )
  }

  loginFinish = (values) => {
    toLogin(values).then(({ data }) => {
      if (data && data.token) {
        localStorage.setItem('token', data.token)
        router.replace('/')
      }
    })
  }

  registerFinish = (values) => {
    const { username, password } = values

    toRegister({ username, password }).then(({ data }) => {
      this.handleChangeType(1)
    })
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
}

export default Login
