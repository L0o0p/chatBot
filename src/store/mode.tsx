import { atom, useAtom } from 'jotai'

// 播放模式
export const playMode = [
    '顺序播放',
    '单曲循环',
    '随机播放'
]

// 当前选中的播放模式index
export const currentPlayModeIndexAtom = atom(0);
// 当前选中的播放模式
export const usePlayMode = () => {
    // 使用的播放模式的索引
    const [currentPlayModeIndex, setCurrentPlayModeIndex] = useAtom(currentPlayModeIndexAtom);
    // 使用的播放模式
    const currentPlayMode = playMode[currentPlayModeIndex];
    return { currentPlayMode, currentPlayModeIndex, setCurrentPlayModeIndex }
}

// 按钮组件
export const FeatrueButton = () => {
    const { currentPlayModeIndex, setCurrentPlayModeIndex } = usePlayMode()
    // 改变当前播放模式的函数
    const changeMode = () => {
        setCurrentPlayModeIndex(currentPlayModeIndex + 1)
    }
    return (
        <button onClick={changeMode}>{'切换播放模式'}</button>
    )
}
