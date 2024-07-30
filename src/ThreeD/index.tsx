import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from 'three'

export const ThreeD = () => {

    return (
        <Canvas
            // style={{ pointerEvents: 'none' }}
            shadows
        >
            <color attach="background" args={["#000000"]} />
            <Light />
            <Camera />
            <Objects />
        </Canvas>
    )
}

const Light = () => {
    return (
        <>
            <ambientLight intensity={1} />
            <pointLight position={[-2, -2, -2]} intensity={10} castShadow />
            <pointLight position={[-2, 2, 2]} intensity={10} castShadow />
        </>
    )
}


const Camera = () => {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null)

    return (
        <>
            <PerspectiveCamera
                makeDefault
                ref={cameraRef}
                position={[2, 2, 2]}
                fov={45}
                castShadow
                receiveShadow
            />
            <OrbitControls
                enabled={true}
            />
        </>
    )
}



const Objects = () => {
    return (
        <>
            <mesh castShadow receiveShadow>
                <boxGeometry />
                <meshStandardMaterial color={'hotpink'} />
            </mesh>
        </>
    )
}



