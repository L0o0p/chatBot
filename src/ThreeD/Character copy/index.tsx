import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from 'three';
import { useAtom } from "jotai";
import { ifClickShareAtom, isLoadingAtom, isPlayingAtom, useAction } from "@store";
import { isTalkingAtom } from "@store/chatBotStore";

export const Character = () => {
    const { actions, setActions } = useAction()
    const [ifClickShare] = useAtom(ifClickShareAtom)

    const glb_PATH = '/waterGuy.glb';
    const gltf = useLoader(GLTFLoader, glb_PATH);
    const expGltf = useLoader(GLTFLoader, '/expression.glb');
    const mixer = useRef<THREE.AnimationMixer | null>(null); // 使用 useRef 避免重复创建
    const [isPlay] = useAtom(isPlayingAtom)
    const [isLoading] = useAtom(isLoadingAtom)
    const [isTaliking] = useAtom(isTalkingAtom)
    // 动画文件加载
    useEffect(() => {
        if (gltf.scene && gltf.animations.length > 0) {
            mixer.current = new THREE.AnimationMixer(gltf.scene);
            // console.log('gltf.animations', gltf.animations);

            const loadAnim = mixer.current.clipAction(gltf.animations[0]);
            const singAnim = mixer.current.clipAction(expGltf.animations[0]);
            const standAnim = mixer.current.clipAction(gltf.animations[2]);
            const throwAnim = mixer.current.clipAction(gltf.animations[3]);
            const talkAAnim = mixer.current.clipAction(gltf.animations[4]);
            const talkBAnim = mixer.current.clipAction(gltf.animations[5]);
            const thinkAnim = mixer.current.clipAction(gltf.animations[6]);
            const actionsA = [loadAnim, singAnim, standAnim, throwAnim, talkAAnim, talkBAnim, thinkAnim];
            setActions(actionsA);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 初始化动画
    useEffect(() => {
        if (actions.length > 0) {
            initializeAnimations(actions[0], actions[1], actions[2], actions[3], actions[4], actions[5], actions[6])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actions])
    const [currentIndex, setCurrentIndex] = useState(2)

    //  函数：动画初始化播放
    function initializeAnimations(
        loadAnim: THREE.AnimationAction,
        singAnim: THREE.AnimationAction,
        standAnim: THREE.AnimationAction,
        throwAnim: THREE.AnimationAction,
        talkAAnim: THREE.AnimationAction,
        talkBAnim: THREE.AnimationAction,
        thinkAnim: THREE.AnimationAction) {

        setWeight(loadAnim, 0);
        setWeight(singAnim, 0);
        setWeight(standAnim, 1);
        setWeight(throwAnim, 0);
        setWeight(talkAAnim, 0);
        setWeight(talkBAnim, 0);
        setWeight(thinkAnim, 0);

        actions.forEach(function (action: { play: () => void; }) {
            action.play();
        });
    }

    // 函数：设置权重
    function setWeight(action: { enabled: boolean; setEffectiveTimeScale: (arg0: number) => void; setEffectiveWeight: (arg0: number) => void; }, weight: number) {
        action.enabled = true;
        action.setEffectiveTimeScale(1);
        action.setEffectiveWeight(weight);
    }

    // 函数：动画交叉淡入淡出
    function prepareCrossFade(startAction: THREE.AnimationAction, endAction: THREE.AnimationAction, defaultDuration = 0.4) {

        if (!startAction || !endAction) return; // 确保动作有效
        // Switch default / custom crossfade duration (according to the user's choice)

        const duration = defaultDuration;//setCrossFadeDuration(defaultDuration);

        // Make sure that we don't go on in singleStepMode, and that all actions are unpaused

        // singleStepMode = false;
        unPauseAllActions();

        // If the current action is 'idle' (duration 4 sec), execute the crossfade immediately;
        // else wait until the current action has finished its current loop
        executeCrossFade(startAction, endAction, duration);
    }

    // 函数：暂停所有动作
    function unPauseAllActions() {
        actions.forEach((action: { paused: boolean; }) => {
            action.paused = false;
        });
    }

    // 函数：执行动画
    function executeCrossFade(startAction: THREE.AnimationAction, endAction: THREE.AnimationAction, duration: number) {
        if (startAction && endAction) {
            setWeight(endAction, 1);
            endAction.time = 0;// 设置本次动画开始时间（从第0秒开始）
            startAction.crossFadeTo(endAction, duration, true);// 从「动画A」到「动画B」，过渡时间为duration秒
        }
    }



    // 触发动画：播放/暂停
    useEffect(() => {
        if (isPlay && !isLoading) {
            prepareCrossFade(actions[currentIndex], actions[1], 0.4)
            setCurrentIndex(1)
            console.log(actions[1]);
            console.log(isPlay);

        } else {
            prepareCrossFade(actions[currentIndex], actions[2], 0.4)
            setCurrentIndex(2)
            console.log(actions[2]);
            console.log(isPlay);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlay]);

    // 触发动画：加载
    useEffect(() => {
        if (isLoading) {
            prepareCrossFade(actions[currentIndex], actions[0], 0.4)
            setCurrentIndex(0)
        } else {
            prepareCrossFade(actions[currentIndex], actions[2], 0.4)
            setCurrentIndex(2)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    // 触发动画：分享
    useEffect(() => {
        if (ifClickShare) {
            prepareCrossFade(actions[currentIndex], actions[3], 0.4)
            actions[3].loop = THREE.LoopOnce;
            setCurrentIndex(3)
            // setTimeout(() => {
            //     setIfClickShare(false)
            //     prepareCrossFade(actions[currentIndex], actions[2], 0.4)
            //     setCurrentIndex(2)
            // }, 3000)
        }
        else {
            prepareCrossFade(actions[currentIndex], actions[2], 0.4)
            setCurrentIndex(2)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ifClickShare]);
    useFrame((_, delta) => {
        mixer.current?.update(delta); // 更新动画
    });

    // 触发动画：讲话
    useEffect((fromAnimationList = [3, 4], toAnimation = 2) => {
        const fromAnimation = fromAnimationList[Math.floor(Math.random() * fromAnimationList.length)]
        if (isTaliking) {
            prepareCrossFade(actions[currentIndex], actions[fromAnimation], 0.4)
            actions[fromAnimation].loop = THREE.LoopOnce;
            setCurrentIndex(fromAnimation)
        }
        else {
            prepareCrossFade(actions[currentIndex], actions[toAnimation], 0.4)
            setCurrentIndex(toAnimation)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isTaliking]);
    useFrame((_, delta) => {
        mixer.current?.update(delta); // 更新动画
    });


    return <><primitive object={gltf.scene} /></>
};


