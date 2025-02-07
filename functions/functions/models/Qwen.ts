import BaseModel from './BaseModel';

export default class Qwen extends BaseModel {
    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        super(requestModel, requestAuthorization, requestMessages, 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation');
    }

    protected formatBody(requestMessages: any) {
        if (typeof this.body !== 'object' || this.body === null) {
            this.body = {};
        }

        let formattedMessages: { role: string, content: string }[] = [];
        requestMessages.forEach((item: { role: string, content: string }, index: number) => {
            if (index === 0 && item.role === 'system') {
                let itemContent = item.content.trim();
                if (itemContent === "") {
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
                    'role': item.role,
                    'content': item.content,
                });
            }
        });

        this.messages = formattedMessages;

        this.body = {
            'model': this.model,
            'input': {
                'messages': this.messages,
            },
            'parameters': {},
        };
    }

    handleResponse(responseData: any) {
        // 判断是否有错误信息
        if (responseData.code) {
            // 处理错误逻辑
            const errorCode = responseData.code;
            const errorMessage = responseData.message || '未知错误';
            return `${this.model}: ${errorCode} - ${errorMessage}`;
        }
        if (responseData.errorType) {
            // 处理错误逻辑
            const errorType = responseData.errorType;
            const errorMessage2 = responseData.errorMessage || '未知错误';
            return `${this.model}: ${errorType} - ${errorMessage2}`;
        }
    
        // 检查是否存在 responseData.output.text
        if (responseData.output && responseData.output.text) {
            // 返回 Qwen API 的响应
            return responseData.output.text;
        } else {
            // 返回错误信息，指示无法获取有效的响应文本
            return `${this.model}: 无法获取有效的响应文本`;
        }
    }
}
