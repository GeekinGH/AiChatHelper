export default class Gemini {
    model: string;
    authorization: string;
    messages: any;
    headers: any;
    body: any;
    url: string;

    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        this.model = requestModel;
        this.authorization = requestAuthorization ? requestAuthorization.replace('Bearer ', '') : '';
        if (this.model === "Gmini") {
            this.url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.authorization}`;
        } else {
            this.url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.authorization}`;
        }
        this.formatHeaders();
        try {
            this.formatBody(requestMessages);
        } catch (error) {
            console.error('Error formatting body:', error);
        }
    }

    private formatHeaders() {
        // 检查是否已经存在 headers，如果存在则不重新初始化
        if (!this.headers) {
            this.headers = {'Content-Type': 'application/json'};
        }
    }

    private formatBody(requestMessages) {
        try {
            // 确保this.body是对象类型，否则进行初始化
            if (typeof this.body !== 'object' || this.body === null) {
                this.body = {};
            }

            let formattedMessages = [];
            requestMessages.forEach((item, index) => {
                if (index === 0) {
                    formattedMessages.push({
                        'role': 'user',
                        'parts': [{
                            'text': item.content,
                        }],
                    }, {
                        'role': 'model',
                        'parts': [{
                            'text': '好的',
                        }],
                    });
                } else if (index === 1 && item.role === 'assistant') {
                    // 忽略掉第二条消息
                } else {
                    formattedMessages.push({
                        'role': (item.role === 'assistant') ? 'model' : 'user',
                        'parts': [{
                            'text': item.content,
                        }],
                    });
                }
            });

            this.messages = formattedMessages;

            // 将格式化后的 messages 转换为自己格式的 body
            this.body = {
                'contents': this.messages,
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
            };
        } catch (error) {
            console.error('Error formatting messages:', error);
            throw error;
        }
    }

    handleResponse(responseData: any) {
        // 判断是否存在 responseData.candidates
        if (responseData.candidates && responseData.candidates.length > 0) {
            // 检查是否存在 responseData.candidates[0].content.parts[0].text
            if (responseData.candidates[0].content && responseData.candidates[0].content.parts &&
                responseData.candidates[0].content.parts.length > 0) {
                // 返回 Gemini API 的响应文本
                return responseData.candidates[0].content.parts[0].text;
            } else {
                // 返回错误信息，指示无法获取有效的响应文本
                return `${this.model} API 返回未知错误: 无法获取有效的响应文本`;
            }
        } else if (responseData.error) {
            // 处理错误逻辑
            const errorMessage = responseData.error.message || '未知错误';
            return `${this.model} API 错误: ${errorMessage}`;
        } else {
            // 返回错误信息，指示无法获取有效的响应
            return `${this.model} API 返回未知错误: 无法获取有效的响应`;
        }
    }
}
