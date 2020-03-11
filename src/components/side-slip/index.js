import { Component } from 'react'
import PropTypes from 'prop-types'
import { Drawer } from 'antd'
import s from './style.less'

class SideSlip extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    width: PropTypes.number,
    onCancel: PropTypes.func,
  }

  render() {
    const { visible, width, onCancel } = this.props

    return visible && (
      <Drawer
        title={''}
        visible={visible}
        width={width || 688}
        closable={false}
        mask={false}
        bodyStyle={{ position: 'relative', boxShadow: '-4px 12px 24px 0 rgba(0,0,0,.12), 0 0 4px 0 rgba(0,0,0,.11)' }}>
        <div className={s.button} onClick={onCancel}></div>

      </Drawer>
    )
  }
}

export default SideSlip
