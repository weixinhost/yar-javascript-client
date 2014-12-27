###Intro
---
这是一个[Yar(一个轻量高效率的RPC框架)](https://github.com/laruence/yar)的浏览器版本调用客户端
利用HTML5的 ArrayBuffer实现二进制传输。

当前尚处于开发阶段，请勿用于生产环境


###Install
---

git clone https://github.com/weixinhost/yar-javascript-client

###Example
---
```HTML
<script>
    var client = new YarClient("your yar server url");
    client.call('test',["@misko_lee",{Content:'我是最美丽的人'}],function(returnData){
        console.log(returnData);
    });
</script>
```

###CStruct
    在 lib/cstruct 是一个使用js语言c变量/数组/结构体的二进制操作。未来将增加nodejs的支持

###Todo
---
- 支援JQuery进行Ajax请求
- 支援并发请求
- 浏览器兼容
- CStruct 支援 nodejs



