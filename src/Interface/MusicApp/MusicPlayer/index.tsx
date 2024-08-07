import { useAtom } from 'jotai';
import { audioRefAtom, isPlayingAtom, useCurrentAudio, currentTimeAtom, currentDurationAtom, currentAudioIndexAtom, useAudioInformation, playListAtom, clickAtom } from '../../store';
import styles from './index.module.scss'
import { useEffect, useRef } from 'react';
import { currentPlayModeIndexAtom, playMode } from '../../store/mode';

export const MusicPlayer = () => {
    const { currentAudio } = useCurrentAudio();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [, setAudioRef] = useAtom(audioRefAtom);
    const [isPlay, setIsPlaying] = useAtom(isPlayingAtom);
    const [, setCurrentTime] = useAtom(currentTimeAtom)
    const [, setCurrentDuration] = useAtom(currentDurationAtom)
    const { getAudioInformation } = useAudioInformation();
    const [currentAudioIndex, setCurrentAudioIndex] = useAtom(currentAudioIndexAtom)
    const [currentPlayModeIndex] = useAtom(currentPlayModeIndexAtom)
    const [playList] = useAtom(playListAtom)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    useEffect(() => {
        console.log(
            'currenAudio', currentAudio.name, currentAudio.id, currentAudio.audioUrl
        );
    }, [currentAudio])

    // 吧ref赋值给更新的audio
    useEffect(() => {
        if (audioRef.current) {
            setAudioRef(audioRef.current);
        }
    }, [audioRef, setAudioRef]);

    // 监听audio实际播放情况改变记录状态
    // 并且安装状态自动化：暂停 ｜ 播放
    // 监听当前音频时长
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlay) {
                audio.addEventListener('play', onPlay);
                audio.addEventListener('pause', onPause);
                // 监听canplaythrough事件，表示音频已经可以无缓冲播放
                audio.addEventListener('canplaythrough', function () {
                    console.log("Audio is fully loaded and can play through.");
                    // 显示音频时长
                    console.log("Duration: " + audio.duration + " seconds");
                    // 可以选择在这里自动播放
                    audio.play();
                }, false);
                if (!currentAudio.audioUrl.includes('.mp3')) {
                    getAudioInformation(currentAudio.id)
                }
                audio.play().catch(e => console.error('Error playing audio:', e));
            } else {
                audio.pause();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlay]);  // 只有当 isPlay 改变时，这个 useEffect 才会运行

    // 当音频加载元数据时，设置总时长
    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        // 方法：更新音频【总时长】&&【已播放时长】
        const setAudioData = () => {
            setCurrentDuration(audio.duration);
            setCurrentTime(audio.currentTime);
        };
        // 方法：更新音频【已播放时长】
        const setAudioTime = () => setCurrentTime(audio.currentTime);

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
        };
    }, [currentAudio, setCurrentDuration, setCurrentTime]);


    // 定义当前音频播放结束行为

    const endAct = () => {
        if (!audioRef.current) { return }
        const audio = audioRef.current
        // 顺序播放
        if (currentPlayModeIndex === 0) {
            audio.onended = function () {
                // alert("The video has ended");
                const newIndex = (currentAudioIndex < playList.length - 1 ? (currentAudioIndex + 1) : 0)
                setCurrentAudioIndex(newIndex)
                audio.play()
            };
        }
        // 单曲循环
        if (currentPlayModeIndex === 1) {
            audio.onended = function () {
                setCurrentAudioIndex(currentAudioIndex)
                audio.play()
            };
        }
        // 随机播放
        if (currentPlayModeIndex === 2) {
            audio.onended = function () {
                const randomIndex = Math.floor(Math.random() * (playMode.length - 1))
                setCurrentAudioIndex(randomIndex)
                audio.play()
            };
        }
    }
    // 执行音频播放结束行为
    useEffect(() => {
        endAct()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAudioIndex, currentPlayModeIndex])

    return (
        <>
            <p className={styles.butttt}>
                <audio
                    ref={audioRef}
                    preload={'auto'}
                    controls={true}
                    autoPlay={true}
                    key={currentAudio.audioUrl}
                // muted
                >
                    <source src={currentAudio.audioUrl} type="audio/mp3" />
                </audio>
            </p>
        </>
    );
}
