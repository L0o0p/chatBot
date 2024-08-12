import { Text } from "@react-three/drei"
import { useEffect, useMemo, useState } from "react"
import { moreThanOneThirdChinese, formatContent } from "../../Interface/TextApp/functions/getMessage";
interface Props {
    status: string;
    textColor: string
    textOpacity: number
    fontSize: number
    textlength: { en: number, cn: number }
    textCut: number
    lineLength: number
    lineHeight: number
}
export const BubbleContent = (props: Props) => {
    const { status, textColor, textOpacity, fontSize, textlength, textCut, lineLength, lineHeight } = props
    const [content, setContent] = useState('')
    // const [result, setResult] = useState()
    // const [lang, setLang] = useState(false)
    const [charaLimit, setCharaLimit] = useState(20)
    const result = useMemo(() => {
        // 判断是否为中文
        const lang = moreThanOneThirdChinese(status)
        if (lang) {
            console.log('是否判断为CN：', lang, '此时字数限制', textlength);
            setCharaLimit(textlength.cn)
            return formatContent(status, textCut, lineLength)
        }
        else {
            setCharaLimit(textlength.en)
            return status
        }
    }, [lineLength, status, textCut, textlength])

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
        }, 20);
        return () => clearInterval(timer);
    }, [result]);


    let sliced = content
    if (content.length > charaLimit) {
        sliced = content.slice(0, charaLimit) + '...'
    }
    return (
        <Text
            scale={.35}
            position={[0.1, 0, .42]}
            maxWidth={5}
            color={textColor}//#D2B48C, #CD853F,#8B4513
            fontSize={fontSize}
            fillOpacity={textOpacity}
            lineHeight={lineHeight}
        >
            {sliced}
        </Text>
    )
}

//https://github.com/protectwise/troika/tree/main/packages/troika-three-text