import BaseModel from './BaseModel';

export default class DeepSeek extends BaseModel {
    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        super(requestModel, requestAuthorization, requestMessages, 'https://api.deepseek.com/chat/completions');
    }
}
