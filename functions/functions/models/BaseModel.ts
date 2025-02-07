// netlify/functions/BaseModel.ts
export default class BaseModel {
    model: string;
    authorization: string;
    messages: any;
    headers: any;
    body: any;
    url: string;

    constructor(requestModel: string, requestAuthorization: string, requestMessages: any, url: string) {
        this.model = requestModel;
        this.authorization = requestAuthorization;
        this.url = url;
        this.formatHeaders();
        this.formatBody(requestMessages);
    }

    protected formatHeaders() {
        if (!this.headers) {
            this.headers = {
                'Content-Type': 'application/json',
                'Authorization': this.authorization,
            };
        }
    }

    protected formatBody(requestMessages: any) {
        if (typeof this.body !== 'object' || this.body === null) {
            this.body = {};
        }
        this.body = {
            'model': this.model,
            'messages': requestMessages,
        };
    }

    handleResponse(responseData: any) {
        if (responseData.error) {
            const errorMessage = responseData.error.message || '未知错误';
            return `${this.model}: ${errorMessage}`;
        }

        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message && responseData.choices[0].message.content) {
            return responseData.choices[0].message.content;
        } else {
            return `${this.model}: 无法解析响应数据`;
        }
    }
}