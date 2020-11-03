const Koa =require('koa');
const static = require('koa-static');
const path = require('path');
// const conditional = require('koa-conditional-get');
const etag = require('koa-etag');

const app = new Koa();

const staticPath = './static'

// app.use(conditional())
app.use(etag())
app.use(
    static(
        path.join( __dirname,  staticPath),
        {
            maxage: 5 * 1000
        }
    )
)

// 错误处理
app.on('error', err => {
    console.log('服务错误', err)
});

app.listen(3388, '0.0.0.0', () => {
    console.log('启动成功！端口：3388');
});

