# 利用Cloudflare Workers搭建反向代理 ChatGPT、Gemini、通义千问 only for 微信助手

欢迎来到微信助手 ChatGPT 反向代理项目！这个仓库帮助你在 Cloudflare Workers 上部署 ChatGPT / Gemini-pro / 通义千问 反向代理，使其能够与懒猫的微信助手插件的 ChatGPT 功能协同工作。

此方案，如果对接 Gemini 遇到“User location is not supported for the API use”的问题，请按照以下步骤解决它：
1. 前往 [palm-netlify-proxy](https://github.com/antergone/palm-netlify-proxy) 仓库，点击 "Deploy With Netlify" 按钮。
2. 部署完成后，您将获得由Netlify分配的域名（例如，https://xxx.netlify.app）。
3. 在您的 AiChatHelper 项目的cloudflare-worker.js 中设置一个名为 proxyUrl 的全局变量，值为您从部署 palm 代理获得的域名（https://xxx.netlify.app）。
4. 重新部署您的 AiChatHelper 项目到cloudflare worker 。这将解决该问题。

关于搭建方法，请参照网络上的文章，他们都说的非常详细。
例如：
CSDN 中 guo_zhen_qian 的：[使用Cloudflare创建openai的反向代理](https://blog.csdn.net/guo_zhen_qian/article/details/134957351)

GamerNoTitle:[Cloudflare Workers反代实战（下）](https://bili33.top/posts/Cloudflare-Workers-Section2/)
