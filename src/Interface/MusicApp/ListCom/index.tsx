import { useEffect, useState } from 'react'
import { playListAtom, useCurrentAudio } from '../../store/index'
import styles from './index.module.scss'
import { useAtom } from 'jotai'
import CaretDownOutlined from '@ant-design/icons/lib/icons/CaretDownOutlined';
import CaretUpOutlined from '@ant-design/icons/lib/icons/CaretUpOutlined';

interface ListCom {
    display: boolean;
    setDis: (value: React.SetStateAction<boolean>) => void;
}
// 歌单组件
export const ListCom = () => {
    // 是否展示
    const [display, setDis] = useState(false)
    // const [display, setDis] = useState(true)
    // 读取原子歌单
    const [playList] = useAtom(playListAtom)
    useEffect(() => {
        console.log('原始歌单：', playList);
    }, [])
    // 歌单初始状态
    const initSelect = [true, false, false]
    const [select, selected] = useState(initSelect)
    // 自动切换歌单状态（根据当前播放音乐）
    const { currentAudioIndex, setCurrentAudioIndex } = useCurrentAudio()
    useEffect(() => {
        const newSelect = select.slice().fill(false)
        newSelect[currentAudioIndex] = true;
        selected(newSelect);
        // console.log('clicked playlist', currentAudioIndex, select);
    }, [currentAudioIndex])
    //歌单点击事件
    const handleClick = (index: number) => {
        setCurrentAudioIndex(index)
    }
    return (
        <>
            {(display) ? (
                <div className={styles.playlist}>
                    <div className={styles.header}
                        onClick={() => { setDis(!display) }}
                    ><div>播放列表</div>
                        <CaretUpOutlined className={styles.open} />
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.content}>
                        {playList.map((item, index) => (
                            <div
                                key={index}
                                className={styles.item}
                                onClick={() => { handleClick(index) }} // 暂时禁用
                                style={select[index] ? { fontWeight: 500, backgroundColor: 'gray', color: 'white' } : {}}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    onClick={() => { setDis(!display) }}
                >
                    <CaretDownOutlined className={styles.open} />
                </div>
            )}

        </>

    )
}