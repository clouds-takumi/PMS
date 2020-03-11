import { PureComponent } from 'react'
import s from './style.less'
import { connect } from 'react-redux'
import { Table, Divider, Tag, Button, Popconfirm, message } from 'antd'
import { getTags, createTag, deleteCurTag, updateCurTag } from './service'
import CreateModal from '@/components/create-modal'

class Tags extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      loading: false,
      tagName: '',
      tagId: '',
      columns: [
        {
          title: '标签',
          key: 'preview',
          render: tag => (
            <Tag color={tag.color}>{tag.name}</Tag>
          )
        },
        {
          title: '操作',
          key: 'operate',
          render: tag => {
            return (
              <div>
                <span className={s.operateEdit} onClick={() => this.tagEdit(tag)}>编辑</span>
                <Divider type='vertical' />
                <Popconfirm
                  title='确认删除?'
                  onConfirm={() => this.deleteTag(tag.id)}
                  okText="确定"
                  cancelText="取消"
                >
                  <span className={s.operateDel}>删除</span>
                </Popconfirm>
              </div>
            )
          }
        },
      ],
      visible: false,
      forms: [
        {
          label: '标签名称',
          name: 'name',
          rules: [
            { required: true, message: '请输入标签名称' },
            { max: 10, message: '名称不能大于10个字符', }
          ]
        },
        {
          type: 'color',
          label: '标签颜色',
          name: 'color',
          initialValue: { color: '#5e72e4' }
        }
      ]
    }
  }

  render() {
    const { tags, loading, columns, visible, forms } = this.state
    return (
      <div className={s.wrapper}>
        <CreateModal
          width={423}
          visible={visible}
          title='创建标签'
          onCancel={() => this.handleVisibleChange(false)}
          forms={forms}
          onFinish={this.onFinish} />
        <div className={s.operations}>
          <Button type='primary' onClick={() => this.handleVisibleChange(true)}>创建标签</Button>
        </div>
        <Table
          className={s.table}
          loading={loading}
          dataSource={tags}
          columns={columns}
          rowKey='id'
          pagination={false} />
      </div >
    )
  }

  componentDidMount() { this.fetchTags() }

  fetchTags = () => {
    const { projectInfo } = this.props

    // this.setState({ loading: true })
    // if (this.projectInfo) {
    //   reqTags(this.projectInfo.id).then(({ data }) => {
    //     if (data) {
    //       this.setState({ loading: false })
    //       this.setState({ tags: data })
    //     }
    //   })
    // }
  }

  handleVisibleChange = visible => { this.setState({ visible }) }

  onFinish = values => {
    // createTag(projectInfo.id, values).then(() => {
    //   message.success('创建成功')
    //   this.handleVisibleChange(false)
    //   this.fetchTags()
    // })
  }

  deleteTag = id => {
    const { projectInfo } = this.props

    // if (projectInfo) {
    //   deleteCurTag(projectInfo.id, id).then(() => this.fetchTags())
    // }
  }

  tagEdit = ({ id, name, color }) => {

  }
}
export default connect(store => ({ projectInfo: store.projectInfo }))(Tags)
