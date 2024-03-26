export default class Claude3 {
    model: string;
    authorization: string;
    messages: any;
    headers: any;
    body: any;
    url: string;
    system: string;

    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        this.model = requestModel;
        this.authorization = requestAuthorization ? requestAuthorization.replace('Bearer ', '') : '';
        this.url = 'https://api.anthropic.com/v1/messages';
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
            this.headers = {
              'x-api-key': this.authorization,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json'};
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
                if (index === 0 && item.role === 'system') {
                    let itemContent = item.content.trim();
                    this.system = itemContent;
                    //Claude3的Message没有"system" role
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

            // 将格式化后的 messages 转换为自己格式的 body
            this.body = {
                'model': this.model,
                'max_tokens': 1024,
                'messages': this.messages,
            };
            // 检查 this.system 是否为空，如果不为空，则添加到 body 对象中
            if (this.system !== undefined && this.system !== null && this.system !== '') {
                this.body['system'] = this.system;
            }
        } catch (error) {
            console.error('Error formatting messages:', error);
            throw error;
        }
    }
  
    handleResponse(responseData: any) {
        // 判断是否有错误信息
        if (responseData.error) {
            // 处理错误逻辑
            const errorMessage = responseData.error.message || '未知错误';
            return `${this.model}: ${errorMessage}`;
        }

        // 检查响应结构是否符合预期
        if (responseData.content && responseData.content.length > 0 && responseData.content[0].text) {
            return responseData.content[0].text;
        } else {
            // 响应结构不符合预期，返回错误信息
            return `${this.model}: 无法解析响应数据`;
        }
    }
}
