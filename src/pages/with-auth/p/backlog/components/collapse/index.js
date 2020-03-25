import { useState } from 'react'
import s from './style.less'
import cn from 'classnames'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { Tag, Dropdown, Menu, Divider, Tooltip, Modal, Button, DatePicker, message, Input } from 'antd'
import {
  QuestionCircleOutlined,
  UnorderedListOutlined,
  DownOutlined,
  RightOutlined,
  PlusOutlined,
  DashOutlined
} from '@ant-design/icons';


moment.locale('zh-cn')
const Collapse = ({
  className,
  children,
  type,
  iterContainerId = null,
  delIterContainer,
  name,
  issuesNum,
  expand,
  onExpand,
  status,
  changeStatus,
  startDate,
  endDate,
  addIssue
}) => {
  const [addFlag, setAddFlag] = useState(false)
  const [addValueFlag, setAddValueFlag] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [timeStart, setTimeStart] = useState(moment().format('YYYY-MM-DD'))
  const [timeEnd, setTimeEnd] = useState(null)
  const [timeComp, setTimeComp] = useState(moment().format('YYYY-MM-DD'))
  const [editInputValue, setEditInputValue] = useState(name)
  const [timeEditStart, setEditTimeStart] = useState(startDate)
  const [timeEditEnd, setEditTimeEnd] = useState(endDate)
  /**
   * @ 0-begin 1-delete 2-complete 3-edit
   */
  const [modalFlag, setModalFlag] = useState(null)

  const changeAddFlag = () => { setAddFlag(true) }
  const handleCancel = () => {
    setInputValue('')
    setAddFlag(false)
    setAddValueFlag(false)
  }

  let curponiter = addValueFlag ? 'pointer' : 'not-allowed'
  let curcolor = addValueFlag ? '#2d3e59' : '#bcc0c5'
  const cur = { cursor: curponiter, backgroundColor: curcolor, color: "white" }

  const handleInput = (e) => {
    setInputValue(e.target.value)
    setAddValueFlag(true)
    if (!e.target.value) {
      setAddValueFlag(false)
    }
  }

  const handleBtnAdd = (e) => {
    if (!!inputValue) {
      const item = { iterContainerId, type, itemTitle: inputValue }
      addIssue(item)
      setInputValue('')
      setAddValueFlag(false)
    }
  }

  const handleEnterAdd = (e) => {
    if ((e.keyCode === 13) && !!inputValue) {
      const item = { iterContainerId, type, itemTitle: inputValue }
      addIssue(item)
      setInputValue('')
      setAddValueFlag(false)
    }
  }

  const handleExpand = () => {
    if (typeof onExpand === 'function') {
      onExpand()
    }
  }

  const dropDownMenu = (
    <>
      <Menu>
        {
          status
            ? <Menu.Item key='0' onClick={(eve) => {
              eve.domEvent.stopPropagation()
              setModalFlag(2)
            }}>完成迭代</Menu.Item>
            : <Menu.Item key='0' onClick={(eve) => {
              eve.domEvent.stopPropagation()
              if (!status) {
                setModalFlag(0)
              }
            }} style={status ? { cursor: " not-allowed" } : null}>开始迭代</Menu.Item>
        }
        <Menu.Divider />
        <Menu.Item key='2' onClick={(eve) => {
          eve.domEvent.stopPropagation()
          setModalFlag(3)
        }}>编辑迭代</Menu.Item>
        <Menu.Divider />
        <Menu.Item key='3' onClick={eve => {
          eve.domEvent.stopPropagation()
          setModalFlag(1)
        }} style={{ color: 'red' }}>删除迭代</Menu.Item>
      </Menu >
    </>
  )

  const hanldeStart = (eve) => {
    eve.stopPropagation()
    if (!timeStart) {
      message.info({ content: '请选择迭代开始时间', key: 'dex' })
    } else if (!timeEnd) {
      message.info({ content: '请选择迭代结束时间', key: 'dex' })
    } else {
      changeStatus(iterContainerId, 1)
      const data = { timeStart, timeEnd, status: 1 }
      setModalFlag(null)
      message.info({ content: `${iterContainerId}已经开始`, key: 'dex' })
    }
  }

  const handleComp = (eve) => {
    eve.stopPropagation()
    if (!timeComp) {
      message.info({ content: '请确认迭代完成时间', key: 'pex' })
    } else {
      const data = { timeComp }
      delIterContainer(iterContainerId)
      setModalFlag(null)
    }
  }

  const handleEditSave = (eve) => {
    eve.stopPropagation()
    if (!editInputValue) {
      message.info({ content: '请输入迭代标题', key: 'pex' })
    } else if (!timeEditStart) {
      message.info({ content: '请选择迭代开始时间', key: 'dex' })
    } else if (!timeEditEnd) {
      message.info({ content: '请选择迭代结束时间', key: 'dex' })
    } else {
      const data = { editInputValue }
      // TODO:
      changeStatus(iterContainerId, 1)
      setModalFlag(null)
    }
  }

  const onStartChange = (date, dateString) => {
    setTimeStart(dateString)
  }

  const onEndChange = (date, dateString) => {
    setTimeEnd(dateString)
  }

  const onCompChange = (date, dateString) => {
    setTimeComp(dateString)
  }

  const renderModal = () => {
    return (
      <Modal
        title={null}
        visible={modalFlag === 0 || modalFlag === 1 || modalFlag === 2 || modalFlag === 3}
        closable={false}
        footer={null}
        className={s.modal}
        onCancel={(eve) => eve.stopPropagation()}
      >
        {
          modalFlag === 1 && (
            <div onClick={(eve) => eve.stopPropagation()}>
              <div className={s.modalTitle}>删除迭代</div>
              <div className={s.modalMsg}>提示：只会删除当前迭代，迭代中涉及的事项将被移至未规划，此操作不可撤销，是否确认？</div>
              <div className={s.modalBtn}>
                <Button
                  type='primary'
                  className={cn(s.btn, s.leftBtn)}
                  onClick={() => delIterContainer(iterContainerId)}
                >确认删除</Button>
                <Button
                  type='primary'
                  className={cn(s.btn, s.rightBtn)}
                  onClick={(eve) => {
                    eve.stopPropagation()
                    setModalFlag(null)
                  }}>取消</Button>
              </div>
            </div>
          )
        }
        {
          modalFlag === 0 && (
            <div onClick={(eve) => eve.stopPropagation()}>
              <div className={s.modalTitle}>开始迭代</div>
              <div className={s.modalMsgTime}>迭代开始时间</div>
              <div>
                <DatePicker
                  placeholder='请选择迭代开始时间'
                  defaultValue={moment()}
                  format={'YYYY-MM-DD'}
                  onChange={onStartChange}
                  // suffixIcon={<Icon type='down' />}
                  className={s.datePick} />
              </div>
              <div className={s.modalMsgTime}>迭代结束时间</div>
              <div >
                <DatePicker
                  placeholder='请选择迭代结束时间'
                  onChange={onEndChange}
                  // suffixIcon={<Icon type='down' />}
                  className={s.datePick} />
              </div>
              <div className={s.modalBtn}>
                <Button
                  type='primary'
                  className={cn(s.btn, s.beginBtn)}
                  onClick={(eve) => hanldeStart(eve)}
                >确认并开始</Button>
                <Button
                  type='primary'
                  className={cn(s.btn, s.rightBtn)}
                  onClick={(eve) => {
                    eve.stopPropagation()
                    setModalFlag(null)
                  }}>取消</Button>
              </div>
            </div>
          )
        }
        {
          modalFlag === 2 && (
            <div onClick={(eve) => eve.stopPropagation()}>
              <div className={s.modalTitle}>完成迭代</div>
              <div className={s.modalMsgTime}>请再次确认当前迭代内所有事项是否都已完成？</div>
              <div className={s.modalMsgTime}>确认迭代完成时间</div>
              <div>
                <DatePicker
                  placeholder='请选择迭代完成时间'
                  defaultValue={moment()}
                  format={'YYYY-MM-DD'}
                  onChange={onCompChange}
                  // suffixIcon={<Icon type='down' />}
                  className={s.datePick} />
              </div>
              <div className={s.modalBtn}>
                <Button
                  type='primary'
                  className={cn(s.btn, s.sureBtn)}
                  onClick={handleComp}
                >确认完成</Button>
                <Button
                  type='primary'
                  className={cn(s.btn, s.rightBtn)}
                  onClick={(eve) => {
                    eve.stopPropagation()
                    setModalFlag(null)
                  }}>取消</Button>
              </div>
            </div>
          )
        }
        {
          modalFlag === 3 && (
            <div onClick={(eve) => eve.stopPropagation()}>
              <div className={s.modalTitle}>编辑迭代</div>
              <div className={s.modalMsgTime}>标题</div>
              <Input
                placeholder='请输入迭代标题'
                value={editInputValue}
                onChange={(e) => setEditInputValue(e.target.value)} />
              <div className={s.modalDate}>
                <div className={s.modalLeft}>
                  <div className={s.modalMsgTime}>开始时间</div>
                  <DatePicker
                    disabled={status ? true : false}
                    placeholder={status ? '' : '请选择迭代开始时间'}
                    defaultValue={status ? moment(timeEditStart) : null}
                    format={'YYYY-MM-DD'}
                    onChange={(date, dateString) => setEditTimeStart(dateString)}
                  // suffixIcon={<Icon type='down' />} 
                  />
                </div>
                <div className={s.modalRight}>
                  <div className={s.modalMsgTime}>结束时间</div>
                  <DatePicker
                    placeholder='请选择迭代结束时间'
                    defaultValue={status ? moment(timeEditEnd) : null}
                    onChange={(date, dateString) => setEditTimeEnd(dateString)}
                  // suffixIcon={<Icon type='down' />}
                  />
                </div>
              </div>
              <Button
                type='primary'
                className={cn(s.btn, s.sureBtn)}
                style={{ width: '60px', marginRight: '20px' }}
                onClick={handleEditSave}>保存</Button>
              <Button
                type='primary'
                className={cn(s.btn, s.rightBtn)}
                onClick={(eve) => {
                  eve.stopPropagation()
                  setModalFlag(null)
                }}
                style={{ width: '60px' }}>取消</Button>
            </div>
          )
        }
      </Modal>
    )
  }

  const renderAddMenu = () => {
    return (
      <div className={s.addRoot}>
        <div className={s.addItemContainer}>
          <span className={s.addMenu}>需求</span>
          <Divider type='vertical' className={s.dvdIcon} />
          <input
            placeholder="输入事件标题，可按回车创建"
            onChange={handleInput}
            value={inputValue}
            onKeyUp={handleEnterAdd}
            className={s.addItemInput}
          />
          <div className={s.btnadd} style={cur} onClick={handleBtnAdd}>创建</div>
          <div className={s.btnadd} onClick={() => handleCancel()} >取消</div>
        </div>
      </div>
    )
  }

  const renderArrow = () => {
    return expand ? <DownOutlined className={s.arrowIcon} /> : <RightOutlined className={s.arrowIcon} />
  }

  return (
    <div className={s.colRoot}>
      <div className={cn(s.collapse, className)}>
        <div
          className={cn(s.header, type !== 'backlog' && s.headerExpand)}
          onClick={handleExpand}>
          {
            type === 'backlog'
              ? <UnorderedListOutlined className={s.logIcon} />
              : renderArrow()
          }
          <span className={s.name}>{name}</span>
          <span className={s.issuesNum}>{issuesNum}个事项</span>
          <Divider type="vertical" className={s.dvdIcon} />
          {
            type === 'backlog'
              ? (
                <Tooltip title='未规划进迭代并且未完成的事项'>
                  <QuestionCircleOutlined className={s.tipIcon} />
                </Tooltip>
              )
              : (
                <div className={s.headerRight}>
                  <Dropdown overlay={dropDownMenu} trigger={['click']}>
                    <DashOutlined onClick={e => e.stopPropagation()} className={s.moreMenu} />
                  </Dropdown>
                  {status === 1 && (
                    <div className={s.date}>
                      {startDate} - {endDate}
                    </div>
                  )
                  }
                  <Tag color={status ? 'orange' : 'blue'}>
                    {status ? '进行中' : '未开始'}
                  </Tag>
                </div>
              )
          }
        </div>

        {/* part2 - show data */}
        <div className={s.body}>
          {(expand || type === 'backlog') && children}
          {/* <div className={s.operate}></div> */}
        </div>

        {/* part3 - create bar */}
        {
          (expand === true || type === 'backlog') && (
            <>
              {
                addFlag
                  ?
                  renderAddMenu()
                  :
                  <div className={s.addFooter} >
                    <div onClick={changeAddFlag}>
                      <PlusOutlined className={s.addIcon} />
                      <span className={s.createtitle}>创建事项</span>
                    </div>
                  </div>
              }
            </>
          )
        }

        {/* part4 - operate modal */}
        {
          renderModal('delete')
        }
      </div>
    </div>
  )
}

export default Collapse
