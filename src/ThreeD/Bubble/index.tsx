import { motion } from "framer-motion-3d";
import { BubbleModel } from "./BubbleModel";
import { BubbleContent } from "./BubbleContent";
import { Float } from "@react-three/drei";
import { useBubble, BubbleProps } from "../../store/chatBotStore";
import { ThreeEvent } from "@react-three/fiber";


export const Bubble = () => {
    const { bubbleStore, changIsClicked } = useBubble();
    const matchStyle = (item: BubbleProps, isLastest: boolean, isClicked: boolean) => {
        // if (!item.ifVisible) return undefined;
        const bubblestyle = {
            color: isClicked ? 'white' : (isLastest ? 'white' : '#fcd7a0'),
            position: isClicked ? { x: -2.5, y: -3, z: 1, } : (isLastest ? { x: 0.5, y: 0, z: 0, } : { x: item.position[0], y: item.position[1], z: item.position[2] }),
            scale: [0, 1, isClicked ? 4 : (isLastest ? 1.2 : Math.random() * 0.2 + 0.7)],
            floatProps: {
                enabled: isClicked ? false : true,
                speed: isClicked ? 0 : (isLastest ? 0.2 : 1),
                rotationIntensity: isClicked ? 0 : (isLastest ? 0.2 : 0.8),
                floatIntensity: isClicked ? 0 : (isLastest ? 1 : 1),
                floatingRange: isClicked ? [0, 0] as [number, number] : (isLastest ? [-0.1, 0.1] as [number, number] : [-0.8, 0.8] as [number, number])
            },
            text: {
                fontSize: isClicked ? 0.2 : 0.66,
                textColor: isLastest ? '#CD853F' : '#D2B48C',
                textOpacity: isLastest ? 1 : .6,
                textCut: isClicked ? 300 : 40,//首次截取长度
                textlength: isClicked ? { en: 144, cn: 180 } : { en: 24, cn: 30 }, //二次截取长度
                lineLength: isClicked ? 20 : 7,// 每行字数限制
                lineHeight: isClicked ? 1.7 : 1.3 // 行高限制
            }
        };

        return bubblestyle;
    };

    // 方法：一键复制气泡内容到剪贴板
    const getCardContent = (x: string) => {
        const textToCopy = (x);// 需要复制的文本内容
        navigator.clipboard.writeText(textToCopy).then(() => {
            alert('气泡内容已成功复制到剪贴板');
        }).catch(err => {
            console.error('无法复制链接: ', err);
            alert('无法复制链接: ');
        });
    }
    // 回调事件：点击气泡触发
    const handleClickBubble = (event: ThreeEvent<MouseEvent>, index: number) => {
        changIsClicked(index)
        event.stopPropagation(); // 阻止事件继续传播
    }



    return (
        <>
            {bubbleStore.map((item, index) => {
                const style: styleProps = matchStyle(item, index === bubbleStore.length - 1, item.isClicked);
                return (
                    <Float
                        // enabled={false}
                        enabled={style.floatProps.enabled}
                        speed={style.floatProps.speed} // Animation speed, defaults to 1
                        rotationIntensity={style.floatProps.rotationIntensity} // XYZ rotation intensity, defaults to 1
                        floatIntensity={style.floatProps.floatIntensity} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                        floatingRange={style.floatProps.floatingRange} // Range of y-axis values the object will float within, defaults to 
                    >
                        <motion.group
                            animate={{
                                opacity: item.ifVisible ? 1 : 1,
                                scale: style.scale,
                                x: style.position.x,
                                y: style.position.y,
                                z: style.position.z
                            }}
                            key={index} // 更好的做法是使用 bubble 的唯一 ID
                            onClick={(event) => handleClickBubble(event, index)}
                            onContextMenu={() => getCardContent(item.content)}
                        // onClick={() => getCardContent(item.content)}
                        >

                            {/* <BubbleModel color={index === bubbleStore.length - 1 ? 'lightgray' : '#fcd7a0'} /> */}
                            <BubbleModel color={style?.color} />
                            <BubbleContent
                                status={item.content}
                                textColor={style.text.textColor}
                                textOpacity={style.text.textOpacity}
                                fontSize={style.text.fontSize}
                                textlength={style.text.textlength}
                                lineLength={style.text.lineLength}
                                textCut={style.text.textCut}
                                lineHeight={style.text.lineHeight}
                            />
                        </motion.group>
                    </Float >
                )
            }
            )}
        </>
    );
};

interface styleProps {
    color: string,
    position: { x: number, y: number, z: number, },
    scale: number[],
    floatProps: {
        enabled: boolean,
        speed: number,
        rotationIntensity: number,
        floatIntensity: number,
        floatingRange: [number, number]
    }
    text: {
        lineHeight: number;
        lineLength: number;
        textCut: number;
        textlength: { en: number; cn: number; };
        textColor: string;
        textOpacity: number;
        fontSize: number,
    }
}
// const bubbleStyles = {
//     // initBubble
//     initial: {
//         color: 'white',
//         position: { x: 0.5, y: 0, z: 0, },
//         scale: [0, 1.2, 1],
//         floatProps: {
//             enabled: true,
//             speed: 0.2,
//             rotationIntensity: 0.5,
//             floatIntensity: 1,
//             floatingRange: [-0.1, 0.1]
//         }
//     },
//     // backBubble
//     background: {
//         color: '#fcd7a0',
//         position: { x: item.position.x, y: item.position.x, z: item.position.x, },
//         scale: [0, 1, Math.random() * 0.2 + 0.7],
//         floatProps: {
//             enabled: true,
//             speed: 1,
//             rotationIntensity: 3,
//             floatIntensity: 1,
//             floatingRange: [-1, 1]
//         }
//     },
//     // hightlightBubble
//     hightlight: {
//         color: 'red',
//         position: { x: -2.5, y: -3, z: 1, },
//         scale: [0, 4.5, 4],
//         floatProps: {
//             enabled: false,
//             speed: 0,
//             rotationIntensity: 0,
//             floatIntensity: 0,
//             floatingRange: [0, 0]
//         }
//     }
// }
