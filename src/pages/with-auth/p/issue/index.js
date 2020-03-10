import { Component } from 'react'
import { getIssues, createIssue } from './service'
import { connect } from 'react-redux'
import { Table, Button, message } from 'antd'
import s from './style.less'
import CreateModal from '@/components/create-modal'
import moment from 'moment'

const priorityMap = [
  { id: 1, name: '紧急' },
  { id: 2, name: '优先' },
  { id: 3, name: '一般' },
]

class Issue extends Component {
  state = {
    iterations: [],
    columns: [
      {
        title: '事项标题',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '负责人',
        dataIndex: 'assignee',
        key: 'assignee',
        // render: dataIndex => {
        //   if (dataIndex) {
        //     return <div>{this.state.userInfo.username}</div>
        //   } else {
        //     return <div>未分配</div>
        //   }
        // }
      },
      {
        title: '优先级',
        dataIndex: 'priority',
        key: 'priority',
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
        render: dataIndex => {
          if (dataIndex) {
            return <div>{moment(dataIndex).format('YYYY/MM/DD')}</div>
          } else {
            return <div>未确定</div>
          }
        }
      },
      {
        title: '所属迭代',
        dataIndex: 'iterationId',
        key: 'iterationId',
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
      // {
      //   title: '操作',
      //   key: 'operate',
      //   render: issue => {
      //     return (
      //       <>
      //         <span className={s.operate} onClick={() => this.issueEdit(issue)}>编辑</span>
      //         <Divider type='vertical' />
      //         <Popconfirm
      //           title='确认删除?'
      //           onConfirm={() => this.delCurIssue(issue.id)}
      //           okText="确定"
      //           cancelText="取消"
      //         >
      //           <span style={{ cursor: 'pointer', color: '#dd3e6e' }}>删除</span>
      //         </Popconfirm>
      //       </>
      //     )
      //   }
      // },
    ],
    visible: false,
    forms: [
      {
        label: '事项名称',
        name: 'name',
        rules: [
          { required: true, message: '请输入事项名称' },
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
        type: 'date',
        label: '开始日期',
        name: 'startDate',
      },
      {
        type: 'date',
        label: '结束日期',
        name: 'endDate',
      },
    ],
  }

  render() {
    const { columns, iterations, visible, forms, extraForms } = this.state

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
        <Table dataSource={iterations} columns={columns} />
      </div>
    )
  }

  componentDidMount() {
    this.fetchIssues()
  }

  fetchIssues = () => {
    const { projectInfo } = this.props

    if (projectInfo.id) {
      getIssues(projectInfo.id).then(res => {
        console.log(res)
        // if (data.lists) {
        //   this.setState({ iterations: data.lists })
        // }
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
}

export default connect(store => ({ projectInfo: store.projectInfo }))(Issue)
