import { Component } from 'react'
import { Provider } from 'react-redux'
import store from '@/redux/store'

class Enter extends Component {
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
}

export default Enter
