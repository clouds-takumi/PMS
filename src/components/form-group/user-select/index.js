import { Component } from 'react'
import { Select } from 'antd'
import { getAllUsers } from '@/service'

class UserSelect extends Component {
    state = {
        options: []
    }

    render() {
        const { options } = this.state
        const { value, placeholder, single } = this.props
        return (
            <Select
              value={value}
              onChange={this.handleChange}
              allowClear
              mode={single ? null : 'multiple'}
              placeholder={placeholder}>
                {
                    options.map(option => (
                        <Select.Option key={option.id} value={option.id}>
                            {option.name}
                        </Select.Option>
                    ))
                }
            </Select>
        );
    }

    componentDidMount() {
        getAllUsers().then(({ data }) => {
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

export default UserSelect;
