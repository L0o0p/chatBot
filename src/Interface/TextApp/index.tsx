import styles from './index.module.scss';
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react';
import {
    isTalkingAtom,
    promptAtom,
    useBubble,
} from '../../store/chatBotStore';
import { getMessage } from './functions/getMessage';

export const TextApp = () => {
    const state = '输入任何内容'
    const temp = ''
    const [prompt, setPrompt] = useAtom(promptAtom)
    const [, setTalking] = useAtom(isTalkingAtom)
    const { appendBubble } = useBubble()
    const [exitCoordinates, setExitCoordinates] = useState<number[][]>([]);
    const [isDsabled, setDisabled] = useState(false)
    const handleClick = async () => {
        setDisabled(true);
        try {
            await getMessage({ prompt, setPrompt, appendBubble, position: generateRandomCoordinate().coordinates }); // 确保 getMessage 完成
            // appendBubble('feedBack', generateRandomCoordinate().coordinates); // 创建气泡(测试用)
            playTalking(); // 播放talking动画一次
        } finally {
            setDisabled(false);
        }
    }

    // 播放talking动画一次
    const playTalking = () => {
        setTalking(true)
        setTimeout(() => {
            setTalking(false)
        }, 1200)
    }
    // 给新增的字条随机生成展示位置
    const generateRandomCoordinate = () => {
        let coordinates: number[];
        let foundUnique = false;
        while (!foundUnique) {
            const x = Math.floor(Math.random() * 14) - 7;
            const y = Math.floor(Math.random() * 8) - 4;
            const z = parseFloat((Math.random() * 3 - 5.3).toFixed(2));
            coordinates = [x, y, z];
            if (!exitCoordinates.some(coord => JSON.stringify(coord) === JSON.stringify(coordinates))) {
                setExitCoordinates(exitCoordinates => [...exitCoordinates, coordinates]);
                foundUnique = true;
            }
        }
        return { coordinates };
    };
    const fetchChatLog = async () => {
        const url = 'http://localhost:3000/articles/chatlog';  // 确保 URL 匹配您的后端服务地址和端口
        try {
            const response = await fetch(url, {
                method: 'GET',  // 使用 GET 方法
                headers: {
                    'Content-Type': 'application/json'  // 假设后端期望接收 JSON 格式
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();  // 解析 JSON 响应体
            console.log('Chat log:', data.data);  // 输出获取到的聊天记录
            return data.data;  // 返回数据以便可以在其他地方使用
        } catch (error) {
            console.error('Failed to fetch chat log:', error);
        }
    }

    const createHistoryBubble = async () => {
        const historyChatLog = await fetchChatLog();
        console.log('historyChatLog', historyChatLog);
        
        historyChatLog.forEach((chat: { answer: string; }) => {
            const randomPlace = generateRandomCoordinate().coordinates;
            appendBubble(chat.answer, randomPlace);
        });
    }
    useEffect(() => {
    const initChatBubbles = async () => {
        await createHistoryBubble();
    };
    initChatBubbles();
    }, []);


    return (<>
        <div className={styles.container}>
            <div className={styles.logCard}>
                <h1 className={styles.header} onClick={handleClick}>{state}</h1>
                <div className={styles.content}>
                    <textarea
                        className={styles.textarea}
                        placeholder={temp}
                        style={{ resize: 'none', outline: 'none', minHeight: '100px', border: 'none' }}
                        value={prompt}
                        onChange={e => setPrompt(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                    <MyButton click={handleClick} disable={isDsabled} />
                </div>
            </div>
        </div>
    </>)
}


interface props {
    click: () => void
    disable: boolean
}
const MyButton = (props: props) => {
    const { click, disable } = props
    useEffect(() => {
        const handleKeyDown = (event: { key: string; }) => {
            // 使用 'Enter' 键作为快捷键
            if (event.key === 'Enter') {
                click();
            }
        };

        // 添加事件监听器
        document.addEventListener('keydown', handleKeyDown);

        // 清理函数
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={styles.buttonContainer}>
            <button
                className={styles.sumitButton}
                onClick={click}
                style={{
                    cursor: disable ? 'not-allowed' : 'pointer', // 改变鼠标样式
                    color: disable ? 'gray' : 'black', // 改变文本颜色
                    // pointerEvents: disable ? 'none' : 'auto' // 控制事件触发
                }}
                disabled={disable}
            >
                <div className={styles.sumitButtonText}>Create Card-moji</div>

                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3.33334 2L12.6667 8L3.33334 14V2Z"
                        stroke="#2C2C2C"
                        style={{
                            stroke: '#8B4513',
                            strokeOpacity: 1,
                        }}
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>

            </button>
        </div>
    )
}