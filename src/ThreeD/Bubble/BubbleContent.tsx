import { Text } from "@react-three/drei"
import { useEffect, useMemo, useState } from "react"
import { firstThreeAreChinese, formatContent } from "../../Interface/TextApp/functions/getMessage";
interface Props {
    status: string;
    textColor: string
    textOpacity: number
}
export const BubbleContent = (props: Props) => {
    const { status, textColor, textOpacity } = props
    const [content, setContent] = useState('')
    // const [result, setResult] = useState()
    // const [lang, setLang] = useState(false)
    const [charaLimit, setCharaLimit] = useState(20)
    const result = useMemo(() => {
        // 判断是否为中文
        const lang = firstThreeAreChinese(status)
        if (lang) {
            console.log('是否判断为CN：', lang);
            setCharaLimit(30)
            return formatContent(status)
        }
        else {
            setCharaLimit(24)
            return status
        }
    }, [status])

    // 完整的文本内容
    // 打字机效果
    useEffect(() => {
        let contentLen = 0;
        const timer = setInterval(() => {
            if (contentLen > result.length) {
                clearInterval(timer);
            }
            else {
                setContent(result.slice(0, contentLen))
                contentLen++
            }
        }, 100);
        return () => clearInterval(timer);
    }, [result]);


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