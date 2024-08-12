import { atom, useAtom } from "jotai";

// 输入内容状态
export const promptAtom = atom<string>('');
// 输出内容状态(标题+内容)
export const resultAtom = atom<{
    emoji: string;
    title: string;
    content: string;
}>({
    emoji: '😬',
    title: 'AI#dea  Title',
    content: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed ipsa et doloremque cumque fugit nemo, temporibus enim minima adipisci ad accusamus tempore? Quae illo doloremque tenetur, adipisci dignissimos maxime voluptatibus?'
});

// GPT访问信息
export const user = {
    BASE_URL: "https://dify.cyte.site:2097/v1",
    Authorization: 'app-Isp6UXSfBYvUSQcXC85ZwYRQ'
}

// 卡片管理
// 预设 bubble 列表
const a: BubbleStore = [{
    content: "Hello," + "\n" + " I' m Juliyet",
    ifVisible: true,
    position: [0.5, -0, -5],
    isClicked: false,
}]

export interface BubbleProps {
    content: string;
    ifVisible: boolean;
    position: [number, number, number]
    isClicked: boolean,
}
type BubbleStore = {
    content: string;
    ifVisible: boolean;
    position: [number, number, number]
    isClicked: boolean,
}[];
export const defaultBubbleStoreAtom = atom<BubbleStore>(a);
export const useBubble = () => {
    const [bubbleStore, setBubbleStore] = useAtom(defaultBubbleStoreAtom)
    // 函数:追加新的气泡（仅改变contetnt和position属性）
    const appendBubble = (content: string, position: [number, number, number]) => {
        const bubble: BubbleProps = {
            content,
            ifVisible: true,
            position,
            isClicked: false
        }
        setBubbleStore(bubbleStore => [...bubbleStore, bubble])
    }
    // 函数:改变指定气泡的isClicked属性
    const changIsClicked = (x: number) => {
        setBubbleStore(bubbleStore.map((item, index) => {
            if (index === x) {
                return { ...item, isClicked: !item.isClicked };
            }
            else {
                return { ...item, isClicked: false };
            }
            return item
        }
        ))
    }
    // 规则：自动迭代气泡
    if (bubbleStore.length > 12) {
        // 当bubble数量大于5个，则删除最老的bubble
        setBubbleStore(bubbleStore => bubbleStore.slice(1))
    }

    return {
        bubbleStore,// 对象：bubbleStore 是一个数组，数组中的元素是Bubble类型
        setBubbleStore,// 函数：设置bubbleStore
        appendBubble, // 函数：追加一个Bubble到bubbleStore
        changIsClicked // 函数：改变指定气泡的isClicked属性
    }
}

export const isTalkingAtom = atom(false)

