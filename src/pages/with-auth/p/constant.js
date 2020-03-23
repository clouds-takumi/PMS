import {
  HomeOutlined,
  BlockOutlined,
  BuildOutlined,
  FilterOutlined,
  TagsOutlined,
  SettingOutlined,
} from '@ant-design/icons'

export const menu = [
  {
    key: 'overview',
    name: '项目概览',
    icon: <HomeOutlined />,
  },
  {
    key: 'backlog',
    name: '待规划',
    icon: <BlockOutlined />,
  },
  {
    key: 'iteration',
    name: '迭代列表',
    icon: <BuildOutlined />,
  },
  {
    key: 'issue',
    name: '事项列表',
    icon: <FilterOutlined />,
  },
  {
    key: 'tag',
    name: '标签列表',
    icon: <TagsOutlined />,
  },
  {
    key: 'setting',
    name: '项目设置',
    icon: <SettingOutlined />,
  },
]
