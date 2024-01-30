import { Context } from "@netlify/edge-functions";

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
            }
        ],
    };

    return new Response(JSON.stringify(jsonMessage), {
        headers: {
            "content-type": 'application/json; charset=utf-8',
        }
    });
}

export default async(request: Request, context: Context) => {
    try {
        const wxid = request.headers.get("wxid");
        if (!wxid) {
            throw new Error('未提供 wxid 头部信息');
        }
        const chatAuthorization = request.headers.get("authorization");
        const apiKey = chatAuthorization ? chatAuthorization.replace('Bearer ', '') : '';
        const requestBody = await request.json();
        const chatModel = requestBody.model.toLowerCase().trim();
        const countryName = context.geo?.country?.name || "somewhere in the world";

        // 判断 wxidArray 是否为空，如果为空则不进行授权验证，直接执行后续程序
        if (wxidArray.length > 0 && !wxidArray.includes(wxid)) {
            return respondJsonMessage('我是狗，偷接口，偷了接口当小丑～');
        }

        if (chatModel === 'gpt-3.5-turbo' || chatModel === 'gpt-4') {
            return handleChatGPTRequest(requestBody, chatModel, chatAuthorization);
        } else if (chatModel === 'gemini-pro' || chatModel === 'gemini') {
            return handleGeminiRequest(requestBody, chatModel, apiKey);
        } else if (chatModel === 'qwen-turbo' || chatModel === 'qwen-max') {
            return handleQwenRequest(requestBody, chatModel, chatAuthorization);
        } else {
            return respondJsonMessage('不支持的 chat_model 类型');
        }
    } catch (error) {
        return respondJsonMessage(`出错了: ${error.toString()}`);
    }
}

async function handleChatGPTRequest(requestBody, chatModel, apiKey) {
    const url = 'https://api.openai.com/v1/chat/completions';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey,
            },
            body: JSON.stringify({
                'model': chatModel,
                'messages': requestBody.messages,
            }),
        });
        const responseData = await response.json();

        // 判断是否有错误信息
        if (responseData.error) {
            // 处理错误逻辑
            const errorMessage = responseData.error.message || '未知错误';
            return respondJsonMessage(`${chatModel}: ${errorMessage}`);
        }

        // 如果没有错误，返回 ChatGPT API 的响应
        return new Response(JSON.stringify(responseData));
    } catch (error) {
        return respondJsonMessage(`${chatModel}: ${error.toString()}`);
    }
}

function formatMessagesForGemini(messages) {
    let formattedMessages = [];
    messages.forEach((item, index) => {
        if (index === 0) {
            formattedMessages.push({
                'role': 'user',
                'parts': [{
                        'text': item.content,
                    }
                ],
            }, {
                'role': 'model',
                'parts': [{
                        'text': '好的',
                    }
                ],
            });
        } else if (index === 1 && item.role === 'assistant') {
            // 忽略掉第二条消息
        } else {
            formattedMessages.push({
                'role': (item.role === 'assistant') ? 'model' : 'user',
                'parts': [{
                        'text': item.content,
                    }
                ],
            });
        }
    });
    return formattedMessages;
}

async function handleGeminiRequest(requestBody, chatModel, apiKey) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    try {
        const chatMessages = requestBody.messages;
        const contents = formatMessagesForGemini(chatMessages);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'contents': contents,
                "safetySettings": [{
                        "category": "HARM_CATEGORY_HARASSMENT",
                        "threshold": "BLOCK_NONE"
                    }, {
                        "category": "HARM_CATEGORY_HATE_SPEECH",
                        "threshold": "BLOCK_NONE"
                    }, {
                        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                        "threshold": "BLOCK_NONE"
                    }, {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_NONE"
                    }
                ],
            }),
        });

        const responseData = await response.json();
        if (responseData.candidates) {
            return respondJsonMessage(responseData.candidates[0].content.parts[0].text);
        } else {
            // 处理失败逻辑，查看是否有错误消息字段
            const errorMessage = responseData.error ? responseData.error.message : '未知错误';
            return respondJsonMessage(`${chatModel} : ${errorMessage}`);
        }
    } catch (error) {
        return respondJsonMessage(`${chatModel}: ${error.toString()}`);
    }
}

async function handleQwenRequest(requestBody, chatModel, apiKey) {
    const url = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
    try {
        const chatMessages = requestBody.messages;
        const contents = formatMessagesForQwen(chatMessages);
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': apiKey,
            },
            body: JSON.stringify({
                'model': chatModel,
                'input': {
                    'messages': contents,
                },
                'parameters': {},
            }),
        });
        const responseData = await response.json();
        // 判断是否有错误信息
        if (responseData.code) {
            // 处理错误逻辑
            const errorCode = responseData.code;
            const errorMessage = responseData.message || '未知错误';
            return respondJsonMessage(`${chatModel}: ${errorCode} - ${errorMessage}`);
        }

        // 如果没有错误，返回 Qwen API 的响应
        return respondJsonMessage(responseData.output.text);
    } catch (error) {
        return respondJsonMessage(`捕获错误${chatModel}: ${error.toString()}`);
    }
}

function formatMessagesForQwen(messages) {
    let formattedMessages = [];
    messages.forEach((item, index) => {
        if (index === 0 && item.role === 'system') {
            let itemContent = item.content.trim();
            if(itemContent ==""){
                itemContent = '你是通义千问';
            }
            formattedMessages.push({
                'role': 'system',
                'content': itemContent,
            });
        } else if (index === 1 && item.role === 'assistant') {
            // 忽略掉第二条消息
        } else {
            formattedMessages.push({
                'role': (item.role === 'assistant') ? 'assistant' : 'user',
                'content': item.content,
            });
        }
    });
    return formattedMessages;
}
