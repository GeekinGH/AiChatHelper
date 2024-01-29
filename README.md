# 搭建ChatGPT、Gemini、通义千问反向代理
## only for 微信助手，突破gemini对区域的限制

欢迎来到微信助手 ChatGPT 反向代理项目！这个仓库帮助你部署 ChatGPT / Gemini-pro / 通义千问 反向代理，使其能够与懒猫的微信助手插件的 ChatGPT 功能协同工作。

# 一键部署到Netlify！！！
## 这个方案独立的，不需要用到Cloudflare即可实现3种AI模型的代理，同时没有gemini的区域限制，不过只有3个月的免费部署。

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/geekingh/aichathelper)

部署完成请在 Netlify site 创建 WXID_ARRAY 这个环境变量，值为 wxid1,wxid2,wxid3 （替换为你需要授权的微信ID，不同的ID需要用英文逗号隔开）

################################################################################################

# Cloudflare Workers的方案，需要在2个地方部署：

# cf方案，可以解决 Gemini “User location is not supported for the API use”的问题，请按照以下步骤搭建gemini反代：
1. 前往 [palm-netlify-proxy](https://github.com/antergone/palm-netlify-proxy) 仓库，点击 "Deploy With Netlify" 按钮。
2. 部署完成后，您将获得由Netlify分配的域名（例如，https://xxx.netlify.app）。
3. 在您的 AiChatHelper 项目的cloudflare-worker.js 中设置一个名为 proxyUrl 的全局变量，值为您从部署 palm 代理获得的域名（https://xxx.netlify.app）。
4. （如果你之前已经部署过此项目）重新部署您的 AiChatHelper 项目到cloudflare worker 。这将解决该问题。（如果是第一次部署本项目，请忽略这步，往下看。。。）

# CF worker的搭建步骤，我这里用文字说明，图文请参照最后提供的链接
1. 你需要有一个自己的域名，因为cf的dev域名是被🧱的。
2. 你需要有一个cloudflare账号，把你的域名添加到cf。
3. 在cf首页，点击“Workers和Pages”，右上角“创建应用程序”-->"创建Worker"。
4. 输入worker的名字（随意），点击部署。
5. 按照上面解决gemini区域限制的方法，部署好gemini的反代，设置好cloudflare-worker.js中的proxyUrl变量！！！
6. 点击“编辑代码：，把本仓库中的cloudflare-worker.js中的代码复制粘贴到worker.js中。
7. 点击右上角的“保存并部署”。
8. 替换自己的域名。在worker管理界面，点击触发器，添加自定义域。
9. 输入自己的域名（一般自己设置一个子域名），点击”添加自定义域“。
10. 等待一会儿，尝试用此域名访问。有效后即可填写到微信助手的代理服务器栏中。
11. 详细的搭建图文说明，请访问以下链接：
12. CSDN 中 guo_zhen_qian 的：[使用Cloudflare创建openai的反向代理](https://blog.csdn.net/guo_zhen_qian/article/details/134957351)
13. GamerNoTitle:[Cloudflare Workers反代实战（下）](https://bili33.top/posts/Cloudflare-Workers-Section2/)
14. Simon's Blog：[simonmy.com](https://simonmy.com/posts/使用netlify反向代理google-palm-api.html)

    

# 其他分支的方案都不需要看了，就用这个可以了。


