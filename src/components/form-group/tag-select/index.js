import { Component } from 'react'
import { Select, Tag } from 'antd'
import { getTags } from '@/service'
import { connect } from 'react-redux'

@connect(
  store => ({ projectInfo: store.projectInfo })
)
class TagSelect extends Component {
    state = {
        options: []
    }

    render() {
        const { options } = this.state
        const { value, placeholder } = this.props
        return (
          <Select
            value={value}
            onChange={this.handleChange}
            allowClear
            tagRender={this.tagRender}
            mode='multiple'
            placeholder={placeholder}>
              {
                  options.map(option => (
                      <Select.Option key={option.id} value={option.id}>
                        <Tag color={option.color}>{option.name}</Tag>
                      </Select.Option>
                  ))
              }
          </Select>
        );
    }

    tagRender = ({ label, closable, onClose }) => {

      if (label && label.props) {
        const { color, children } = label.props

        return (
          <Tag color={color} closable={closable} onClose={onClose} style={{ marginRight: 3 }}>
            {children}
          </Tag>
        )
      }
      return null
    }

    componentDidMount() {
      const { projectInfo } = this.props
        getTags(projectInfo.id).then(({ data }) => {
            this.setState({ options: data })
        })
    }

    handleChange = value => {
        const { onChange } = this.props
        if (typeof onChange === 'function') {
            onChange(value)
        }
    }
}

export default TagSelect;
