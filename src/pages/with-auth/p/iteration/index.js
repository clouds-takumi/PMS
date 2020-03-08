import { Component } from 'react'
import { getIterations, createIteration } from './service'
import { connect } from 'react-redux'
import { Table, Button, Modal, Form, Input, DatePicker } from 'antd'
import s from './style.less'

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
  }

  render() {
    const { columns, iterations, visible } = this.state

    return (
      <div className={s.wrapper}>
        <Modal
          visible={visible}
          title='新建迭代'
          onCancel={() => this.hanldeVisibleChange(false)}
          maskClosable={false}
          footer={null}>
          <Form
            layout='vertical'
            onFinish={this.onFinish}>
            <Form.Item
              label='迭代名称'
              name='name'
              rules={[{ required: true, message: '请输入迭代名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label='迭代描述'
              name='desc'
              rules={[{ required: true, message: '请输入迭代描述' }]}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item
              label='开始日期'
              name='startDate'
              rules={[{ required: true, message: '请选择开始日期' }]}>
              <DatePicker />
            </Form.Item>
            <Form.Item
              label='结束日期'
              name='endDate'
              rules={[{ required: true, message: '请选择结束日期' }]}>
              <DatePicker />
            </Form.Item>
            <Button type='primary' htmlType='submit'>创建</Button>
          </Form>
        </Modal>
        <div className={s.operations}>
          <Button type='primary' onClick={() => this.hanldeVisibleChange(true)}>创建迭代</Button>
        </div>
        <Table dataSource={iterations} columns={columns} />
      </div>
    )
  }

  componentDidMount() {
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
    const { name, desc, startDate, endDate } = values

    createIteration(projectInfo.id, {
      name,
      desc,
      startDate: startDate && startDate.format('YYYY-MM-DD'),
      endDate: endDate && endDate.format('YYYY-MM-DD'),
    }).then(() => {
      this.hanldeVisibleChange(false)
    })
  }
}

export default Iteration
