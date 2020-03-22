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
import moment from 'moment'
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util,
} from 'bizcharts';

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
      <div className={s.wrapper}>
        <div className={s.left}>
          <div className={s.title}>项目动态</div>
          {
            reduceActs.map((acts, index)=> (
              <div key={index}>
                <div className={s.date}>{moment(acts[0].createdAt).format('YYYY-MM-DD dddd')}</div>
                <Timeline style={{padding: 20}}>
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
        <div className={s.right}>
          <div>
            <div className={s.title}>迭代统计</div>
            {this.renderChart()}
          </div>
          <div>
            <div className={s.title}>事项统计</div>
            {this.renderChart2()}
          </div>
        </div>
      </div>
    )
  }

  renderChart = () => {
    const data = [
      { name: '未开始', value: 10 },
      { name: '进行中', value: 24 },
      { name: '已完成', value: 15 },
    ];

    return (
      <Chart
        data={data}
        forceFit
        height={250}
      >
        <Coord type="theta"/>
        <Tooltip showTitle={false} />
        <Geom
          type="intervalStack"
          position="value"
          color="name"
        >
          <Label content="name" />
        </Geom>
      </Chart>
    )
  }

  renderChart2 = () => {
    const data = [
      {
        month: "1月",
        type: "待处理",
        number: 7,
      },
      {
        month: "1月",
        type: "处理中",
        number: 1,
      },
      {
        month: "1月",
        type: "处理完成",
        number: 16,
      },
      {
        month: "2月",
        type: "待处理",
        number: 3,
      },
      {
        month: "2月",
        type: "处理中",
        number: 10,
      },
      {
        month: "2月",
        type: "处理完成",
        number: 8,
      },
      {
        month: "3月",
        type: "待处理",
        number: 18,
      },
      {
        month: "3月",
        type: "处理中",
        number: 9,
      },
      {
        month: "3月",
        type: "处理完成",
        number: 21,
      },
    ];

    return (
      <Chart height={250} data={data} forceFit>
        <Legend />
        <Axis name="month" />
        <Axis
          name="number"
        />
        <Tooltip
          crosshairs={{
            type: "y"
          }}
        />
        <Geom
          type="line"
          position="month*number"
          size={2}
          color={"type"}
          shape={"smooth"}
        />
        <Geom
          type="point"
          position="month*number"
          size={4}
          shape={"circle"}
          color={"type"}
          style={{
            stroke: "#fff",
            lineWidth: 1
          }}
        />
      </Chart>
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
