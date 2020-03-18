import { Component } from 'react'
import _ from 'lodash'
import s from './style.less'
import cn from 'classnames'
import router from 'umi/router'
import { getProjects, createProject } from './service'
import { Divider, Drawer, Input, Select, Tag, message } from 'antd'
import { PlusOutlined, ForkOutlined, LeftOutlined } from '@ant-design/icons'


class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      modalFlag: false,
      projectName: '',
      nameTip: false,
      tags: null,
      selectedTags: [],
      userInfo: null
    }
    document.getElementsByTagName("title")[0].innerText = '项目列表'
  }

  goback = () => this.setState({ modalFlag: false, projectName: '', selectedTags: [] })

  routeChange = () => router.replace('/p/p1')

  handleNameChange = (e) => {
    let name = e.target.value
    this.setState({ projectName: name })
    if (name === '') {
      this.setState({ nameTip: true })
    } else {
      this.setState({ nameTip: false })
    }
  }

  handleSelectTag = value => {
    if (value) {
      this.setState({ selectedTags: value })
    }
  }

  handleCreate = async () => {
    const { projectName, userInfo, selectedTags } = this.state
    if (!projectName) {
      this.fun1()
      return
    }
    if (projectName.length > 20) {
      this.fun2()
      return
    }
    if (selectedTags.length > 3) {
      this.fun3()
      return
    }
    const tagsStr = selectedTags.join(',')
    const product = { name: projectName, status: 0, created: userInfo.id, tags: tagsStr }
    const result = await createProject(product)
    if (result && result.id) {
      message.success('创建成功')
      this.setState({ modalFlag: false, projectName: '', selectedTags: [] })
      this.fetchData()
    }
  }
  fun1 = _.throttle(() => message.info({ top: 0, key: '1', content: '请填写需求名称' }), 3000)
  fun2 = _.throttle(() => message.info({ top: 0, key: '1', content: '项目名称超过了20个字符' }), 3000)
  fun3 = _.throttle(() => message.info({ top: 0, key: '1', content: '项目标签应该不多于3个' }), 3000)

  fetchData = async () => {
    const resData = await getProjects()
    if (resData.lists) {
      this.setState({ projects: resData.lists })
    }
  }

  componentDidMount() {
    this.fetchData()
    // reqUserInfo().then(res => { this.setState({ userInfo: res }) })
    // reqTags().then(res => this.setState({ tags: res }))
  }

  renderModal = () => {
    const { projectName, nameTip, tags } = this.state
    return (
      <Drawer
        title=""
        placement="left"
        width='100%'
        visible
        closable={false}
        className={s.drawer}>
        <div className={s.drawerInner}>
          <div className={s.leftContainer}>
            <div onClick={this.goback} className={s.closeBtn}>
              <LeftOutlined />
            </div>
          </div>
          <div className={s.rightContent}>
            <div className={s.info}>
              <div className={s.title}>
                <span>填写项目基本信息</span>
              </div>
              <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '32px', width: '500px' }}>
                  <div className={s.item}>
                    <div className={s.subtitle}>项目名称</div>
                    <Input value={projectName} onChange={this.handleNameChange} />
                    <span className={s.tips} style={nameTip ? { color: 'red' } : {}}>{nameTip ? '项目名称不能为空' : '可以使用中英文、数字、空格组合'}</span>
                  </div>
                  <div className={s.item}>
                    <div className={s.subtitle}>项目标签</div>
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      onChange={this.handleSelectTag}>
                      {tags && tags.map(
                        tag => <Select.Option key={tag.id} >
                          <Tag color={tag.color}>{tag.name}</Tag>
                        </Select.Option>)}
                    </Select>
                    <span className={s.tips}>建议选择最多不超过三个</span>
                  </div>
                  <div className={s.item}>
                    <div className={s.subtitle}>项目描述</div>
                    <span className={s.tips}>
                      <Input.TextArea
                        rows={4}
                        placeholder='描述内容限制在100字以内（选填）'
                        className={s.text} />
                    </span>
                  </div>
                  <button className={cn(s.btn, s.leftBtn)} onClick={this.handleCreate}>完成创建</button>
                  <button className={s.btn} onClick={this.goback}>取消</button>
                </div>
                <div className={s.infoPic}>
                  <span className={s.picTitle}>项目封面</span>
                  <div className={s.bcImg}></div>
                  <button className={s.changeBtn} >更改封面</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    )
  }

  render() {
    const { projects, modalFlag } = this.state
    return (
      <div className={s.projectsRoot}>
        <div className={s.leftNav}>
          <div className={s.header}>
            <div className={s.title}>
              项目
              <PlusOutlined className={s.createIcon} onClick={() => this.setState({ modalFlag: true })} />
            </div>
          </div>
          <div className={s.prolists}>
            <div className={s.proItem} style={{ backgroundColor: '#dadfe6' }}>
              <ForkOutlined style={{ marginRight: '8px', fontSize: '12px' }} />
              <div>我参与的</div>
            </div>
          </div>
        </div>

        <div className={s.rightContent}>
          <div>
            <div className={s.contentTitle}>所有项目（{projects.length}）</div>
          </div>
          <Divider type='horizontal' />
          <div className={s.mangeLists}>
            <div onClick={() => this.setState({ modalFlag: true })}>
              <div className={s.mItem}>
                <div className={s.itemImg}>
                  <PlusOutlined />
                </div>
                <div className={s.itemName}>新建项目</div>
              </div>
            </div>
            {
              projects.map((item, index) => {
                return (
                  <div onClick={this.routeChange}>
                    <div className={s.mItem}>
                      <div className={s.itemImg}>
                        <div>img</div>
                      </div>
                      <div className={s.itemName}>{item.name}</div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </div>

        {
          modalFlag && this.renderModal()
        }
      </div>
    );
  }
}

export default Projects
