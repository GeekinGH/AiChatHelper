# 利用Cloudflare Workers搭建 ChatGPT 以及 Gemini 反向代理 only for 微信助手

欢迎来到微信助手 ChatGPT 反向代理项目！这个仓库帮助你在 Cloudflare Workers 上部署 ChatGPT / Gemini-pro 反向代理，使其能够与懒猫的微信助手插件的 ChatGPT 功能协同工作。

我需要时间来编写详细的 readme，如果你们懂得如何使用Cloudflare Workers，可以先复制代码去尝试。我的测试中，代理ChatGPT是没有问题的，代理 Gemini 则会常常遇到“User location is not supported for the API use”的问题，关键是 CF 的 IP 并不固定。
