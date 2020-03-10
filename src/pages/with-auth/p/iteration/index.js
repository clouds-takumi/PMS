import { Component } from 'react'
import { getIterations, createIteration } from './service'
import { connect } from 'react-redux'
import { Table, Button, message } from 'antd'
import s from './style.less'
import CreateModal from '@/components/create-modal'

@connect(
  store => ({ projectInfo: store.projectInfo })
)
class Iteration extends Component {
  state = {
    iterations: [],
    columns: [
      {
        title: '迭代名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '开始日期',
        dataIndex: 'startDate',
        key: 'startDate',
      },
      {
        title: '结束日期',
        dataIndex: 'endDate',
        key: 'endDate',
      },
      {
        title: '负责人',
        dataIndex: 'assigneeName',
        key: 'assigneeName',
      },
    ],
    visible: false,
    forms: [
      {
        label: '迭代名称',
        name: 'name',
        rules: [
          { required: true, message: '请输入迭代名称' },
        ],
      },
      {
        type: 'editor',
        label: '迭代描述',
        name: 'desc',
      },
    ],
    extraForms: [
      {
        type: 'date',
        label: '开始日期',
        name: 'startDate',
        rules: [
          { required: true, message: '请选择开始日期' },
        ],
      },
      {
        type: 'date',
        label: '结束日期',
        name: 'endDate',
        rules: [
          { required: true, message: '请选择结束日期' },
        ],
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
          title='新建迭代'
          onCancel={() => this.hanldeVisibleChange(false)}
          forms={forms}
          extraForms={extraForms}
          onFinish={this.onFinish} />
        <div className={s.operations}>
          <Button type='primary' onClick={() => this.hanldeVisibleChange(true)}>创建迭代</Button>
        </div>
        <Table dataSource={iterations} columns={columns} />
      </div>
    )
  }

  componentDidMount() {
    this.fetchIterations()
  }

  fetchIterations = () => {
    const { projectInfo } = this.props

    if (projectInfo.id) {
      getIterations(projectInfo.id).then(({ data }) => {
        if (data.lists) {
          this.setState({ iterations: data.lists })
        }
      })
    }
  }

  hanldeVisibleChange = visible => {
    this.setState({ visible })
  }

  onFinish = values => {
    const { projectInfo } = this.props

    createIteration(projectInfo.id, values).then(() => {
      message.success('创建成功')
      this.hanldeVisibleChange(false)
      this.fetchIterations()
    })
  }
}

export default Iteration
