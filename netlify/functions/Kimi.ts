import BaseModel from './BaseModel';

export default class Kimi extends BaseModel {
    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        super(requestModel, requestAuthorization, requestMessages, 'https://api.moonshot.cn/v1/chat/completions');
    }

    protected formatBody(requestMessages: any) {
        super.formatBody(requestMessages);
        this.body['temperature'] = 0.3;
    }
}
