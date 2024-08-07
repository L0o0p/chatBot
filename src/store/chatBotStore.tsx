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
    content: "Hello," + "\n" + " I' m Tim",
    ifVisible: true,
    position: [0, -1, -5]
}]

export interface Bubble {
    content: string;
    ifVisible: boolean;
    position: number[]
}
type BubbleStore = {
    content: string;
    ifVisible: boolean;
    position: number[]
}[];
export const defaultBubbleStoreAtom = atom<BubbleStore>(a);
export const useBubble = () => {
    const [bubbleStore, setBubbleStore] = useAtom(defaultBubbleStoreAtom)
    const appendBubble = (content: string, position: number[]) => {
        const bubble: Bubble = {
            content,
            ifVisible: true,
            position
        }
        setBubbleStore(bubbleStore => [...bubbleStore, bubble])
    }
    if (bubbleStore.length > 12) {
        // 当bubble数量大于5个，则删除最老的bubble
        setBubbleStore(bubbleStore => bubbleStore.slice(1))
     }
    return {
        bubbleStore,
        setBubbleStore,
        appendBubble
    }
}

export const isTalkingAtom = atom(false)


