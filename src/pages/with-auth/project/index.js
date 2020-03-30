import { Component } from 'react'
import s from './style.less'
import cn from 'classnames'
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
          // FIXME: 额外设置label的样式出错，效果是将整个item设置了额外的样式
          itemExtraClassName: s.formItem,
          name: 'name',
          rules: [
            { required: true, message: '请输入项目名称' },
            { max: 20, message: '名称不能大于20个字符' }
          ],
        },
        {
          type: 'editor',
          label: '项目描述',
          itemExtraClassName: s.formItem,
          name: 'desc',
        },
      ],
      extraForms: [
        {
          type: 'avatar',
          label: '项目封面',
          name: 'avatar',
          buttonText: '更换封面'
        },
        {
          type: 'user-select',
          label: '项目成员',
          name: 'participant',
          placeholder: '选择项目成员',
        }
      ]
    }
    document.getElementsByTagName("title")[0].innerText = '项目列表'
  }

  renderAddModal = () => {
    const { forms, extraForms } = this.state
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
              <div className={s.formWrap}>
                <FormGroup
                  forms={forms}
                  extraForms={extraForms}
                  extraClassName={s.formGroupExtra}
                  onFinish={this.onFinish} />
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
            <div className={cn(s.proItem, s.proItemChecked)} >
              <ForkOutlined className={s.iconStyle} />
              <div>我管理的</div>
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
                    {/* FIXME: 没有项目图片src的时候，出现的背景图像样式问题，有的出现border */}
                    <img src={project.avatar} className={cn(s.itemImgx, !project.avatar && s.itemImgxColor)} alt='' />
                    <div className={s.itemName}>{project.name}</div>
                  </div>
                )
              })
            }
          </div>
        </div>

        {
          modalFlag && this.renderAddModal()
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
}

export default Projects