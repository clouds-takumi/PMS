import { useState } from 'react'
// import { Input } from 'antd'
import s from './style.less'
import CreateModal from '@/components/create-modal'
import { PlusSquareOutlined } from '@ant-design/icons'

const CreateIteration = ({ handleAddIter, emptyFlag }) => {
    const [flag, setFlag] = useState(true)
    // const [value, setValue] = useState('')
    // const [btnFlag, setBtnFlag] = useState(false)

    // let curponiter = btnFlag ? 'pointer' : 'not-allowed'
    // let curcolor = btnFlag ? '#4682B4' : '#bcc0c5'
    // const cur = { cursor: curponiter, backgroundColor: curcolor, color: "white" }

    const changeFlag = value => { setFlag(value) }

    // const handleCancel = () => {
    //     setFlag(true)
    //     setValue('')
    //     setBtnFlag(false)
    // }

    // const handleInput = (e) => {
    //     setValue(e.target.value)
    //     setBtnFlag(true)
    //     if (!e.target.value) {
    //         setBtnFlag(false)
    //     }
    // }

    // const handleItemAdd = () => {
    //     if (!!value) {
    //         handleAddIter({ title: value, expand: true })
    //         setValue('')
    //     }
    // }

    const forms = [
        {
            label: '迭代名称',
            name: 'name',
            rules: [
                { required: true, message: '请输入迭代名称' },
                { max: 20, message: '名称不能大于20个字符' }
            ],
        },
        {
            type: 'editor',
            label: '迭代描述',
            name: 'desc',
        },
    ]

    const extraForms = [
        {
            type: 'date',
            label: '开始日期',
            name: 'startDate',
            rules: [
                { required: true, message: '请选择开始日期' },
            ],
        },
        {
            type: 'date',
            label: '结束日期',
            name: 'endDate',
            rules: [
                { required: true, message: '请选择结束日期' },
            ],
        },
    ]

    const onFinish = value => {
        handleAddIter(value)
        changeFlag(true)
    }

    return (
        <>
            {
                emptyFlag && (
                    <div className={s.emptyRoot}>
                        <div className={s.emptyContainer}>
                            <div className={s.empthBg}></div>
                            <div className={s.title}>当前没有迭代项</div>
                            <div className={s.subTitle}>
                                <span className={s.subTitleBtn} onClick={() => changeFlag(false)}>创建迭代</span>
                                ，将 backlog 中的事项拖入迭代中，完成迭代的准备。
                            </div>
                        </div>
                    </div>
                )

            }
            {
                flag
                    ? (
                        <div className={s.addcontainer} onClick={() => changeFlag(false)}>
                            <span className={s.btn}><PlusSquareOutlined className={s.createIcon} />创建迭代</span>
                        </div>
                    )
                    : (
                        // <div className={s.info}>
                        //     <Input
                        //         className={s.infoInput}
                        //         placeholder='请输入容器标题，可按回车创建'
                        //         size='small'
                        //         value={value}
                        //         onPressEnter={handleItemAdd}
                        //         onChange={handleInput}
                        //     />
                        //     <span className={s.inforight}>
                        //         <div className={s.infoBtn} onClick={handleItemAdd} style={cur}>
                        //             创建
                        //     </div>
                        //         <div className={s.infoBtn} onClick={handleCancel}>
                        //             取消
                        //     </div>
                        //     </span>

                        // </div>

                        <CreateModal
                            width={935}
                            visible={!flag}
                            title={'创建迭代'}
                            onCancel={changeFlag}
                            forms={forms}
                            extraForms={extraForms}
                            onFinish={onFinish}
                            btnText={'创建'} />
                    )
            }
        </>

    )
}

export default CreateIteration