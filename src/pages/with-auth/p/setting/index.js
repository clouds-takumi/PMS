import { Component } from 'react'
import s from './style.less'
import { connect } from 'react-redux'
import { message, Avatar } from 'antd'
import FormGroup from '@/components/form-group'
import { editProject, getProject } from '@/service'
import { dataFormat } from '@/utils'
import { setProjectInfo } from '@/redux/actions'

const dataFormatRules = [
  {
    key: 'desc',
    type: 'html',
  },
  {
    key: 'participant',
    type: 'array',
  }
]

@connect(
  store => ({ projectInfo: store.projectInfo }),
  dispatch => ({
    setProjectInfo: projectInfo => dispatch(setProjectInfo(projectInfo))
  })
)
class Setting extends Component {
  state = {
    isCreating: false,
  }

  render() {
    const { isCreating } = this.state
    const { projectInfo } = this.props
    const { name, desc, avatar, participant } = projectInfo

    let forms = []
    let extraForms = []
    let btnText = '编辑'
    let showCancel = false
    if (!isCreating) {
      forms = [
        {
          type: 'plain',
          label: '项目名称',
          element: name || <span style={{color: '#ccc'}}>暂无</span>,
        },
        {
          type: 'plain',
          label: '项目描述',
          element: desc ? <div dangerouslySetInnerHTML={{__html: desc}}></div> : <span style={{color: '#ccc'}}>暂无</span>
        }
      ]
      extraForms = [
        {
          type: 'plain',
          label: '项目封面',
          element: <Avatar shape='square' src={avatar} size={88} />
        },
        {
          type: 'plain',
          label: '项目成员',
          element: participant.map(p => (
            <div>{p.name}</div>
          ))
        },
      ]
    } else {
      forms = [
        {
          label: '姓名',
          name: 'name',
        },
        {
          type: 'editor',
          label: '简介',
          name: 'desc',
        },
      ]
      extraForms = [
        {
          type: 'avatar',
          label: '头像',
          name: 'avatar',
        },
        {
          type: 'user-select',
          label: '项目成员',
          name: 'participant',
          placeholder: '选择项目成员',
        },
      ]
      btnText = '保存'
      showCancel = true
    }

    return (
      <div className={s.wrapper}>
        {
          isCreating ? (
            <FormGroup
              key='1'
              initialValues={dataFormat({
                name,
                desc,
                avatar,
                participant: participant.map(p => p.id)
              }, dataFormatRules, true)}
              forms={forms}
              extraForms={extraForms}
              onFinish={this.handleFinish}
              btnText={btnText}
              showCancel={showCancel}
              onCancel={this.handleCancel}
              extraClassName={s.formGroupExtra} />
          ) : (
            <FormGroup
              key='2'
              forms={forms}
              extraForms={extraForms}
              onFinish={this.handleFinish}
              btnText={btnText}
              showCancel={showCancel}
              onCancel={this.handleCancel}
              extraClassName={s.formGroupExtra} />
          )
        }
      </div>
    )
  }

  handleFinish = values => {
    const { isCreating } = this.state
    const { projectInfo } = this.props

    if (isCreating) {
      editProject(projectInfo.id, dataFormat(values, dataFormatRules)).then(() => {
        message.success('更新成功')
        this.setState({
          isCreating: false,
        })
        getProject({ id: projectInfo.id }).then(({ data }) => {
          if (data) {
            this.props.setProjectInfo(data)
          }
        })
      })
    } else {
      this.setState({
        isCreating: true,
      })
    }
  }

  handleCancel = () => {
    this.setState({ isCreating: false })
  }
}

export default Setting
