import { Component } from 'react'
import s from './style.less'
import { Select } from 'antd'
import { getIterations } from './service'

class IterationSelect extends Component {
    state = {
        options: []
    }

    render() {
        const { options } = this.state
        const { value } = this.props
        return (
            <Select value={value} onChange={this.handleChange} allowClear>
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
        const { projectId } = this.props
        getIterations(projectId).then(({ data }) => {
            this.setState({ options: data.lists })
        })
    }

    handleChange = value => {
        const { onChange } = this.props
        if (typeof onChange === 'function') {
            onChange(value)
        }
    }
}

export default IterationSelect;