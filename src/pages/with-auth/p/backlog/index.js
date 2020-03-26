import { Component } from 'react'
import { connect } from 'react-redux'
import s from './style.less'
import cn from 'classnames'
import { dataFormat } from '@/utils'
import { Avatar, message, Tooltip } from 'antd'
import Collapse from './components/collapse'
import SideSlip from '@/components/side-slip'
import CreateIteration from './components/add-iteration'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  getIteraions,
  getIterationIssues,
  createIssue,
  createIteration,
  sortIssues,
  deleteCurIteration
} from '@/service'
import {
  FlagTwoTone,
  UserOutlined,
  UpCircleTwoTone,
  MinusCircleTwoTone,
  DownCircleTwoTone,
} from '@ant-design/icons'

const dataFormatRules = [
  {
    key: 'desc',
    type: 'html',
  },
  {
    key: 'startDate',
    type: 'moment',
  },
  {
    key: 'endDate',
    type: 'moment',
  }
]

class Backlog extends Component {
  state = {
    issues: { backlog: [] },
    iterations: [],
    curIssueId: null,
    iterationExpand: { backlog: true },
    sideSlipVisible: false
  }

  renderPriIcon = priority => {
    let icon
    switch (priority) {
      case 3:
        icon = <UpCircleTwoTone />
        break
      case 2:
        icon = <MinusCircleTwoTone />
        break
      case 1:
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
        onClick={() => this.showSideSlip(list)}
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
    const { issues } = this.state
    if (issues[droppableId]) {
      lists = issues[droppableId]
    } else {
      lists = []
    }

    return (
      <Droppable droppableId={`${droppableId}`}>
        {
          (droppableProvided) => lists.length !== 0
            ? (
              <div className={s.lists} ref={droppableProvided.innerRef}>
                {
                  lists.map((list, index) => (
                    <Draggable draggableId={`${list.id}`} index={index} key={list.id}>
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
    const { issues, iterations, iterationExpand, sideSlipVisible, curIssueId } = this.state
    console.log(iterations)
    return (
      <div>
        <DragDropContext onDragEnd={this.handleDragEnd}>
          <div className={s.wrapper}>
            <div className={s.backlog}>
              <Collapse
                type='backlog'
                name='Backlog'
                issuesNum={issues['backlog'].length}
                addIssue={this.handleAddIssue}>
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
                      issuesNum={issues[`${iteration.id}`] ? issues[`${iteration.id}`].length : 0}
                      startDate={iteration.startDate}
                      endDate={iteration.endDate}
                      status={1}
                      expand={iterationExpand[iteration.id]}
                      onExpand={() => this.handleExpand(iteration.id)}
                      addIssue={this.handleAddIssue}>
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
        {
          sideSlipVisible &&
          <SideSlip
            visible={sideSlipVisible}
            id={curIssueId}
            onCancel={() => this.handleSideSlipVisible(false)} />
        }
      </div>
    )
  }

  fetchBacklog = () => {
    const { projectInfo } = this.props
    const { issues } = this.state
    if (projectInfo.id) {
      getIterationIssues(projectInfo.id).then(({ data }) => {
        if (data.lists) {
          issues['backlog'] = data.lists
          this.setState({ issues })
        }
      })
    }
  }

  fetchIterations = () => {
    const { projectInfo } = this.props
    const { iterationExpand } = this.state
    if (projectInfo.id) {
      getIteraions(projectInfo.id).then(({ data }) => {
        if (data.lists) {
          this.setState({ iterations: data.lists })
          if (data.lists.length > 0) {
            const id = data.lists[0].id
            iterationExpand[`${id}`] = true
            this.setState({ iterationExpand })
            this.fetchIterationIssues(id)
          }
        }
      })
    }
  }

  fetchIterationIssues = iterationId => {
    const { projectInfo } = this.props
    const { issues } = this.state
    getIterationIssues(projectInfo.id, iterationId).then(({ data }) => {
      if (data) {
        issues[`${iterationId}`] = data.lists
        this.setState({ issues: issues })
      }
    })
  }

  componentDidMount() {
    this.fetchBacklog()
    this.fetchIterations()
  }

  showSideSlip = eachItem => {
    this.setState({ curIssueId: eachItem.id })
    this.setState({ sideSlipVisible: true })
  }

  handleSideSlipVisible = visible => {
    this.setState({
      sideSlipVisible: visible,
    })
  }

  handleExpand = id => {
    const { iterationExpand } = this.state
    iterationExpand[id] = !iterationExpand[id]
    this.setState({ iterationExpand })
    this.fetchIterationIssues(id)
  }

  handleAddIssue = ({ iterContainerId, type, itemTitle }) => {
    const { projectInfo } = this.props

    let data
    if (type === 'iteration') {
      data = { name: itemTitle, iterationId: iterContainerId, priority: 2 }
    } else {
      data = { name: itemTitle, priority: 2 }
    }

    createIssue(projectInfo.id, data).then(() => {
      message.success('创建成功')
      if (type === 'iteration') {
        this.fetchIterationIssues(iterContainerId)
      } else {
        this.fetchBacklog()
      }
    })
  }

  // handleAddIter = ({ title, expand }) => {
  //   const { projectInfo } = this.props
  //   const data = { name: title, startDate: '2012-12-12', endDate: '2012-12-12' }
  //   createIteration(projectInfo.id, data).then(({ data }) => {
  //     const { iterationExpand } = this.state
  //     if (data) {
  //       iterationExpand[`${data.id}`] = true
  //     }
  //     this.setState({ iterationExpand })
  //     this.fetchIterations()
  //     message.success('创建迭代成功')
  //   })
  // }

  handleAddIter = values => {
    const { projectInfo } = this.props
    createIteration(projectInfo.id, dataFormat(values, dataFormatRules)).then(({ data }) => {
      const { iterationExpand } = this.state
      if (data) {
        iterationExpand[`${data.id}`] = true
      }
      this.setState({ iterationExpand })
      this.fetchIterations()
      message.success('创建迭代成功')
    })
  }

  delIterContainer = iterationId => {
    // const { issues, iterations } = this.state
    // const newData = iterations.filter(item => item.id !== iterationId)
    // const resId = iterations.filter(item => item.id === iterationId)[0].id
    // const resData = issues[resId]
    // issues.backlog = [...resData, ...issues.backlog]
    // delete issues.iterationId
    // this.setState({ iterations: newData })
    // this.setState({ issues })
    // message.success('删除成功')
    const { projectInfo } = this.props
    deleteCurIteration(projectInfo.id, iterationId).then(() => {
      this.fetchIterations()
      this.fetchBacklog()
      message.success('删除成功')
    })
  }

  handleDragEnd = (result, a) => {
    let data, targetIterationId
    const { projectInfo } = this.props

    if (!result.destination) {
      return
    }

    const { droppableId: sourceDroppableId, index: sourceDroppableIndex } = result.source
    const { droppableId: targeDroppableId, index: targetDroppableIndex } = result.destination

    if (sourceDroppableId === targeDroppableId && sourceDroppableIndex === targetDroppableIndex) {
      return
    }
    const { issues } = this.state

    if (targeDroppableId === 'backlog') {
      targetIterationId = null
    } else {
      targetIterationId = `${targeDroppableId}`
    }

    if (sourceDroppableId === targeDroppableId) {
      const curArray = issues[sourceDroppableId]
      const sourceId = `${curArray[sourceDroppableIndex].id}`
      const targetId = `${curArray[targetDroppableIndex].id}`

      const cur = curArray.splice(sourceDroppableIndex, 1)[0]
      curArray.splice(targetDroppableIndex, 0, cur)
      issues[sourceDroppableId] = curArray

      data = { sourceId, targetId, targetIterationId }
    } else {
      const curArray1 = issues[sourceDroppableId]
      const curArray2 = issues[targeDroppableId]
      const sourceId = `${curArray1[sourceDroppableIndex].id}`

      if (curArray2.length !== 0) {
        if (targetDroppableIndex < curArray2.length - 1) {
          const targetId = `${curArray2[targetDroppableIndex].id}`
          data = { sourceId, targetId, targetIterationId }
        } else {
          data = { sourceId, targetIterationId }
        }
      } else {
        data = { sourceId, targetIterationId }
      }

      const cur = curArray1.splice(sourceDroppableIndex, 1)[0]
      curArray2.splice(targetDroppableIndex, 0, cur)
      issues[sourceDroppableId] = curArray1
      issues[targeDroppableId] = curArray2
    }

    this.setState({ issues })

    console.log(data)
    sortIssues(
      projectInfo.id,
      data
    ).then(() => {

      this.fetchSortData(
        sourceDroppableId === 'backlog' ? 0 : targetIterationId,
        targeDroppableId === 'backlog' ? 0 : targeDroppableId)
    })
  }

  fetchSortData = (id1, id2) => {
    const { projectInfo } = this.props
    const { issues } = this.state
    if (id1 === id2) {
      getIterationIssues(projectInfo.id, id1).then(({ data }) => {
        if (data.lists) {
          if (id1 === 0) {
            issues.backlog = data.lists
          } else {
            issues[`${id1}`] = data.lists
          }
          this.setState({ issues })
        }
      })
    } else {
      getIterationIssues(projectInfo.id, id1).then(({ data }) => {
        if (data.lists) {
          if (id1 === 0) {
            issues.backlog = data.lists
          } else {
            issues[`${id1}`] = data.lists
          }
          this.setState({ issues })
        }
      })
      getIterationIssues(projectInfo.id, id2).then(({ data }) => {
        if (data.lists) {
          if (id2 === 0) {
            issues.backlog = data.lists
          } else {
            issues[`${id2}`] = data.lists
          }
          this.setState({ issues })
        }
      })
    }
  }
}

export default connect(store => ({ projectInfo: store.projectInfo }))(Backlog)