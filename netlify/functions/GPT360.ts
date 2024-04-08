export default class GPT360 {
    model: string;
    authorization: string;
    messages: any;
    headers: any;
    body: any;
    url: string;

    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        this.model = requestModel;
        this.authorization = requestAuthorization;
        this.url = 'https://api.360.cn/v1/chat/completions';
        this.formatHeaders();
        try {
            this.formatBody(requestMessages);
        } catch (error) {
            console.error('Error formatting body:', error);
            throw error;
        }
    }

    private formatHeaders() {
        // 检查是否已经存在 headers，如果存在则不重新初始化
        if (!this.headers) {
            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': this.authorization,
            };
        }
    }

    private formatBody(requestMessages) {
        try {
            // 确保this.body是对象类型，否则进行初始化
            if (typeof this.body !== 'object' || this.body === null) {
                this.body = {};
            }

            // 将格式化后的 messages 转换为自己格式的 body
            this.body = {
                'model': this.model,
                'messages': requestMessages,
                'stream': false
            };
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
        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message && responseData.choices[0].message.content) {
            return responseData.choices[0].message.content;
        } else {
            // 响应结构不符合预期，返回错误信息
            return `${this.model}: 无法解析响应数据`;
        }
    }
}
