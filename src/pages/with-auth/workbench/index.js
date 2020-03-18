import { Component } from 'react'
import { RightOutlined, SoundOutlined, TagOutlined } from '@ant-design/icons'
import Link from 'umi/link'
import s from './style.less'
import { getProjects } from './service'
import router from 'umi/router'
import { Select, Empty } from 'antd'

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      type: '1',
      switchType: '1',
    }
    document.getElementsByTagName("title")[0].innerText = '工作台'
  }

  renderAllContent = switchType => {
    return (
      <div className={s.mainDetail}>
        {
          switchType === '1' && (
            <div>
              <Empty description={'暂时没有 全部动态'} />
            </div>
          )
        }
        {
          switchType === '2' && (
            <div>
              <Empty description={'暂时没有 与我相关'} />
            </div>
          )
        }
      </div>
    )
  }

  renderWorkContainer = () => {
    const { type, switchType, projects } = this.state
    return (
      <>
        <div className={s.titleContainer}>
          <h3 className={s.workname}>工作台</h3>
          <div className={s.switch}>
            <div className={s.sitem}
              onClick={() => { this.setState({ type: '1' }) }}
              style={type === '1' ? { backgroundColor: '#fff' } : null}>
              <SoundOutlined style={type === '1' ? { marginRight: '4px', color: 'blue' } : { marginRight: '4px' }} />项目动态
              </div>
            <div className={s.sitem}
              onClick={() => { this.setState({ type: '2' }) }}
              style={type === '2' ? { backgroundColor: '#fff' } : null}>
              <TagOutlined style={type === '2' ? { marginRight: '4px', color: 'blue' } : { marginRight: '4px' }} />待处理事项
              </div>
          </div>
          <div className={s.divider}></div>
          <div className={s.select}>
            {/* TODO: */}
            {
              projects.length > 0
                ? (
                  <Select defaultValue={projects[0].name} style={{ width: 120 }} onChange={() => { }} allowClear>
                    {
                      projects.map(item => (
                        <Select.Option value={item.name} key={item.id}>{item.name}</Select.Option>
                      ))
                    }
                  </Select>
                )
                : (
                  <Select defaultValue='全部项目' style={{ width: 120 }} onChange={() => { }}></Select>
                )
            }
          </div>
        </div>

        <div className={s.workContent}>
          {
            type === '1' && (
              <>
                <div className={s.workHeader}>
                  <div className={s.workItem}
                    onClick={() => this.setState({ switchType: '1' })}
                    style={switchType === '1' ? { borderBottom: "2px solid #355f9e" } : null}>全部动态</div>
                  <div className={s.workItem}
                    onClick={() => this.setState({ switchType: '2' })}
                    style={switchType === '2' ? { borderBottom: "2px solid #355f9e" } : null}>与我相关</div>
                </div>
                <div className={s.workMain}>
                  {
                    switchType !== '' && (
                      this.renderAllContent(switchType)
                    )
                  }
                </div>
              </>
            )
          }
          {
            type === '2' && (
              <>
                <div className={s.workHeader}>
                  <div className={s.workItem}
                    style={{ borderBottom: "2px solid #355f9e" }}>全部事项</div>
                </div>
                <div className={s.workMain}>
                  <div className={s.mainDetail}>
                    <Empty description={'暂时没有 待处理事项'} />
                  </div>
                </div>
              </>
            )
          }
        </div>
      </>
    )
  }

  render() {
    const { projects} = this.state

    return (
      <div className={s.wrapper}>
        <div className={s.projects}>
          <h3 className={s.projectsTitle}>我的项目</h3>
          <div className={s.projectsList}>
            {
              projects.map((project, index) => {
                if (index < 4) {
                  return (
                    <div
                      key={project.id}
                      className={s.projectsListItem}
                      onClick={() => router.push(`/p/${project.id}/overview`)}>
                      <div className={s.projectsLeft}></div>
                      <div className={s.projectsRight}>
                        <div className={s.projectsName}>{project.name}</div>
                        {
                          project.desc && project.desc !== '<p></p>' ? (
                            <div className={s.projectsDesc} dangerouslySetInnerHTML={{ __html: project.desc }}></div>
                          ) : <div className={s.projectsDesc}>未填写描述</div>
                        }
                      </div>
                    </div>
                  )
                } else if (index === 4) {
                  return (
                    <div className={s.morePro}>.....</div>
                  )
                } else {
                  return null
                }
              })
            }
            <Link to='/project'>
              <div className={s.projectsLink}>
                全部项目 <RightOutlined />
              </div>
            </Link>
          </div>
        </div>
        <div className={s.work}>
          {
            this.renderWorkContainer()
          }
        </div>
      </div>
    )
  }

  componentDidMount() {
    this.fetchProjects()
  }

  fetchProjects = () => {
    getProjects().then(({ data }) => {
      if (data && data.lists) {
        this.setState({ projects: data.lists })
      }
    })
  }
}

export default User
