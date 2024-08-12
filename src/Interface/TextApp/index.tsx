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
        const x = Math.floor(Math.random() * 14) - 7;  // 生成 -7 到 7 之间的整数
        const y = Math.floor(Math.random() * 8) - 4;  // 生成 -4 到 4 之间的整数
        // const z = Math.floor(Math.random() * 11) - 5;  // 生成 -5 到 5 之间的整数
        const z = parseFloat((Math.random() * 3 - 5.3).toFixed(2));  // 生成 -5.3 到 -2.3 之间的小数，并保留两位小数
        const coordinates = [x, y, z] as [number, number, number];
        // 如果坐标不存在于 exitCoordinates 中，则添加到 exitCoordinates 中
        let foundUnique = false;
        while (!foundUnique) {
            // 使用 JSON.stringify 来比较数组内容
            if (!exitCoordinates.some(coord => JSON.stringify(coord) === JSON.stringify(coordinates))) {
                setExitCoordinates(exitCoordinates => [...exitCoordinates, coordinates]);
                foundUnique = true;
            }
        }
        return { coordinates };
    };

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
                <MyButton click={handleClick} disable={isDsabled} />
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