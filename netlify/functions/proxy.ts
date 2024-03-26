import { Context } from "@netlify/edge-functions";
import Gemini from "./Gemini";
import ChatGPT from "./ChatGPT";
import Qwen from "./Qwen";
import Kimi from "./Kimi";
import Claude3 from "./Claude3";

// 从 Netlify 的环境变量中获取授权的微信ID
const wxidArray = process.env.WXID_ARRAY ? process.env.WXID_ARRAY.split(',') : [];

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
        const requestAuthorization = request.headers.get("authorization");
        const requestBody = await request.json();
        const requestModel = requestBody.model.toLowerCase().trim();
        const countryName = context.geo?.country?.name || "somewhere in the world";

        // 判断 wxidArray 是否为空，如果为空则不进行授权验证，直接执行后续程序
        if (wxidArray.length > 0 && !wxidArray.includes(wxid)) {
            return respondJsonMessage('我是狗，偷接口，偷了接口当小丑～');
        }

        let response;
        if (requestModel === 'gpt-3.5-turbo' || requestModel === 'gpt-4') {
            const chatGPT = new ChatGPT(requestModel, requestAuthorization, requestBody.messages);
            response = await chatGPT.handleResponse(await getResponse(chatGPT.url, 'POST', chatGPT.headers, chatGPT.body));
        } else if (requestModel === 'gemini-pro' || requestModel === 'gemini') {
            const gemini = new Gemini(requestModel, requestAuthorization, requestBody.messages);
            response = await gemini.handleResponse(await getResponse(gemini.url, 'POST', gemini.headers, gemini.body));
        } else if (requestModel === 'qwen-turbo' || requestModel === 'qwen-max') {
            const qwen = new Qwen(requestModel, requestAuthorization, requestBody.messages);
            response = await qwen.handleResponse(await getResponse(qwen.url, 'POST', qwen.headers, qwen.body));
        }  else if (requestModel === 'moonshot-v1-8k' || requestModel === 'moonshot-v1-32k') {
            const kimi = new Kimi(requestModel, requestAuthorization, requestBody.messages);
            response = await kimi.handleResponse(await getResponse(kimi.url, 'POST', kimi.headers, kimi.body));
        }  else if (requestModel === 'claude-3-opus-20240229') {
            const claude3 = new Claude3(requestModel, requestAuthorization, requestBody.messages);
            response = await claude3.handleResponse(await getResponse(claude3.url, 'POST', claude3.headers, claude3.body));
        } else {
            return respondJsonMessage('不支持的 chat_model 类型');
        }

        return respondJsonMessage(response);
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
