import { Component } from 'react'
import { connect } from 'react-redux'
import s from './style.less'
import cn from 'classnames'
import { Avatar, Icon, message, Tooltip } from 'antd'
import Collapse from './components/collapse'
import CreateIteration from './components/add-iteration'
import { getBacklogIssues, getIteraions, getIterationIssues } from './service'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  FlagTwoTone,
  UserOutlined,
  UpCircleTwoTone,
  MinusCircleTwoTone,
  DownCircleTwoTone,

} from '@ant-design/icons'

class Backlog extends Component {
  state = {
    issues: { backlog: [] },
    iterations: [{ id: 1, name: 'xxx' }, { id: 2, name: 'xxxxx' }],
    itemId: null,
    iterationExpand: { backlog: true },
    drawerVisible: false
  }

  renderPriIcon = priority => {
    let icon
    switch (priority) {
      case 1:
        icon = <UpCircleTwoTone />
        break
      case 2:
        icon = <MinusCircleTwoTone />
        break
      case 3:
        icon = <DownCircleTwoTone />
        break
      default:
    }
    return icon
  }

  renderList = (list, provided, isDragging, style) => {
    return (
      <div
        className={s.list}
        // onClick={() => this.showDrawer(list)}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          boxShadow: isDragging && '0 8px 24px 0 rgba(0, 0, 0, 0.15), 0 0 1px 0 rgba(0, 0, 0, 0.05)',
          borderBottom: isDragging && 'none',
          ...provided.draggableProps.style,
          ...style,
        }}>
        <div className={s.listTitle}>{list.name}</div>
        <div className={s.listExtra}>
          <div className={s.listCode}>
            <FlagTwoTone />&nbsp;#{list.id}
          </div>
          <div className={s.lsRight}>
            <div className={s.prior}>{this.renderPriIcon(list.priority)}</div>
            {
              list.assignee
                ?
                <Tooltip title={list.assignee.name}><Avatar src={list.assignee.avatar} className={s.userIcon} /></Tooltip>
                : <Avatar icon={<UserOutlined />} className={s.userIcon} />
            }
          </div>
        </div>
      </div >
    )
  }

  renderLists = droppableId => {
    let lists
    const { issues, iterationExpand } = this.state
    if (iterationExpand[droppableId]) {
      if (issues[droppableId]) {
        lists = issues[droppableId]
      } else {
        lists = []
      }
    } else {
      lists = []
    }

    return (
      <Droppable droppableId={droppableId}>
        {
          (droppableProvided) => lists.length !== 0 ? (
            <div className={s.lists} ref={droppableProvided.innerRef}>
              {
                lists.map((list, index) => (
                  <Draggable draggableId={list.id} index={index} key={list.id}>
                    {
                      (draggableProvided, draggableSnapshot) => this.renderList(list, draggableProvided, draggableSnapshot.isDragging)
                    }
                  </Draggable>
                ))
              }
              {droppableProvided.placeholder}
            </div>

          ) :
            (droppableId !== 'backlog')
              ? (
                <div className={s.emptyWrap}>
                  <div className={s.mainEmpty} ref={droppableProvided.innerRef}>
                    <span>从Backlog中拖动需求事项到此处进行分类</span>
                  </div>
                </div>

              )
              : (
                <div className={s.emptyWrap}>
                  <div className={cn(s.mainEmpty, s.backlogEmpty)} ref={droppableProvided.innerRef}>
                    <div className={s.emptyTitle}>当前没有待规划的需求事项</div>
                    <div>创建事项，可以调整事项的顺序，也可以拖动到迭代中进行规划。</div>
                  </div>
                </div>
              )
        }
      </Droppable>
    )
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
                      // status={iteration.status}
                      // changeStatus={this.handleStatus}
                      // startDate={iteration.startDate}
                      // endDate={iteration.endDate}
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
    if (projectInfo.id) {
      getBacklogIssues(projectInfo.id).then(({ data }) => {
        if (data.lists) {
          this.setState({ issues: { backlog: data.lists } })
        }
      })
    }
  }

  fetchIterations = () => {
    const { projectInfo } = this.props
    if (projectInfo.id) {
      getIteraions(projectInfo.id).then(({ data }) => {
        if (data.lists) {
          this.setState({ iterations: data.lists })
          if (this.state.iterations.length > 0) {
            const id = this.state.iterations[0].id
            let temp = JSON.parse(JSON.stringify(this.state.iterationExpand))
            temp[`${id}`] = true
            this.setState({ iterationExpand: temp })
          }
        }
      })
    }
  }

  componentDidMount() {
    this.fetchBacklog()
    this.fetchIterations()
  }

  handleExpand = id => {
    const { iterationExpand, issues } = this.state
    // if (!iterationExpand.hasOwnProperty(id)) {
    //   this.fetchCurIterData(id)
    // }
    iterationExpand[id] = !iterationExpand[id]
    this.setState({ iterationExpand })
  }

}

export default connect(store => ({ projectInfo: store.projectInfo }))(Backlog)