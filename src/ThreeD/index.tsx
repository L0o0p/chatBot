import { Canvas } from "@react-three/fiber"
import { Character } from "./Character"
import { Air } from "./Air"
import {
    OrbitControls,
    // OrbitControls, OrthographicCamera,
    PerspectiveCamera
} from "@react-three/drei"
import { useRef } from "react"
import * as THREE from 'three'
import { useAtom } from "jotai"
import { motion } from "framer-motion-3d";
import { Bubble } from "./Bubble"
import { ifClickShareAtom } from "../store"
import { BgElement } from "./BgElement"

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
            <OrbitControls makeDefault enabled={true} target={[0, -2, 0]} />
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



