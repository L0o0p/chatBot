import { Canvas } from "@react-three/fiber"
import { useFrame } from "@react-three/fiber";
import { Character } from "./Character"
import { Air } from "./Air"
import {
    OrbitControls,
    // OrbitControls, OrthographicCamera,
    PerspectiveCamera
} from "@react-three/drei"
import { useEffect, useRef } from "react"
import * as THREE from 'three'
import { useAtom } from "jotai"
import { motion } from "framer-motion-3d";
import { Bubble } from "./Bubble"
import { ifClickShareAtom } from "../store"
import { BgElement } from "./BgElement"
import { isTalkingAtom } from "@store/chatBotStore"

export const ThreeD = () => {

    return (
        <Canvas
            style={{
                position: "absolute",
                // pointerEvents: 'none'
            }}
            shadows
        >
            <color attach="background" args={['#ffbd5d']} />
            <Light />
            <Camera />
            <Objects />
        </Canvas>
    )
}

const Light = () => {
    return (
        <>
            <ambientLight intensity={Math.PI / 2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} castShadow />
            <pointLight position={[2, 3, 3]} decay={0} intensity={Math.PI} castShadow />
            <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} castShadow />
            <ambientLight intensity={1} />
        </>
    )
}


const Camera = () => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)
    const [ifClickShare] = useAtom(ifClickShareAtom)
    const [isTalking] = useAtom(isTalkingAtom)
    const initCamera = {
        position: { x: -1, y: 1, z: 12 },
        target: { x: 0, y: -0.8, z: 0 },
    }

    // 触发：讲话时候重置镜头
    useEffect(() => {
        if (cameraRef?.current) { cameraRef?.current.position.set(initCamera.position.x, initCamera.position.y, initCamera.position.z) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTalking])

    // 动画框架，用于更新位置和缩放
    useFrame((state) => {
        state.camera.position.lerp(initCamera.position, 0.04);
        state.camera.lookAt(initCamera.target.x, initCamera.target.y, initCamera.target.z);
    });

    return (
        <>
            <motion.group
                animate={{
                    z: ifClickShare ? 10 : 0,
                    transition: {
                        duration: ifClickShare ? .8 : .2,
                    }
                }}
            >
                {/* <OrthographicCamera
                    makeDefault
                /> */}
                <PerspectiveCamera
                    makeDefault
                    ref={cameraRef}
                    position={[0.32, 1.4, 12]}
                    rotation={[-Math.PI / 16, 0, 0]}
                    fov={45}
                    castShadow
                    receiveShadow
                />
            </motion.group>
            <OrbitControls
                // makeDefault
                // enabled={true}
                target={[0, -2, 0]}
                regress={false}
                maxDistance={20}
                minDistance={10}
                dampingFactor={.5}
                enableDamping={true}
                panSpeed={.1}
            />
        </>
    )
}



const Objects = () => {

    return (
        <>
            <group position={[0 + 2, 2, -2]}>
                <Bubble />
            </group>
            <group
                scale={8}
                position={[0, -13, 0 - 2]}
            >
                <Character />
                <Air />
                {/* 背景的气泡 */}
                <BgElement />
            </group>
        </>
    )
}



