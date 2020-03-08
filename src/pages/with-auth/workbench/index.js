import { Component } from 'react'
import { RightOutlined, PlusOutlined } from '@ant-design/icons'
import Link from 'umi/link'
import s from './style.less'
import { getProjects, createProject } from './service'
import { Modal, Form, Input, Button } from 'antd'
import router from 'umi/router'

class User extends Component {
  state = {
    projects: [],
    visible: false,
  }

  render() {
    const { projects, visible } = this.state

    return (
      <div className={s.wrapper}>
        <Modal
          title='新建项目'
          visible={visible}
          footer={null}
          maskClosable={false}
          onCancel={() => this.handleVisibleChange(false)}>
          <Form
            layout='vertical'
            onFinish={this.onFinish}>
            <Form.Item
              label='项目标题'
              name='name'
              rules={[{ required: true, message: '请输入项目标题' }]}>
              <Input />
            </Form.Item>
            <Form.Item label='项目描述' name='desc'>
              <Input.TextArea />
            </Form.Item>
            <Button type='primary' htmlType='submit'>创建</Button>
          </Form>
        </Modal>
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
                    <div className={s.projectsDesc}>{project.desc || '未填写描述'}</div>
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
      this.fetchProjects()
      this.handleVisibleChange(false)
    })
  }
}

export default User
