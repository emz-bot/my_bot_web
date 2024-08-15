# chat_log_web

## 本地调测

推荐 node 版本`v22.1.0` npm 版本`v10.7.0`

``` shell
# 安装依赖
npm install
# 运行
npm run dev
# 构建
npm run build
```

## 自动部署

1. fork 本项目
2. 在自己的项目中依次进入 `Settings` - `Secrets` - `action` - `New repository secrets`
3. 在自己的服务器中安装`unzip`
4. 增加如下变量
    ``` shell
    host  # 目标服务器ip或域名, 例如: 10.10.10.10
    username  # 目标服务器用户名, 例如: root
    password  # 目标服务器密码, 例如: wobugaosuni
    port  # 目标服务器端口, 例如: 22
    remote_path  # 上传的位置, 例如: /home/ubuntu/web/
    end_cmd  # 上传成功后需要执行的命令, 例如: sed -i 's#http://127.0.0.1:8899#https://ermaozi.cn#' ~/web/static/config.js; sudo nginx -s reload
    ```
5. 目前还适配了七牛云的自动部署, 如果要用的话上面的变量就可以不加了, 加下面这些
    ``` shell
    PREFIXHOST  # 七牛cdn绑定的域名
    ACCESSKEY  # 七牛accessKey
    SECRETKEY  # 七牛secretKey
    SPACE  # 七牛空间名
    ZONE  # 空间对应的机房，zone_z1代表华北，其他配置参见七牛云文档
    ```