import React, { Component } from 'react'
import s from './style.less'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Button, Select } from 'antd'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import InputColor from 'react-input-color'

class FormGroup extends Component {
  static propTypes = {
    layout: PropTypes.string,
    btnText: PropTypes.string,
    btnStyle: PropTypes.object,
    forms: PropTypes.array.isRequired,
    extraForms: PropTypes.array,
    onFinish: PropTypes.func
  }

  static defaultProps = {
    layout: 'vertical',
    btnText: '创建',
    extraForms: []
  }

  formRef = React.createRef()

  render() {
    const { layout, btnText, btnStyle, forms, extraForms, extraData } = this.props

    return (
      <Form
        ref={this.formRef}
        layout={layout}
        onFinish={this.handleFinish}>
        <div className={s.wrapper}>
          <div className={s.left}>
            {
              forms.map(form => this.renderForm(form))
            }
            <Form.Item>
              <Button type='primary' htmlType='submit' style={btnStyle}>{btnText}</Button>
            </Form.Item>
          </div>
          {
            !!extraForms.length && (
              <div className={s.right}>
                {
                  extraForms.map(form => this.renderForm(form, extraData))
                }
              </div>
            )
          }
        </div>
      </Form>
    )
  }

  renderForm = ({ type, name, placeholder, label, rules, size, initialValue, data }, extraData) => {
    let ele = <Input size={size} placeholder={placeholder} />

    if (type === 'password') {
      ele = <Input.Password size={size} placeholder={placeholder} />
    }

    if (type === 'date') {
      ele = <DatePicker />
    }

    if (type === 'editor') {
      ele = <BraftEditor placeholder={placeholder} className={s.editor} />
    }

    if (type === 'color') {
      const initialColor = initialValue.color || '#5e72e4'
      ele = <InputColor initialHexColor={initialColor} placement="right" />
    }

    if (type === 'select') {
      ele = (
        <Select placeholder='未指定' allowClear>
          {
            data.map(item => (
              <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
            ))
          }
        </Select>
      )
    }

    if (type === 'iteration') {
      console.log(extraData)
      if (extraData) {
        ele = (
          <Select placeholder='未规划' allowClear>
            {
              extraData.map(item => (
                <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
              ))
            }
          </Select>
        )
      }
    }

    return (
      <Form.Item
        key={name}
        label={label}
        name={name}
        rules={rules}>
        {ele}
      </Form.Item>
    )
  }

  handleFinish = values => {
    const { desc, startDate, endDate, color, ...restValues } = values
    const { onFinish } = this.props

    if (desc) {
      restValues.desc = desc.toHTML()
    }

    if (startDate) {
      restValues.startDate = startDate.format('YYYY-MM-DD')
    }

    if (endDate) {
      restValues.endDate = endDate.format('YYYY-MM-DD')
    }

    if (color) {
      restValues.color = color.hex
    }

    if (typeof onFinish === 'function') {
      onFinish(restValues)
    }
  }
}

export default FormGroup
