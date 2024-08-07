import { motion } from "framer-motion-3d";
import { BubbleModel } from "./BubbleModel";
import { BubbleContent } from "./BubbleContent";
import { Float } from "@react-three/drei";
import { useBubble } from "../../store/chatBotStore";

export const Bubble = () => {
    const { bubbleStore } = useBubble();
    const bubbleScaleFunction = (isVisible: boolean, isLastest: boolean) => {
        let bubbleScale;
        if (isVisible && isLastest) {
            bubbleScale = [0, 1.2, 1]
        }
        else if (isVisible && !isLastest) {
            const random = Math.random() * 0.2 + 0.7;
            bubbleScale = [0, 1, random]
        } else {
            bubbleScale = 0
        }
        return (bubbleScale)
    }

    return (
        <>
            {bubbleStore.map((item, index) => {
                
                return (
                    <motion.group
                        animate={{
                            opacity: item.ifVisible ? 1 : 1,
                            scale: bubbleScaleFunction(item.ifVisible, index === bubbleStore.length - 1),
                            x: index === bubbleStore.length - 1 ? 0.5 : item.position[0],
                            y: index === bubbleStore.length - 1 ? 0 : item.position[1],
                            z: index === bubbleStore.length - 1 ? 0 : item.position[2]
                        }}
                        key={index} // 更好的做法是使用 bubble 的唯一 ID
                    >
                        <Float
                            speed={index === bubbleStore.length - 1 ? 1 : .2} // Animation speed, defaults to 1
                            rotationIntensity={index === bubbleStore.length - 1 ? .5 : 3} // XYZ rotation intensity, defaults to 1
                            floatIntensity={index === bubbleStore.length - 1 ? 1 : 1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
                            floatingRange={index === bubbleStore.length - 1 ? [-0.1, 0.1] : [-1, 1]} // Range of y-axis values the object will float within, defaults to 
                        >
                            <BubbleModel color={index === bubbleStore.length - 1 ? 'lightgray' : '#fcd7a0'} />
                            <BubbleContent
                                status={item.content}
                                textColor={index === bubbleStore.length - 1 ?
                                    '#CD853F' : '#D2B48C'}
                                textOpacity={index === bubbleStore.length - 1 ?
                                    1 : .6}
                            />
                        </Float >
                    </motion.group>)
            }
            )}
        </>
    );
};
//#D2B48C, #CD853F,#8B4513
// import { useFrame } from "@react-three/fiber";
// import { useRef } from "react";
// import * as THREE from 'three'

// export const Bubble = () => {
//     const { bubbleStore } = useBubble();
//     const ref = useRef<THREE.Group>(null);

//     // 使用useFrame来更新位置
//     useFrame(() => {
//         if (ref.current) {
//             bubbleStore.forEach((item, index) => {
//                 const targetPosition = new THREE.Vector3(...item.position);
//                 ref.current?.position.lerp(targetPosition, 0.1); // 0.1是插值因子，控制动画速度

//             });
//         }
//     });

//     return (
//         <>
//             {bubbleStore.map((item, index) => (
//                 <group
//                     ref={ref}
//                     key={index}
//                 >
//                     <Float>
//                         <BubbleModel color={index === bubbleStore.length - 1 ? 'lightgray' : 'gray'} />
//                         <BubbleContent status={item.content} />
//                     </Float>
//                 </group>
//             ))}
//         </>
//     );
// };

