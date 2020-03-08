import { Component } from 'react'
import { Menu } from 'antd'
import Link from 'umi/link'
import { menu } from './constant'
import s from './style.less'
import { connect } from 'react-redux'
import { setProjectInfo } from '@/redux/actions'
import { getProject } from './service'

@connect(
  null,
  dispatch => ({
    setProjectInfo: projectInfo => dispatch(setProjectInfo(projectInfo))
  })
)
class P extends Component {
  render() {
    const { children } = this.props

    return (
      <div className={s.wrapper}>
        <div className={s.side}>
          {this.renderMenu()}
        </div>
        <div className={s.main}>
          {children}
        </div>
      </div>
    )
  }

  renderMenu = () => {
    const { type } = this.props.match.params

    return (
      <Menu
        style={{ background: '#f6f7fa'}}
        selectedKeys={[type]}>
        {
          menu.map(m => (
            <Menu.Item key={m.key}>
              <Link to={m.key} style={{color: 'inherit'}}>
                {m.icon}
                &nbsp;
                {m.name}
              </Link>
            </Menu.Item>
          ))
        }
      </Menu>
    )
  }

  componentDidMount() {
    const { projectId } = this.props.match.params

    if (projectId) {
      getProject({ id: projectId }).then(({ data }) => {
        if (data) {
          this.props.setProjectInfo(data)
        }
      })
    }
  }
}

export default P
