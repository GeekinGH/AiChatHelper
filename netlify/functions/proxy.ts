import { Context } from "@netlify/edge-functions";
import Gemini from "./Gemini";
import ChatGPT from "./ChatGPT";
import Qwen from "./Qwen";
import Kimi from "./Kimi";
import Claude3 from "./Claude3";
import GPT360 from "./GPT360";
import DeepSeek from "./DeepSeek";

// 从 Netlify 的环境变量中获取授权的微信ID
const wxidArray = process.env.WXID_ARRAY ? process.env.WXID_ARRAY.split(',') : [];

//360 API Key
const APIKEY360 = "";

// 全局范围定义 supportedModels（支持的模型） 对象
const supportedModels = {
    'gpt-3.5-turbo': ChatGPT,
    'gpt-4': ChatGPT,
    'GPT-4o': ChatGPT,
    'gemini-pro': Gemini,
    'gemini': Gemini,
    'gemini-1.5-pro-latest': Gemini,
    'gemini-1.5-flash': Gemini,
    'gemini-2.0-flash-exp': Gemini,
    'qwen-turbo': Qwen,
    'qwen-max': Qwen,
    'moonshot-v1-8k': Kimi,
    'moonshot-v1-32k': Kimi,
    'claude-3-opus-20240229': Claude3,
    '360gpt-pro': GPT360,
    'deepseek-chat': DeepSeek,
    'deepseek-reasoner': DeepSeek
};

// 全局范围定义 respondJsonMessage 函数
function respondJsonMessage(message) {
    const jsonMessage = {
        choices: [{
            message: {
                role: 'assistant',
                content: message,
            },
        }],
    };

    return new Response(JSON.stringify(jsonMessage), {
        headers: {
            "content-type": 'application/json; charset=utf-8',
        }
    });
}

export default async (request: Request, context: Context) => {
    try {
        const wxid = request.headers.get("wxid");
        if (!wxid) {
            throw new Error('您的请求不兼容于本服务');
        }
        // 判断 wxidArray 是否为空，如果为空则不进行授权验证，直接执行后续程序
        if (wxidArray.length > 0 && !wxidArray.includes(wxid)) {
            return respondJsonMessage('当您看到这个信息，说明您需要联系本服务提供者进行使用授权');
        }
        
        let requestAuthorization = request.headers.get("authorization");
        if (!requestAuthorization) {
            throw new Error('请提供API鉴权码');
        }
        
        const requestBody = await request.json();
        let requestModel = requestBody.model.toLowerCase().trim();
        const requestMessages = requestBody.messages;
        const lastMessage = requestMessages[requestMessages.length - 1].content.trim();

        // 判断是否需要文生图模式
        if (APIKEY360.length > 0 && lastMessage.startsWith("画")) {
            requestModel = "360gpt-pro";
            requestAuthorization = APIKEY360;
        }
        
        let response;
        const ModelClass = supportedModels[requestModel];
        if (ModelClass) {
            const modelInstance = new ModelClass(requestModel, requestAuthorization, requestMessages);
            response = await modelInstance.handleResponse(await getResponse(modelInstance.url, 'POST', modelInstance.headers, modelInstance.body));
            return respondJsonMessage(response);
        } else {
            return respondJsonMessage('不支持的 chat_model 类型');
        }
    } catch (error) {
        console.error('Error:', error); // 记录错误信息
        return respondJsonMessage(`出错了: ${error.toString()}`);
    }
}

async function getResponse(url, method, headers, body) {
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify(body),
    });

    if (response.status !== 200) {
        return respondJsonMessage(`HTTP Error: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
}
