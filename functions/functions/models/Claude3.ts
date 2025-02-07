import BaseModel from './BaseModel';

export default class Claude3 extends BaseModel {
    system: string = '';

    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        super(requestModel, requestAuthorization, requestMessages, 'https://api.anthropic.com/v1/messages');
    }

    protected formatHeaders() {
        if (!this.headers) {
            this.headers = {
                'x-api-key': this.authorization,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json'
            };
        }
    }

    protected formatBody(requestMessages: any) {
        if (typeof this.body !== 'object' || this.body === null) {
            this.body = {};
        }

        let formattedMessages: { role: string; content: string }[] = [];
        requestMessages.forEach((item: { role: string; content: string }, index: number) => {
            if (index === 0 && item.role === 'system') {
                let itemContent = item.content.trim();
                this.system = itemContent;
            } else if (index === 1 && item.role === 'assistant') {
                // Claude3的Message开头必须是user role
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
            'max_tokens': 1024,
            'messages': this.messages,
        };
        if (this.system !== undefined && this.system !== null && this.system !== '') {
            this.body['system'] = this.system;
        }
    }

    handleResponse(responseData: any) {
        if (responseData.error) {
            const errorMessage = responseData.error.message || '未知错误';
            return `${this.model}: ${errorMessage}`;
        }

        if (responseData.content && responseData.content.length > 0 && responseData.content[0].text) {
            return responseData.content[0].text;
        } else {
            return `${this.model}: 无法解析响应数据`;
        }
    }
}
