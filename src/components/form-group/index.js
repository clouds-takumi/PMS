import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Button } from 'antd'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import s from './style.less'

class FormGroup extends Component {
  static propTypes = {
    forms: PropTypes.array.isRequired,
    layout: PropTypes.string,
    btnText: PropTypes.string,
    btnStyle: PropTypes.object,
    onFinish: PropTypes.func,
    extraForms: PropTypes.array,
  }

  static defaultProps = {
    layout: 'vertical',
    btnText: '创建',
    extraForms: [],
  }

  formRef = React.createRef()

  render() {
    const { forms, layout, btnText, btnStyle, extraForms } = this.props

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
                  extraForms.map(form => this.renderForm(form))
                }
              </div>
            )
          }
        </div>
      </Form>
    )
  }

  renderForm = ({ type, name, placeholder, label, rules, size }) => {
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

    return (
      <Form.Item
        key={name}
        label={label}
        name={name}
        rules={rules}>
        { ele }
      </Form.Item>
    )
  }

  handleFinish = values => {
    const { desc, startDate, endDate, ...restValues } = values
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

    if (typeof onFinish === 'function') {
      onFinish(restValues)
    }
  }
}

export default FormGroup
