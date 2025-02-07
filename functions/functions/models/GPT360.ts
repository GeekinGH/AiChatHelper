import BaseModel from './BaseModel';

export default class GPT360 extends BaseModel {
    text2img: boolean;

    constructor(requestModel: string, requestAuthorization: string, requestMessages: any) {
        const url = 'https://api.360.cn/v1/chat/completions';
        super(requestModel, requestAuthorization, requestMessages, url);
        this.text2img = false;

        const lastMessage = requestMessages[requestMessages.length - 1].content.trim();
        if (lastMessage.startsWith('画')) {
            this.url = 'https://api.360.cn/v1/images/text2img';
            this.model = '360CV_S0_V5';
            this.text2img = true;
            this.formatBodyText2Img(lastMessage);
        } else {
            this.formatBody(requestMessages);
        }
    }

    protected formatBody(requestMessages: any) {
        super.formatBody(requestMessages);
        this.body['stream'] = false;
        this.body['tools'] = [{
            "type": "web_search",
            "web_search": {
                "search_mode": "auto",
                "search_query": requestMessages[requestMessages.length - 1].content.trim()
            }
        }];
    }

    private formatBodyText2Img(lastMessage: string) {
        if (typeof this.body !== 'object' || this.body === null) {
            this.body = {};
        }

        this.body = {
            "model": "360CV_S0_V5",
            "style": "realistic",
            "prompt": lastMessage.substring(1),
            "negative_prompt": "",
            "guidance_scale": 15,
            "height": 1920,
            "width": 1080,
            "num_inference_steps": 50,
            "samples": 1,
            "enhance_prompt": true
        };
    }

    handleResponse(responseData: any) {
        if (responseData.error) {
            const errorMessage = responseData.error.message || '未知错误';
            return `${this.model}: ${errorMessage}`;
        }

        if (!this.text2img) {
            if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message && responseData.choices[0].message.content) {
                return responseData.choices[0].message.content;
            } else {
                return `${this.model}: 无法解析响应数据`;
            }
        } else {
            if (responseData.status === 'success' && responseData.output) {
                if (responseData.output.length > 0) {
                    return responseData.output[0];
                } else {
                    return '鉴于关键词过滤原因，无法根据您的关键词生图';
                }
            } else {
                return `${this.model}: 无法解析响应数据`;
            }
        }
    }
}
