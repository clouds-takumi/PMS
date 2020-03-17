import { Component } from 'react'
import { getIterations, createIteration, delIdIteration, editIteration } from './service'
import { connect } from 'react-redux'
import { Table, Button, message, Divider, Modal } from 'antd'
import s from './style.less'
import moment from 'moment'
import CreateModal from '@/components/create-modal'
import SideSlip from '@/components/side-slip'
import { dataFormat } from '@/utils'

const dataFormatRules = [
  {
    key: 'desc',
    type: 'html',
  },
  {
    key: 'startDate',
    type: 'moment',
  },
  {
    key: 'endDate',
    type: 'moment',
  }
]

@connect(
  store => ({ projectInfo: store.projectInfo })
)
class Iteration extends Component {
  state = {
    loading: false,
    iterations: {},
    iterName: '',
    id: null,
    delFlag: false,
    sideSlipVisible: false,
    columns: [
      {
        title: '迭代名称',
        dataIndex: 'name',
        key: 'name',
        width: 120,
        render: dataIndex => <div className={s.iterName} onClick={() => this.handleSideSlipVisible(true)} >{dataIndex}</div>
      },
      {
        title: '开始日期',
        dataIndex: 'startDate',
        key: 'startDate',
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
        title: '结束日期',
        dataIndex: 'endDate',
        key: 'endDate',
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
        title: '负责人',
        dataIndex: 'assigneeName',
        key: 'assigneeName',
        width: 120,
        render: dataIndex => {
          if (dataIndex) {
            return <div>{dataIndex}</div>
          } else {
            return <div>未分配</div>
          }
        }
      },
      {
        title: '操作',
        key: 'operation',
        width: 120,
        render: iteration => {
          return (
            <>
              <span className={s.operateEdit} onClick={() => this.handleEdit(iteration)}>编辑</span>
              <Divider type='vertical' />
              <span className={s.operatDel} onClick={() => this.showDeleteModal(iteration)}>删除</span>
            </>
          )
        }
      },
    ],
    visible: false,
    forms: [
      {
        label: '迭代名称',
        name: 'name',
        rules: [
          { required: true, message: '请输入迭代名称' },
          { max: 20, message: '名称不能大于20个字符' }
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
    initialValues: null,
  }

  renderDelModal = () => {
    const { iterName, initialValues } = this.state
    return (
      <Modal
        initialValues={initialValues}
        title={null}
        visible
        closable={false}
        footer={null}
        onCancel={eve => eve.stopPropagation()}>
        <div className={s.delRoot}>
          <div className={s.title}>删除迭代</div>
          <span className={s.subtitle}>
            当前正在删除迭代 <span style={{ color: 'red' }}>{iterName}</span>，该迭代下的所有事项将移入未规划，此操作不可撤销，是否确认？
            </span>
          <div className={s.btnGroup}>
            <Button type='primary' onClick={this.handleConfirmDel} className={s.btn}>确认</Button>
            <Button onClick={this.closeDeleteModal}>取消</Button>
          </div>
        </div>
      </Modal>
    )
  }

  render() {
    const {
      loading,
      columns,
      iterations,
      visible,
      forms,
      extraForms,
      delFlag,
      sideSlipVisible,
      initialValues
    } = this.state

    return (
      <div className={s.wrapper}>
        <CreateModal
          initialValues={initialValues}
          width={935}
          visible={visible}
          title={initialValues ? '编辑迭代' : '创建迭代'}
          onCancel={this.handleCloseModal}
          forms={forms}
          extraForms={extraForms}
          onFinish={this.onFinish}
          btnText={initialValues ? '编辑' : '创建'} />
        <div className={s.operations}>
          <Button type='primary' onClick={this.handleOpenModal}>创建迭代</Button>
        </div>
        <SideSlip
          visible={sideSlipVisible}
          onCancel={() => this.handleSideSlipVisible(false)} />
        <Table
          loading={loading}
          className={s.table}
          dataSource={iterations.lists}
          columns={columns}
          rowKey='id'
        // pagination={{ total: iterations.total, pageSize: 8, hideOnSinglePage: true, onChange: this.handlePageChange }}
        />
        {
          delFlag && this.renderDelModal()
        }
      </div>
    )
  }

  componentDidMount() { this.fetchIterations() }

  handleEdit = (iteration) => {
    this.setState({
      initialValues: dataFormat(iteration, dataFormatRules, true),
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

  fetchIterations = page => {
    const { projectInfo } = this.props
    this.setState({ loading: true })

    if (projectInfo.id) {
      getIterations(projectInfo.id, { page }).then(({ data }) => {
        if (data) {
          console.log(data)
          this.setState({ iterations: data })
          this.setState({ loading: false })
        }
      })
    }
  }

  handlePageChange = page => { this.fetchIterations(page) }

  showDeleteModal = iteration => this.setState({ iterName: iteration.name, id: iteration.id, delFlag: true })
  closeDeleteModal = () => this.setState({ delFlag: false, iterName: '', id: null })

  handleConfirmDel = () => {
    const { id } = this.state
    const { projectInfo } = this.props
    delIdIteration(projectInfo.id, id).then(() => {
      message.success(`删除成功`)
      this.fetchIterations()
      this.setState({ delFlag: false, iterName: '', id: null })
    })
  }

  handleVisibleChange = visible => { this.setState({ visible }) }

  onFinish = values => {
    const { projectInfo } = this.props
    const { initialValues } = this.state

    if (initialValues) {
      editIteration(projectInfo.id, initialValues.id, dataFormat(values, dataFormatRules)).then(() => {
        message.success('更新成功')
        this.handleCloseModal()
        this.fetchIterations()
      })
      return
    }

    createIteration(projectInfo.id, dataFormat(values, dataFormatRules)).then(() => {
      message.success('创建成功')
      this.handleCloseModal()
      this.fetchIterations()
    })
  }
}

export default Iteration
