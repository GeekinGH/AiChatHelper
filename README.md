# 微信助手 ChatGPT 反向代理

欢迎来到微信助手 ChatGPT 反向代理项目！这个仓库帮助你在 replit.com 上部署 ChatGPT / Gemini-pro 反向代理，使其能够与懒猫的微信助手插件的 ChatGPT 功能协同工作。

## Fork 仓库

1. 点击仓库右上角的 "Fork" 按钮，创建你自己的分支。

## 部署到 replit

1. 注册[Replit 帐号](https://replit.com/)。
2. 在 Replit 上创建一个新项目(Create Node.js)。
3. 点击弹出的窗口右上角 "Import from GitHub" 。
4. Connect your GitHub account-->Install&Authorize.
5. 将你 Fork 的 GitHub 仓库连接到你的 Replit 项目，项目名任意。
6. Replit 将自动检测到你的 Node.js 应用并设置必要的配置。

## 设置环境变量

1. 在 Replit 项目中，进入 "Tools" 选项卡。
2. 找到 "Secrets" 部分。
3. 添加以下环境变量(+ New Secret)：
   - `MAX_RETRIES`：设置最大重试次数。选填项，不添加此变量则默认1，即可重试一次，也就是会执行 2 次。
   - `WXID_ARRAY`：设置授权的 WXID 数组（微信ID，助手里面可以看到，不同 ID 必须以英文逗号分隔）。选填项，不添加此变量则默认为空，表示不进行授权验证。
   - `CHATGPT_TEMPERATURE`：设置 ChatGPT 的温度。选填项，不添加此变量则默认为 1，从0开始，温度值越高，生成的文本越随机和创造性，而温度值越低，生成的文本越保守和可预测。

## 运行应用

1. 一旦项目设置完成，Replit 上的 "My Repls" 选项卡选择你刚刚创建的项目。
2. 点击 "Run" 运行应用。
3. 应用启动后，“Webview”选项卡点击“New tab”，会在默认浏览器打开新页面，复制它的网址链接，这就是代理服务器的地址，不需要加端口,末端不带/。例如 "https://一串乱码..replit.dev"

## 使用方法
以下操作都是在“微信助手”ChatGPT中操作：
1. 将你的代理地址填写到“代理地址”栏。
2. 如果使用的是ChatGPT API，请和 “APIKey”中填写ChatGPT(Openai)的API Key，在“模型”中选择对应的gpt-4或者gpt-3.5-turbo。
3. 如果使用的是Gemini-pro API，请和 “APIKey”中填写Gemini-pro的API Key，在“模型”中选择 手动输入 ，填写：Gemini 或者 Gemini-pro 。

## 防止Repl不定时休眠的最终方案
如果本代码的保活功能正常运行，反代能持续服务，忽略以下所述方法！
如果发现本代码中的保活功能失效,Replit在没有请求时依然会不定期的休眠，最有效的解决方案是用UptimeRobot网站监控功能，方法很简单：
1. 在[UptimeRobot](https://uptimerobot.com/) 选择免费计划(free),注册一个账号,免费的足够用了。
2. 新建一个监视，URL填写你的Repl反代网址，间隔5分钟，超时30秒。这样让它定期发送head请求，是防止Repl休眠的一个好方法。

## 其他注意事项
- 代码修改自懒猫提供的Gemini.zip，[懒猫插件交流](https://t.me/maogroup)
- 如果遇到任何问题，请参考[Replit 文档](https://docs.replit.com)进行故障排除。
- 有关微信助手ChatGPT相关功能使用，请查看微信助手中的详细使用说明，或者在交流群里交流。

祝你在微信助手中体验愉快！
