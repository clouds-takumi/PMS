import { Component } from 'react'
import Link from 'umi/link'
import s from './style.less'
import cn from 'classnames'
import moment from 'moment'
import { getProjects, getActivity } from '@/service'
import router from 'umi/router'
import { Select, Empty, Timeline } from 'antd'
import {
  RightOutlined,
  SoundOutlined,
  TagOutlined,
  HomeOutlined,
  BuildOutlined,
  FilterOutlined,
  TagsOutlined
} from '@ant-design/icons'

const actMap = {
  'CREATE': {
    name: '创建了',
    color: 'green'
  },
  'UPDATE': {
    name: '更新了',
    color: '#06f',
  },
  'DELETE': {
    name: '删除了',
    color: 'red',
  },
}
const typeMap = {
  project: {
    name: '项目',
    icon: <HomeOutlined />,
  },
  iteration: {
    name: '迭代',
    icon: <BuildOutlined />,

  },
  issue: {
    name: '事项',
    icon: <FilterOutlined />,
  },
  tag: {
    name: '标签',
    icon: <TagsOutlined />,
  },
}

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      type: '1',
      switchType: '1',
      projectId: null,
      activities: []
    }
    document.getElementsByTagName("title")[0].innerText = '工作台'
  }

  renderProjectActivity = () => {
    const { activities } = this.state
    const reduceActs = activities.reduce((a, b) => {
      const length = a.length

      if (!length) {
        a.push([b])
      } else {
        const prevLength = a[length - 1].length
        const prevDate = moment(a[length - 1][prevLength - 1].createdAt).format('YYYY-MM-DD')
        const currentDate = moment(b.createdAt).format('YYYY-MM-DD')
        if (prevDate === currentDate) {
          a[length - 1].push(b)
        } else {
          a.push([b])
        }
      }
      return a
    }, [])

    return (
      <div>
        {
          reduceActs.map((acts, index) => (
            <div key={index}>
              <div className={s.date}>{moment(acts[0].createdAt).format('YYYY-MM-DD dddd')}</div>
              <Timeline style={{ padding: 20 }}>
                {
                  acts.map(activity => (
                    <Timeline.Item color={actMap[activity.act].color} key={activity.id}>
                      <span className={s.item}>{moment(activity.createdAt).format('HH:mm')}</span>
                      <span className={s.item}>{activity.fromName}</span>
                      <span className={s.item}>{actMap[activity.act].name}</span>
                      <span className={s.item}>
                        {typeMap[activity.targetType].icon}&nbsp;
                          {typeMap[activity.targetType].name}
                      </span>
                      <span className={s.item}>{activity.targetName}</span>
                    </Timeline.Item>
                  ))
                }
              </Timeline>
            </div>
          ))
        }
      </div>
    )
  }

  renderAllContent = switchType => {
    const { projectId } = this.state

    return (
      <div className={s.mainDetail}>
        {
          switchType === '1' && !projectId && (
            <div>
              <Empty description={'未选择查看项目，或当前项目没有动态'} />
            </div>
          )
        }
        {
          switchType === '1' && projectId && this.renderProjectActivity()
        }
        {
          switchType === '2' && (
            <div>
              <Empty description={'暂时没有与我相关的信息'} />
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
            <div className={type === '1' ? cn(s.sitem, s.checked) : s.sitem}
              onClick={() => { this.setState({ type: '1' }) }}>
              <SoundOutlined className={type === '1' ? cn(s.itemIcon, s.iconColor) : s.itemIcon} />项目动态
              </div>
            <div className={type === '2' ? cn(s.sitem, s.checked) : s.sitem}
              onClick={() => { this.setState({ type: '2' }) }}>
              <TagOutlined className={type === '2' ? cn(s.itemIcon, s.iconColor) : s.itemIcon} />待处理事项
              </div>
          </div>
          <div className={s.divider}></div>
          <div className={s.select}>
            {
              projects.length > 0
                ? (
                  <Select placeholder='选择查看项目' allowClear className={s.selectStyle} onChange={this.handleSelect}>
                    {
                      projects.map(item => (
                        <Select.Option value={item.id} key={item.id}>
                          {item.name}
                        </Select.Option>
                      ))
                    }
                  </Select>
                )
                : (
                  <Select></Select>
                )
            }
          </div>
        </div>

        <div className={s.workContent}>
          {
            type === '1' && (
              <>
                <div className={s.workHeader}>
                  <div className={switchType === '1' ? cn(s.workItem, s.workItemChecked) : s.workItem}
                    onClick={() => this.setState({ switchType: '1' })}>全部动态</div>
                  <div className={switchType === '2' ? cn(s.workItem, s.workItemChecked) : s.workItem}
                    onClick={() => this.setState({ switchType: '2' })}>与我相关</div>
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
    const { projects } = this.state

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
                      <img className={s.projectsLeft} src={project.avatar} alt='' />
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
              <div className={s.projectsLink}>全部项目 <RightOutlined /></div>
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

  handleSelect = projectId => {
    this.setState({ projectId })
    if (projectId) {
      getActivity(projectId).then(({ data }) => {
        this.setState({
          activities: data,
        })
      })
    }
  }

}

export default User
