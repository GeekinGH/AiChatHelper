import BaseModel from './BaseModel';

export default class Grok extends BaseModel {
    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        super(requestModel, requestAuthorization, requestMessages, 'https://api.x.ai/v1/chat/completions');
    }
}
