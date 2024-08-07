import { useAtom } from "jotai";
import { icon } from '../iconStore'
import styles from './index.module.scss';
import { isPlayingAtom, playListAtom, useAudioInformation, useCurrentAudio } from "../../../store";
import { useEffect, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { playMode, usePlayMode } from "../../../store/mode";

export const ControlBlock = () => {

    return (
        <div className={styles.controlBlock}>
            <PlayMode />
            <PlayControl />
            <Download />
        </div>
    )
}

// 变更播放模式按钮
const PlayMode = () => {
    const { currentPlayModeIndex, setCurrentPlayModeIndex, currentPlayMode } = usePlayMode()
    const changeMode = () => {
        const newPlaymodeIndex = (currentPlayModeIndex < playMode.length - 1 ? (currentPlayModeIndex + 1) : 0)
        setCurrentPlayModeIndex(newPlaymodeIndex)
        console.log('播放模式切换为：', currentPlayMode);
    }
    return (
        <div className={styles.playmode} onClick={changeMode}>
            <img className={styles.featherButton} src={icon.playmode0} />
        </div>
    )
}

// 下载按钮
const Download = () => {
    const { loading, audioInfo, getAudioInformation } = useAudioInformation()
    // 假设 useCurrentAudio 是一个 Hook，返回当前音频的相关信息
    const { currentAudio } = useCurrentAudio()
    const [toDownLoad, setToDownLoad] = useState(false)
    // 函数：根据重新获取到的url下载mp3文件
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function downloadAudio() {
        if (audioInfo && audioInfo.audio_url !== '') {
            const audioUrl = audioInfo.audio_url;
            // 使用 fetch API 下载文件
            fetch(audioUrl)
                .then(response => response.blob()) // 转换为 blob
                .then(blob => {
                    // 创建一个指向该 Blob 的 URL
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = audioInfo.title, ".mp3"; // 指定下载文件名
                    document.body.appendChild(a);
                    a.click();

                    // 清理
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                })
                .catch(e => console.error('下载失败:', e));
        }
    }
    // 点击下载
    async function downloadMP3(audioId = currentAudio) {
        // if (!currentAudio.audioUrl.includes('.mp3')) {
        // 函数：重新获取当前音频的信息（包含生成的mp3）
        getAudioInformation(audioId.id);
        // }
        setToDownLoad(true)
        console.log('点击了下载按钮', toDownLoad);
    }
    // // 获取到自动执行下载方法
    useEffect(() => {
        // 是否点击了下载按钮
        if (toDownLoad) {
            downloadAudio()
            // 执行完下载行为后要还原为没有点击下载按钮的状态
            setToDownLoad(false)
            console.log('还原下载状态', toDownLoad);
        }
    }, [downloadAudio, toDownLoad, audioInfo?.audio_url])
    return (
        <div className={styles.download}>
            {loading ? <LoadingOutlined /> : <img className={styles.featherButton} src={icon.download} onClick={() => { downloadMP3(); console.log('Download clicked') }} />
            }
        </div>
    )
}

// 播放控制按钮组件（上一曲、暂停｜播放、下一曲）
const PlayControl = () => {
    const { setCurrentAudioIndex, currentAudio } = useCurrentAudio()
    const [playList] = useAtom(playListAtom)
    const [isPlay, setIsPlaying] = useAtom(isPlayingAtom)

    const next = () => {
        console.log('next：', currentAudio.audioUrl)
        setCurrentAudioIndex((currentIndex) => (currentIndex + 1) % playList.length);
        setIsPlaying(true);

    }
    const previous = () => {
        console.log('next', currentAudio.audioUrl)
        setCurrentAudioIndex((currentIndex) => (currentIndex - 1 + playList.length) % playList.length);
        setIsPlaying(true);
    }
    const play = () => {
        setIsPlaying(true);
    };
    const pause = () => {
        setIsPlaying(false);
    };
    // 播放或暂停音乐
    const togglePlayPause = () => {
        isPlay ? pause() : play()

    };

    return (
        <div className={styles.playControl}>
            <img
                className={styles.featherButton}
                src={icon.previousbutton}
                onClick={previous}
            />
            <img
                className={styles.playbutton}
                src={isPlay ? icon.playButtonT : icon.playButtonF}
                onClick={togglePlayPause}
            />
            {/* <button onClick={() => { setIsLoading(!isloading) }}></button> */}
            <img
                className={styles.featherButton}
                src={icon.nextbutton}
                onClick={next}
            />
        </div>
    )
}


