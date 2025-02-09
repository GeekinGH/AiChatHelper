# 搭建各类 AI 的微信助手反向代理

**only for 微信助手**  
把微信助手的反代部署到 Netlify，不需要用到 Cloudflare 即可实现多种 AI 模型的代理，同时没有 Gemini 的区域限制（User location is not supported for the API use）。

## 有三个相同功能的不同部署环境的项目：

1. 部署到 Netlify 的，就是本仓库。目前 Netlify 注册有难度，已经有 Netlify 账户的可以尝试它；  
2. 部署到自己的服务器或者任何可以搭建 NodeJs 环境的服务器的，请移步到 [AiChatHelperNodejs](https://github.com/GeekinGH/AiChatHelperNodejs)；  
3. 部署到 CloudFlare 的，目前有新的办法可以解决 Gemini 区域限制和域名问题，目前来看是最省钱最简单的实现方法，请移步到 [AiChatHelperCFW](https://github.com/GeekinGH/AiChatHelperCFW)；  

## Fork 仓库

1. 注册一个你自己的 GitHub 账户。
2. 来到我这个仓库，点击仓库右上角的 "Fork" 按钮，创建你自己的分支。

## 部署到 Netlify

1. 用 **邮箱** 注册 [Netlify 帐号](https://app.netlify.com/signup/)。  
   注意：  
   1.1 GitHub 授权登录的方式可能会引起身份审核；  
   1.2 邮箱注册也有可能引起身份审核，尝试换邮箱地址，比如国外的邮箱；  
   1.3 netlify.com 和 netlify.app 的分流规则，建议设置为直连，不用魔法。  
   <img src="./images/rules_netlify.jpg" width="400px">
2. 在 [Netlify](https://app.netlify.com) 上创建一个新 Site (Add new site)。
3. 点击弹出的窗口 "Import an existing project"。
4. Deploy with GitHub。
5. 按提示授权 GitHub 到你的 Netlify。
6. 选择你刚刚 fork 的项目。
7. "Add environment variables" 创建以下环境变量：

| 环境变量名称       | 描述                           | 示例值                                      |
|------------------|------------------------------|-------------------------------------------|
| WXID_ARRAY       | 微信 ID 列表                  | wxid_abcdefg, lambous, yourxxx, abdcedf   |
| APIKEY360        | 360 API Key，用于文生图功能    | your-360-api-key                          |
| SUPPORTED_MODELS | 支持的模型配置，值为 JSON 字符串 |  {"gemini-2.0-flash-thinking-exp-1219": "Gemini", "gemini-2.0-flash": "Gemini", "gemini-2.0-pro-exp": "Gemini"} |

WXID_ARRAY 的特别说明：
- 替换为你需要授权的微信 ID，不同的 ID 需要用英文逗号隔开，最后一个微信 ID 后面不要加逗号。不需要加引号；  
- 如果你的微信 ID 是 wxid_abcdefg，你就填写 wxid_abcdefg，别删掉了 'wxid_'；  
- 如果你的微信 ID 是 lambous 就填写 lambous，开头别加 ‘wxid’！  
- 以此类推可以添加很多不止三个的。比如 wxid_abcdefg, lambous, yourxxx, abdcedf

8. Deploy AiChatHelper。
9. 等待部署完成，你将获得一个二级域名，这就是你的代理地址，记住它。（xxx.netlify.app；xxx 可自定义，需要带上前缀 https://）
10. 以后在 GitHub 修改你的代码，Netlify 会自动更新代码并重新部署。
11. 第 7 步的环境变量是初次部署之前填写的。如果部署成功后再次修改环境变量的值，请重新部署。  
    <img src="./images/deploySite.png" width="400px"><img src="./images/configure-builds-retry-deploy-dropdown.png" width="400px">
12. gemini-2.0-flash-exp, gemini-2.0-flash, gemini-2.0-pro-exp,这三个 Gemini 模型支持实时谷歌搜索功能，其中 gemini-2.0-flash, gemini-2.0-pro-exp模型在代码中没有写入，需要使用的请在环境变量中添加。【修改环境变量后需要 清除缓存并重新部署 才能生效】

## 使用方法

以下操作都是在“微信助手”ChatGPT 中操作：

1. 将你的代理地址填写到“代理地址”栏。（https://xxx.netlify.app）
2. “APIKey”中填写对应的 API Key，在“模型”中按下表选择或填写。

| AI             | 模型(选择或手动输入)           |
|----------------|-----------------------------|
| ChatGPT 3.5    | gpt-3.5-turbo               |
| ChatGPT plus   | gpt-4                       |
| GPT-4o         | GPT-4o                      |
| Gemini-pro     | Gemini-pro                  |
| gemini-1.5-pro | gemini-1.5-pro-latest       |
| gemini-1.5-flash | gemini-1.5-flash           |
| gemini-2.0-flash | gemini-2.0-flash-exp       |
| 通义千问       | qwen-max                    |
| Moonshot Kimi  | moonshot-v1-8k 或 moonshot-v1-32k |
| Claude3        | claude-3-opus-20240229      |
| 360智脑        | 360gpt-pro                  |
| DeepSeek-V3    | deepseek-chat               |
| DeepSeek-R1    | deepseek-reasoner           |

3. 360AI 支持文生图功能，在聊天中，话术为：画xxxxxxxx，AI 则会返回一个图片链接。比如：画一个蓝天白云的图片。
4. DeepSeek-R1 因为 WeChat 的字数限制，删除了推理过程，直接输出结果。DeepSeek 可以不用反代，直接输入 API 地址 https://api.deepseek.com

## 其他事项

- 部分代码参考了懒猫提供的 Gemini.zip，[懒猫插件交流](https://t.me/maogroup)
- 部分代码参考了 Simon's Blog：[simonmy.com](https://simonmy.com/posts/使用netlify反向代理google-palm-api.html)
- 如果遇到任何问题，请参考 [Netlify 文档](https://docs.netlify.com) 进行故障排除。
- 有关微信助手 ChatGPT 相关功能使用，请查看微信助手中的详细使用说明，或者在交流群里交流。

祝你在微信助手中体验愉快！
