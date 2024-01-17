# 利用Cloudflare Workers搭建反向代理 ChatGPT and Gemini only for 微信助手

欢迎来到微信助手 ChatGPT 反向代理项目！这个仓库帮助你在 Cloudflare Workers 上部署 ChatGPT / Gemini-pro 反向代理，使其能够与懒猫的微信助手插件的 ChatGPT 功能协同工作。

此方案，代理ChatGPT是没有问题的，代理 Gemini 则会常常遇到“User location is not supported for the API use”的问题，关键是 CF 的 IP 并不固定。

关于搭建方法，请参照网络上的文章，他们都说的非常详细。
例如：
CSDN 中 guo_zhen_qian 的：[使用Cloudflare创建openai的反向代理](https://blog.csdn.net/guo_zhen_qian/article/details/134957351)
GamerNoTitle:[Cloudflare Workers反代实战（下）](https://bili33.top/posts/Cloudflare-Workers-Section2/)
