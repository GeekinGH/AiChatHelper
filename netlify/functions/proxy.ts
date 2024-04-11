import { Context } from "@netlify/edge-functions";
import Gemini from "./Gemini";
import ChatGPT from "./ChatGPT";
import Qwen from "./Qwen";
import Kimi from "./Kimi";
import Claude3 from "./Claude3";
import GPT360 from "./GPT360";

// 从 Netlify 的环境变量中获取授权的微信ID
const wxidArray = process.env.WXID_ARRAY ? process.env.WXID_ARRAY.split(',') : [];

//360 API Key
const APIKEY360 = "";

// 全局范围定义 supportedModels（支持的模型） 对象
const supportedModels = {
    'gpt-3.5-turbo': ChatGPT,
    'gpt-4': ChatGPT,
    'gemini-pro': Gemini,
    'gemini': Gemini,
    'gemini-1.5-pro-latest': Gemini,
    'qwen-turbo': Qwen,
    'qwen-max': Qwen,
    'moonshot-v1-8k': Kimi,
    'moonshot-v1-32k': Kimi,
    'claude-3-opus-20240229': Claude3,
    '360gpt-pro': GPT360
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
            throw new Error('未提供 wxid 头部信息');
        }
        // 判断 wxidArray 是否为空，如果为空则不进行授权验证，直接执行后续程序
        if (wxidArray.length > 0 && !wxidArray.includes(wxid)) {
            return respondJsonMessage('我是狗，偷接口，偷了接口当小丑～');
        }
        
        let requestAuthorization = request.headers.get("authorization");
        if (!requestAuthorization) {
            throw new Error('未提供 API Key');
        }
        
        const requestBody = await request.json();
        let requestModel = requestBody.model.toLowerCase().trim();
        const requestMessages = requestBody.messages;
        const lastMessage = requestMessages[requestMessages.length - 1].content.trim();

        // 判断是否需要文生图模式
        if (APIKEY360 !== "" && lastMessage.startsWith("画")) {
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
    const responseData = await response.json();
    return responseData;
}
