import { Component } from 'react'
import s from './style.less'
import { connect } from 'react-redux'
import { message, Avatar } from 'antd'
import FormGroup from '@/components/form-group'
import { updateUserInfo } from './service'
import { dataFormat } from '@/utils'
import { getUserInfo } from '../service'
import { setUserInfo } from '@/redux/actions'

const dataFormatRules = [
  {
    key: 'desc',
    type: 'html',
  },
]

@connect(
  store => ({ userInfo: store.userInfo }),
  dispatch => ({
    setUserInfo: userInfo => dispatch(setUserInfo(userInfo))
  })
)
class Center extends Component {
  state = {
    isCreating: false,
  }

  render() {
    const { isCreating } = this.state
    const { userInfo } = this.props

    let forms = []
    let extraForms = []
    let btnText = '编辑'
    let showCancel = false
    if (!isCreating) {
      forms = [
        {
          type: 'plain',
          label: '名称',
          element: userInfo.name || <span style={{color: '#ccc'}}>暂无</span>,
        },
        {
          type: 'plain',
          label: '简介',
          element: userInfo.desc ? <div dangerouslySetInnerHTML={{__html: userInfo.desc}}></div> : <span style={{color: '#ccc'}}>暂无</span>
        }
      ]
      extraForms = [
        {
          type: 'plain',
          label: '头像',
          element: <Avatar shape='square' src={userInfo.avatar} size={88} />
        }
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
        }
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
              initialValues={dataFormat({ ...this.props.userInfo }, dataFormatRules, true)}
              forms={forms}
              extraForms={extraForms}
              onFinish={this.handleFinish}
              btnText={btnText}
              showCancel={showCancel}
              onCancel={this.handleCancel} />
          ) : (
            <FormGroup
              key='2'
              forms={forms}
              extraForms={extraForms}
              onFinish={this.handleFinish}
              btnText={btnText}
              showCancel={showCancel}
              onCancel={this.handleCancel} />
          )
        }
      </div>
    )
  }

  handleFinish = values => {
    const { isCreating } = this.state

    if (isCreating) {
      updateUserInfo(dataFormat(values, dataFormatRules)).then(() => {
        message.success('更新成功')
        this.setState({
          isCreating: false,
        })
        getUserInfo().then(({ data }) => {
          if (data) {
            this.props.setUserInfo(data)
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

export default Center
