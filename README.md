# 搭建各类 AI 的微信助手反向代理
only for 微信助手<br>
把微信助手的反代部署到Netlify，不需要用到Cloudflare即可实现多种AI模型的代理，同时没有gemini的区域限制（User location is not supported for the API use）。

## Fork 仓库

1. 注册一个你自己的GitHub账户。
2. 来到我这个仓库，点击仓库右上角的 "Fork" 按钮，创建你自己的分支。

## 部署到 Netlify
$\color{red}{如果希望部署到自建服务器，或者任意安装了NodeJs环境的服务器（比如腾讯云函数）中，请移步到}$[另外一个仓库](https://github.com/GeekinGH/AiChatHelperNodejs)<br>
1. 用 $\color{red}{邮箱}$ 注册[Netlify 帐号](https://app.netlify.com/signup/)。<br>
注意：<br>
1.1 Github授权登录的方式可能会引起身份审核；<br>
1.2 邮箱注册也有可能引起身份审核，尝试换邮箱地址，比如国外的邮箱；<br>
1.3 netlify.com和netlify.app的分流规则，建议设置为直连，不用魔法。<br>
<img src="./images/rules_netlify.jpg" width="400px">
2. 在 [Netlify](https://app.netlify.com) 上创建一个新Site(Add new site)。<br>
3. 点击弹出的窗口 "Import an existing project" 。<br>
4. Deploy with GitHub.<br>
5. 按提示授权 GitHub 到你的 Netlify。<br>
6. 选择你刚刚fork的项目<br>
7. "Add environment variables" 创建<B>WXID_ARRAY</B>这个环境变量（只创建一个，别重复），values值为：微信ID1,微信ID2,微信ID3 <br>
---替换为你需要授权的微信ID，不同的ID需要用英文逗号隔开,最后一个微信ID后面不要加逗号。不需要加引号； <br>
---如果你的微信ID是wxid_abcdefg,你就填写wxid_abcdefg,别删掉了'wxid_'; <br>
---如果你的微信ID是lambous就填写lambous、开头别加‘wxid’！ <br>
---以此类推可以添加很多不止三个的。比如 wxid_abcdefg,lambous,yourxxx,abdcedf <br>
8. Deploy AiChatHelper
9. 等待部署完成，你将获得一个二级域名，这就是你的代理地址，记住它。（xxx.netlify.app；xxx可自定义，需要带上前缀https&#58;&#47;&#47;）
10. 以后在GitHub修改你的代码，Netlity会自动更新代码并重新部署。
11. 第7步的环境变量WXID_ARRAY是在初次部署之前填写的。如果部署成功后再次修改环境变量WXID_ARRAY的值，请重新部署。
<img src="./images/deploySite.png" width="400px"><img src="./images/configure-builds-retry-deploy-dropdown.png" width="400px">

## 使用方法
以下操作都是在“微信助手”ChatGPT中操作：
1. 将你的代理地址填写到“代理地址”栏。（https&#58;&#47;&#47;xxx.netlify.app）
2. “APIKey”中填写对应的API Key，在“模型”中按下表选择或填写。

| AI       | APIKey      | 模型            |
|-----------|-------------|-----------------|
| ChatGPT 3.5  | ChatGPT 3.5 API Key | 选择：gpt-3.5-turbo |
| ChatGPT plus  | ChatGPT 4 API Key | 选择：gpt-4 |
| Gemini-pro 1.0 | Gemini 1.0 API Key | 手动输入，填写：Gemini-pro |
| Gemini-pro 1.5 | Gemini 1.5 API Key | 手动输入，填写：gemini-1.5-pro-latest |
| 通义千问   | Qwen API Key    | 手动输入，填写：qwen-turbo(弃用) 或 qwen-max |
| Moonshot Kimi | Kimi API Key  | 手动输入，填写：moonshot-v1-8k 或 moonshot-v1-32k |
| Claude3   | Claude3 API Key | 手动输入，填写：claude-3-opus-20240229 | 
| 360智脑   | 360 API Key | 手动输入，填写：360gpt-pro |

## 其他事项
- 部分代码参考了懒猫提供的Gemini.zip，[懒猫插件交流](https://t.me/maogroup)
- 部分代码参考了Simon's Blog：[simonmy.com](https://simonmy.com/posts/使用netlify反向代理google-palm-api.html)
- 如果遇到任何问题，请参考[Netlify 文档](https://docs.netlify.com)进行故障排除。
- 有关微信助手ChatGPT相关功能使用，请查看微信助手中的详细使用说明，或者在交流群里交流。

祝你在微信助手中体验愉快！
