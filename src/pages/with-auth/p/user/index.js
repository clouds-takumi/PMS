import { Component } from 'react'
import { connect } from 'react-redux'
import { reqUsers } from './service'

class User extends Component {
  render() {
    return (
      <div>
        users
      </div>
    )
  }

  componentDidMount() {
    const { projectInfo } = this.props

    reqUsers(projectInfo.id).then(res => {

    })
  }
}

export default connect(store => ({ projectInfo: store.projectInfo }))(User)