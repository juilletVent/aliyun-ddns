# 阿里云 DDNS 接入

## 需要编译前需要修改的东西

安装完依赖后，做如下修改后才可以进行编译,否则编译出来的目标文件执行时将会报错：

```js
// 找到文件 node_modules\@alicloud\credentials\dist\util\helper.js，
// 搜索下面这一段：
const pkg = kitx_1.default.loadJSONSync(
  path_1.default.join(__dirname, "./package.json")
);
exports.DEFAULT_UA =
  `AlibabaCloud (${os.platform()}; ${os.arch()}) ` +
  `Node.js/${process.version} Core/${pkg.version}`;
exports.DEFAULT_CLIENT = `Node.js(${process.version}), ${pkg.name}: ${pkg.version}`;

// 更改为下面这一段：
exports.DEFAULT_UA =
  `AlibabaCloud (${os.platform()}; ${os.arch()}) ` + `Node.js/1.0.0 Core/1.0.1`;
exports.DEFAULT_CLIENT = `Node.js(${process.version}), aliyun-ddns: 1.0.0`;
```

修改 src\index.ts：

```js
// 修改下面这一行，将pppoe-wan修改为软路由实际的网卡名，可以用 ip addr命令查看到，或者在面板里查看
const wanIp = networksObj["pppoe-wan"][0].address;

// 修改下面这一行，填入实际的"AccessKeyId", "AccessKeySecret"
const client = Client.createClient("AccessKeyId", "AccessKeySecret");

// 修改目标解析ID（改成你实际解析的那条）
// 没有实现完，应该使用API获取完整列表判断是否有对应的记录，并检查记录是否与当前IP一致，如果不一致，则更新
// 如果查询不到，则应该使用OpenAPI进行添加（懒得实现了）
recordId: "729721273856116736",
```

## 修改完毕后

执行命令（）：

```bash
npm run build
# 或者
yarn build
```

目标文件将产出至 dist 目录下，将 dist 目录下的文件传至服务器即可

## 编写启动脚本，设置自启动

创建脚本文件（aliyun-ddns.sh），内容如下：

```bash
#!/bin/bash
# ******** 非常重要：请将路径替换成你上传的实际路径 *******
nohup node /root/aliyun-ddns/main.js >> /root/aliyun-ddns/runtime.log &
```

添加自启动：打开文件`/etc/rc.local`，在文件中 `exit 0` 前面一行执行上面创建的脚本即可：

```bash

# 阿里云DDNS服务启动（重要：请换成你脚本的实际位置）
/root/aliyun-ddns/aliyun-ddns.sh

exit 0
```
