import { Text } from "@react-three/drei"
import { useEffect, useState } from "react"
import { firstThreeAreChinese, formatContent } from "../../Interface/TextApp/functions/getMessage";
interface Props {
    status: string;
    textColor: string
    textOpacity: number
}
export const BubbleContent = (props: Props) => {
    const { status, textColor, textOpacity } = props
    const [content, setContent] = useState('')
    const [result, setResult] = useState(status)
    const [lang, setLang] = useState(false)
    const [charaLimit, setCharaLimit] = useState(20)

    // 判断是否为中文
    useEffect(() => {
        setLang(firstThreeAreChinese(result))
        if (firstThreeAreChinese(result)) {
            const x = formatContent(result)
            setResult(x)
            console.log('是否判断为CN：', lang);
            setCharaLimit(30)
        }
        else {
        setCharaLimit(24)
        }
    }, [status])

    // 完整的文本内容
    // 打字机效果
    useEffect(() => {
        const timeout = setTimeout(() => {
            setContent(result.slice(0, content.length + 1));
        }, 100);
        return () => clearTimeout(timeout);
    }, [content, result]);

    let sliced = content
    if (content.length > charaLimit) {
        sliced = content.slice(0, charaLimit) + '...'
    }
    return (
        <Text
            scale={.35}
            position={[0.2, 0, .42]}
            maxWidth={5}
            color={textColor}//#D2B48C, #CD853F,#8B4513
            fontSize={.66}
            fillOpacity={textOpacity}
            lineHeight={1.3}
        >
            {sliced}
        </Text>
    )
}

//https://github.com/protectwise/troika/tree/main/packages/troika-three-text