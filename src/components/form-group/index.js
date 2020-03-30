import React, { Component } from 'react'
import s from './style.less'
import PropTypes from 'prop-types'
import { Form, Input, DatePicker, Button, Select } from 'antd'
import 'braft-editor/dist/index.css'
import BraftEditor from 'braft-editor'
import InputColor from 'react-input-color'
import MyAvatar from './avatar'
import IterationSelect from './iteration-select'
import UserSelect from './user-select'
import TagSelect from './tag-select'
import cn from 'classnames'

class FormGroup extends Component {
  static propTypes = {
    layout: PropTypes.string,
    btnText: PropTypes.string,
    btnStyle: PropTypes.object,
    forms: PropTypes.array.isRequired,
    extraForms: PropTypes.array,
    onFinish: PropTypes.func,
    initialValues: PropTypes.object,
    showCancel: PropTypes.bool,
    extraClassName: PropTypes.string,
  }

  static defaultProps = {
    layout: 'vertical',
    btnText: '创建',
    extraForms: []
  }

  formRef = React.createRef()

  render() {
    const {
      layout,
      btnText,
      btnStyle,
      forms,
      extraForms,
      initialValues,
      showCancel,
      extraClassName,
    } = this.props

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
              {
                showCancel && (
                  <Button onClick={this.handleCancel} style={{ marginLeft: 16 }}>取消</Button>
                )
              }
            </Form.Item>
          </div>
          {
            !!extraForms.length && (
              <div className={cn(s.right, extraClassName)}>
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

  renderForm = ({ type, buttonText, name, itemExtraClassName, placeholder, label, rules, size, element, options = [], single }) => {
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
          options.map(option => <Select.Option key={option.value || option.id} value={option.value || option.id}>{option.name}</Select.Option>)
        }
      </Select>
    }

    if (type === 'color') {
      const { initialValues } = this.props
      const initialColor = (initialValues && initialValues[name]) || '#5e72e4'
      ele = <InputColor initialHexColor={initialColor} placement="right" />
    }

    if (type === 'avatar') {
      ele = <MyAvatar btnText={buttonText} />
    }

    if (type === 'plain') {
      ele = <div>{element}</div>
    }

    if (type === 'iterations') {
      ele = <IterationSelect />
    }

    if (type === 'user-select') {
      ele = <UserSelect placeholder={placeholder} single={single} />
    }

    if (type === 'tag-select') {
      ele = <TagSelect placeholder={placeholder} />
    }

    return (
      <Form.Item
        key={name || label}
        label={label}
        // className={itemExtraClassName ? itemExtraClassName : null}
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

  handleCancel = () => {
    const { onCancel } = this.props

    if (typeof onCancel === 'function') {
      onCancel()
    }
  }
}

export default FormGroup
