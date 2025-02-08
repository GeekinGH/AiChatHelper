import BaseModel from './BaseModel';

export default class ChatGPT extends BaseModel {
    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        super(requestModel, requestAuthorization, requestMessages, 'https://api.openai.com/v1/chat/completions');
    }
}
