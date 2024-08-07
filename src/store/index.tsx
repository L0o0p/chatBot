import axios from "axios";
import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";


// 生成请求地址
// export const baseUrl = "https://suno-api-eta-seven.vercel.app";
export const baseUrl = "http://localhost:3000";

// 初始播放列表
export const initialPlayList = [
    { imageUrl: 'https://telegraph-image-3k8.pages.dev/file/f87b9fd9305890ab158cf.jpg', audioUrl: '/Im-sorry.mp3', name: 'Im-sorry', id: '56d8ac53-cedb-4b44-93c4-9de95e0f62bf' },
    { imageUrl: 'https://telegraph-image-3k8.pages.dev/file/2054b3cf3f0975efa1de9.jpg', audioUrl: '/Feline Fever.mp3', name: 'Feline Fever', id: '51d87db9-bd7a-4047-ab2f-b1f77c028cbe' },
    // { imageUrl: 'https://telegraph-image-3k8.pages.dev/file/2054b3cf3f0975efa1de9.jpg', audioUrl: '/Feline Fever.mp3', name: 'Feline Fever', id: '25e70e8d-74f2-4827-aaef-bdc907395fb8' },
    { imageUrl: 'https://telegraph-image-3k8.pages.dev/file/d6de2d827d8959df78ed9.jpg', audioUrl: '/Desperate Boy.mp3', name: 'Desperate Boy', id: 'f86d7788-2e5b-410d-9ebb-af67fc376956' },
];

// 暴露初始播放列表
export const playListAtom = atomWithStorage('playlist', initialPlayList);

// 暴露当前播放的音频索引
export const currentAudioIndexAtom = atom(0);

// Hook to access and update current audio
export const useCurrentAudio = () => {
    // 读取、更新整个播放列表
    const [playList, setPlayList] = useAtom(playListAtom);
    // 读取、更新当前播放的音频索引
    const [currentAudioIndex, setCurrentAudioIndex] = useAtom(currentAudioIndexAtom);
    // 更新当前播放的音频，传入新的音频url，复制播放列表，使用当前索引，让当前播放的对象音频url接收新的音频url
    const setCurrentAudioUrl = (audioUrl: string) => {
        const newPlayList = [...playList];
        newPlayList[currentAudioIndex] = {
            ...newPlayList[currentAudioIndex],
            audioUrl: audioUrl // Update the audio URL
        };
        setPlayList(newPlayList);
    };
    const setCurrentAudio = (audio: {
        imageUrl: string;
        audioUrl: string;
        name: string;
        id: string;
    }) => {
        const newPlayList = [...playList];
        newPlayList[currentAudioIndex] = audio
        setPlayList(newPlayList);
    };

    const setCurrentAudioName = (audioName: string) => {
        const newPlayList = [...playList];
        newPlayList[currentAudioIndex] = {
            ...newPlayList[currentAudioIndex],
            name: audioName // Update the audio URL
        };
        setPlayList(newPlayList);
    };
    const setCurrentAudioImg = (imageUrl: string) => {
        const newPlayList = [...playList];
        newPlayList[currentAudioIndex] = {
            ...newPlayList[currentAudioIndex],
            imageUrl: imageUrl // Update the audio URL
        };
        setPlayList(newPlayList);
    };
    const currentAudio = playList[currentAudioIndex];
    return { currentAudio, setCurrentAudio, setCurrentAudioIndex, currentAudioIndex, setCurrentAudioUrl, setCurrentAudioName, setCurrentAudioImg };
};

// 碟片的旋转状态
export const useDiskRotation = () => {
    const [isPlaying] = useAtom(isPlayingAtom);
    const cd = (isPlaying ? true : false)
    const diskRotation = cd
    return { diskRotation }
}

// 跨组件共享audioRef
export const audioRefAtom = atom<HTMLAudioElement | null>(null);

// 监听音频实际播放状态
export const isPlayingAtom = atom<boolean>(false);
export const currentTimeAtom = atom<number>(0);
export const currentDurationAtom = atom<number>(0);

// 枚举播放模式
export const PlaybackModes = {
    REPEAT_ALL: 'REPEAT_ALL',  // 全部循环
    REPEAT_ONE: 'REPEAT_ONE',  // 单曲循环
    SHUFFLE: 'SHUFFLE',        // 随机播放
    SEQUENTIAL: 'SEQUENTIAL'   // 顺序播放
};
// 当前的播放模式状态
export const playbackModeAtom = atom(PlaybackModes.SEQUENTIAL)
export interface AudioInfo {
    id: string;
    status: string;
    audio_url: string;
    image_url: string;
    title: string;
}
export const audioInfoAtom = atom<AudioInfo | null>(null)

// 是否等待状态
export const isLoadingAtom = atom<boolean>(false);

export const ifClickShareAtom = atom<boolean>(false);

// 获取音频信息
// 函数：重新获取当前音频的信息（包含生成的mp3）
export function useAudioInformation() {
    const [loading, setLoading] = useAtom(isLoadingAtom);
    const [audioInfo, setAudioInfo] = useAtom(audioInfoAtom);
    const { setCurrentAudioUrl } = useCurrentAudio()
    async function getAudioInformation(audioIds: string) {
        setLoading(true);
        const url = `${baseUrl}/api/get?ids=${audioIds}`;
        const response = await axios.get(url)
            .catch(error => {
                console.error('API请求失败:', error);
                if (error.response) {
                    alert(`错误: ${error.response.status} ${error.response.data.message}`);
                } else if (error.request) {
                    alert('服务器响应超时，请检查您的网络连接或稍后再试。');
                } else {
                    alert('请求失败，请检查您的请求配置或稍后再试。');
                }
                return null;  // 返回 null 以避免后续代码执行
            });

        if (response && response.data) {  // 确保 response 和 response.data 都有效
            setAudioInfo(response.data[0]);
            // if (!currentAudio.audioUrl.includes('.mp3')) {
            console.log('文件链接过期，正在重新请求...');
            if (audioInfo?.audio_url && audioInfo?.audio_url !== '') {
                setCurrentAudioUrl(response.data[0].audio_url)
                // }
            }
        }
        setLoading(false);
    }
    return { loading, setLoading, audioInfo, setAudioInfo, getAudioInformation }
}

// 对话泡 && characterAnimation
export const showBubbleAtom = atom(false)

// 气泡文本内容
export const statusAtom = atom("Hello," + "\n" + " I' m Tim")
// 角色动画
export const characterAnimationAtom = atom('idle')

import { AnimationAction } from "three";

// 定义 actions 和 actionIndex 两个 Atom
export const actionsAtom = atom<AnimationAction[]>([]);

export const actionIndexAtom = atom(2); // 初始化为 0 或任意有效的默认索引

export const useAction = () => {
    const [actions, setActions] = useAtom(actionsAtom);
    const [actionIndex, setActionIndex] = useAtom(actionIndexAtom);
    const nextActionIndex = (actionIndex + 1) % (actions.length || 1);

    // 直接在组件中计算当前动作，而不是创建一个新的 Atom
    const currentAction = actions[actionIndex] || null;
    const nextAction = actions[nextActionIndex] || null;
    const setCurrentAction = (action: AnimationAction) => {
        setActions(prevActions => {
            const newActions = [...prevActions];
            newActions[actionIndex] = action;
            return newActions;
        });
    };

    // 返回所有相关状态和设置函数
    return { actions, setActions, actionIndex, setActionIndex, currentAction, setCurrentAction, nextActionIndex, nextAction };
}

export const clickAtom = atom(false);