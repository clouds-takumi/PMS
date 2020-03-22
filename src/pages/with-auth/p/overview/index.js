import { Component } from 'react'
import { getActivity } from '@/service'
import { Timeline } from 'antd'
import s from  './style.less'
import {
  HomeOutlined,
  BuildOutlined,
  FilterOutlined,
  TagsOutlined,
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

class Overview extends Component {
  state = {
    activities: [],
  }

  render() {
    const { activities } = this.state

    return (
      <div className={s.wrapper}>
        <div className={s.left}>
          <div className={s.title}>项目动态</div>
          <Timeline style={{padding: 20}}>
            {
              activities.map(activity => (
                <Timeline.Item color={actMap[activity.act].color} key={activity.id}>
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
        <div className={s.right}></div>
      </div>
    )
  }

  componentDidMount() {
    this.getActivity()
  }

  getActivity = () => {
    const { match } = this.props

    getActivity(match.params.projectId).then(({ data }) => {
      this.setState({
        activities: data,
      })
    })

  }
}

export default Overview
