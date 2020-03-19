import { Component } from 'react'
import { Upload, Button, Avatar, Spin, message } from 'antd'
import s from './style.less'

class MyAvatar extends Component {
  state = {
    loading: false,
  }

  render() {
    const { value } = this.props
    const { loading } = this.state

    return (
      <div>
        <div className={s.avatar}>
          {
            loading
              ? <Spin className={s.spin} />
              : <Avatar shape='square' src={value} size={88} />
          }
        </div>
        <Upload
          action='https://api.imgbb.com/1/upload'
          name='image'
          data={{ key: '你的key' }}
          onChange={this.handleChange}
          showUploadList={{
            showRemoveIcon: false
          }}
          beforeUpload={this.handleBeforeUpload}>
          <Button>更改头像</Button>
        </Upload>
      </div>
    )
  }

  handleChange = ({ file }) => {
    if (file.status === 'uploading') {
      this.setState({ loading: true })
    }

    if (file.status === 'done' || file.status === 'removed' || file.status === 'error') {
      this.setState({ loading: false })

      const { onChange } = this.props

      let previewUrl = ''

      if (file.status === 'done') {
        previewUrl = file.response.data.image.url
      }

      if (onChange) {
        onChange(previewUrl)
      }
    }
  }

  handleBeforeUpload = (file) => {
    if (file.size > 200 * 1024) {
      message.error('图片上传限制200KB')
      return false
    }
    return true
  }
}

export default MyAvatar
