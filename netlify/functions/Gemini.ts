import BaseModel from './BaseModel';

export default class Gemini extends BaseModel {
    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${requestModel === "gemini" ? "gemini-pro" : requestModel}:generateContent?key=${requestAuthorization.replace('Bearer ', '')}`;
        super(requestModel, requestAuthorization, requestMessages, url);
    }

    protected formatHeaders() {
        if (!this.headers) {
            this.headers = { 'Content-Type': 'application/json' };
        }
    }

    protected formatBody(requestMessages: any) {
        if (typeof this.body !== 'object' || this.body === null) {
            this.body = {};
        }

        let formattedMessages: { role: string, parts: { text: string }[] }[] = [];
        requestMessages.forEach((item: { role: string, content: string }, index: number) => {
            if (index === 0) {
                formattedMessages.push(
                    {
                        'role': 'user',
                        'parts': [
                            {
                                'text': item.content,
                            },
                        ],
                    },
                    {
                        'role': 'model',
                        'parts': [
                            {
                                'text': '好的',
                            },
                        ],
                    }
                );
            } else if (index === 1 && item.role === 'assistant') {
                // 忽略掉第二条消息
            } else {
                formattedMessages.push({
                    'role': (item.role === 'assistant') ? 'model' : 'user',
                    'parts': [
                        {
                            'text': item.content,
                        },
                    ],
                });
            }
        });

        this.messages = formattedMessages;

        this.body = {
            'contents': this.messages,
            "safetySettings": [
                { "category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE" },
                { "category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE" },
                { "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE" },
                { "category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE" }
            ],
            "tools": [
                {
                    // 添加 tools 参数，增加谷歌搜索功能, 感谢 @SugarCarry 的贡献
                    "google_search_retrieval": {
                        "dynamic_retrieval_config": {
                            "mode": "MODE_DYNAMIC",
                            "dynamic_threshold": 0.3,
                        }
                    }
                }
            ]
        };
    }

    handleResponse(responseData: any) {
        if (responseData.candidates && responseData.candidates.length > 0) {
            if (
                responseData.candidates[0].content &&
                responseData.candidates[0].content.parts &&
                responseData.candidates[0].content.parts.length > 0
            ) {
                return responseData.candidates[0].content.parts[0].text;
            } else {
                return `${this.model} API 返回未知错误: 无法获取有效的响应文本`;
            }
        } else if (responseData.error) {
            const errorMessage = responseData.error.message || '未知错误';
            return `${this.model} API 错误: ${errorMessage}`;
        } else {
            return `${this.model} API 返回未知错误: 无法获取有效的响应`;
        }
    }
}