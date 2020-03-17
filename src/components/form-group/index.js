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
    onFinish: PropTypes.func,
    initialValues: PropTypes.object,
  }

  static defaultProps = {
    layout: 'vertical',
    btnText: '创建',
    extraForms: []
  }

  formRef = React.createRef()

  render() {
    const { layout, btnText, btnStyle, forms, extraForms, initialValues } = this.props

    return (
      <Form
        ref={this.formRef}
        layout={layout}
        onFinish={this.handleFinish}
        initialValues={initialValues}>
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
                  extraForms.map(form => this.renderForm(form))
                }
              </div>
            )
          }
        </div>
      </Form>
    )
  }

  renderForm = ({ type, name, placeholder, label, rules, size, initialValue, options = [] }) => {
    let ele = <Input size={size} placeholder={placeholder} />

    if (type === 'password') {
      ele = <Input.Password size={size} placeholder={placeholder} />
    }

    if (type === 'date') {
      ele = <DatePicker />
    }

    if (type === 'editor') {
      ele = (
        <BraftEditor
          placeholder={placeholder}
          className={s.editor} />
      )
    }

    if (type === 'select') {
      ele = <Select placeholder={placeholder}>
        {
          options.map(option => <Select.Option key={option.value} value={option.value}>{option.name}</Select.Option>)
        }
      </Select>
    }

    if (type === 'color') {
      const { initialValues } = this.props
      const initialColor = (initialValues && initialValues[name]) || '#5e72e4'
      ele = <InputColor initialHexColor={initialColor} placement="right" />
    }

    // if (type === 'iteration') {
    //   console.log(extraData)
    //   if (extraData) {
    //     ele = (
    //       <Select placeholder='未规划' allowClear>
    //         {
    //           extraData.map(item => (
    //             <Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>
    //           ))
    //         }
    //       </Select>
    //     )
    //   }
    // }

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
    const { onFinish } = this.props

    if (typeof onFinish === 'function') {
      onFinish(values)
    }
  }
}

export default FormGroup
