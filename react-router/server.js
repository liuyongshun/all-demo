const Koa = require('koa')
const path = require('path')
const static = require('koa-static')

const app = new Koa()

const staticPath = './static'

app.use(static(
  path.join( __dirname, staticPath)
))

// 错误处理
app.on('error', err => {
    console.log('服务错误', err)
});

app.listen(9898, '0.0.0.0', () => {
    console.log('启动成功！端口：9898');
});

