import { Component } from 'react'
import { connect } from 'react-redux'
import s from './style.less'
import { Avatar, Icon, message } from 'antd'
import Collapse from './components/collapse'
import CreateIteration from './components/add-iteration'
import { reqBacklog, reqAllIters, reqIterIssues } from './service'

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

class Backlog extends Component {
  state = {
    issues: { backlog: [] },
    iterations: [],
    itemId: null,
    iterationExpand: { backlog: true },
    drawerVisible: false
  }

  render() {
    const { issues, iterations, iterationExpand } = this.state
    return (
      <div>
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <div className={s.wrapper}>
            <div className={s.backlog}>
              <Collapse
                type='backlog'
                name='Backlog'
                issuesNum={issues['backlog'].length}
                handleAdd={this.handleAdd}>
                <div className={s.backlogBox}>
                  {this.renderLists('backlog')}
                </div>
              </Collapse>
            </div>

            <div className={s.rightContainer}>
              <div className={s.iteration}>
                {
                  iterations.map(iteration => (
                    <Collapse
                      className={s.collapse}
                      key={iteration.id}
                      type='iteration'
                      iterContainerId={iteration.id}
                      delIterContainer={this.delIterContainer}
                      name={iteration.name}
                      issuesNum={0}
                      expand={iterationExpand[iteration.id]}
                      onExpand={() => this.handleExpand(iteration.id)}
                      status={iteration.status}
                      changeStatus={this.handleStatus}
                      startDate={iteration.startDate}
                      endDate={iteration.endDate}
                      handleAdd={this.handleAdd}>
                      <div className={s.iterationsBox}>
                        {this.renderLists(iteration.id)}
                      </div>
                    </Collapse>
                  ))
                }
              </div>
              <div className={s.addContainer}>
                <CreateIteration handleAddIter={this.handleAddIter} emptyFlag={iterations.length === 0} />
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    )
  }

  fetchBacklog = () => {
    const { projectInfo } = this.props

    // if (projectInfo.id) {
    //   reqBacklog(projectInfo.id).then(res => {
    //     console.log(res)
    //     // if (data.lists) {
    //     //   this.setState({ issues: { backlog: data.lists } })
    //     // }
    //   })
    // }
  }

  renderLists = () => {

  }

  componentDidMount() {
    this.fetchBacklog()
    // reqAllIters().then(res => {
    //   const id = res.lists[0].id
    //   let temp = JSON.parse(JSON.stringify(this.state.iterationExpand))
    //   temp[`${id}`] = true
    //   this.setState({ iterations: res.lists, iterationExpand: temp })
    // })
  }

}

export default connect(store => ({ projectInfo: store.projectInfo }))(Backlog)