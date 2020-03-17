import { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import FormGroup from '@/components/form-group'

class CreateModal extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    forms: PropTypes.array.isRequired,
    onCancel: PropTypes.func,
    onFinish: PropTypes.func,
    width: PropTypes.number,
    extraForms: PropTypes.array,
  }

  render() {
    const { width, visible, title, onCancel, forms, extraForms, onFinish, extraData } = this.props

    return (
      <Modal
        width={width || 688}
        visible={visible}
        title={title}
        footer={null}
        maskClosable={false}
        onCancel={onCancel}
        bodyStyle={{ padding: 0 }}>
        <FormGroup
          extraData={extraData}
          forms={forms}
          extraForms={extraForms}
          onFinish={onFinish} />
      </Modal>
    )
  }
}

export default CreateModal
