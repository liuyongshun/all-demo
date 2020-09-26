// jsonp 实现方式 ==================================
const Koa =require('koa');
const app = new Koa();
app.use(async ( ctx ) => {
  // 如果jsonp 的请求为GET
  console.log(ctx.query)
  if ( ctx.method === 'GET' && ctx.url.split('?')[0] === '/jsonp') {
    let callbackName = ctx.query.callback || 'callback'
    let returnData = {
      success: true,
      data: {
        text: 'jsonp 返回的数据',
        time: new Date().getTime(),
      }
    }
    // jsonp的script字符串
    let jsonpStr = `;${callbackName}(${JSON.stringify(returnData)})`
    // 用text/javascript，让请求支持跨域获取
    ctx.type = 'text/javascript'
    // 输出jsonp字符串
    ctx.body = jsonpStr
  } else {
    ctx.body = 'hello jsonp'
  }
})

// 错误处理
app.on('error', err => {
  console.log('服务错误', err)
});

app.listen(5555, '0.0.0.0', () => {
  console.log('启动成功！端口：5555');
});

