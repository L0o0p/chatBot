import { Cylinder, Float } from "@react-three/drei";

export const BgElement = () => {

    return <>
        <FloatBall color={"#fcd7a0"} position={[-.7, 1.3, 0 - 1]} scale={.1} />
        <FloatBall color={"#fcd7a0"} position={[.7, 1.8, 0]} scale={.1} />
        <FloatBall color={"#fa8e19"} position={[-.6, 1.2, 0]} scale={.13} />
        <FloatBall color={"#fcd7a0"} position={[1.3, 1.1, 0 - .6]} scale={.1} />
        <FloatBall color={"#fcd7a0"} position={[-.8, 2, 0]} scale={.1} />
        <FloatCylinder color={"#f98d17"}
            scale={1}
            position={[0.55, 1.6, .85]}
            rotation={[-Math.PI / 20, 0, Math.PI / 5]}
        />
        <FloatCylinder color={"#f98d17"}
            scale={.8}
            position={[0.55, 1.9, -.1]}
            rotation={[-Math.PI / 20, 0, -Math.PI / 4]}
        />
        <FloatCylinder color={"#f98d17"}
            scale={.7}
            position={[-0.55, 1.6, .65]}
            rotation={[-Math.PI / 20, 0, -Math.PI / 2.5]}
        />
    </>
};

interface FloatElementProps {
    position: number[],
    scale: number
    color: string
}
const FloatBall = (props: FloatElementProps) => {
    const { position, scale, color } = props;
    return (
        <Float
            speed={.4} // Animation speed, defaults to 1
            rotationIntensity={.4} // XYZ rotation intensity, defaults to 1
            floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
            floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to 
        >
            <mesh position={position} rotation={[0, 0, 0]} scale={scale} >
                <sphereGeometry args={[1, 32, 32]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </Float>
    )
}


interface FloatCylinderProps {
    position: number[],
    scale: number,
    color: string,
    rotation: number[]
}
const FloatCylinder = (props: FloatCylinderProps) => {
    const { position, scale, color, rotation } = props;
    const list = [
        {}, {}, {}
    ]
    return (

        <Float
            speed={.4} // Animation speed, defaults to 1
            rotationIntensity={.4} // XYZ rotation intensity, defaults to 1
            floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
            floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to
        >
            <group position={position} scale={scale} rotation={rotation}>
                {list.map((item, index) => {
                    const x = 0 + index * 0.03 // 确保位置根据 index 变化
                    return (
                        <Cylinder
                            key={index}
                            args={[.02, .02, .5]}
                            position={[x, 0, 0]}
                            scale={.5}
                        >
                            <meshStandardMaterial color={color} />
                        </Cylinder>
                    )
                })
                }
            </group>
        </Float>
    )
}






