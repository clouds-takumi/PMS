import { Component } from 'react'
import { getIssues, createIssue, deleteCurIssue, getIterations } from './service'
import { connect } from 'react-redux'
import { Table, Button, message, Divider, Popconfirm } from 'antd'
import s from './style.less'
import CreateModal from '@/components/create-modal'
import moment from 'moment'
import { UpCircleFilled, MinusCircleFilled, DownCircleFilled } from '@ant-design/icons'

const priorityMap = [
  { id: 1, name: '紧急' },
  { id: 2, name: '优先' },
  { id: 3, name: '一般' },
]

class Issue extends Component {
  constructor(props) {
    super(props)
    this.state = {
      projectId: null,
      issues: {},
      loading: false,
      columns: [
        {
          title: '事项名称',
          dataIndex: 'name',
          key: 'name',
          width: 120
        },
        {
          title: '负责人',
          dataIndex: 'assignee',
          key: 'assignee',
          width: 120,
          render: dataIndex => {
            return dataIndex ? dataIndex : <div>未分配</div>
          }
        },
        {
          title: '优先级',
          dataIndex: 'priority',
          key: 'priority',
          width: 120,
          render: dataIndex => priorityMap.map((item, index) => {
            if (item.id === dataIndex) {
              return <div key={index + 10}>{item.name}</div>
            } else {
              return null
            }
          })
        },
        {
          title: '截止日期',
          dataIndex: 'deadline',
          key: 'deadline',
          width: 120,
          render: dataIndex => {
            if (dataIndex) {
              return <div>{moment(dataIndex).format('YYYY/MM/DD')}</div>
            } else {
              return <div>未设定</div>
            }
          }
        },
        {
          title: '所属迭代',
          dataIndex: 'iterationId',
          key: 'iterationId',
          width: 120,
          render: dataIndex => {
            if (dataIndex) {
              if (this.state.iters) {
                return this.state.iters.map((item, index) => {
                  if (item.id === dataIndex) {
                    return <div key={index}>{item.name}</div>
                  } else {
                    return null
                  }
                })
              }
            } else {
              return <div>未进行规划</div>
            }
          }
        },
        {
          title: '操作',
          key: 'operate',
          width: 120,
          render: issue => {
            return (
              <>
                <span className={s.operateEdit} onClick={() => this.issueEdit(issue)}>编辑</span>
                <Divider type='vertical' />
                <Popconfirm
                  title='确认删除?'
                  onConfirm={() => this.delCurIssue(issue.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <span className={s.operatDel}>删除</span>
                </Popconfirm>
              </>
            )
          }
        },
      ],
      visible: false,
      forms: [
        {
          label: '事项名称',
          name: 'name',
          rules: [
            { required: true, message: '请输入事项名称' },
            { max: 20, message: '名称不能大于20个字符' }
          ],
        },
        {
          type: 'editor',
          label: '事项描述',
          name: 'desc',
        },
      ],
      extraForms: [
        {
          type: 'select',
          label: '优先级',
          name: 'priority',
          data: priorityMap,
          placeholder: '请选择优先等级',
          options: [
            { value: 3, name: <div><UpCircleFilled style={{color: 'red'}} /> 高 </div>},
            { value: 2, name: <div><MinusCircleFilled style={{color: 'orange'}} /> 中 </div> },
            { value: 1, name: <div><DownCircleFilled style={{color: 'green'}} /> 低 </div> },
          ],
          rules: [{ required: true, message: '请选择优先等级' }]
        },
        {
          type: 'assignee',
          label: '负责人',
          name: 'assignee',
        },
        {
          type: 'date',
          label: '截止日期',
          name: 'deadline',
        },
        {
          type: 'select',
          label: '所属迭代',
          name: 'iterationId',
          data: (() => {
            return []
          })()
        }
      ],
    }
  }

  render() {
    const { loading, columns, issues, visible, forms, extraForms } = this.state

    return (
      <div className={s.wrapper}>
        <CreateModal
          width={935}
          visible={visible}
          title='新建事项'
          onCancel={() => this.hanldeVisibleChange(false)}
          forms={forms}
          extraForms={extraForms}
          onFinish={this.onFinish} />
        <div className={s.operations}>
          <Button type='primary' onClick={() => this.hanldeVisibleChange(true)}>创建事项</Button>
        </div>
        <Table
          loading={loading}
          className={s.table}
          dataSource={issues.lists}
          columns={columns}
          pagination={false}
          rowKey='id' />
      </div>
    )
  }

  getIterations = () => {
    const { projectInfo } = this.props
    getIterations(projectInfo).then(({ data }) => {
      if (data) {
        return data.lists
      } else {
        return []
      }
    })
  }

  componentDidMount() {
    this.fetchIssues()
    const { projectInfo } = this.props
    if (projectInfo.id) {
      this.setState({ projectId: projectInfo.id })
    }
  }

  fetchIssues = () => {
    const { projectInfo } = this.props
    this.setState({ loading: true })

    if (projectInfo.id) {
      getIssues(projectInfo.id).then(({ data }) => {
        if (data) {
          this.setState({ issues: data })
          this.setState({ loading: false })
        }
      })
    }
  }

  hanldeVisibleChange = visible => {
    this.setState({ visible })
  }

  onFinish = values => {
    const { projectInfo } = this.props

    createIssue(projectInfo.id, values).then(() => {
      message.success('创建成功')
      this.hanldeVisibleChange(false)
      this.fetchIssues()
    })
  }

  delCurIssue = id => {
    const { projectInfo } = this.props

    deleteCurIssue(projectInfo, id).then(() => {
      message.success(`删除成功`)
      this.fetchIssues()
    })
  }
}

export default connect(store => ({ projectInfo: store.projectInfo }))(Issue)
