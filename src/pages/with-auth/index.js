import { Component } from 'react'
import { connect } from 'react-redux'
import { Menu, Dropdown, Avatar } from 'antd';
import { DownOutlined, LeftOutlined } from '@ant-design/icons';
import s from './style.less'
import router from 'umi/router';
import { getUserInfo } from './service';
import { setUserInfo } from '@/redux/actions'
import Link from 'umi/link';

const pathReg = /^\/p/
@connect(
  store => ({ userInfo: store.userInfo, projectInfo: store.projectInfo }),
  dispatch => ({
    setUserInfo: userInfo => dispatch(setUserInfo(userInfo))
  })
)
class WithAuth extends Component {
  render() {
    const { children, userInfo, projectInfo, location } = this.props
    const { pathname } = location

    let showLogo = true
    if (pathReg.test(pathname)) {
      showLogo = false
    }

    return (
      <div className={s.wrapper}>
        <div className={s.header}>
          {
            showLogo
              ? <Link to='/'>
                  <div className={s.logo}>PMS</div>
                </Link>
              : <Link to='/'>
                  <div className={s.logo}>
                    <LeftOutlined className={s.logoLink} />
                    {projectInfo.name}
                  </div>
                </Link>
          }
          <div className={s.headerRight}>
            <Dropdown overlay={this.renderMenu()}>
              <div className={s.avatar}>
                <Avatar className={s.avatarEle} src={userInfo.avatar} />
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
        </div>
        <div className={s.body}>
          {children}
        </div>
      </div>
    )
  }

  renderMenu = () => {
    return (
      <Menu>
        <Menu.Item>个人设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item onClick={this.handleLogout}>退出登录</Menu.Item>
      </Menu>
    )
  }

  componentDidMount() {
    const token = localStorage.getItem('token')

    if (!token) {
      router.replace('/login')
    }

    getUserInfo().then(({ data }) => {
      if (data) {
        this.props.setUserInfo(data)
      }
    })
  }

  handleLogout = () => {
    localStorage.removeItem('token')
    router.replace('/login')
  }
}

export default WithAuth
