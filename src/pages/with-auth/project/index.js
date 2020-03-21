import { Component } from 'react'
// import _ from 'lodash'
import s from './style.less'
// import cn from 'classnames'
import router from 'umi/router'
import { getProjects, createProject } from '@/service'
import { Divider, Drawer, message } from 'antd'
import { PlusOutlined, ForkOutlined, LeftOutlined } from '@ant-design/icons'
import FormGroup from '@/components/form-group'
import { dataFormat } from '@/utils'

const dataFormatRules = [
  {
    key: 'desc',
    type: 'html',
  },
  {
    key: 'participant',
    type: 'array',
  }
]

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      modalFlag: false,
      forms: [
        {
          label: '项目名称',
          style: { fontSize: '14px', color: '#202d40', fontWeight: 700 },
          name: 'name',
          rules: [
            { required: true, message: '请输入项目名称' },
            { max: 20, message: '名称不能大于20个字符' }
          ],
        },
        {
          type: 'editor',
          label: '项目描述',
          style: { fontSize: '14px', color: '#202d40', fontWeight: 700 },
          name: 'desc',
        },
      ],
      extraForms: [
        {
          type: 'avatar',
          label: '项目封面',
          name: 'avatar',
        },
        {
          type: 'user-select',
          label: '项目成员',
          name: 'participant',
          placeholder: '选择项目成员',
        }
      ]
      // projectName: '',
      // nameTip: false,
    }
    document.getElementsByTagName("title")[0].innerText = '项目列表'
  }

  renderModal = () => {
    const { forms, extraForms } = this.state
    // const { projectName, nameTip } = this.state
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
                <div style={{ marginRight: '32px', width: '700px' }}>
                  <FormGroup
                    forms={forms}
                    extraForms={extraForms}
                    extraClassName={s.formGroupExtra}
                    onFinish={this.onFinish} />
                </div>
                {/* <div className={s.infoPic}>
                  <span className={s.picTitle}>项目封面</span>
                  <div className={s.bcImg}></div>
                  <button className={s.changeBtn} >更改封面</button>
                </div> */}
              </div>


              {/* <div style={{ display: 'flex' }}>
                <div style={{ marginRight: '32px', width: '500px' }}>
                  <div className={s.item}>
                    <div className={s.subtitle}>项目名称</div>
                    <Input value={projectName} onChange={this.handleNameChange} />
                    <span className={s.tips} style={nameTip ? { color: 'red' } : {}}>{nameTip ? '项目名称不能为空' : '可以使用中英文、数字、空格组合'}</span>
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
              </div> */}
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
                <div className={s.itemName}>创建项目</div>
              </div>
            </div>
            {
              projects.map((project, index) => {
                return (
                  <div
                    className={s.pItem}
                    key={project.id}
                    onClick={() => router.push(`/p/${project.id}/overview`)}>
                    {/* <div className={s.itemImgx}></div> */}
                    <img src={project.avatar} className={s.itemImgx} alt='' />
                    <div className={s.itemName}>{project.name}</div>
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

  fetchProjects = () => {
    getProjects().then(({ data }) => {
      if (data && data.lists) {
        this.setState({ projects: data.lists })
      }
    })
  }

  componentDidMount() {
    this.fetchProjects()
  }

  onFinish = values => {
    createProject(dataFormat(values, dataFormatRules)).then(() => {
      message.success('创建成功')
      this.goback()
      this.fetchProjects()
    })
  }

  goback = () => this.setState({ modalFlag: false })
  // goback = () => this.setState({ modalFlag: false, projectName: '' })

  // handleNameChange = (e) => {
  //   let name = e.target.value
  //   this.setState({ projectName: name })
  //   if (name === '') {
  //     this.setState({ nameTip: true })
  //   } else {
  //     this.setState({ nameTip: false })
  //   }
  // }

  // handleCreate = async () => {
  //   const { projectName } = this.state
  //   if (!projectName) {
  //     this.fun1()
  //     return
  //   }
  //   if (projectName.length > 20) {
  //     this.fun2()
  //     return
  //   }
  //   const product = { name: projectName }
  //   const result = await createProject(product)
  //   if (result) {
  //     message.success('创建成功')
  //     this.setState({ modalFlag: false, projectName: '' })
  //     this.fetchProjects()
  //   }
  // }
  // fun1 = _.throttle(() => message.info({ top: 0, key: '1', content: '请填写需求名称' }), 3000)
  // fun2 = _.throttle(() => message.info({ top: 0, key: '1', content: '项目名称超过了20个字符' }), 3000)
}



export default Projects
