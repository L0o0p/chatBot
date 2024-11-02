import { atom, useAtom } from "jotai";


export const baseUrl = "http://localhost:3000";



// 是否等待状态
export const isLoadingAtom = atom<boolean>(false);

export const ifClickShareAtom = atom<boolean>(false);



// 对话泡 && characterAnimation
export const showBubbleAtom = atom(false)

// 气泡文本内容
export const statusAtom = atom("Hello," + "\n" + " I' m Tim")
// 角色动画
export const characterAnimationAtom = atom('idle')

import { AnimationAction } from "three";

// 定义 actions 和 actionIndex 两个 Atom
export const actionsAtom = atom<AnimationAction[]>([]);

export const actionIndexAtom = atom(2); // 初始化为 0 或任意有效的默认索引

export const useAction = () => {
    const [actions, setActions] = useAtom(actionsAtom);
    const [actionIndex, setActionIndex] = useAtom(actionIndexAtom);
    const nextActionIndex = (actionIndex + 1) % (actions.length || 1);

    // 直接在组件中计算当前动作，而不是创建一个新的 Atom
    const currentAction = actions[actionIndex] || null;
    const nextAction = actions[nextActionIndex] || null;
    const setCurrentAction = (action: AnimationAction) => {
        setActions(prevActions => {
            const newActions = [...prevActions];
            newActions[actionIndex] = action;
            return newActions;
        });
    };

    // 返回所有相关状态和设置函数
    return { actions, setActions, actionIndex, setActionIndex, currentAction, setCurrentAction, nextActionIndex, nextAction };
}

export const clickAtom = atom(false);