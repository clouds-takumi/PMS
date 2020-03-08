import { Component } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import s from './style.less'

const cards = [
  {
    id: '1',
    name: 'dlgldkgdsdgldkfslf;gdaaaaa',
    desc: 'dgldkfjdskfkckkgdsgskd;fddddddd',
  },
  {
    id: '2',
    name: 'dlgldkgdsdgldkfslf;gdaaaaaaa',
    desc: 'dgldkfjdskfkckkgdsgskd;fddddddd',
  },
  {
    id: '3',
    name: 'dlgldkgdsdgldkfslf;gd',
    desc: 'dgldkfjdskfkckkgdsgskd;f',
  },
  {
    id: '4',
    name: 'dlgldkgdsdgldkfslf;gd',
    desc: 'dgldkfjdskfkckkgdsgskd;f',
  },
]

class Project extends Component {
  render() {
    return (
      <div className={s.wrapper}>
        <div className={s.list}>
          <div className={s.item}>
            <div className={s.itemAdd}>
              <PlusOutlined />
            </div>
            <div className={s.itemName}>新建项目</div>
          </div>
          {
            cards.map(card => (
              <div className={s.item} key={card.id}>
                <div className={s.itemImg}></div>
                <div className={s.itemName}>{card.name}</div>
                <div className={s.itemDesc}>{card.desc}</div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}

export default Project
