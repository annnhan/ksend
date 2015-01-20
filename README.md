ksend
=====

命令行推送个人文档到kindle。

**使用指南**

1. 安装

        npm install -g ksend

2. 设置默认发送邮箱，格式: 邮箱地址:密码

        ksend --from yourname@qq.com:yourpassword

3. 推送，如下示例，推送 a.pdf 至 hanan@kindle.cn 这个kindle接收邮箱：

        ksend -m hanan@kindle.cn a.pdf

    以上命令，参数 -m 表示接收邮箱。自此，完成推送。

如果脚得每次都要敲 -m 接收邮箱 麻烦，可以设置默认接收邮箱：

    ksend --to hanan@kindle.cn

这样，以后只需要如下命令即可推送：

    ksend a.pdf

也可以同时推送多个文档：

    ksend a.pdf b.pdf ../img/photo.jpg /Users/hanan/book/ooxx.txt

查看帮助：

    ksend --help
    
ps: 记得把发送邮箱添加到您的kindle已认可的发件人电子邮箱列表哦