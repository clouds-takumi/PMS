import { Component } from 'react'
import { getIssues, createIssue, deleteCurIssue, getIterations, editIssue } from '@/service'
import { connect } from 'react-redux'
import { Table, Button, message, Divider, Popconfirm } from 'antd'
import s from './style.less'
import CreateModal from '@/components/create-modal'
import moment from 'moment'
import { UpCircleFilled, MinusCircleFilled, DownCircleFilled } from '@ant-design/icons'
import SideSlip from '@/components/side-slip'
import { dataFormat } from '@/utils'

const dataFormatRules = [
  {
    key: 'desc',
    type: 'html',
  },
  {
    key: 'deadline',
    type: 'moment',
  },
  {
    key: 'tags',
    type: 'array',
  },
]

const priorityMap = [
  { id: 3, name: '高' },
  { id: 2, name: '中' },
  { id: 1, name: '低' },
]

class Issue extends Component {
  constructor(props) {
    super(props)
    const { participant } = props.projectInfo
    this.state = {
      issues: {},
      iterations: [],
      loading: false,
      sideSlipVisible: false,
      columns: [
        {
          title: '事项名称',
          dataIndex: 'name',
          key: 'name',
          width: 120,
          render: dataIndex => <div className={s.issueName} onClick={() => this.handleSideSlipVisible(true)} >{dataIndex}</div>
        },
        {
          title: '负责人',
          dataIndex: 'assignee',
          key: 'assignee',
          width: 120,
          render: dataIndex => {
            return dataIndex ? dataIndex.name : <div>未分配</div>
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
              if (this.state.iterations) {
                return this.state.iterations.map((item, index) => {
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
                <span className={s.operateEdit} onClick={() => this.handleEdit(issue)}>编辑</span>
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
          placeholder: '请选择优先等级',
          options: [
            { value: 3, name: <div><UpCircleFilled style={{ color: '#e05846' }} /> 高 </div> },
            { value: 2, name: <div><MinusCircleFilled style={{ color: '#f8cd55' }} /> 中 </div> },
            { value: 1, name: <div><DownCircleFilled style={{ color: '#8dcb57' }} /> 低 </div> },
          ],
          rules: [{ required: true, message: '请选择优先等级' }]
        },
        {
          type: 'user-select',
          label: '处理人',
          name: 'assignee',
          placeholder: '选择处理人',
          single: true,
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
          options: [],
          placeholder: '选择迭代',
        },
        {
          type: 'tag-select',
          label: '标签',
          name: 'tags',
          placeholder: '选择标签',
        }
      ],
      initialValues: null
    }
  }

  render() {
    const { loading,
      columns,
      issues,
      visible,
      forms,
      extraForms,
      sideSlipVisible,
      initialValues } = this.state

    return (
      <div className={s.wrapper}>
        <CreateModal
          initialValues={initialValues}
          width={935}
          visible={visible}
          title={initialValues ? '编辑事项' : '创建事项'}
          onCancel={this.handleCloseModal}
          forms={forms}
          extraForms={extraForms}
          onFinish={this.onFinish}
          btnText={initialValues ? '编辑' : '创建'} />
        <div className={s.operations}>
          <Button type='primary' onClick={this.handleOpenModal}>创建事项</Button>
        </div>
        <SideSlip
          visible={sideSlipVisible}
          onCancel={() => this.handleSideSlipVisible(false)} />
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

  componentDidMount() {
    this.fetchIssues()
    this.fetchIterations()
  }

  fetchIterations = () => {
    const { projectInfo } = this.props
    getIterations(projectInfo.id, { pageSize: 9999 }).then(({ data }) => {
      if (data) {
        this.setState({ iterations: data.lists })
        const { extraForms } = this.state

        extraForms[3].options = data.lists.map(list => ({ ...list, value: list.id }))
        this.setState({ extraForms })
      }
    })
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

  handleEdit = ({ id, name, desc, priority, assignee, deadline, iterationId, tags }) => {
    this.setState({
      initialValues: dataFormat({
        id,
        name,
        desc,
        priority,
        assignee: assignee ? assignee.id : null,
        deadline,
        iterationId,
        tags: tags.map(tag => tag.id),
      }, dataFormatRules, true),
      visible: true,
    })
  }

  handleOpenModal = () => {
    this.setState({
      initialValues: null,
      visible: true,
    })
  }

  handleCloseModal = () => {
    this.setState({
      initialValues: null,
      visible: false,
    })
  }

  handleSideSlipVisible = visible => {
    this.setState({
      sideSlipVisible: visible,
    })
  }

  onFinish = values => {
    const { projectInfo } = this.props
    const { initialValues } = this.state

    if (initialValues) {
      editIssue(projectInfo.id, initialValues.id, dataFormat(values, dataFormatRules)).then(() => {
        message.success('更新成功')
        this.handleCloseModal()
        this.fetchIssues()
      })
      return
    }

    createIssue(projectInfo.id, dataFormat(values, dataFormatRules)).then(() => {
      message.success('创建成功')
      this.handleCloseModal()
      this.fetchIssues()
    })
  }

  delCurIssue = id => {
    const { projectInfo } = this.props

    deleteCurIssue(projectInfo.id, id).then(() => {
      message.success(`删除成功`)
      this.fetchIssues()
    })
  }
}

export default connect(store => ({ projectInfo: store.projectInfo }))(Issue)
