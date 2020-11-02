// jsonp 实现方式 ==================================
const Koa =require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const router = new Router();

const app = new Koa();
const cors = require('koa2-cors');

app.use(cors({
  origin: function () {
    return '*';
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTION', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'Content-Length', 'credentials', 'X-Access-Token', 'Cache-Control', 'Pragma', 'X-Requested-With']
}));


const home = router.get('/v1/home', async (ctx) => {
    console.log(ctx.request)
    ctx.response.body = {
        code: 0,
        data: {
            name: 'liu',
            age: 11
        }
    }
});

router.use(home.routes())

app.use(bodyParser());
app.use(router.routes())

// 错误处理
app.on('error', err => {
    console.log('服务错误', err)
});

app.listen(6666, '0.0.0.0', () => {
    console.log('启动成功！端口：6666');
});

