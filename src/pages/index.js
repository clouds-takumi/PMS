import { Component } from 'react'
import { Provider } from 'react-redux'
import store from '@/redux/store'
import zhCN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'

class Enter extends Component {
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          {this.props.children}
        </Provider>
      </ConfigProvider>
    )
  }
}

export default Enter
