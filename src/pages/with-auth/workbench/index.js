import { Component } from 'react'
import { RightOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'umi/link'
import s from './style.less'
import { getProjects, createProject } from './service'
import router from 'umi/router'
import CreateModal from '@/components/create-modal'
import { message } from 'antd'

class User extends Component {
  state = {
    projects: [],
    visible: false,
    forms: [
      {
        name: 'name',
        label: '项目标题',
        rules: [
          { required: true, message: '请输入项目标题' },
        ],
      },
      {
        name: 'desc',
        label: '项目描述',
        type: 'editor',
      }
    ],
  }

  render() {
    const { projects, visible, forms } = this.state

    return (
      <div className={s.wrapper}>
        <CreateModal
          title='新建项目'
          visible={visible}
          onCancel={() => this.handleVisibleChange(false)}
          forms={forms}
          onFinish={this.onFinish} />
        <div className={s.projects}>
          <h3 className={s.projectsTitle}>
            我的项目
            <PlusOutlined className={s.projectAdd} onClick={() => this.handleVisibleChange(true)} />
          </h3>
          <div className={s.projectsList}>
            {
              projects.slice(0, 4).map(project => (
                <div
                  key={project.id}
                  className={s.projectsListItem}
                  onClick={() => router.push(`/p/${project.id}/overview`)}>
                  <div className={s.projectsLeft}></div>
                  <div className={s.projectsRight}>
                    <div className={s.projectsName}>{project.name}</div>
                    {
                      project.desc && project.desc !== '<p></p>' ? (
                        <div className={s.projectsDesc} dangerouslySetInnerHTML = {{ __html: project.desc }}></div>
                      ) :  <div className={s.projectsDesc}>未填写描述</div>
                    }
                  </div>
                </div>
              ))
            }
            <Link to='/project'>
              <div className={s.projectsLink}>
                全部项目 <RightOutlined />
              </div>
            </Link>
          </div>
        </div>
        <div className={s.work}></div>
      </div>
    )
  }

  componentDidMount() {
    this.fetchProjects()
  }

  fetchProjects = () => {
    getProjects().then(({ data }) => {
      if (data && data.lists) {
        this.setState({ projects: data.lists })
      }
    })
  }

  handleVisibleChange = visible => {
    this.setState({ visible })
  }

  onFinish = values => {
    createProject(values).then(() => {
      message.success('创建成功')
      this.fetchProjects()
      this.handleVisibleChange(false)
    })
  }
}

export default User
