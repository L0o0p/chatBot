import axios, { AxiosError } from "axios";
import { user } from "../../../store/chatBotStore";
interface getMessageProps {
    prompt: string;
    setPrompt: (arg0: string) => void
    // appendCard: (newCard: { emoji: string; title: string; content: string; }) => void;
    // setStatus: (arg0: string) => void;
    appendBubble: (content: string, position: number[]) => void
    position: number[]
}
// import { Text } from "@react-three/drei"
// import { useEffect } from "react";


//  定义一个数组，用来存放待处理文本（元素是行（数组））
// const chunk: string[] = []
// 要求一：要求行数不超过5
// chunk.len < 5
// 要求二：单个单词的长度限制——根据空格分割（即把每个单词分开）
// split by space
// ，每个单词长度不超过14
// max string len 14
// 要求三：总文本长度不超过45个字符
// const a = value.slice(45).split(' ')

// BubbleContent展示格式与处理
// export const formatContent = (inputContent: string) => {
//     let result = '';
//     const beforeResult = [];

//     // 控制总文本长度，先截取一波 'i am peter'
//     const sliceContent = inputContent.slice(0, 40);
//     // 正确按空格拆分单词
//     const content = sliceContent.split(' ');

//     let line: string[] = []; // 预存每一行的单词
//     let currentLength = 0; // 当前行的字符长度（包括空格）

//     content.forEach(word => {
//         // 如果添加这个单词会超过13个字符，则先将当前行保存
//         if (currentLength + word.length + (line.length > 0 ? 1 : 0) > 13) {
//             beforeResult.push(line.join(' '));
//             line = []; // 清空行数组
//             currentLength = 0; // 重置当前行长度
//         }
//         // 添加单词到当前行
//         line.push(word);
//         currentLength += word.length + (line.length > 1 ? 1 : 0); // 加1因为单词间的空格
//     });

//     // 添加最后一行（如果有）
//     if (line.length > 0) {
//         beforeResult.push(line.join(' '));
//     }

//     result = beforeResult.join('\n');
//     return { result };
// }
export const formatContent = (inputContent: string): string => {
    let result = '';
    const beforeResult = [];

    // 控制总文本长度，先截取一段文本
    const sliceContent = inputContent.slice(0, 40);

    let line = ''; // 预存每一行的文本
    let currentLength = 0; // 当前行的字符长度

    // 遍历截取的内容，每个汉字处理
    Array.from(sliceContent).forEach(char => {
        // 如果添加这个字符会超过13个字符，则先将当前行保存
        if (currentLength + 1 >7) {
            beforeResult.push(line);
            line = ''; // 清空行
            currentLength = 0; // 重置当前行长度
        }
        // 添加字符到当前行
        line += char;
        currentLength += 1; // 每个汉字计为一个单位
    });

    // 添加最后一行（如果有）
    if (line) {
        beforeResult.push(line);
    }

    result = beforeResult.join('\n');
    console.log('执行了');
    
    return result;
}
// 中文判断
function isChinese(char:string) {
    return /^[\u4e00-\u9fa5]$/.test(char);
}

export function firstThreeAreChinese(str:string) {
    if (str.length < 3) return false;
    return isChinese(str[0]) && isChinese(str[1]) && isChinese(str[2]);
}
//全中文判断
// export function isChinese(string: string) {
//     // 正则表达式匹配中文字符
//     const chineseRegex = /^[\u4e00-\u9fa5\u3400-\u4DBF\u{20000}-\u{2A6DF}\u{2A700}-\u{2B73F}\u{2B740}-\u{2B81F}\u{2B820}-\u{2CEAF}\u{2CEB0}-\u{2EBEF}\u{30000}-\u{3134F}]+$/u;

//     // 检查字符串是否全部由中文字符组成
//     return chineseRegex.test(string);
// }

// // 示例使用
// const string1 = '你好，世界';
// const string2 = 'Hello, 世界';

// console.log(isChinese(string1));  // 输出: true
// console.log(isChinese(string2));  // 输出: false

export async function getMessage(props: getMessageProps) {
    const { prompt, setPrompt, appendBubble, position } = props

    // console.log('prompt', prompt);
    if (!checkIfUrl(prompt)) {
        try {
            const { feedBack } = await sendMessage(prompt); // 获取发送消息到服务器的响应
            console.log('feedBack', feedBack);
            // setStatus(feedBack);
            appendBubble(feedBack, position)

        } catch (error) {
            console.error('Failed to send message:', error);
            // setResult('Error sending message');
        }
    } else {
        const getWebContent = await getWebInfo(prompt)
        console.log(getWebContent?.webContent);
        const webContent = getWebContent?.webContent
        if (webContent) setPrompt('帮我总结一下这个网页的信息和内容，并按照要求格式返回：' + webContent);

        try {
            const { feedBack } = await sendMessage(prompt); // 发送消息到服务器
            console.log('feedBack', feedBack);
            // setStatus(feedBack);
            appendBubble(feedBack, position)
        } catch (error) {
            console.error('Failed to send message:', error);
            // setResult('Error sending message');
        }
    }

}


// 方法：发送消息到服务器
async function sendMessage(prompt: getMessageProps["prompt"]) {
    const url = `${user.BASE_URL}/chat-messages`; // 替换为正确的 URL
    const data = {
        query: prompt,//"你好，我想了解更多信息。",
        response_mode: "blocking",
        user: "user123",
        auto_generate_name: true,
        inputs: {}
    };

    try {
        const response = await axios.post(
            url,
            data,
            {
                headers: { 'Authorization': `Bearer ${user.Authorization}` }
            });
        const feedBack = response.data.answer
        console.log('Response:', feedBack);
        return { feedBack }
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        if (axiosError.response) {
            console.error('Error Status:', axiosError.response.status);
            console.error('Error Data:', axiosError.response.data);
            return { feedBack: "Error: " + axiosError.response.data.message };  // 提供默认反馈
        } else if (axiosError.request) {
            console.error('No response received.');
            return { feedBack: "No response received" };  // 提供默认反馈
        } else {
            console.error('Error Message:', axiosError.message);
            return { feedBack: "Request setup error" };  // 提供默认反馈
        }
    }
}


// 方法：判断是否是网址
function checkIfUrl(input: string): boolean {
    const urlPattern = new RegExp(
        '(https?:\\/\\/)?' + // 协议
        '(([^:\\/\\s]+\\.)?([^:\\/\\s]+)\\.[^:\\/\\s]{2,}|' + // 域名
        'localhost|' + // 本地主机名
        '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}|' + // IPv4 地址
        '\\[?[a-fA-F0-9:]+\\]?)' + // IPv6 地址
        '(\\:\\d+)?' + // 端口号
        '(\\/[^\\s]*)?', // 路径
        'i' // 忽略大小写
    );

    return urlPattern.test(input);
}

// 方法：获取网页信息
const getWebInfo = async (url: string) => {
    let webContent;
    console.log('开始爬虫');
    if (!url) {
        alert('请输入一个有效的网址');
        return;
    }


    try {
        const response = await fetch('http://localhost:3000/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (response.ok) {
            webContent = JSON.stringify(data.texts, null, 2)
            console.log(webContent);

        } else {
            // setResult('爬虫失败：' + data.error);
        }
    } catch (error: unknown) {  // 使用 `any` 类型来避免类型检查问题
        let errorMessage = '未知错误';
        if (error && typeof error === 'object' && 'message' in error) {
            errorMessage = (error as Error).message;
            console.log(errorMessage);

        }
    }

    return { webContent }
};
