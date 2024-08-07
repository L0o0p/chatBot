import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useLoader } from "@react-three/fiber";
import * as THREE from 'three';

import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { ifClickShareAtom } from "../../store";

export const Air = () => {

    const glb_PATH = '/air.glb';
    const gltf = useLoader(GLTFLoader, glb_PATH);
    const airMixer = useRef<THREE.AnimationMixer | null>(null);
    const [airAnim, setAirAnim] = useState<THREE.AnimationAction>();

    const [ifClickShare] = useAtom(ifClickShareAtom)


    useEffect(() => {
        if (gltf.scene && gltf.animations.length > 0) {
            airMixer.current = new THREE.AnimationMixer(gltf.scene);
            setAirAnim(airMixer.current.clipAction(gltf.animations[0]))
            airAnim?.setLoop(THREE.LoopRepeat, 1);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gltf]);

    useEffect(() => {
        if (airAnim) {
            if (ifClickShare) {
                setTimeout(() => {
                    airAnim.play()
                }, 100)
            } else {
                airAnim.stop()
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ifClickShare])

    useFrame((_state, delta) => {
        if (airMixer.current) {
            airMixer.current.update(delta);
        }
    });

    return <primitive object={gltf.scene} />;
};



